import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary server-side using secure environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/**
 * Uploads a file buffer securely to Cloudinary with folder organization
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder = 'growing_fit',
  options: Record<string, unknown> = {}
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary API credentials are not configured in environment variables.');
  }

  const isSvg =
    options.format === 'svg' ||
    (typeof options.filename === 'string' && options.filename.endsWith('.svg'));

  const uploadConfig: Record<string, unknown> = {
    folder,
    resource_type: 'image',
    ...(isSvg
      ? { format: 'svg' }
      : {
          format: 'webp',
          quality: 'auto:good',
          fetch_format: 'webp',
          flags: 'lossy',
        }),
    ...options,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadConfig,
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error || new Error('Upload to Cloudinary failed without result.'));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an image from Cloudinary safely by publicId
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Skipping Cloudinary deletion: credentials not configured.');
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
    return false;
  }
}
