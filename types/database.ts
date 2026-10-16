export interface AdminUser {
  id: string;
  email: string;
  full_name?: string | null;
  role: 'super_admin' | 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_title: string;
  meta_description: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  phone: string;
  email: string;
  address?: string | null;
  whatsapp_url?: string | null;
  is_maintenance: boolean;
  updated_at: string;
}

export interface HeroSection {
  id: number;
  eyebrow: string;
  heading: string;
  highlighted_text: string;
  description: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_focal_position: string;
  is_visible: boolean;
  updated_at: string;
}

export interface HeroBenefit {
  id: string;
  title: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface SportsCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SportsProgram {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AboutSection {
  id: number;
  eyebrow: string;
  heading: string;
  highlighted_text: string;
  description: string;
  button_text: string;
  button_url: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_focal_position: string;
  is_visible: boolean;
  hero_image_url?: string | null;
  hero_image_public_id?: string | null;
  philosophy_image_url?: string | null;
  philosophy_image_public_id?: string | null;
  cta_image_url?: string | null;
  cta_image_public_id?: string | null;
  updated_at: string;
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface VisionSection {
  id: number;
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  mission_title?: string;
  mission_description?: string;
  vision_title?: string;
  description: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_focal_position: string;
  overlay_opacity: number;
  is_visible: boolean;
  updated_at: string;
}

export interface SiteStatistic {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  title?: string | null;
  alt_text: string;
  image_url: string;
  image_public_id?: string | null;
  width?: number | null;
  height?: number | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  rating: number;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface Centre {
  id: string;
  name: string;
  address?: string | null;
  map_url?: string | null;
  phone?: string | null;
  email?: string | null;
  opening_hours?: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ContactSettings {
  id: number;
  phone: string;
  email: string;
  whatsapp?: string | null;
  headquarters?: string | null;
  opening_hours?: string | null;
  updated_at: string;
}

export interface FooterSettings {
  id: number;
  brand_description: string;
  copyright_text: string;
  privacy_policy_url: string;
  terms_conditions_url: string;
  updated_at: string;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface HomePageData {
  siteSettings: SiteSettings | null;
  hero: HeroSection | null;
  heroBenefits: HeroBenefit[];
  categories: SportsCategory[];
  programs: SportsProgram[];
  about: AboutSection | null;
  aboutFeatures: AboutFeature[];
  vision: VisionSection | null;
  statistics: SiteStatistic[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  centres: Centre[];
  socialLinks: SocialLink[];
  contact: ContactSettings | null;
  footer: FooterSettings | null;
}
