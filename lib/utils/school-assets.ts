import fs from 'fs';
import path from 'path';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/server';

interface ImageBounds {
  width: number;
  height: number;
}

export function getJpegDimensions(buffer: Buffer): ImageBounds {
  let offset = 2; // skip SOI (FF D8)
  while (offset < buffer.length - 8) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // Baseline SOF0 (0xC0), Extended SOF1 (0xC1), Progressive SOF2 (0xC2)
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    // Skip marker segment
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return { width: 1000, height: 1530 }; // fallback
}

export async function ensureSchoolReferenceAssets() {
  const artifactPath = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b1c7e8c9-df51-488a-b1c1-7aa5ab1391f1\\.user_uploaded\\media_1792229970594.jpg';
  const publicDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const localTarget = path.join(publicDir, 'school-reference.jpg');

  let fileBuf: Buffer;
  if (fs.existsSync(artifactPath)) {
    fileBuf = fs.readFileSync(artifactPath);
    fs.writeFileSync(localTarget, fileBuf);
  } else if (fs.existsSync(localTarget)) {
    fileBuf = fs.readFileSync(localTarget);
  } else {
    return null;
  }

  const { width, height } = getJpegDimensions(fileBuf);

  // We can calculate normalized cropping coordinates based on reference screenshot proportions:
  // Total screenshot height is H, width is W
  // 1. Hero Banner: top ~3.8% to ~19.5%
  // 2. What's in for kids (4 cards): Y ~39.5% to ~46.5%, 4 columns across X ~7.5% to ~92.5%
  // 3. Tab columns (3 cards): Y ~51.5% to ~59.5%, 3 columns across X ~7.5% to ~92.5%
  // 4. Glimpses (4 cards): Y ~70.5% to ~77.0%, 4 columns across X ~7.5% to ~92.5%
  // 5. Testimonial Avatars: Anjali (~82% Y, ~8.5% X), Ramesh (~82% Y, ~53.5% X)

  return {
    width,
    height,
    localPath: '/images/school-reference.jpg',
  };
}
