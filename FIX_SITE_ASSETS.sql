
-- ============================================================================
-- FIX SITE ASSETS STORAGE BUCKET AND IMAGES
-- This fixes the AgentIntro and NigeriaSymbol image display issues
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Supabase project info (use your actual project URL)
-- https://oohabvgbrzrewwrekkfy.supabase.co

-- ============================================================================
-- STEP 1: CREATE SITE-ASSETS STORAGE BUCKET (if not exists)
-- ============================================================================

-- Create site-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'site-assets', 'site-assets', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'site-assets');

-- Verify bucket was created/updated
SELECT id, name, public, created_at FROM storage.buckets WHERE id = 'site-assets';

-- ============================================================================
-- STEP 2: CREATE POLICIES FOR SITE-ASSETS BUCKET
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public View Site Assets Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Site Assets Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Site Assets Images" ON storage.objects;

-- Create policies for site-assets bucket (public read access)
CREATE POLICY "Public View Site Assets Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Public Upload Site Assets Images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Admin Delete Site Assets Images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 3: CREATE POLICIES FOR IMAGES BUCKET (if admin uploads there)
-- ============================================================================

-- The admin might upload images to 'images' bucket, so ensure it's public
-- Create images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'images', 'images', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images');

-- Drop existing policies for images bucket
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Images" ON storage.objects;

-- Create policies for images bucket (public read access)
CREATE POLICY "Public View Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public Upload Images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Admin Delete Images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 4: CREATE SITE_ASSETS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on site_assets table
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Allow public read on site_assets" ON site_assets;
DROP POLICY IF EXISTS "Allow admin insert on site_assets" ON site_assets;
DROP POLICY IF EXISTS "Allow admin update on site_assets" ON site_assets;
DROP POLICY IF EXISTS "Allow admin delete on site_assets" ON site_assets;

CREATE POLICY "Allow public read on site_assets" ON site_assets
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert on site_assets" ON site_assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin update on site_assets" ON site_assets
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete on site_assets" ON site_assets
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- STEP 5: INSERT OR UPDATE SITE ASSETS DATA
-- ============================================================================

-- Insert agent_photo record (for AgentIntro component)
-- This will update the existing record or insert a new one
INSERT INTO site_assets (key, label, image_url, description) 
VALUES (
  'agent_photo', 
  'Agent Photo', 
  'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/agent-photo.jpg', 
  'Agent photo for AgentIntro component'
)
ON CONFLICT (key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert oat_seal record (for NigeriaSymbol component)
-- This will update the existing record or insert a new one
INSERT INTO site_assets (key, label, image_url, description) 
VALUES (
  'oat_seal', 
  'OAT Seal', 
  'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/oat-seal.png', 
  'OAT seal for NigeriaSymbol component'
)
ON CONFLICT (key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================================================
-- STEP 6: VERIFY ALL SETUP
-- ============================================================================

-- Check all buckets
SELECT 'Buckets:' as info;
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- Check storage policies for images and site-assets
SELECT 'Storage Policies for Images/Site-Assets:' as info;
SELECT policyname, permissive, roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (policyname LIKE '%Images%' OR policyname LIKE '%Site Assets%')
ORDER BY policyname;

-- Check site_assets table data
SELECT 'Site Assets Table:' as info;
SELECT id, key, label, image_url, description, created_at, updated_at 
FROM site_assets 
ORDER BY key;

-- ============================================================================
-- TROUBLESHOOTING:
-- ============================================================================
-- If images are still not showing:
-- 1. Check that the bucket is public: SELECT id, name, public FROM storage.buckets;
-- 2. Check that the file exists in storage bucket
-- 3. Check the actual image URL in site_assets table
-- 4. Verify the image URL is accessible in browser
--
-- To check what URL is currently stored:
-- SELECT key, image_url FROM site_assets WHERE key IN ('agent_photo', 'oat_seal');

-- ============================================================================
-- END OF FIX
-- ============================================================================
