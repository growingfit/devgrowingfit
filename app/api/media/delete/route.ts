import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/admin';
import { deleteFromCloudinary } from '@/lib/cloudinary/server';

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ error: 'Missing publicId' }, { status: 400 });
    }

    const success = await deleteFromCloudinary(publicId);

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Delete handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Media deletion failed.' },
      { status: 500 }
    );
  }
}
