import fs from 'fs';
import zlib from 'zlib';

// Standard CRC32 table
const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.slice(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

export interface PngImage {
  width: number;
  height: number;
  colorType: number;
  channels: number;
  data: Buffer; // RGBA or RGB raw uncompressed scanline data [height * width * channels]
}

export function readPng(filePath: string): PngImage {
  const buf = fs.readFileSync(filePath);
  if (buf.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Not a valid PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  const idatChunks: Buffer[] = [];

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.slice(offset + 4, offset + 8).toString('ascii');
    const data = buf.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (bitDepth !== 8) {
        throw new Error('Only 8-bit PNG supported, got ' + bitDepth);
      }
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
  const rawIdat = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(rawIdat);

  const stride = width * channels;
  const rawPixels = Buffer.alloc(width * height * channels);

  let inOffset = 0;
  let prevRow: Buffer = Buffer.alloc(stride, 0);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[inOffset++];
    const currentRow = Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const b = channels;
      const left = x >= b ? currentRow[x - b] : 0;
      const up = prevRow[x];
      const upLeft = x >= b ? prevRow[x - b] : 0;
      const raw = decompressed[inOffset++];

      let val = raw;
      if (filter === 0) {
        val = raw;
      } else if (filter === 1) {
        val = (raw + left) & 0xff;
      } else if (filter === 2) {
        val = (raw + up) & 0xff;
      } else if (filter === 3) {
        val = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filter === 4) {
        val = (raw + paethPredictor(left, up, upLeft)) & 0xff;
      }

      currentRow[x] = val;
    }

    currentRow.copy(rawPixels, y * stride);
    prevRow = currentRow;
  }

  return { width, height, colorType, channels, data: rawPixels };
}

export function cropAndSavePng(
  img: PngImage,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  outPath: string
) {
  // Clamp boundaries
  const startX = Math.max(0, Math.min(cropX, img.width - 1));
  const startY = Math.max(0, Math.min(cropY, img.height - 1));
  const targetW = Math.min(cropWidth, img.width - startX);
  const targetH = Math.min(cropHeight, img.height - startY);

  const inStride = img.width * img.channels;
  const outStride = targetW * img.channels;
  const outScanlineLength = 1 + outStride;
  const filtered = Buffer.alloc(targetH * outScanlineLength);

  for (let y = 0; y < targetH; y++) {
    const srcY = startY + y;
    const srcOffset = srcY * inStride + startX * img.channels;
    const destOffset = y * outScanlineLength;

    filtered[destOffset] = 0; // Filter: 0 (None)
    img.data.copy(filtered, destOffset + 1, srcOffset, srcOffset + outStride);
  }

  const deflated = zlib.deflateSync(filtered, { level: 8 });

  // Build IHDR data
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(targetW, 0);
  ihdr.writeUInt32BE(targetH, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = img.colorType; // 6 = RGBA, 2 = RGB
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outPath, finalPng);
}
