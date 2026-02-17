-- ============================================
-- SITE ASSETS TABLE & STORAGE BUCKET
-- This table stores images used in the site components like AgentIntro and NigeriaSymbol
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================================================
-- STEP 1: CREATE SITE-ASSETS STORAGE BUCKET
-- ============================================================================

-- Create site-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'site-assets', 'site-assets', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'site-assets');

-- ============================================================================
-- STEP 2: CREATE POLICIES FOR SITE-ASSETS BUCKET
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public View Site Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Site Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Site Assets" ON storage.objects;

-- Create policies for site-assets bucket
CREATE POLICY "Public View Site Assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Public Upload Site Assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Admin Delete Site Assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 3: CREATE THE SITE_ASSETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================================---
-- STEP 4: ENABLE RLS ON SITE_ASSETS TABLE
-- ============================================================================

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

-- =========================================================================---
-- STEP 5: INSERT DEFAULT DATA
-- =========================================================================---

-- For AgentIntro component (agent_photo key) - using placeholder, update with real storage URL
INSERT INTO site_assets (key, image_url, description) 
VALUES ('agent_photo', 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/site-assets/agent-photo.jpg', 'Agent photo for AgentIntro component')
ON CONFLICT (key) DO NOTHING;

-- For NigeriaSymbol component (oat_seal key) - using placeholder, update with real storage URL
INSERT INTO site_assets (key, image_url, description) 
VALUES ('oat_seal', 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/site-assets/oat-seal.png', 'OAT seal for NigeriaSymbol component')
ON CONFLICT (key) DO NOTHING;

-- =========================================================================---
-- STEP 6: VERIFY SETUP
-- ============================================================================

-- Check all buckets
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- Check site_assets table
SELECT * FROM site_assets;

-- =========================================================================---
-- INSTRUCTIONS FOR UPDATING IMAGES:
-- =========================================================================---
-- 1. Go to Supabase Dashboard -> Storage -> site-assets bucket
-- 2. Upload your images:
--    - Upload agent photo as 'agent-photo.jpg' or similar
--    - Upload OAT seal as 'oat-seal.png' or similar
-- 3. The public URL will be automatically generated in format:
--    https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/site-assets/YOUR_FILENAME
-- 4. Update the image_url in site_assets table with the actual URL:
--
-- UPDATE site_assets SET image_url = 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/site-assets/agent-photo.jpg' WHERE key = 'agent_photo';
-- UPDATE site_assets SET image_url = 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/site-assets/oat-seal.png' WHERE key = 'oat_seal';
