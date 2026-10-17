-- Migration: 20240105000000_add_homepage_sections.sql
-- Add Homepage Sections (Schools, Academy, Corporate) and Header Settings tables

-- 1. Homepage Sections (Singleton table: id = 1)
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    schools JSONB NOT NULL DEFAULT '{}'::jsonb,
    academy JSONB NOT NULL DEFAULT '{}'::jsonb,
    corporate JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Header & Navigation Settings (Singleton table: id = 1)
CREATE TABLE IF NOT EXISTS public.header_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    logo_url TEXT,
    tagline TEXT,
    nav_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    show_location BOOLEAN NOT NULL DEFAULT TRUE,
    location_name TEXT NOT NULL DEFAULT 'Bangalore',
    show_login BOOLEAN NOT NULL DEFAULT TRUE,
    show_cart BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.header_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Public Read Access
CREATE POLICY "Public read homepage_sections"
    ON public.homepage_sections FOR SELECT
    USING (true);

CREATE POLICY "Public read header_settings"
    ON public.header_settings FOR SELECT
    USING (true);

-- 5. RLS Policies: Admin Write Access
CREATE POLICY "Admin update homepage_sections"
    ON public.homepage_sections FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.admin_users
                WHERE admin_users.id = auth.uid()
            )
            OR NOT EXISTS (SELECT 1 FROM public.admin_users)
        )
    );

CREATE POLICY "Admin update header_settings"
    ON public.header_settings FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.admin_users
                WHERE admin_users.id = auth.uid()
            )
            OR NOT EXISTS (SELECT 1 FROM public.admin_users)
        )
    );

-- 6. Insert default singleton rows if not present
INSERT INTO public.homepage_sections (id, schools, academy, corporate, updated_at)
VALUES (1, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.header_settings (id, location_name, updated_at)
VALUES (1, 'Bangalore', now())
ON CONFLICT (id) DO NOTHING;
