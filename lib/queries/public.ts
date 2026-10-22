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
      homepageSectionsRes,
      headerSettingsRes,
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
      supabase.from('homepage_sections').select('*').eq('id', 1).maybeSingle(),
      supabase.from('header_settings').select('*').eq('id', 1).maybeSingle(),
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

    // 1. Vision section: live Supabase DB has priority, local JSON provides fallback text
    const visionJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'vision-mission.json'));
    let visionData: VisionSection | null = visionJson ? ({ ...visionJson, ...(visionRes.data || {}) } as VisionSection) : (visionRes.data || null);

    // 2. About section: live Supabase DB has priority for uploaded images and copy
    const aboutJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'about-images.json'));
    let aboutData: AboutSection | null = aboutJson ? ({ ...aboutJson, ...(aboutRes.data || {}) } as AboutSection) : (aboutRes.data || null);

    // 3. Hero section: live Supabase DB has priority for uploaded banners, mobile banners and copy
    const heroJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'hero.json'));
    let heroData = heroJson?.hero ? { ...heroJson.hero, ...(heroRes.data || {}) } : (heroRes.data || null);
    if (heroRes.data?.slides && Array.isArray(heroRes.data.slides) && heroRes.data.slides.length > 0) {
      heroData.slides = heroRes.data.slides;
    }
    let heroBenefitsList = (heroBenefitsRes.data && heroBenefitsRes.data.length > 0)
      ? heroBenefitsRes.data
      : (heroJson?.benefits?.filter((b: any) => b.is_visible !== false) || []);

    // 4. Sports categories: Live Supabase DB data is authoritative!
    let categoriesList = categoriesRes.data || [];
    const catJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'sports-categories.json'));
    const localCategories = (Array.isArray(catJson) ? catJson : []).filter((c: any) => c && c.is_active !== false);
    const dbCategories = (categoriesRes.data || []).filter((c: any) => c && c.is_active !== false);

    if (dbCategories.length > 0) {
      const categoryMap = new Map<string, any>();
      for (const c of localCategories) {
        const key = String(c.id || c.slug || c.name).toLowerCase();
        categoryMap.set(key, c);
      }
      for (const c of dbCategories) {
        const key = String(c.id || c.slug || c.name).toLowerCase();
        categoryMap.set(key, c);
      }
      categoriesList = Array.from(categoryMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
    } else if (localCategories.length > 0) {
      categoriesList = localCategories.sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
    }

    // 5. Sports programs: Live Supabase DB has full priority, JSON is fallback
    let programsList = programsRes.data || [];
    const progJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'programs.json'));
    const localPrograms = (Array.isArray(progJson) ? progJson : []).filter((p: any) => p && p.is_published !== false);
    const dbPrograms = (programsRes.data || []).filter((p: any) => p && p.is_published !== false);

    if (dbPrograms.length > 0) {
      const progMap = new Map<string, any>();
      for (const p of localPrograms) {
        const key = String(p.id || p.slug || p.name).toLowerCase();
        progMap.set(key, p);
      }
      for (const p of dbPrograms) {
        const key = String(p.id || p.slug || p.name).toLowerCase();
        progMap.set(key, p);
      }
      programsList = Array.from(progMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
    } else if (localPrograms.length > 0) {
      programsList = localPrograms;
    }

    // 6. Centres: Live Supabase DB has priority
    let centresList = centresRes.data || [];
    const centresJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'centres.json'));
    const localCentres = (Array.isArray(centresJson) ? centresJson : []).filter((c: any) => c && c.is_published !== false);
    const dbCentres = (centresRes.data || []).filter((c: any) => c && c.is_published !== false);

    if (dbCentres.length > 0) {
      const centreMap = new Map<string, any>();
      for (const c of localCentres) {
        const key = String(c.id || c.name).toLowerCase();
        centreMap.set(key, c);
      }
      for (const c of dbCentres) {
        const key = String(c.id || c.name).toLowerCase();
        centreMap.set(key, c);
      }
      centresList = Array.from(centreMap.values()).sort(
        (a: any, b: any) => (Number(a.sort_order) || 999) - (Number(b.sort_order) || 999)
      );
    } else if (localCentres.length > 0) {
      centresList = localCentres;
    }

    // 7. Statistics: Live Supabase DB has priority
    let statsList = (statsRes.data && statsRes.data.length > 0) ? statsRes.data : [];
    if (statsList.length === 0) {
      const statsJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'statistics.json'));
      if (Array.isArray(statsJson) && statsJson.length > 0) {
        statsList = statsJson.filter((s: any) => s && s.is_visible !== false);
      }
    }

    // 8. Gallery: Live Supabase DB has priority
    let galleryList = (galleryRes.data && galleryRes.data.length > 0)
      ? galleryRes.data.filter((img: any) => img && img.is_published !== false)
      : [];
    if (galleryList.length === 0) {
      const galleryJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'gallery.json'));
      if (Array.isArray(galleryJson) && galleryJson.length > 0) {
        galleryList = galleryJson.filter((img: any) => img && img.is_published !== false);
      }
    }

    // 9. Testimonials: Live Supabase DB has priority
    let testimonialsList = (testimonialsRes.data && testimonialsRes.data.length > 0)
      ? testimonialsRes.data.filter((t: any) => t && t.is_published !== false)
      : [];
    if (testimonialsList.length === 0) {
      const testJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'testimonials.json'));
      if (Array.isArray(testJson) && testJson.length > 0) {
        testimonialsList = testJson.filter((t: any) => t && t.is_published !== false);
      }
    }

    // 10. Contact and footer: Live Supabase DB has priority
    const contactJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'contact.json'));
    let contactData = contactJson?.contact ? { ...contactJson.contact, ...(contactRes.data || {}) } : (contactRes.data || null);
    let socialLinksList = (socialRes.data && socialRes.data.length > 0)
      ? socialRes.data
      : (contactJson?.socials?.filter((s: any) => s.is_active !== false) || []);

    const footerJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'footer.json'));
    let footerData = footerJson ? { ...footerJson, ...(footerRes.data || {}) } : (footerRes.data || null);

    const settingsJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'settings.json'));
    let siteSettingsData = settingsJson ? { ...settingsJson, ...(siteSettingsRes.data || {}) } : (siteSettingsRes.data || null);

    // 11. Homepage sections (Schools, Academy, Corporate): Live Supabase DB has priority!
    const hpJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'homepage-sections.json'));
    const dbHp = homepageSectionsRes?.data;
    let schoolsSectionData = (dbHp?.schools && Object.keys(dbHp.schools).length > 0)
      ? { ...(hpJson?.schools || {}), ...dbHp.schools }
      : (hpJson?.schools || null);
    let academySectionData = (dbHp?.academy && Object.keys(dbHp.academy).length > 0)
      ? { ...(hpJson?.academy || {}), ...dbHp.academy }
      : (hpJson?.academy || null);
    let corporateSectionData = (dbHp?.corporate && Object.keys(dbHp.corporate).length > 0)
      ? { ...(hpJson?.corporate || {}), ...dbHp.corporate }
      : (hpJson?.corporate || null);

    // 12. Header settings: Live Supabase DB has priority!
    const hdrJson = safeReadJson(path.join(process.cwd(), 'lib', 'data', 'header-settings.json'));
    const dbHdr = headerSettingsRes?.data;
    let headerSettingsData = (dbHdr && Object.keys(dbHdr).length > 0)
      ? { ...(hdrJson || {}), ...dbHdr }
      : (hdrJson || null);

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
