import { z } from 'zod';

export const siteSettingsSchema = z.object({
  site_title: z.string().min(2, 'Site title is required'),
  meta_description: z.string().min(5, 'Meta description is required'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().optional().nullable(),
  whatsapp_url: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  is_maintenance: z.boolean().default(false),
});

export const heroSlideSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  image_url: z.string().optional().nullable().or(z.literal('')),
  image_public_id: z.string().optional().nullable().or(z.literal('')),
  mobile_image_url: z.string().optional().nullable().or(z.literal('')),
  mobile_image_public_id: z.string().optional().nullable().or(z.literal('')),
  heading: z.string().optional().nullable().or(z.literal('')),
  eyebrow: z.string().optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable().or(z.literal('')),
  primary_cta_text: z.string().optional().nullable().or(z.literal('')),
  primary_cta_url: z.string().optional().nullable().or(z.literal('')),
  is_visible: z.boolean().default(true),
});

export const heroSectionSchema = z.object({
  eyebrow: z.string().optional().nullable().or(z.literal('')),
  heading: z.string().optional().nullable().or(z.literal('')).default('Fun Fitness Sports'),
  highlighted_text: z.string().optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable().or(z.literal('')),
  primary_cta_text: z.string().optional().nullable().or(z.literal('')),
  primary_cta_url: z.string().optional().nullable().or(z.literal('')),
  secondary_cta_text: z.string().optional().nullable().or(z.literal('')),
  secondary_cta_url: z.string().optional().nullable().or(z.literal('')),
  image_url: z.string().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  mobile_image_url: z.string().optional().nullable(),
  mobile_image_public_id: z.string().optional().nullable(),
  image_focal_position: z.string().default('center'),
  is_visible: z.boolean().default(true),
  slides: z.array(heroSlideSchema).optional(),
  slide_interval: z.number().optional().default(3200),
});

export const heroBenefitSchema = z.object({
  title: z.string().min(2, 'Benefit title is required'),
  icon: z.string().min(1, 'Icon identifier is required'),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const sportsCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  icon: z.string().min(1, 'Icon identifier is required'),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const sportsProgramSchema = z.object({
  name: z.string().min(2, 'Program name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable().or(z.literal('')),
  image_url: z.string().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const aboutSectionSchema = z.object({
  eyebrow: z.string().optional().nullable().or(z.literal('')),
  heading: z.string().optional().nullable().or(z.literal('')).default('About Growing Fit'),
  heading_line1: z.string().optional().nullable().or(z.literal('')),
  heading_highlight1: z.string().optional().nullable().or(z.literal('')),
  heading_highlight2: z.string().optional().nullable().or(z.literal('')),
  heading_line2: z.string().optional().nullable().or(z.literal('')),
  highlighted_text: z.string().optional().nullable().or(z.literal('')),
  highlight_quote: z.string().optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable().or(z.literal('')),
  button_text: z.string().optional().nullable().or(z.literal('')),
  button_url: z.string().optional().nullable().or(z.literal('')),
  image_url: z.string().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  image_focal_position: z.string().default('center'),
  is_visible: z.boolean().default(true),
  hero_image_url: z.string().optional().nullable(),
  hero_image_public_id: z.string().optional().nullable(),
  banner_image_url: z.string().optional().nullable(),
  banner_image_public_id: z.string().optional().nullable(),
  banner_mobile_image_url: z.string().optional().nullable(),
  banner_mobile_image_public_id: z.string().optional().nullable(),
  banner_heading: z.string().optional().nullable(),
  philosophy_image_url: z.string().optional().nullable(),
  philosophy_image_public_id: z.string().optional().nullable(),
  cta_image_url: z.string().optional().nullable(),
  cta_image_public_id: z.string().optional().nullable(),
});

export const aboutFeatureSchema = z.object({
  title: z.string().min(2, 'Feature title is required'),
  description: z.string().min(5, 'Feature description is required'),
  icon: z.string().min(1, 'Icon identifier is required'),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const visionSectionSchema = z.object({
  eyebrow: z.string().optional().default('OUR PURPOSE'),
  heading: z.string().min(1, 'Heading is required').default('Our Mission & Vision'),
  subtitle: z.string().optional().default('Inspiring and empowering every child through health, discipline, and active sports.'),
  mission_eyebrow: z.string().optional().default('OUR MISSION'),
  mission_title: z.string().optional().default('To Inspire and Empower'),
  mission_description: z.string().min(5, 'Mission description is required').default('To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow.'),
  vision_eyebrow: z.string().optional().default('OUR VISION'),
  vision_title: z.string().optional().default('A Healthier and Brighter Future'),
  description: z.string().min(5, 'Vision description is required'),
  image_url: z.string().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  image_focal_position: z.string().default('center'),
  overlay_opacity: z.number().min(0).max(1).default(0.85),
  is_visible: z.boolean().default(true),
});

export const siteStatisticSchema = z.object({
  value: z.string().min(1, 'Value is required (e.g. 500+)'),
  label: z.string().min(1, 'Label is required (e.g. Happy Students)'),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const galleryImageSchema = z.object({
  title: z.string().optional().nullable(),
  alt_text: z.string().min(2, 'Alt text is required for accessibility'),
  image_url: z.string().min(1, 'Image URL is required'),
  image_public_id: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  quote: z.string().min(5, 'Quote text is required'),
  author_name: z.string().min(2, 'Author name is required'),
  author_title: z.string().min(2, 'Author role/relationship is required (e.g. Parent)'),
  avatar_url: z.string().optional().nullable(),
  avatar_public_id: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const centreSchema = z.object({
  name: z.string().min(2, 'Centre name is required'),
  address: z.string().min(2, 'Address is required'),
  map_url: z.string().url('Invalid map URL').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(2, 'Platform name is required'),
  url: z.string().url('Invalid profile URL'),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const contactSettingsSchema = z.object({
  address: z.string().optional().nullable().or(z.literal('')),
  headquarters: z.string().optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable().or(z.literal('')),
  phone_secondary: z.string().optional().nullable().or(z.literal('')),
  email: z.string().optional().nullable().or(z.literal('')),
  whatsapp: z.string().optional().nullable(),
  opening_hours: z.string().optional().nullable(),
});

export const footerSettingsSchema = z.object({
  brand_description: z.string().min(5, 'Brand description is required'),
  copyright_text: z.string().min(2, 'Copyright notice is required'),
  privacy_policy_url: z.string().default('/privacy-policy'),
  terms_conditions_url: z.string().default('/terms-conditions'),
});
