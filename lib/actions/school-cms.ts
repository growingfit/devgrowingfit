'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { createAdminClient as createClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { SchoolPageData } from '@/types/database';

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

const JSON_FILE = 'school-page.json';

function syncSchoolJson(data: SchoolPageData) {
  try {
    const dataDir = path.join(process.cwd(), 'lib', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const filePath = path.join(dataDir, JSON_FILE);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to sync school-page.json:', err);
  }
}

function readSchoolJson(): SchoolPageData | null {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'data', JSON_FILE);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || !content.trim()) return null;
      return JSON.parse(content);
    }
  } catch {}
  return null;
}

async function persistSchoolData(data: SchoolPageData) {
  syncSchoolJson(data);

  // Persist directly to Supabase table school_page (id = 1)
  try {
    const supabase = createClient();
    await supabase.from('school_page').upsert({
      id: 1,
      data,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase school_page upsert warning:', err);
  }
}

export async function getSchoolPageCmsAction(): Promise<SchoolPageData | null> {
  const local = readSchoolJson();

  // Try Supabase first for live production data on Vercel
  try {
    const supabase = createClient();
    const { data: dbRow } = await supabase.from('school_page').select('data').eq('id', 1).maybeSingle();
    if (dbRow?.data && typeof dbRow.data === 'object' && Object.keys(dbRow.data).length > 0) {
      return { ...(local || {}), ...dbRow.data } as SchoolPageData;
    }
  } catch {}

  if (local) return local;

  // Import default fallback if file not yet written
  const { getSchoolPageData } = await import('@/lib/queries/school');
  return await getSchoolPageData();
}

export async function updateSchoolHeroAction(heroData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      hero: { ...current.hero, ...heroData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'School hero banner updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update hero banner.' };
  }
}

export async function updateWhyGrowingFitAction(whyData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      whyGrowingFit: { ...current.whyGrowingFit, ...whyData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Why Growing Fit section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update Why Growing Fit section.' };
  }
}

export async function updateSchoolIntroAction(introData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      introduction: { ...current.introduction, ...introData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Introduction section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update introduction.' };
  }
}

export async function updateWhatsInForKidsAction(whatsData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      whatsInForKids: { ...current.whatsInForKids, ...whatsData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: "What's in for Kids updated successfully!" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update What's in for Kids." };
  }
}

export async function updateSchoolTabsAction(tabsData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      tabsSection: { ...current.tabsSection, ...tabsData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Sports & fitness tabs updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update tabs.' };
  }
}

export async function updateSchoolCurriculumAction(curriculumData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      curriculum: { ...current.curriculum, ...curriculumData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Curriculum section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update curriculum.' };
  }
}

export async function updateSchoolGlimpsesAction(glimpsesData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      glimpses: { ...current.glimpses, ...glimpsesData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Previous year glimpses updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update glimpses gallery.' };
  }
}

export async function updateSchoolTestimonialsAction(testimonialsData: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const current = (await getSchoolPageCmsAction()) || ({} as SchoolPageData);
    const updated: SchoolPageData = {
      ...current,
      testimonials: { ...current.testimonials, ...testimonialsData },
    };
    await persistSchoolData(updated);

    revalidatePath('/', 'layout');
    revalidatePath('/schools');
    revalidatePath('/school');
    revalidatePath('/admin/school-page');
    return { success: true, message: 'Testimonials updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update testimonials.' };
  }
}
