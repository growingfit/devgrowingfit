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

    // Merge hero section with local json
    let heroData = heroRes.data || null;
    let heroBenefitsList = heroBenefitsRes.data || [];
    try {
      const heroFilePath = path.join(process.cwd(), 'lib', 'data', 'hero.json');
      if (fs.existsSync(heroFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(heroFilePath, 'utf-8'));
        if (fileContent.hero) heroData = { ...fileContent.hero, ...heroData, ...fileContent.hero };
        if (fileContent.benefits && Array.isArray(fileContent.benefits) && (!heroBenefitsList || heroBenefitsList.length === 0)) {
          heroBenefitsList = fileContent.benefits.filter((b: any) => b.is_visible !== false);
        }
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

    // Merge programs with local json
    let programsList = programsRes.data || [];
    try {
      const progFilePath = path.join(process.cwd(), 'lib', 'data', 'programs.json');
      if (fs.existsSync(progFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(progFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          programsList = fileContent.filter((p: any) => p && p.is_published !== false);
        }
      }
    } catch {}

    // Merge centres with local json
    let centresList = centresRes.data || [];
    try {
      const cFilePath = path.join(process.cwd(), 'lib', 'data', 'centres.json');
      if (fs.existsSync(cFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(cFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          centresList = fileContent.filter((c: any) => c && c.is_published !== false);
        }
      }
    } catch {}

    // Merge stats with local json
    let statsList = statsRes.data || [];
    try {
      const sFilePath = path.join(process.cwd(), 'lib', 'data', 'statistics.json');
      if (fs.existsSync(sFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(sFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          statsList = fileContent.filter((s: any) => s && s.is_visible !== false);
        }
      }
    } catch {}

    // Merge gallery with local json
    let galleryList = (galleryRes.data || []).filter((img: any) => img && img.is_published !== false);
    try {
      const gFilePath = path.join(process.cwd(), 'lib', 'data', 'gallery.json');
      if (fs.existsSync(gFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(gFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          galleryList = fileContent.filter((img: any) => img && img.is_published !== false);
        }
      }
    } catch {}

    // Merge testimonials with local json
    let testimonialsList = testimonialsRes.data || [];
    try {
      const tFilePath = path.join(process.cwd(), 'lib', 'data', 'testimonials.json');
      if (fs.existsSync(tFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(tFilePath, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          testimonialsList = fileContent.filter((t: any) => t && t.is_published !== false);
        }
      }
    } catch {}

    // Merge contact and footer
    let contactData = contactRes.data || null;
    let socialLinksList = socialRes.data || [];
    try {
      const ctFilePath = path.join(process.cwd(), 'lib', 'data', 'contact.json');
      if (fs.existsSync(ctFilePath)) {
        const fileContent = JSON.parse(fs.readFileSync(ctFilePath, 'utf-8'));
        if (fileContent.contact) contactData = { ...contactData, ...fileContent.contact };
        if (fileContent.socials && Array.isArray(fileContent.socials) && fileContent.socials.length > 0) {
          socialLinksList = fileContent.socials.filter((s: any) => s.is_active !== false);
        }
      }
    } catch {}

    let footerData = footerRes.data || null;
    try {
      const ftFilePath = path.join(process.cwd(), 'lib', 'data', 'footer.json');
      if (fs.existsSync(ftFilePath)) {
        footerData = { ...footerData, ...JSON.parse(fs.readFileSync(ftFilePath, 'utf-8')) };
      }
    } catch {}

    let siteSettingsData = siteSettingsRes.data || null;
    try {
      const stFilePath = path.join(process.cwd(), 'lib', 'data', 'settings.json');
      if (fs.existsSync(stFilePath)) {
        siteSettingsData = { ...siteSettingsData, ...JSON.parse(fs.readFileSync(stFilePath, 'utf-8')) };
      }
    } catch {}

    // Merge homepage sections (Schools, Academy, Corporate)
    let schoolsSectionData: any = null;
    let academySectionData: any = null;
    let corporateSectionData: any = null;
    try {
      const hpFilePath = path.join(process.cwd(), 'lib', 'data', 'homepage-sections.json');
      if (fs.existsSync(hpFilePath)) {
        const hpJson = JSON.parse(fs.readFileSync(hpFilePath, 'utf-8'));
        schoolsSectionData = hpJson.schools || null;
        academySectionData = hpJson.academy || null;
        corporateSectionData = hpJson.corporate || null;
      }
    } catch {}

    // Merge header settings
    let headerSettingsData: any = null;
    try {
      const hdrFilePath = path.join(process.cwd(), 'lib', 'data', 'header-settings.json');
      if (fs.existsSync(hdrFilePath)) {
        headerSettingsData = JSON.parse(fs.readFileSync(hdrFilePath, 'utf-8'));
      }
    } catch {}

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
