-- Migration: 20240107000000_add_contact_fields.sql
-- Add phone_secondary and address columns to public.contact_settings

ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS phone_secondary TEXT;
ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS address TEXT;
