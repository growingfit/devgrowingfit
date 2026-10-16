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
    revalidatePath('/');
    return { success: true, message: 'Site settings updated successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update site settings.' };
  }
}

// 2. Hero Section
export async function updateHeroSectionAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = heroSectionSchema.parse(formData);
    const supabase = createClient();

    const { error } = await supabase
      .from('hero_sections')
      .upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });

    if (error) throw error;
    revalidatePath('/');
    return { success: true, message: 'Hero banner updated successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update hero section.' };
  }
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
    revalidatePath('/');
    return { success: true, message: 'Benefit indicator updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update benefit indicator.' };
  }
}

// 4. Categories CRUD
function syncLocalSportsCategories(categories: any[]) {
  try {
    const dataDir = path.join(process.cwd(), 'lib', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dataFilePath = path.join(dataDir, 'sports-categories.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to sync sports-categories.json:', err);
  }
}

export async function syncCategoriesCacheAction(categories: any[]): Promise<ActionResult> {
  try {
    syncLocalSportsCategories(categories);
    revalidatePath('/');
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

    if (program.id) {
      const { error } = await supabase
        .from('sports_programs')
        .update({ ...validated, updated_at: new Date().toISOString() })
        .eq('id', program.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('sports_programs')
        .insert([{ ...validated }]);
      if (error) throw error;
    }

    revalidatePath('/');
    return { success: true, message: 'Sports program saved successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save sports program.' };
  }
}

export async function deleteProgramAction(id: string, imagePublicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (imagePublicId) {
      await deleteFromCloudinary(imagePublicId);
    }
    const supabase = createClient();
    const { error } = await supabase.from('sports_programs').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
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

    // 1. Persist the 3 image options to local json for zero-friction resilience
    try {
      const dataDir = path.join(process.cwd(), 'lib', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dataFilePath = path.join(dataDir, 'about-images.json');
      const imageData = {
        hero_image_url: validated.hero_image_url || '',
        hero_image_public_id: validated.hero_image_public_id || '',
        philosophy_image_url: validated.philosophy_image_url || '',
        philosophy_image_public_id: validated.philosophy_image_public_id || '',
        cta_image_url: validated.cta_image_url || '',
        cta_image_public_id: validated.cta_image_public_id || '',
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(imageData, null, 2), 'utf-8');
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
  const supabase = createClient();
  const { data: dbData } = await supabase.from('about_sections').select('*').eq('id', 1).maybeSingle();
  let result: any = {
    id: 1,
    eyebrow: 'ABOUT GROWING FIT',
    heading: 'More Than Just',
    highlighted_text: 'Martial Arts.',
    description: 'Growing Fit is a dedicated martial arts academy focused on the holistic development of children. Our professional training programs in Karate, Kung Fu, Muay Thai, Boxing, and more, help every child stay active, confident and disciplined in life.',
    button_text: 'Know More',
    button_url: '/about',
    image_url: '',
    image_public_id: '',
    image_focal_position: 'center',
    is_visible: true,
    hero_image_url: '/images/about-hero-girl.jpg',
    hero_image_public_id: '',
    philosophy_image_url: '/images/about-philosophy-boy.jpg',
    philosophy_image_public_id: '',
    cta_image_url: '/images/vision-karate-girl.png',
    cta_image_public_id: '',
  };

  if (dbData) {
    result = { ...result, ...dbData };
  }

  try {
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'about-images.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      result = { ...result, ...fileData };
      if (dbData?.hero_image_url) result.hero_image_url = dbData.hero_image_url;
      if (dbData?.philosophy_image_url) result.philosophy_image_url = dbData.philosophy_image_url;
      if (dbData?.cta_image_url) result.cta_image_url = dbData.cta_image_url;
    }
  } catch {}

  return result;
}

export async function updateAboutFeatureAction(id: string, data: { title: string; description: string; icon: string; sort_order: number; is_visible: boolean }): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase
      .from('about_features')
      .update(data)
      .eq('id', id);

    if (error) throw error;
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
    // Try full insert first in case columns exist
    const { error: fullError } = await supabase
      .from('vision_sections')
      .upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });

    if (fullError) {
      // Fallback: If extra columns don't exist yet in Supabase table schema,
      // save the standard schema columns (heading, description, image_url, etc.)
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
      if (standardError) throw standardError;
    }

    revalidatePath('/');
    return { success: true, message: 'Vision & Mission section updated successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update vision section.' };
  }
}

