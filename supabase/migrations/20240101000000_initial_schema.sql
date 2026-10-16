-- Growing Fit - Production Database Schema
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Administrator Users Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Site Settings (Singleton table: enforced by CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_title TEXT NOT NULL DEFAULT 'Growing Fit — School of Health & Physical Education',
    meta_description TEXT NOT NULL DEFAULT 'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    logo_url TEXT,
    favicon_url TEXT,
    phone TEXT NOT NULL DEFAULT '+91 702 581 0722',
    email TEXT NOT NULL DEFAULT 'growingfitofficial@gmail.com',
    address TEXT,
    whatsapp_url TEXT,
    is_maintenance BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Hero Section (Singleton: enforced by CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.hero_sections (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow TEXT NOT NULL DEFAULT 'SCHOOL OF HEALTH & PHYSICAL EDUCATION',
    heading TEXT NOT NULL DEFAULT 'Stronger Kids. Brighter',
    highlighted_text TEXT NOT NULL DEFAULT 'Futures.',
    description TEXT NOT NULL DEFAULT 'At Growing Fit, we help children build strength, confidence and discipline through sports and physical education.',
    primary_cta_text TEXT NOT NULL DEFAULT 'Explore Programs',
    primary_cta_url TEXT NOT NULL DEFAULT '/programs',
    secondary_cta_text TEXT NOT NULL DEFAULT 'Enquire Now',
    secondary_cta_url TEXT NOT NULL DEFAULT '/contact',
    image_url TEXT,
    image_public_id TEXT,
    image_focal_position TEXT NOT NULL DEFAULT 'center',
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Hero Benefits (4 items under hero CTAs)
CREATE TABLE IF NOT EXISTS public.hero_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Activity',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Sports Categories (Badminton, Football, Roller Skating)
CREATE TABLE IF NOT EXISTS public.sports_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'badminton',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Sports Programs (Kung Fu, Muay Thai, Boxing, Swimming, Wushu, etc.)
CREATE TABLE IF NOT EXISTS public.sports_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.sports_categories(id) ON DELETE SET NULL,
    image_url TEXT,
    image_public_id TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. About Section (Singleton: CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.about_sections (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow TEXT NOT NULL DEFAULT 'ABOUT GROWING FIT',
    heading TEXT NOT NULL DEFAULT 'More Than Just',
    highlighted_text TEXT NOT NULL DEFAULT 'Sports.',
    description TEXT NOT NULL DEFAULT 'Growing Fit is a dedicated sports academy focused on the holistic development of children. We offer professional training programs in Kung Fu, Muay Thai, Boxing, Swimming, and more. Our goal is to help every child stay active, healthy and confident.',
    button_text TEXT NOT NULL DEFAULT 'Know More',
    button_url TEXT NOT NULL DEFAULT '/about',
    image_url TEXT,
    image_public_id TEXT,
    image_focal_position TEXT NOT NULL DEFAULT 'center',
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. About Features (4 feature cards on right of About section)
CREATE TABLE IF NOT EXISTS public.about_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Users',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Vision Section (Singleton: CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.vision_sections (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    heading TEXT NOT NULL DEFAULT 'Vision',
    description TEXT NOT NULL DEFAULT 'Our vision at Growing Fit is to be a leading sports academy that empowers individuals of all ages and abilities to achieve their full potential, both on and off the field. We envision a future where everyone has access to high-quality sports training programs that promote physical fitness, mental well-being, and a supportive, inclusive community.',
    image_url TEXT,
    image_public_id TEXT,
    image_focal_position TEXT NOT NULL DEFAULT 'center',
    overlay_opacity NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Site Statistics
CREATE TABLE IF NOT EXISTS public.site_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Gallery Images
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    alt_text TEXT NOT NULL DEFAULT 'Growing Fit Academy Training',
    image_url TEXT NOT NULL,
    image_public_id TEXT,
    width INTEGER,
    height INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_title TEXT NOT NULL DEFAULT 'Parent',
    avatar_url TEXT,
    avatar_public_id TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Training Centres
CREATE TABLE IF NOT EXISTS public.centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    map_url TEXT,
    phone TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. Contact Settings (Singleton: CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    phone TEXT NOT NULL DEFAULT '+91 702 581 0722',
    email TEXT NOT NULL DEFAULT 'growingfitofficial@gmail.com',
    whatsapp TEXT,
    headquarters TEXT DEFAULT 'Kerala, India',
    opening_hours TEXT DEFAULT 'Monday - Saturday: 6:00 AM - 7:00 PM',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. Footer Settings (Singleton: CHECK id = 1)
CREATE TABLE IF NOT EXISTS public.footer_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    brand_description TEXT NOT NULL DEFAULT 'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    copyright_text TEXT NOT NULL DEFAULT '© 2024 Growing Fit. All rights reserved.',
    privacy_policy_url TEXT NOT NULL DEFAULT '/privacy-policy',
    terms_conditions_url TEXT NOT NULL DEFAULT '/terms-conditions',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. Legal Pages Content
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. Database Indexes for High-Traffic Queries
CREATE INDEX IF NOT EXISTS idx_sports_categories_active_order ON public.sports_categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_sports_programs_pub_order ON public.sports_programs(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_hero_benefits_visible_order ON public.hero_benefits(is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_about_features_visible_order ON public.about_features(is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_site_stats_visible_order ON public.site_statistics(is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_pub_order ON public.gallery_images(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_pub_order ON public.testimonials(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_centres_pub_order ON public.centres(is_published, sort_order);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function to check if current user is an authenticated admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-register auth.users into admin_users
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'admin'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies:
-- Only authenticated admins can view admin_users; user can read own record
CREATE POLICY "Admins can read admin_users" ON public.admin_users
    FOR SELECT TO authenticated
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Super admins can insert/update admin_users" ON public.admin_users
    FOR ALL TO authenticated
    USING (public.is_admin());

-- 2. Public Read Policies (Only published / visible content for public)
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public read hero_sections" ON public.hero_sections FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read hero_benefits" ON public.hero_benefits FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read sports_categories" ON public.sports_categories FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "Public read sports_programs" ON public.sports_programs FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Public read about_sections" ON public.about_sections FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read about_features" ON public.about_features FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read vision_sections" ON public.vision_sections FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read site_statistics" ON public.site_statistics FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Public read gallery_images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Public read centres" ON public.centres FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "Public read contact_settings" ON public.contact_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public read footer_settings" ON public.footer_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public read legal_pages" ON public.legal_pages FOR SELECT TO anon, authenticated USING (TRUE);

-- 3. Admin Full Control Policies (Admins can perform SELECT, INSERT, UPDATE, DELETE on all CMS tables)
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write hero_sections" ON public.hero_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write hero_benefits" ON public.hero_benefits FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write sports_categories" ON public.sports_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write sports_programs" ON public.sports_programs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write about_sections" ON public.about_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write about_features" ON public.about_features FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write vision_sections" ON public.vision_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write site_statistics" ON public.site_statistics FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write gallery_images" ON public.gallery_images FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write centres" ON public.centres FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write social_links" ON public.social_links FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write contact_settings" ON public.contact_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write footer_settings" ON public.footer_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write legal_pages" ON public.legal_pages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
