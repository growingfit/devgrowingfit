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

    // Helper to safely parse local json files without crashing
    const safeReadJson = <T = any>(filePath: string): T | null => {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content && content.trim()) {
            return JSON.parse(content) as T;
          }
        }
      } catch {}
      return null;
    };

    // Merge vision section with local json data for mission and eyebrow
    let visionData: VisionSection | null = visionRes.data || null;
    const visionJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'vision-mission.json'));
    if (visionJson) {
      visionData = { ...visionJson, ...visionData, ...visionJson } as VisionSection;
      if (visionRes.data?.image_url) {
        visionData.image_url = visionRes.data.image_url;
      }
    }

    // Merge about section with local json data for about page images
    let aboutData: AboutSection | null = aboutRes.data || null;
    const aboutJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'about-images.json'));
    if (aboutJson) {
      aboutData = { ...aboutJson, ...aboutData, ...aboutJson } as AboutSection;
      if (aboutRes.data?.hero_image_url) aboutData.hero_image_url = aboutRes.data.hero_image_url;
      if (aboutRes.data?.philosophy_image_url) aboutData.philosophy_image_url = aboutRes.data.philosophy_image_url;
      if (aboutRes.data?.cta_image_url) aboutData.cta_image_url = aboutRes.data.cta_image_url;
    }

    // Merge hero section with local json
    let heroData = heroRes.data || null;
    let heroBenefitsList = heroBenefitsRes.data || [];
    const heroJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'hero.json'));
    if (heroJson) {
      if (heroJson.hero) heroData = { ...heroJson.hero, ...heroData, ...heroJson.hero };
      if (heroJson.benefits && Array.isArray(heroJson.benefits) && (!heroBenefitsList || heroBenefitsList.length === 0)) {
        heroBenefitsList = heroJson.benefits.filter((b: any) => b.is_visible !== false);
      }
    }

    // Merge sports categories with local json data for instant sync
    let categoriesList = categoriesRes.data || [];
    const catJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'sports-categories.json'));
    if (Array.isArray(catJson) && catJson.length > 0) {
      categoriesList = catJson.filter((c: any) => c && c.is_active !== false);
    }

    // Merge programs with local json
    let programsList = programsRes.data || [];
    const progJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'programs.json'));
    if (Array.isArray(progJson) && progJson.length > 0) {
      programsList = progJson.filter((p: any) => p && p.is_published !== false);
    }

    // Merge centres with local json
    let centresList = centresRes.data || [];
    const centresJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'centres.json'));
    if (Array.isArray(centresJson) && centresJson.length > 0) {
      centresList = centresJson.filter((c: any) => c && c.is_published !== false);
    }

    // Merge stats with local json
    let statsList = statsRes.data || [];
    const statsJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'statistics.json'));
    if (Array.isArray(statsJson) && statsJson.length > 0) {
      statsList = statsJson.filter((s: any) => s && s.is_visible !== false);
    }

    // Merge gallery with local json
    let galleryList = (galleryRes.data || []).filter((img: any) => img && img.is_published !== false);
    const galleryJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'gallery.json'));
    if (Array.isArray(galleryJson) && galleryJson.length > 0) {
      galleryList = galleryJson.filter((img: any) => img && img.is_published !== false);
    }

    // Merge testimonials with local json
    let testimonialsList = (testimonialsRes.data || []).filter(
      (t: any) => t && t.author_name !== 'Anand Kumar' && t.author_name !== 'Priya R.'
    );
    const testJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'testimonials.json'));
    if (Array.isArray(testJson) && testJson.length > 0) {
      testimonialsList = testJson.filter(
        (t: any) => t && t.is_published !== false && t.author_name !== 'Anand Kumar' && t.author_name !== 'Priya R.'
      );
    }

    // Merge contact and footer
    let contactData = contactRes.data || null;
    let socialLinksList = socialRes.data || [];
    const contactJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'contact.json'));
    if (contactJson) {
      if (contactJson.contact) contactData = { ...contactData, ...contactJson.contact };
      if (contactJson.socials && Array.isArray(contactJson.socials) && contactJson.socials.length > 0) {
        socialLinksList = contactJson.socials.filter((s: any) => s.is_active !== false);
      }
    }

    let footerData = footerRes.data || null;
    const footerJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'footer.json'));
    if (footerJson) {
      footerData = { ...footerData, ...footerJson };
    }

    let siteSettingsData = siteSettingsRes.data || null;
    const settingsJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'settings.json'));
    if (settingsJson) {
      siteSettingsData = { ...siteSettingsData, ...settingsJson };
    }

    // Merge homepage sections (Schools, Academy, Corporate)
    let schoolsSectionData: any = null;
    let academySectionData: any = null;
    let corporateSectionData: any = null;
    const hpJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'homepage-sections.json'));
    if (hpJson) {
      schoolsSectionData = hpJson.schools || null;
      academySectionData = hpJson.academy || null;
      corporateSectionData = hpJson.corporate || null;
    }

    // Merge header settings
    let headerSettingsData: any = null;
    const hdrJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'header-settings.json'));
    if (hdrJson) {
      headerSettingsData = hdrJson;
    }

    return {
      siteSettings: siteSettingsData,
      hero: heroData,
      heroBenefits: heroBenefitsList,
      categories: categoriesList,
      programs: programsList,
      about: aboutData,
      aboutFeatures: aboutFeaturesRes.data || [],
      vision: visionData,
      statistics: statsList,
      gallery: galleryList,
      testimonials: testimonialsList,
      centres: centresList,
      socialLinks: socialLinksList,
      contact: contactData,
      footer: footerData,
      schoolsSection: schoolsSectionData,
      academySection: academySectionData,
      corporateSection: corporateSectionData,
      headerSettings: headerSettingsData,
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
