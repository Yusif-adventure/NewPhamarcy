-- Run this SQL in your Supabase SQL Editor to add location columns

-- Add location columns to pharmacies table
ALTER TABLE public.pharmacies ADD COLUMN IF NOT EXISTS latitude float8;
ALTER TABLE public.pharmacies ADD COLUMN IF NOT EXISTS longitude float8;
ALTER TABLE public.pharmacies ADD COLUMN IF NOT EXISTS address text;

-- Add location columns to riders table
ALTER TABLE public.riders ADD COLUMN IF NOT EXISTS latitude float8;
ALTER TABLE public.riders ADD COLUMN IF NOT EXISTS longitude float8;
