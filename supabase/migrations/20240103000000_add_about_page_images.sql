-- ==============================================================================
-- Migration: Add 3 Image Fields to about_sections and Seed Their Paths
-- Run this directly in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Ensure the 3 image columns exist on about_sections
ALTER TABLE public.about_sections
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '/images/about-hero-banner.png',
  ADD COLUMN IF NOT EXISTS hero_image_public_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS philosophy_image_url TEXT DEFAULT '/images/about-philosophy-card.jpg',
  ADD COLUMN IF NOT EXISTS philosophy_image_public_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_image_url TEXT DEFAULT '/images/about-cta-banner.png',
  ADD COLUMN IF NOT EXISTS cta_image_public_id TEXT DEFAULT '';

-- 2. Update singleton id = 1 with the exact three images
UPDATE public.about_sections
SET
  hero_image_url = '/images/about-hero-banner.png',
  philosophy_image_url = '/images/about-philosophy-card.jpg',
  cta_image_url = '/images/about-cta-banner.png',
  updated_at = timezone('utc'::text, now())
WHERE id = 1;

-- 3. If id = 1 does not exist yet, insert the complete row
INSERT INTO public.about_sections (
  id,
  eyebrow,
  heading,
  highlighted_text,
  description,
  button_text,
  button_url,
  image_url,
  image_focal_position,
  is_visible,
  hero_image_url,
  philosophy_image_url,
  cta_image_url,
  updated_at
)
VALUES (
  1,
  'ABOUT GROWING FIT',
  'More Than Just',
  'Sports.',
  'Growing Fit is a dedicated sports academy focused on the holistic development of children. We offer professional training programs in Kung Fu, Muay Thai, Boxing, Swimming, and more. Our goal is to help every child stay active, healthy and confident.',
  'Know More',
  '/about',
  '/images/user-admin-about.png',
  'center',
  TRUE,
  '/images/about-hero-banner.png',
  '/images/about-philosophy-card.jpg',
  '/images/about-cta-banner.png',
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
  hero_image_url = EXCLUDED.hero_image_url,
  philosophy_image_url = EXCLUDED.philosophy_image_url,
  cta_image_url = EXCLUDED.cta_image_url,
  updated_at = timezone('utc'::text, now());
