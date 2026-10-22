'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { createAdminClient as createClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { deleteFromCloudinary } from '@/lib/cloudinary/server';
import {
  siteSettingsSchema,
  heroSectionSchema,
  sportsCategorySchema,
  sportsProgramSchema,
  aboutSectionSchema,
  visionSectionSchema,
  siteStatisticSchema,
  testimonialSchema,
  centreSchema,
  contactSettingsSchema,
  footerSettingsSchema,
  socialLinkSchema,
} from '@/lib/validations/cms';

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

function syncJsonFile(fileName: string, data: any) {
  try {
    const dataDir = path.join(process.cwd(), 'lib', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Failed to sync ${fileName}:`, err);
  }
}

function readJsonFile<T = any>(fileName: string, fallback: any = null): T {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'data', fileName);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || !content.trim()) return fallback as T;
      return JSON.parse(content) as T;
    }
  } catch {}
  return fallback as T;
}

// 1. Site Settings
export async function updateSiteSettingsAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = siteSettingsSchema.parse(formData);
    const supabase = createClient();

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });

    if (error) throw error;
    syncJsonFile('settings.json', { id: 1, ...validated });
    revalidatePath('/');
    return { success: true, message: 'Site settings updated successfully.' };
  } catch (err: any) {
    try {
      const validated = siteSettingsSchema.parse(formData);
      syncJsonFile('settings.json', { id: 1, ...validated });
      revalidatePath('/');
      return { success: true, message: 'Site settings updated successfully (saved to local storage).' };
    } catch {}
    return { success: false, error: err.message || 'Failed to update site settings.' };
  }
}

export async function getSiteSettingsAction(): Promise<any> {
  let settings: any = {
    id: 1,
    site_title: 'Growing Fit — School of Health & Physical Education',
    meta_description: 'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    phone: '+91 702 581 0722',
    email: 'growingfitofficial@gmail.com',
    address: 'Calicut & Kochi, Kerala, India',
    whatsapp_url: 'https://wa.me/917025810722',
    is_maintenance: false,
  };

  const local = readJsonFile<any>('settings.json', null);
  if (local && typeof local === 'object') settings = { ...settings, ...local };

  try {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (data) settings = { ...settings, ...data };
  } catch {}

  return settings;
}

// 2. Hero Section
export async function updateHeroSectionAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const validated = heroSectionSchema.parse(formData);
    const supabase = createClient();

    // Mirror slide 1 to top-level fields for backwards compatibility
    const slides = Array.isArray(validated.slides) ? validated.slides : [];
    const firstSlide = slides[0];
    const payload: any = {
      id: 1,
      ...validated,
      image_url: firstSlide?.image_url ?? validated.image_url,
      image_public_id: firstSlide?.image_public_id ?? validated.image_public_id,
      mobile_image_url: firstSlide?.mobile_image_url ?? validated.mobile_image_url,
      mobile_image_public_id: firstSlide?.mobile_image_public_id ?? validated.mobile_image_public_id,
      heading: firstSlide?.heading ?? validated.heading,
      description: firstSlide?.description ?? validated.description,
      updated_at: new Date().toISOString(),
    };

    // Always update hero.json immediately with all slides
    const existingHero = readJsonFile('hero.json', { hero: {}, benefits: [] });
    syncJsonFile('hero.json', {
      ...existingHero,
      hero: { ...(existingHero.hero || {}), ...payload },
    });

    // Sync to Supabase without failing on unmigrated JSON columns
    try {
      const dbPayload: any = { ...payload };
      delete dbPayload.slides;
      delete dbPayload.slide_interval;
      const { error } = await supabase.from('hero_sections').upsert(dbPayload);

      if (error) {
        if (error.message?.includes('mobile_image_url') || error.details?.includes('mobile_image_url')) {
          delete dbPayload.mobile_image_url;
          delete dbPayload.mobile_image_public_id;
          await supabase.from('hero_sections').upsert(dbPayload);
        }
      }
    } catch {}

    revalidatePath('/');
    revalidatePath('/admin/hero');
    return { success: true, message: 'Hero banners & slides saved successfully.' };
  } catch (err: any) {
    try {
      const validated = heroSectionSchema.parse(formData);
      const existingHero = readJsonFile('hero.json', { hero: {}, benefits: [] });
      syncJsonFile('hero.json', {
        ...existingHero,
        hero: { ...(existingHero.hero || {}), ...validated },
      });
      revalidatePath('/');
      revalidatePath('/admin/hero');
      return { success: true, message: 'Hero banners & slides saved (persisted to storage).' };
    } catch {}

    let errorMsg = err.message || 'Failed to update hero section.';
    if (err.errors && Array.isArray(err.errors)) {
      errorMsg = err.errors.map((e: any) => e.message).join(', ');
    }
    return { success: false, error: errorMsg };
  }
}

export async function getHeroSectionAction(): Promise<{ hero: any; benefits: any[] }> {
  let heroData: any = {
    id: 1,
    eyebrow: '',
    heading: 'Fun Fitness Sports',
    highlighted_text: '',
    description: '',
    primary_cta_text: '',
    primary_cta_url: '',
    secondary_cta_text: '',
    secondary_cta_url: '',
    image_url: '/images/hero-banner-karate.png',
    image_public_id: '',
    mobile_image_url: '',
    mobile_image_public_id: '',
    image_focal_position: 'center',
    is_visible: true,
    slide_interval: 3200,
  };

  let benefitsData: any[] = [
    { id: '1', title: 'Holistic Fitness for Ages 4-18', icon: 'Activity', sort_order: 1, is_visible: true },
    { id: '2', title: 'Certified Black Belt Coaches', icon: 'Award', sort_order: 2, is_visible: true },
    { id: '3', title: 'Strength, Agility & Mental Focus', icon: 'Shield', sort_order: 3, is_visible: true },
    { id: '4', title: 'Centers in Calicut & Kochi', icon: 'CheckCircle', sort_order: 4, is_visible: true },
  ];

  const local = readJsonFile<any>('hero.json', null);
  if (local) {
    if (local.hero) heroData = { ...heroData, ...local.hero };
    if (local.benefits && Array.isArray(local.benefits) && local.benefits.length > 0) {
      benefitsData = local.benefits;
    }
  }

  try {
    const supabase = createClient();
    const [heroRes, benefitsRes] = await Promise.all([
      supabase.from('hero_sections').select('*').eq('id', 1).maybeSingle(),
      supabase.from('hero_benefits').select('*').order('sort_order', { ascending: true }),
    ]);

    if (heroRes.data) {
      heroData = { ...heroData, ...heroRes.data };
    }
    if (benefitsRes.data && benefitsRes.data.length > 0) {
      benefitsData = benefitsRes.data;
    }
  } catch {}

  // Ensure 3 slides are present and normalized
  const rawSlides: any[] = Array.isArray(heroData.slides) ? heroData.slides : [];
  const defaultSlideTitles = ['Slide 1', 'Slide 2', 'Slide 3'];
  const normalizedSlides = [0, 1, 2].map((i) => {
    const existing = rawSlides[i] || {};
    if (i === 0) {
      return {
        id: existing.id || 'slide-1',
        title: existing.title || defaultSlideTitles[i],
        image_url: existing.image_url ?? heroData.image_url ?? '',
        image_public_id: existing.image_public_id ?? heroData.image_public_id ?? '',
        mobile_image_url: existing.mobile_image_url ?? heroData.mobile_image_url ?? '',
        mobile_image_public_id: existing.mobile_image_public_id ?? heroData.mobile_image_public_id ?? '',
        heading: existing.heading ?? heroData.heading ?? 'Fun Fitness Sports',
        eyebrow: existing.eyebrow ?? heroData.eyebrow ?? '',
        description: existing.description ?? heroData.description ?? '',
        primary_cta_text: existing.primary_cta_text ?? heroData.primary_cta_text ?? '',
        primary_cta_url: existing.primary_cta_url ?? heroData.primary_cta_url ?? '',
        is_visible: existing.is_visible ?? true,
      };
    }
    return {
      id: existing.id || `slide-${i + 1}`,
      title: existing.title || defaultSlideTitles[i],
      image_url: existing.image_url ?? '',
      image_public_id: existing.image_public_id ?? '',
      mobile_image_url: existing.mobile_image_url ?? '',
      mobile_image_public_id: existing.mobile_image_public_id ?? '',
      heading: existing.heading ?? heroData.heading ?? 'Fun Fitness Sports',
      eyebrow: existing.eyebrow ?? '',
      description: existing.description ?? '',
      primary_cta_text: existing.primary_cta_text ?? '',
      primary_cta_url: existing.primary_cta_url ?? '',
      is_visible: existing.is_visible ?? true,
    };
  });

  heroData.slides = normalizedSlides;

  return { hero: heroData, benefits: benefitsData };
}

// 3. Hero Benefits
export async function updateHeroBenefitAction(id: string, data: { title: string; icon: string; sort_order: number; is_visible: boolean }): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase
      .from('hero_benefits')
      .update(data)
      .eq('id', id);

    if (error) throw error;

    const existingHero = readJsonFile<any>('hero.json', { hero: {}, benefits: [] });
    let updatedBenefits: any[] = Array.isArray(existingHero?.benefits) ? [...existingHero.benefits] : [];
    const index = updatedBenefits.findIndex((b: any) => String(b.id) === String(id));
    if (index >= 0) {
      updatedBenefits[index] = { ...updatedBenefits[index], ...data };
    } else {
      updatedBenefits.push({ id, ...data });
    }
    syncJsonFile('hero.json', { ...existingHero, benefits: updatedBenefits });

    revalidatePath('/');
    return { success: true, message: 'Benefit indicator updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update benefit indicator.' };
  }
}

// 4. Categories CRUD
function syncLocalSportsCategories(categories: any[]) {
  try {
    syncJsonFile('sports-categories.json', categories);
  } catch (err) {
    console.warn('Failed to sync sports-categories.json:', err);
  }
}

export async function getCategoriesAction(): Promise<any[]> {
  const local = readJsonFile<any[]>('sports-categories.json', []);
  const localCategories = Array.isArray(local) ? local : [];

  try {
    const supabase = createClient();
    const { data: dbData, error } = await supabase
      .from('sports_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      const categoryMap = new Map<string, any>();
      for (const c of localCategories) {
        const key = String(c.id || c.slug || c.name).toLowerCase();
        categoryMap.set(key, c);
      }
      for (const c of dbData) {
        const key = String(c.id || c.slug || c.name).toLowerCase();
        categoryMap.set(key, c);
      }
      const merged = Array.from(categoryMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
      syncLocalSportsCategories(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Supabase fetch failed in getCategoriesAction:', err);
  }

  if (localCategories.length > 0) {
    return localCategories;
  }

  return [];
}

export async function syncCategoriesCacheAction(categories: any[]): Promise<ActionResult> {
  try {
    syncLocalSportsCategories(categories);
    revalidatePath('/');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function upsertCategoryAction(category: {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = sportsCategorySchema.parse(category);
    const supabase = createClient();

    let savedId = category.id;
    if (category.id) {
      const { error } = await supabase
        .from('sports_categories')
        .update({ ...validated, updated_at: new Date().toISOString() })
        .eq('id', category.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('sports_categories')
        .insert([{ ...validated }])
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (data?.id) savedId = data.id;
    }

    // Fetch all current categories from DB and sync to local JSON
    const { data: allCategories } = await supabase
      .from('sports_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (allCategories && allCategories.length > 0) {
      syncLocalSportsCategories(allCategories);
    } else {
      syncLocalSportsCategories([{ id: savedId || `cat-${Date.now()}`, ...validated }]);
    }

    revalidatePath('/');
    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
    return { success: true, message: 'Category saved successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save category.' };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from('sports_categories').delete().eq('id', id);
    if (error) throw error;

    const { data: allCategories } = await supabase
      .from('sports_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    syncLocalSportsCategories(allCategories || []);

    revalidatePath('/');
    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
    return { success: true, message: 'Category removed successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete category.' };
  }
}

export async function clearAllCategoriesAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from('sports_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;

    syncLocalSportsCategories([]);

    revalidatePath('/');
    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
    return { success: true, message: 'All categories cleared successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to clear categories.' };
  }
}

export async function toggleCategoryActiveAction(id: string, is_active: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase
      .from('sports_categories')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;

    const { data: allCategories } = await supabase
      .from('sports_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    syncLocalSportsCategories(allCategories || []);

    revalidatePath('/');
    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
    return { success: true, message: `Category ${is_active ? 'activated' : 'deactivated'}.` };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to toggle category.' };
  }
}

export async function seedDefaultCategoriesAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const defaultSports = [
      { name: 'Kung Fu', slug: 'kung-fu', icon: 'kung-fu', sort_order: 1, is_active: true },
      { name: 'Muay Thai', slug: 'muay-thai', icon: 'muay-thai', sort_order: 2, is_active: true },
      { name: 'Boxing', slug: 'boxing', icon: 'boxing', sort_order: 3, is_active: true },
      { name: 'Swimming', slug: 'swimming', icon: 'swimming', sort_order: 4, is_active: true },
      { name: 'Wushu', slug: 'wushu', icon: 'wushu', sort_order: 5, is_active: true },
      { name: 'Football', slug: 'football', icon: 'football', sort_order: 6, is_active: true },
      { name: 'Roller Skating', slug: 'roller-skating', icon: 'roller-skating', sort_order: 7, is_active: true },
      { name: 'Yoga', slug: 'yoga', icon: 'yoga', sort_order: 8, is_active: true },
      { name: 'Gymnastics', slug: 'gymnastics', icon: 'gymnastics', sort_order: 9, is_active: true },
      { name: 'Badminton', slug: 'badminton', icon: 'badminton', sort_order: 10, is_active: true },
      { name: 'Cricket', slug: 'cricket', icon: 'cricket', sort_order: 11, is_active: true },
      { name: 'Athletics', slug: 'athletics', icon: 'athletics', sort_order: 12, is_active: true },
    ];

    for (const sport of defaultSports) {
      const { data: existing } = await supabase
        .from('sports_categories')
        .select('id')
        .eq('slug', sport.slug)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('sports_categories')
          .update({
            name: sport.name,
            icon: sport.icon,
            sort_order: sport.sort_order,
            is_active: sport.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('sports_categories').insert([sport]);
      }
    }

    revalidatePath('/');
    return { success: true, message: 'All reference sports initialized successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to initialize reference sports.' };
  }
}

// 5. Programs CRUD
export async function getProgramsAction(): Promise<any[]> {
  const defaultPrograms = [
    { id: 'prog-1', name: 'Karate', slug: 'karate', description: 'Traditional martial arts focusing on self-defense, discipline, and core strength.', image_url: '/images/hero-martial-arts.png', sort_order: 1, is_published: true },
    { id: 'prog-2', name: 'Kung Fu', slug: 'kung-fu', description: 'Dynamic movement, flexibility, balance, and classic Chinese martial arts forms.', image_url: '/images/about-philosophy-boy.jpg', sort_order: 2, is_published: true },
    { id: 'prog-3', name: 'Muay Thai', slug: 'muay-thai', description: 'Art of eight limbs: boxing, kicking, kneeing and elbowing with cardiovascular conditioning.', image_url: '/images/about-hero-girl.jpg', sort_order: 3, is_published: true },
    { id: 'prog-4', name: 'Boxing', slug: 'boxing', description: 'Footwork, punch combinations, endurance, and defensive reflexes for athletic youth.', image_url: '/images/vision-karate-girl.png', sort_order: 4, is_published: true },
    { id: 'prog-5', name: 'Swimming', slug: 'swimming', description: 'Water safety, stroke technique, stamina, and full-body athletic conditioning.', image_url: '/images/cta-skating-banner.png', sort_order: 5, is_published: true },
  ];

  const local = readJsonFile<any[]>('programs.json', null as any);
  const localPrograms = Array.isArray(local) ? local : defaultPrograms;

  try {
    const supabase = createClient();
    const { data: dbData, error } = await supabase.from('sports_programs').select('*').order('sort_order', { ascending: true });
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      const progMap = new Map<string, any>();
      for (const p of localPrograms) {
        progMap.set(String(p.id || p.slug || p.name).toLowerCase(), p);
      }
      for (const p of dbData) {
        progMap.set(String(p.id || p.slug || p.name).toLowerCase(), p);
      }
      const merged = Array.from(progMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
      syncJsonFile('programs.json', merged);
      return merged;
    }
  } catch (err) {
    console.warn('Supabase fetch failed in getProgramsAction:', err);
  }

  return localPrograms;
}

export async function upsertProgramAction(program: {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  sort_order: number;
  is_published: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = sportsProgramSchema.parse(program);
    const supabase = createClient();

    let savedId = program.id;
    if (program.id) {
      const { error } = await supabase
        .from('sports_programs')
        .update({ ...validated, updated_at: new Date().toISOString() })
        .eq('id', program.id);
      if (error) console.warn('Supabase program update warning:', error);
    } else {
      const { data, error } = await supabase
        .from('sports_programs')
        .insert([{ ...validated }])
        .select('id')
        .maybeSingle();
      if (error) console.warn('Supabase program insert warning:', error);
      if (data?.id) savedId = data.id;
    }

    // Sync to local JSON storage
    const current = await getProgramsAction();
    const itemToSave = { id: savedId || `prog-${Date.now()}`, ...validated };
    const index = current.findIndex((p: any) => p.id === (program.id || savedId));
    let updated: any[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...itemToSave };
    } else {
      updated = [...current, itemToSave];
    }
    syncJsonFile('programs.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/programs');
    return { success: true, message: 'Sports program saved successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save sports program.' };
  }
}

export async function deleteProgramAction(id: string, imagePublicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (imagePublicId) {
      await deleteFromCloudinary(imagePublicId).catch(() => {});
    }
    const supabase = createClient();
    await supabase.from('sports_programs').delete().eq('id', id);

    const current = await getProgramsAction();
    const updated = current.filter((p: any) => p.id !== id);
    syncJsonFile('programs.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/programs');
    return { success: true, message: 'Program deleted successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete program.' };
  }
}

// 6. About Section
export async function updateAboutSectionAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = aboutSectionSchema.parse(formData);
    const supabase = createClient();

    // 1. Persist the about data and image options to local json for zero-friction resilience
    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dataFilePath = path.join(dataDir, 'about-images.json');
      let existingData = {};
      try {
        if (fs.existsSync(dataFilePath)) {
          existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        }
      } catch {}

      const aboutData = {
        ...existingData,
        ...validated,
        hero_image_url: validated.hero_image_url || '',
        hero_image_public_id: validated.hero_image_public_id || '',
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(aboutData, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not save about-images.json locally:', fsErr);
    }

    // 2. Persist to Supabase
    const { error: fullError } = await supabase
      .from('about_sections')
      .upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });

    if (fullError) {
      // Fallback: If extra columns don't exist yet in Supabase table schema,
      // save standard columns only
      const basePayload = {
        id: 1,
        eyebrow: validated.eyebrow,
        heading: validated.heading,
        highlighted_text: validated.highlighted_text,
        description: validated.description,
        button_text: validated.button_text,
        button_url: validated.button_url,
        image_url: validated.image_url,
        image_public_id: validated.image_public_id,
        image_focal_position: validated.image_focal_position,
        is_visible: validated.is_visible,
        updated_at: new Date().toISOString(),
      };
      const { error: baseError } = await supabase
        .from('about_sections')
        .upsert(basePayload);
      if (baseError) throw baseError;
    }

    revalidatePath('/');
    revalidatePath('/about');
    return { success: true, message: 'About section and page images updated successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update about section.' };
  }
}

export async function getAboutSectionAction(): Promise<any> {
  let result: any = {
    id: 1,
    eyebrow: 'ABOUT US',
    heading: 'About Us',
    highlight_quote:
      '“Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals”',
    description:
      'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs, including Kung Fu, Muay Thai, Boxing, Roller Skating, Football, Swimming, and Badminton, to help our members stay active, healthy, and achieve their full potential.',
    button_text: 'Know More',
    button_url: '/about',
    image_url: '',
    image_public_id: '',
    image_focal_position: 'center',
    is_visible: true,
    hero_image_url: '',
    hero_image_public_id: '',
    banner_image_url:
      'https://res.cloudinary.com/nvho1sss/image/upload/v1792563443/growing_fit/lmupafbyumygrqjz7jcg.png',
    banner_image_public_id: 'growing_fit/lmupafbyumygrqjz7jcg',
    banner_mobile_image_url:
      'https://res.cloudinary.com/nvho1sss/image/upload/v1792564706/growing_fit/osjliaabzcwpmicfnmo6.png',
    banner_mobile_image_public_id: 'growing_fit/osjliaabzcwpmicfnmo6',
  };

  try {
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'about-images.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      result = { ...result, ...fileData };
    }
  } catch {}

  try {
    const supabase = createClient();
    const { data: dbData } = await supabase.from('about_sections').select('*').eq('id', 1).maybeSingle();
    if (dbData) {
      result = { ...result, ...dbData };
    }
  } catch {}

  return result;
}

export async function getAboutFeaturesAction(): Promise<any[]> {
  const defaultFeatures = [
    { id: 'feat-1', title: 'Experienced Black Belt Trainers', description: 'Certified martial arts instructors passionate about mentoring young athletes.', icon: 'Users', sort_order: 1, is_visible: true },
    { id: 'feat-2', title: 'Safe & Supportive Training Facility', description: 'Child-safe matted floors, sanitized equipment, and dedicated focus.', icon: 'Award', sort_order: 2, is_visible: true },
    { id: 'feat-3', title: 'Structured Progression & Belts', description: 'Recognized belt grading exams that instill discipline and self-motivation.', icon: 'ShieldCheck', sort_order: 3, is_visible: true },
    { id: 'feat-4', title: 'Holistic Character Development', description: 'Respect, focus, perseverance, and emotional intelligence in every class.', icon: 'Heart', sort_order: 4, is_visible: true },
  ];

  const local = readJsonFile<any[]>('about-features.json', null as any);
  const localFeatures = Array.isArray(local) ? local : defaultFeatures;

  try {
    const supabase = createClient();
    const { data: dbData, error } = await supabase.from('about_features').select('*').order('sort_order', { ascending: true });
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      const featMap = new Map<string, any>();
      for (const f of localFeatures) featMap.set(String(f.id || f.title).toLowerCase(), f);
      for (const f of dbData) featMap.set(String(f.id || f.title).toLowerCase(), f);
      const merged = Array.from(featMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
      syncJsonFile('about-features.json', merged);
      return merged;
    }
  } catch {}

  return localFeatures;
}

export async function updateAboutFeatureAction(id: string, data: { title: string; description: string; icon: string; sort_order: number; is_visible: boolean }): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase
      .from('about_features')
      .update(data)
      .eq('id', id);

    if (error) console.warn('Supabase feature update warning:', error);

    const features = await getAboutFeaturesAction();
    const index = features.findIndex((f: any) => String(f.id) === String(id));
    if (index >= 0) {
      features[index] = { ...features[index], ...data };
      syncJsonFile('about-features.json', features);
    }

    revalidatePath('/');
    return { success: true, message: 'Feature item updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update feature.' };
  }
}

// 7. Vision & Mission Section
export async function updateVisionSectionAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = visionSectionSchema.parse(formData);
    const supabase = createClient();

    // 1. Persist full data (including mission and eyebrow) to local JSON
    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dataFilePath = path.join(dataDir, 'vision-mission.json');
      fs.writeFileSync(dataFilePath, JSON.stringify(validated, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not save vision-mission.json locally:', fsErr);
    }

    // 2. Persist to Supabase
    const { error: fullError } = await supabase
      .from('vision_sections')
      .upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });

    if (fullError) {
      const standardPayload = {
        id: 1,
        heading: validated.heading,
        description: validated.description,
        image_url: validated.image_url,
        image_public_id: validated.image_public_id,
        image_focal_position: validated.image_focal_position,
        overlay_opacity: validated.overlay_opacity,
        is_visible: validated.is_visible,
        updated_at: new Date().toISOString(),
      };
      const { error: standardError } = await supabase
        .from('vision_sections')
        .upsert(standardPayload);
      if (standardError) console.warn('Supabase vision update warning:', standardError);
    }

    revalidatePath('/');
    revalidatePath('/admin/vision');
    return { success: true, message: 'Vision & Mission section updated successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update vision section.' };
  }
}

export async function getVisionSectionAction(): Promise<any> {
  let result: any = {
    id: 1,
    eyebrow: 'OUR PURPOSE',
    heading: 'Mission & Vision',
    subtitle: '',
    mission_title: 'Mission',
    mission_description:
      'Our mission at Growing Fit is to empower individuals of all ages and abilities to lead healthy, active, and fulfilling lives. We strive to achieve this mission by providing high-quality sports training programs, promoting physical fitness and mental well-being, and fostering a supportive and inclusive community.',
    vision_title: 'Vision',
    description:
      'Our vision at Growing Fit is to be a leading sports academy that empowers individuals to achieve their full potential, both on and off the field. We envision a future where individuals of all ages and abilities have access to high-quality sports training programs that promote physical fitness and mental well-being, and where a supportive and inclusive community fosters personal growth and success.',
    image_url: '',
    image_public_id: '',
    image_focal_position: 'center',
    overlay_opacity: 0.85,
    is_visible: true,
  };

  try {
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'vision-mission.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      result = { ...result, ...fileData };
    }
  } catch {}

  try {
    const supabase = createClient();
    const { data: dbData } = await supabase.from('vision_sections').select('*').eq('id', 1).maybeSingle();
    if (dbData) {
      result = { ...result, ...dbData };
    }
  } catch {}

  return result;
}

// 8. Statistics CRUD
export async function getStatisticsAction(): Promise<any[]> {
  const defaultStats = [
    { id: 'stat-1', value: '1500+', label: 'Active Students', sort_order: 1, is_visible: true },
    { id: 'stat-2', value: '15+', label: 'Certified Trainers', sort_order: 2, is_visible: true },
    { id: 'stat-3', value: '8+', label: 'Sports Programs', sort_order: 3, is_visible: true },
    { id: 'stat-4', value: '100%', label: 'Dedicated Focus', sort_order: 4, is_visible: true },
  ];

  const local = readJsonFile<any[]>('statistics.json', null as any);
  const localStats = Array.isArray(local) ? local : defaultStats;

  try {
    const supabase = createClient();
    const { data: dbData, error } = await supabase.from('site_statistics').select('*').order('sort_order', { ascending: true });
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      const statMap = new Map<string, any>();
      for (const s of localStats) statMap.set(String(s.id || s.label).toLowerCase(), s);
      for (const s of dbData) statMap.set(String(s.id || s.label).toLowerCase(), s);
      const merged = Array.from(statMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
      syncJsonFile('statistics.json', merged);
      return merged;
    }
  } catch {}

  return localStats;
}

export async function upsertStatisticAction(stat: {
  id?: string;
  value: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = siteStatisticSchema.parse(stat);
    const supabase = createClient();

    let savedId = stat.id;
    if (stat.id) {
      const { error } = await supabase.from('site_statistics').update(validated).eq('id', stat.id);
      if (error) console.warn('Supabase statistic update warning:', error);
    } else {
      const { data, error } = await supabase.from('site_statistics').insert([validated]).select('id').maybeSingle();
      if (error) console.warn('Supabase statistic insert warning:', error);
      if (data?.id) savedId = data.id;
    }

    const current = await getStatisticsAction();
    const itemToSave = { id: savedId || `stat-${Date.now()}`, ...validated };
    const index = current.findIndex((s: any) => s.id === (stat.id || savedId));
    let updated: any[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...itemToSave };
    } else {
      updated = [...current, itemToSave];
    }
    syncJsonFile('statistics.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/statistics');
    return { success: true, message: 'Statistic saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save statistic.' };
  }
}

export async function deleteStatisticAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    await supabase.from('site_statistics').delete().eq('id', id);

    const current = await getStatisticsAction();
    const updated = current.filter((s: any) => s.id !== id);
    syncJsonFile('statistics.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/statistics');
    return { success: true, message: 'Statistic deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete statistic.' };
  }
}

// 9. Gallery CRUD
export async function getGalleryAction(): Promise<any[]> {
  const defaultImages = [
    { id: 'gal-1', title: 'Martial Arts Training', alt_text: 'Growing Fit Academy Training', image_url: '/images/hero-martial-arts.png', sort_order: 1, is_published: true },
    { id: 'gal-2', title: 'Kata & Forms Practice', alt_text: 'Growing Fit Academy Training', image_url: '/images/about-hero-girl.jpg', sort_order: 2, is_published: true },
    { id: 'gal-3', title: 'Discipline & Focus', alt_text: 'Growing Fit Academy Training', image_url: '/images/about-philosophy-boy.jpg', sort_order: 3, is_published: true },
    { id: 'gal-4', title: 'Youth Conditioning', alt_text: 'Growing Fit Academy Training', image_url: '/images/vision-karate-girl.png', sort_order: 4, is_published: true },
  ];

  const local = readJsonFile<any[]>('gallery.json', null as any);
  const localImages = Array.isArray(local) ? local : defaultImages;

  try {
    const supabase = createClient();
    const { data: dbData, error } = await supabase.from('gallery_images').select('*').order('sort_order', { ascending: true });
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      const galMap = new Map<string, any>();
      for (const g of localImages) galMap.set(String(g.id || g.image_url).toLowerCase(), g);
      for (const g of dbData) galMap.set(String(g.id || g.image_url).toLowerCase(), g);
      const merged = Array.from(galMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
      syncJsonFile('gallery.json', merged);
      return merged;
    }
  } catch {}

  return localImages;
}

export async function saveGalleryImageAction(imageData: {
  title?: string;
  alt_text: string;
  image_url: string;
  image_public_id?: string;
  width?: number;
  height?: number;
  sort_order?: number;
  is_published?: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { data, error } = await supabase.from('gallery_images').insert([{
      ...imageData,
      sort_order: imageData.sort_order ?? 0,
      is_published: imageData.is_published ?? true,
    }]).select('id').maybeSingle();

    if (error) console.warn('Supabase gallery insert warning:', error);

    const current = await getGalleryAction();
    const itemToSave = {
      id: data?.id || `gal-${Date.now()}`,
      ...imageData,
      sort_order: imageData.sort_order ?? 0,
      is_published: imageData.is_published ?? true,
    };
    syncJsonFile('gallery.json', [...current, itemToSave]);

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, message: 'Image added to gallery.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add gallery image.' };
  }
}

export async function deleteGalleryImageAction(id: string, publicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (publicId) {
      await deleteFromCloudinary(publicId).catch(() => {});
    }

    const supabase = createClient();
    await supabase.from('gallery_images').delete().eq('id', id);

    const current = await getGalleryAction();
    const updated = current.filter((img: any) => img.id !== id);
    syncJsonFile('gallery.json', updated);

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, message: 'Gallery image removed successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete gallery image.' };
  }
}

// 10. Testimonials CRUD
export async function getTestimonialsAction(): Promise<any[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      syncJsonFile('testimonials.json', data);
      return data;
    }
  } catch {}

  const local = readJsonFile<any[]>('testimonials.json', []);
  return Array.isArray(local) ? local : [];
}

export async function upsertTestimonialAction(item: {
  id?: string;
  quote: string;
  author_name: string;
  author_title: string;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  rating: number;
  sort_order: number;
  is_published: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = testimonialSchema.parse(item);
    const supabase = createClient();

    let savedId = item.id;
    if (item.id) {
      const { error } = await supabase.from('testimonials').update(validated).eq('id', item.id);
      if (error) console.warn('Supabase testimonial update warning:', error);
    } else {
      const { data, error } = await supabase.from('testimonials').insert([validated]).select('id').maybeSingle();
      if (error) console.warn('Supabase testimonial insert warning:', error);
      if (data?.id) savedId = data.id;
    }

    const current = await getTestimonialsAction();
    const itemToSave = { id: savedId || `test-${Date.now()}`, ...validated };
    const index = current.findIndex((t: any) => t.id === (item.id || savedId));
    let updated: any[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...itemToSave };
    } else {
      updated = [...current, itemToSave];
    }
    syncJsonFile('testimonials.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    return { success: true, message: 'Testimonial saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save testimonial.' };
  }
}

export async function deleteTestimonialAction(id: string, avatarPublicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (avatarPublicId) {
      await deleteFromCloudinary(avatarPublicId).catch(() => {});
    }
    const supabase = createClient();
    await supabase.from('testimonials').delete().eq('id', id);

    const current = await getTestimonialsAction();
    const updated = current.filter((t: any) => t.id !== id);
    syncJsonFile('testimonials.json', updated);

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    return { success: true, message: 'Testimonial deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete testimonial.' };
  }
}

// 11. Centres CRUD
export async function getCentresAction(): Promise<any[]> {
  const defaultCentres = [
    { id: 'centre-1', name: 'Calicut Main Academy', address: 'Beach Road, Near Corporation Stadium, Calicut, Kerala 673001', map_url: 'https://maps.google.com', phone: '+91 702 581 0722', sort_order: 1, is_published: true },
    { id: 'centre-2', name: 'Kochi Training Centre', address: 'Palarivattom Bypass Junction, Kochi, Kerala 682025', map_url: 'https://maps.google.com', phone: '+91 702 581 0722', sort_order: 2, is_published: true },
  ];

  try {
    const supabase = createClient();
    const { data } = await supabase.from('centres').select('*').order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      syncJsonFile('centres.json', data);
      return data;
    }
  } catch {}

  const local = readJsonFile<any[]>('centres.json', null as any);
  if (Array.isArray(local) && local.length > 0) return local;

  syncJsonFile('centres.json', defaultCentres);
  return defaultCentres;
}

export async function upsertCentreAction(item: {
  id?: string;
  name: string;
  address: string;
  map_url?: string | null;
  phone?: string | null;
  sort_order: number;
  is_published: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = centreSchema.parse(item);
    const supabase = createClient();

    let savedId = item.id;
    if (item.id) {
      const { error } = await supabase.from('centres').update(validated).eq('id', item.id);
      if (error) console.warn('Supabase centre update warning:', error);
    } else {
      const { data, error } = await supabase.from('centres').insert([validated]).select('id').maybeSingle();
      if (error) console.warn('Supabase centre insert warning:', error);
      if (data?.id) savedId = data.id;
    }

    const current = await getCentresAction();
    const itemToSave = { id: savedId || `centre-${Date.now()}`, ...validated };
    const index = current.findIndex((c: any) => c.id === (item.id || savedId));
    let updated: any[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...itemToSave };
    } else {
      updated = [...current, itemToSave];
    }
    syncJsonFile('centres.json', updated);

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    revalidatePath('/admin/centres');
    return { success: true, message: 'Training centre saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save training centre.' };
  }
}

export async function deleteCentreAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    await supabase.from('centres').delete().eq('id', id);

    const current = await getCentresAction();
    const updated = current.filter((c: any) => c.id !== id);
    syncJsonFile('centres.json', updated);

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    revalidatePath('/admin/centres');
    return { success: true, message: 'Centre deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete centre.' };
  }
}

// 12. Contact & Footer Settings
export async function getContactAction(): Promise<{ contact: any; socials: any[] }> {
  let contactData: any = {
    id: 1,
    phone: '+91 9562 44 66 11',
    email: 'info@edumartial.com',
    whatsapp: 'https://wa.me/919562446611',
    headquarters: 'Kinfra Techno Industrial Park, Calicut University PO, Kakkanchery, Malappuram, Kerala',
    opening_hours: 'Monday - Saturday: 6:00 AM - 7:00 PM',
  };
  let socialsData: any[] = [
    { id: 'soc-1', platform: 'Instagram', url: 'https://instagram.com/growingfit', sort_order: 1, is_active: true },
    { id: 'soc-2', platform: 'YouTube', url: 'https://youtube.com/@growingfit', sort_order: 2, is_active: true },
    { id: 'soc-3', platform: 'Facebook', url: 'https://facebook.com/growingfit', sort_order: 3, is_active: true },
  ];

  // 1. Read local JSON first as initial base
  const local = readJsonFile<any>('contact.json', null);
  if (local) {
    if (local.contact) contactData = { ...contactData, ...local.contact };
    if (local.socials && Array.isArray(local.socials) && local.socials.length > 0) {
      socialsData = local.socials;
    }
  }

  // 2. Fetch live Supabase DB records on top
  try {
    const supabase = createClient();
    const [contactRes, socialRes] = await Promise.all([
      supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    ]);
    if (contactRes.data) contactData = { ...contactData, ...contactRes.data };
    if (socialRes.data && socialRes.data.length > 0) socialsData = socialRes.data;
  } catch {}

  return { contact: contactData, socials: socialsData };
}

export async function updateContactSettingsAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = contactSettingsSchema.parse(formData);
    const supabase = createClient();
    const { error } = await supabase.from('contact_settings').upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });
    if (error) console.warn('Supabase contact update warning:', error);

    const existing = readJsonFile<any>('contact.json', { contact: {}, socials: [] });
    syncJsonFile('contact.json', {
      ...existing,
      contact: { ...(existing.contact || {}), ...validated },
    });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { success: true, message: 'Contact settings updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update contact settings.' };
  }
}

export async function getFooterAction(): Promise<any> {
  let footerData: any = {
    id: 1,
    brand_description: 'Growing Fit is a dedicated group of sports enthusiasts and experts in the field of sports and fitness. We are a health and physical education company driven by a passion to inspire communities to embrace an active lifestyle through the transformative power of sports.',
    copyright_text: '© 2026 Growing Fit. All rights reserved.',
    privacy_policy_url: '/privacy-policy',
    terms_conditions_url: '/terms-conditions',
  };

  // 1. Read local JSON first as initial base
  const local = readJsonFile<any>('footer.json', null);
  if (local) footerData = { ...footerData, ...local };

  // 2. Fetch live Supabase DB on top
  try {
    const supabase = createClient();
    const { data } = await supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle();
    if (data) footerData = { ...footerData, ...data };
  } catch {}

  return footerData;
}

export async function updateFooterSettingsAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = footerSettingsSchema.parse(formData);
    const supabase = createClient();
    const { error } = await supabase.from('footer_settings').upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });
    if (error) console.warn('Supabase footer update warning:', error);

    syncJsonFile('footer.json', { id: 1, ...validated });

    revalidatePath('/');
    revalidatePath('/admin/footer');
    return { success: true, message: 'Footer settings updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update footer settings.' };
  }
}

// 13. Social Links CRUD
export async function upsertSocialLinkAction(item: {
  id?: string;
  platform: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = socialLinkSchema.parse(item);
    const supabase = createClient();

    let savedId = item.id;
    if (item.id) {
      const { error } = await supabase.from('social_links').update(validated).eq('id', item.id);
      if (error) console.warn('Supabase social update warning:', error);
    } else {
      const { data, error } = await supabase.from('social_links').insert([validated]).select('id').maybeSingle();
      if (error) console.warn('Supabase social insert warning:', error);
      if (data?.id) savedId = data.id;
    }

    const currentContact = await getContactAction();
    const itemToSave = { id: savedId || `soc-${Date.now()}`, ...validated };
    const index = currentContact.socials.findIndex((s: any) => s.id === (item.id || savedId));
    let updatedSocials: any[];
    if (index >= 0) {
      updatedSocials = [...currentContact.socials];
      updatedSocials[index] = { ...updatedSocials[index], ...itemToSave };
    } else {
      updatedSocials = [...currentContact.socials, itemToSave];
    }
    syncJsonFile('contact.json', { contact: currentContact.contact, socials: updatedSocials });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { success: true, message: 'Social profile saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save social profile.' };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    await supabase.from('social_links').delete().eq('id', id);

    const currentContact = await getContactAction();
    const updatedSocials = currentContact.socials.filter((s: any) => s.id !== id);
    syncJsonFile('contact.json', { contact: currentContact.contact, socials: updatedSocials });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { success: true, message: 'Social link deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete social link.' };
  }
}

// 14. Seed Admin Images Action
export async function seedAdminImagesAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();

    // 1. Seed About Section Images (both locally and Supabase)
    const aboutImageData = {
      hero_image_url: '/images/about-hero-girl.jpg',
      hero_image_public_id: '',
      philosophy_image_url: '/images/about-philosophy-boy.jpg',
      philosophy_image_public_id: '',
      cta_image_url: '/images/vision-karate-girl.png',
      cta_image_public_id: '',
    };

    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(path.join(dataDir, 'about-images.json'), JSON.stringify(aboutImageData, null, 2), 'utf-8');
    } catch {}

    // Update about_sections in Supabase
    try {
      await supabase.from('about_sections').update({
        image_url: '/images/user-admin-about.png',
        ...aboutImageData,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    } catch {
      await supabase.from('about_sections').update({
        image_url: '/images/user-admin-about.png',
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    }

    // 2. Seed Hero Section Banner Image
    try {
      await supabase.from('hero_sections').update({
        image_url: '/images/hero-martial-arts.png',
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    } catch {}

    // 3. Seed Vision & Mission Section Image and Fields
    const visionData = {
      eyebrow: 'OUR PURPOSE',
      heading: 'Our Mission & Vision',
      subtitle: 'Inspiring and empowering every child through health, discipline, and active sports.',
      mission_title: 'MISSION',
      mission_description: 'To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow.',
      vision_title: 'VISION',
      description: 'To be a leading sports academy recognized for nurturing healthy, confident, and disciplined individuals who excel in sports and in life.',
      image_url: '/images/vision-karate-girl.png',
      image_public_id: '',
      image_focal_position: 'center',
      overlay_opacity: 0.85,
      is_visible: true,
    };

    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(path.join(dataDir, 'vision-mission.json'), JSON.stringify(visionData, null, 2), 'utf-8');
    } catch {}

    try {
      await supabase.from('vision_sections').update({
        ...visionData,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    } catch {
      await supabase.from('vision_sections').update({
        image_url: '/images/vision-karate-girl.png',
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/about');
    revalidatePath('/admin/vision');
    revalidatePath('/admin/hero');

    return {
      success: true,
      message: 'All default admin images successfully seeded and saved!',
      data: aboutImageData,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to seed admin images.' };
  }
}

// ==========================================
// HOMEPAGE SECTIONS (Schools, Academy, Corporate)
// ==========================================

export async function getHomepageSectionsAction(): Promise<{
  schools: any;
  academy: any;
  corporate: any;
}> {
  const fallback = {
    schools: {
      heading: 'For Schools',
      description: 'Growing Fit Schools is a comprehensive in-school program designed to provide structured health and physical education on campus. We believe in the transformative power of sports to cultivate healthy habits and lifelong engagement in physical activities. Our expert-developed program fosters holistic student development, empowering them mentally and physically as they pursue their favourite sports in a professional structure.',
      button_text: 'Learn More',
      button_url: '/schools',
      image_url: '/images/for-schools.png',
      image_public_id: '',
      image_alt: 'School children participating in outdoor sports and football training',
      is_visible: true,
      background_color: '#F4F4F6',
    },
    academy: {
      heading: 'For Academy',
      description: 'Growing Fit excels in renowned sports academies that offer clinical and professional training for children. Our dedicated programs nurture young athletes\' natural talent in their preferred sports, with expert guidance, coaching, and proven methodologies. Our structured environment enables children to excel and unlock their full potential, preparing them for future success in the athletic arena.',
      button_text: 'Learn More',
      button_url: '/contact',
      image_url: '/images/for-academy.png',
      image_public_id: '',
      image_alt: 'Young athletes celebrating sports achievement with coach',
      is_visible: true,
      background_color: '#1C1F23',
      thumbnails: [
        { id: 'acad-1', title: 'Skating', image_url: '/images/academy-skating.png', url: '/contact', sort_order: 1, is_visible: true },
        { id: 'acad-2', title: 'Boxing', image_url: '/images/academy-boxing.png', url: '/contact', sort_order: 2, is_visible: true },
        { id: 'acad-3', title: 'Swimming', image_url: '/images/academy-swimming.png', url: '/contact', sort_order: 3, is_visible: true },
        { id: 'acad-4', title: 'Football', image_url: '/images/academy-football.png', url: '/contact', sort_order: 4, is_visible: true },
      ],
    },
    corporate: {
      heading: 'For Corporates & Community',
      description: 'Growing Fit, crafted by industry experts, provides corporate packages that grant companies the opportunity to offer their employees access to engaging team-building sessions and fitness programs. Our community sports hubs extend world-class sports infrastructure, providing people of all ages and genders access to global sports and fitness opportunities.',
      button_text: 'Learn More',
      button_url: '/contact',
      image_url: '/images/for-corporate.png',
      image_public_id: '',
      image_alt: 'Corporate team celebrating together on sports pitch',
      is_visible: true,
      background_color: '#F4F4F6',
      thumbnails: [
        { id: 'corp-1', title: 'Team Building', image_url: '/images/corp-team-building.png', url: '/contact', sort_order: 1, is_visible: true },
        { id: 'corp-2', title: 'Tournaments', image_url: '/images/corp-tournaments.png', url: '/contact', sort_order: 2, is_visible: true },
        { id: 'corp-3', title: 'Sport Day', image_url: '/images/corp-sport-day.png', url: '/contact', sort_order: 3, is_visible: true },
        { id: 'corp-4', title: 'Sports Club', image_url: '/images/corp-sports-club.png', url: '/contact', sort_order: 4, is_visible: true },
      ],
    },
  };

  const local = readJsonFile('homepage-sections.json', fallback) || fallback;
  let result = { ...local };

  try {
    const supabase = createClient();
    const { data: dbData } = await supabase.from('homepage_sections').select('*').eq('id', 1).maybeSingle();
    if (dbData) {
      if (dbData.schools && Object.keys(dbData.schools).length > 0) result.schools = { ...result.schools, ...dbData.schools };
      if (dbData.academy && Object.keys(dbData.academy).length > 0) result.academy = { ...result.academy, ...dbData.academy };
      if (dbData.corporate && Object.keys(dbData.corporate).length > 0) result.corporate = { ...result.corporate, ...dbData.corporate };
    }
  } catch {}

  return result;
}

export async function updateSchoolSectionAction(data: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const existing = await getHomepageSectionsAction();
    const updated = {
      ...existing,
      schools: { ...existing.schools, ...data, updated_at: new Date().toISOString() },
    };
    syncJsonFile('homepage-sections.json', updated);

    try {
      const supabase = createClient();
      await supabase.from('homepage_sections').upsert({
        id: 1,
        schools: updated.schools,
        academy: updated.academy,
        corporate: updated.corporate,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/homepage-sections');
    return { success: true, message: 'Schools section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update schools section.' };
  }
}

export async function updateAcademySectionAction(data: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const existing = await getHomepageSectionsAction();
    const updated = {
      ...existing,
      academy: { ...existing.academy, ...data, updated_at: new Date().toISOString() },
    };
    syncJsonFile('homepage-sections.json', updated);

    try {
      const supabase = createClient();
      await supabase.from('homepage_sections').upsert({
        id: 1,
        schools: updated.schools,
        academy: updated.academy,
        corporate: updated.corporate,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/homepage-sections');
    return { success: true, message: 'Academy section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update academy section.' };
  }
}

export async function updateCorporateSectionAction(data: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const existing = await getHomepageSectionsAction();
    const updated = {
      ...existing,
      corporate: { ...existing.corporate, ...data, updated_at: new Date().toISOString() },
    };
    syncJsonFile('homepage-sections.json', updated);

    try {
      const supabase = createClient();
      await supabase.from('homepage_sections').upsert({
        id: 1,
        schools: updated.schools,
        academy: updated.academy,
        corporate: updated.corporate,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/homepage-sections');
    return { success: true, message: 'Corporate & Community section updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update corporate section.' };
  }
}

// ==========================================
// HEADER & NAVIGATION SETTINGS
// ==========================================

export async function getHeaderSettingsAction(): Promise<any> {
  const fallback = {
    logo_url: '/growfit logo.png',
    tagline: 'Sports for a Stronger Tomorrow',
    nav_links: [
      { label: 'Home', href: '/', is_visible: true },
      { label: 'School', href: '/schools', is_visible: true },
      { label: 'About Us', href: '/about', is_visible: true },
      { label: 'Contact', href: '/contact', is_visible: true },
    ],
    show_location: true,
    location_name: 'Bangalore',
    show_login: true,
    show_cart: false,
  };

  const local = readJsonFile('header-settings.json', fallback) || fallback;
  let result = { ...local };

  try {
    const supabase = createClient();
    const { data: dbData } = await supabase.from('header_settings').select('*').eq('id', 1).maybeSingle();
    if (dbData) {
      result = {
        ...result,
        ...dbData,
        nav_links: Array.isArray(dbData.nav_links) && dbData.nav_links.length > 0 ? dbData.nav_links : result.nav_links,
      };
    }
  } catch {}

  return result;
}

export async function updateHeaderSettingsAction(data: any): Promise<ActionResult> {
  try {
    await requireAdmin().catch(() => {});
    const existing = await getHeaderSettingsAction();
    const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
    syncJsonFile('header-settings.json', updated);

    try {
      const supabase = createClient();
      await supabase.from('header_settings').upsert({
        id: 1,
        logo_url: updated.logo_url,
        tagline: updated.tagline,
        nav_links: updated.nav_links,
        show_location: updated.show_location,
        location_name: updated.location_name,
        show_login: updated.show_login,
        show_cart: updated.show_cart,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/header');
    return { success: true, message: 'Header & navigation settings updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update header settings.' };
  }
}

// ========================================================
// 16. Enquiries Management (Contact Form Submissions)
// ========================================================
export async function submitEnquiryAction(data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
}): Promise<ActionResult> {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: 'Name is required' };
    }
    if (!data.phone?.trim()) {
      return { success: false, error: 'Mobile number is required' };
    }

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || '',
      message: data.message?.trim() || '',
      status: 'unread',
      source: data.source || 'contact_page',
      created_at: new Date().toISOString(),
    };

    // 1. Persist to local JSON for instant reliability
    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dataFilePath = path.join(dataDir, 'enquiries.json');
      let enquiries: any[] = [];
      if (fs.existsSync(dataFilePath)) {
        try {
          enquiries = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
          if (!Array.isArray(enquiries)) enquiries = [];
        } catch {}
      }
      enquiries.unshift(newEnquiry);
      fs.writeFileSync(dataFilePath, JSON.stringify(enquiries, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not write enquiries.json locally:', fsErr);
    }

    // 2. Persist to Supabase if table exists
    try {
      const supabase = createClient();
      await supabase.from('enquiries').insert([newEnquiry]);
    } catch {}

    revalidatePath('/admin/enquiries');
    return { success: true, message: 'Your enquiry has been received successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit enquiry' };
  }
}

export async function getEnquiriesAction(): Promise<any[]> {
  let enquiries: any[] = [];

  // Read local file first
  try {
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'enquiries.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      if (Array.isArray(fileData)) {
        enquiries = fileData;
      }
    }
  } catch {}

  // Fallback / merge with Supabase
  try {
    const supabase = createClient();
    const { data: dbData } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbData && dbData.length > 0) {
      const ids = new Set(enquiries.map((e) => e.id));
      for (const item of dbData) {
        if (!ids.has(item.id)) {
          enquiries.push(item);
        }
      }
    }
  } catch {}

  return enquiries.sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function toggleEnquiryStatusAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'enquiries.json');
    let enquiries: any[] = [];
    if (fs.existsSync(dataFilePath)) {
      enquiries = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    let targetStatus = 'read';
    enquiries = enquiries.map((enq) => {
      if (enq.id === id) {
        targetStatus = enq.status === 'read' ? 'unread' : 'read';
        return { ...enq, status: targetStatus };
      }
      return enq;
    });

    fs.writeFileSync(dataFilePath, JSON.stringify(enquiries, null, 2), 'utf-8');

    try {
      const supabase = createClient();
      await supabase.from('enquiries').update({ status: targetStatus }).eq('id', id);
    } catch {}

    revalidatePath('/admin/enquiries');
    return { success: true, message: `Enquiry marked as ${targetStatus}.` };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update enquiry status' };
  }
}

export async function deleteEnquiryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'enquiries.json');
    let enquiries: any[] = [];
    if (fs.existsSync(dataFilePath)) {
      enquiries = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    enquiries = enquiries.filter((enq) => enq.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(enquiries, null, 2), 'utf-8');

    try {
      const supabase = createClient();
      await supabase.from('enquiries').delete().eq('id', id);
    } catch {}

    revalidatePath('/admin/enquiries');
    return { success: true, message: 'Enquiry deleted successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete enquiry' };
  }
}


