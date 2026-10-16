-- Migration: Add Mission and Header Fields to vision_sections
ALTER TABLE public.vision_sections
  ADD COLUMN IF NOT EXISTS eyebrow TEXT DEFAULT 'OUR PURPOSE',
  ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT 'Inspiring and empowering every child through health, discipline, and active sports.',
  ADD COLUMN IF NOT EXISTS mission_title TEXT DEFAULT 'MISSION',
  ADD COLUMN IF NOT EXISTS mission_description TEXT DEFAULT 'To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow.',
  ADD COLUMN IF NOT EXISTS vision_title TEXT DEFAULT 'VISION';
