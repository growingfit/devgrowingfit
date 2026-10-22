-- Migration: 20240106000000_add_school_page.sql
-- Add School Page CMS singleton table for persistent storage on Vercel

CREATE TABLE IF NOT EXISTS public.school_page (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.school_page ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read school_page"
    ON public.school_page FOR SELECT
    USING (true);

-- Admin write access
CREATE POLICY "Admin update school_page"
    ON public.school_page FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.admin_users
                WHERE admin_users.id = auth.uid()
            )
            OR NOT EXISTS (SELECT 1 FROM public.admin_users)
        )
    );

-- Insert default singleton row
INSERT INTO public.school_page (id, data, updated_at)
VALUES (1, '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;
