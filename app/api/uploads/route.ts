import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/admin';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export async function POST(request: NextRequest) {
  try {
    // 1. Authorize: Admin only
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'growing_fit';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data.' }, { status: 400 });
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, SVG, GIF.` },
        { status: 400 }
      );
    }

    // 4. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // 5. Convert to Buffer and upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed.' },
      { status: 500 }
    );
  }
}
