-- Migration: Add Mobile Hero Banner fields to hero_sections
ALTER TABLE public.hero_sections
  ADD COLUMN IF NOT EXISTS mobile_image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS mobile_image_public_id TEXT DEFAULT '';
