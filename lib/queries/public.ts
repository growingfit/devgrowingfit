import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { HomePageData, VisionSection, AboutSection } from '@/types/database';

export async function getHomePageData(): Promise<HomePageData> {
  const supabase = createClient();

  try {
    const [
      siteSettingsRes,
      heroRes,
      heroBenefitsRes,
      categoriesRes,
      programsRes,
      aboutRes,
      aboutFeaturesRes,
      visionRes,
      statsRes,
      galleryRes,
      testimonialsRes,
      centresRes,
      socialRes,
      contactRes,
      footerRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('hero_sections').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('hero_benefits').select('*').eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('sports_categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('sports_programs').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      supabase.from('about_sections').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('about_features').select('*').eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('vision_sections').select('*').eq('id', 1).maybeSingle(),
      supabase.from('site_statistics').select('*').eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
      supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      supabase.from('centres').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      supabase.from('social_links').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle(),
    ]);

    // Merge vision section with local json data for mission and eyebrow
    let visionData: VisionSection | null = visionRes.data || null;
    try {
      const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'vision-mission.json');
      if (fs.existsSync(dataFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        visionData = { ...fileContent, ...visionData, ...fileContent } as VisionSection;
        // Prioritize Supabase image if uploaded
        if (visionRes.data?.image_url) {
          visionData.image_url = visionRes.data.image_url;
        }
      }
    } catch {}

    // Merge about section with local json data for about page images
    let aboutData: AboutSection | null = aboutRes.data || null;
    try {
      const aboutFilePath = path.join(process.cwd(), 'lib', 'data', 'about-images.json');
      if (fs.existsSync(aboutFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(aboutFilePath, 'utf-8'));
        aboutData = { ...fileContent, ...aboutData, ...fileContent } as AboutSection;
        if (aboutRes.data?.hero_image_url) aboutData.hero_image_url = aboutRes.data.hero_image_url;
        if (aboutRes.data?.philosophy_image_url) aboutData.philosophy_image_url = aboutRes.data.philosophy_image_url;
        if (aboutRes.data?.cta_image_url) aboutData.cta_image_url = aboutRes.data.cta_image_url;
      }
    } catch {}

    // Merge sports categories with local json data for instant sync
    let categoriesList = categoriesRes.data || [];
    try {
      const catFilePath = path.join(process.cwd(), 'lib', 'data', 'sports-categories.json');
      if (fs.existsSync(catFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(catFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          categoriesList = fileContent.filter((c: any) => c && c.is_active !== false);
        }
      }
    } catch {}

    return {
      siteSettings: siteSettingsRes.data || null,
      hero: heroRes.data || null,
      heroBenefits: heroBenefitsRes.data || [],
      categories: categoriesList,
      programs: programsRes.data || [],
      about: aboutData,
      aboutFeatures: aboutFeaturesRes.data || [],
      vision: visionData,
      statistics: statsRes.data || [],
      gallery: (galleryRes.data || []).filter((img: any) => img && img.is_published !== false),
      testimonials: testimonialsRes.data || [],
      centres: centresRes.data || [],
      socialLinks: socialRes.data || [],
      contact: contactRes.data || null,
      footer: footerRes.data || null,
    };
  } catch (error) {
    console.error('Database query error in getHomePageData:', error);
    return {
      siteSettings: null,
      hero: null,
      heroBenefits: [],
      categories: [],
      programs: [],
      about: null,
      aboutFeatures: [],
      vision: null,
      statistics: [],
      gallery: [],
      testimonials: [],
      centres: [],
      socialLinks: [],
      contact: null,
      footer: null,
    };
  }
}