export async function getVisionSectionAction(): Promise<any> {
  const supabase = createClient();
  const { data: dbData } = await supabase.from('vision_sections').select('*').eq('id', 1).maybeSingle();
  let result: any = {
    id: 1,
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
    const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'vision-mission.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      result = { ...result, ...fileData };
    }
  } catch {}

  if (dbData) {
    result = { ...result, ...dbData };
    if (dbData.image_url) result.image_url = dbData.image_url;
    if (dbData.description) result.description = dbData.description;
  }

  return result;
}

// 8. Statistics CRUD
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

    if (stat.id) {
      const { error } = await supabase.from('site_statistics').update(validated).eq('id', stat.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('site_statistics').insert([validated]);
      if (error) throw error;
    }

    revalidatePath('/');
    return { success: true, message: 'Statistic saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save statistic.' };
  }
}

export async function deleteStatisticAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from('site_statistics').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true, message: 'Statistic deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete statistic.' };
  }
}

// 9. Gallery CRUD
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
    const { error } = await supabase.from('gallery_images').insert([{
      ...imageData,
      sort_order: imageData.sort_order ?? 0,
      is_published: imageData.is_published ?? true,
    }]);

    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/gallery');
    return { success: true, message: 'Image added to gallery.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add gallery image.' };
  }
}

export async function deleteGalleryImageAction(id: string, publicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    const supabase = createClient();
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/gallery');
    return { success: true, message: 'Gallery image removed successfully.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete gallery image.' };
  }
}

// 10. Testimonials CRUD
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

    if (item.id) {
      const { error } = await supabase.from('testimonials').update(validated).eq('id', item.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('testimonials').insert([validated]);
      if (error) throw error;
    }

    revalidatePath('/');
    return { success: true, message: 'Testimonial saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save testimonial.' };
  }
}

export async function deleteTestimonialAction(id: string, avatarPublicId?: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (avatarPublicId) {
      await deleteFromCloudinary(avatarPublicId);
    }
    const supabase = createClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true, message: 'Testimonial deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete testimonial.' };
  }
}

// 11. Centres CRUD
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

    if (item.id) {
      const { error } = await supabase.from('centres').update(validated).eq('id', item.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('centres').insert([validated]);
      if (error) throw error;
    }

    revalidatePath('/');
    return { success: true, message: 'Training centre saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save training centre.' };
  }
}

export async function deleteCentreAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from('centres').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true, message: 'Centre deleted.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete centre.' };
  }
}

// 12. Contact & Footer Settings
export async function updateContactSettingsAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = contactSettingsSchema.parse(formData);
    const supabase = createClient();
    const { error } = await supabase.from('contact_settings').upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });
    if (error) throw error;
    revalidatePath('/');
    return { success: true, message: 'Contact settings updated.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update contact settings.' };
  }
}

export async function updateFooterSettingsAction(formData: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validated = footerSettingsSchema.parse(formData);
    const supabase = createClient();
    const { error } = await supabase.from('footer_settings').upsert({ id: 1, ...validated, updated_at: new Date().toISOString() });
    if (error) throw error;
    revalidatePath('/');
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

    if (item.id) {
      const { error } = await supabase.from('social_links').update(validated).eq('id', item.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('social_links').insert([validated]);
      if (error) throw error;
    }

    revalidatePath('/');
    return { success: true, message: 'Social profile saved.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save social profile.' };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
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

