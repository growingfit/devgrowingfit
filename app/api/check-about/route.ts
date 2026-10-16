import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('vision_sections').select('*').eq('id', 1).maybeSingle();
  return NextResponse.json({ data, error });
}
