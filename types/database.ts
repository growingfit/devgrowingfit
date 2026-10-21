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

export interface HeroSlide {
  id?: string;
  title?: string;
  image_url?: string | null;
  image_public_id?: string | null;
  mobile_image_url?: string | null;
  mobile_image_public_id?: string | null;
  heading?: string;
  eyebrow?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  is_visible?: boolean;
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
  mobile_image_url?: string | null;
  mobile_image_public_id?: string | null;
  image_focal_position: string;
  is_visible: boolean;
  slides?: HeroSlide[];
  slide_interval?: number;
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

export interface SchoolSectionData {
  id?: number | string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  image_url: string;
  image_public_id?: string | null;
  image_alt?: string;
  is_visible: boolean;
  background_color?: string;
}

export interface AcademyThumbnail {
  id: string;
  title: string;
  image_url: string;
  image_public_id?: string | null;
  url?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface AcademySectionData {
  id?: number | string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  image_url: string;
  image_public_id?: string | null;
  image_alt?: string;
  is_visible: boolean;
  background_color?: string;
  thumbnails: AcademyThumbnail[];
}

export interface CorporateThumbnail {
  id: string;
  title: string;
  image_url: string;
  image_public_id?: string | null;
  url?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface CorporateSectionData {
  id?: number | string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  image_url: string;
  image_public_id?: string | null;
  image_alt?: string;
  is_visible: boolean;
  background_color?: string;
  thumbnails: CorporateThumbnail[];
}

export interface HeaderSettingsData {
  logo_url?: string;
  tagline?: string;
  nav_links?: { label: string; href: string; is_visible?: boolean }[];
  show_location?: boolean;
  location_name?: string;
  show_login?: boolean;
  show_cart?: boolean;
}

export interface SchoolHeroSlide {
  id: string;
  title: string;
  image_url: string;
  mobile_image_url?: string;
  image_alt?: string;
  sort_order: number;
  is_published: boolean;
}

export interface SchoolHeroSection {
  heading: string;
  subtitle?: string;
  slides: SchoolHeroSlide[];
}

export interface WhyGrowingFitItem {
  id: string;
  sequence: string; // e.g. '#1', '#2'
  title: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
}

export interface WhyGrowingFitSection {
  heading: string;
  subtitle: string;
  items: WhyGrowingFitItem[];
}

export interface SchoolIntroSection {
  content: string;
  is_visible: boolean;
}

export interface WhatsInForKidsCard {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface WhatsInForKidsSection {
  heading: string;
  subtitle?: string;
  cards: WhatsInForKidsCard[];
}

export interface SchoolTabItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  link_text?: string;
  link_url?: string;
}

export interface SchoolTabCategory {
  id: string;
  label: string;
  items: SchoolTabItem[];
}

export interface SchoolTabsSection {
  activeTab: string;
  tabs: SchoolTabCategory[];
}

export interface CurriculumStage {
  stage: string;
  detail: string;
}

export interface CurriculumSection {
  heading: string;
  description: string;
  stages: CurriculumStage[];
  is_visible: boolean;
}

export interface SchoolGlimpseImage {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  is_published: boolean;
}

export interface SchoolGlimpsesSection {
  heading: string;
  subtitle?: string;
  images: SchoolGlimpseImage[];
}

export interface SchoolTestimonialItem {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  avatar_url?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface SchoolTestimonialsSection {
  heading: string;
  subtitle?: string;
  items: SchoolTestimonialItem[];
}

export interface SchoolPageData {
  hero: SchoolHeroSection;
  whyGrowingFit: WhyGrowingFitSection;
  introduction: SchoolIntroSection;
  whatsInForKids: WhatsInForKidsSection;
  tabsSection: SchoolTabsSection;
  curriculum: CurriculumSection;
  glimpses: SchoolGlimpsesSection;
  testimonials: SchoolTestimonialsSection;
  headerSettings?: HeaderSettingsData;
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
  schoolsSection?: SchoolSectionData;
  academySection?: AcademySectionData;
  corporateSection?: CorporateSectionData;
  headerSettings?: HeaderSettingsData;
}
