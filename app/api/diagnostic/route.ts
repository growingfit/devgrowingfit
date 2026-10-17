import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@/lib/supabase/server';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    supabase: {},
    cloudinary: {},
  };

  // 1. CLOUDINARY CHECKS
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    results.cloudinary.config = {
      cloud_name: cloudName || 'MISSING',
      api_key_set: Boolean(apiKey),
      api_secret_set: Boolean(apiSecret),
    };

    if (!cloudName || !apiKey || !apiSecret) {
      results.cloudinary.error = 'Cloudinary credentials missing in environment variables';
    } else {
      // Test Cloudinary Ping
      const pingRes = await cloudinary.api.ping();
      results.cloudinary.ping = pingRes;

      // Test small 1x1 PNG upload to verify write permission & upload flow
      const tiny1x1Png = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      const testUpload = await uploadBufferToCloudinary(tiny1x1Png, 'growing_fit/test');
      results.cloudinary.test_upload = {
        success: true,
        url: testUpload.url,
        publicId: testUpload.publicId,
      };

      // Test delete of the test image
      const deleteRes = await deleteFromCloudinary(testUpload.publicId);
      results.cloudinary.test_delete = { success: deleteRes };
    }
  } catch (err: any) {
    results.cloudinary.error = err.message || String(err);
    results.cloudinary.stack = err.stack;
  }

  // 2. SUPABASE CHECKS
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    results.supabase.config = {
      url: supabaseUrl || 'MISSING',
      anon_key_set: Boolean(supabaseAnonKey),
      anon_key_preview: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 15)}...` : 'MISSING',
      service_role_key_set: Boolean(serviceRoleKey),
    };

    const supabase = createClient();

    // Check each table in Supabase
    const tables = [
      'site_settings',
      'hero_sections',
      'hero_benefits',
      'sports_categories',
      'sports_programs',
      'about_sections',
      'about_features',
      'vision_sections',
      'site_statistics',
      'gallery_images',
      'testimonials',
      'centres',
      'social_links',
      'contact_settings',
      'footer_settings',
      'homepage_sections',
      'header_settings',
      'admin_users',
    ];

    results.supabase.tables = {};

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(2);

        if (error) {
          results.supabase.tables[table] = {
            exists: false,
            error: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          };
        } else {
          results.supabase.tables[table] = {
            exists: true,
            rowCount: count,
            sample: data?.length ? data[0] : null,
          };
        }
      } catch (tableErr: any) {
        results.supabase.tables[table] = {
          exists: false,
          error: tableErr.message,
        };
      }
    }

    // Test write permission on a table (e.g. test upsert or update to see if RLS blocks writes without auth)
    const { error: writeError } = await supabase
      .from('site_settings')
      .update({ site_title: 'Growing Fit' })
      .eq('id', 999999); // non-existent id to test RLS without altering data

    results.supabase.write_test = {
      allowed: !writeError,
      error: writeError ? writeError.message : null,
      code: writeError?.code,
    };
  } catch (err: any) {
    results.supabase.error = err.message || String(err);
  }

  return NextResponse.json(results, { status: 200 });
}
