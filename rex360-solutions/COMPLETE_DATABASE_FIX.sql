-- ============================================
-- COMPLETE DATABASE FIX - Run this in Supabase SQL Editor
-- This will fix all table and column issues
-- ============================================

-- 1) FIX SERVICES TABLE
-- First, check if services table exists and add missing columns

-- Add missing columns if they don't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS old_price INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS title TEXT;

-- Copy data from title to name if name is empty
UPDATE services SET name = COALESCE(title, name) WHERE name IS NULL OR name = '';

-- Set display_order based on existing order (use id if needed)
UPDATE services SET display_order = id::integer WHERE display_order IS NULL;

-- Verify the data
SELECT 'Services:' as info, id, name, price, display_order FROM services ORDER BY display_order LIMIT 10;

-- 2) FIX HERO_SLIDES TABLE
-- Check if hero_slides exists and add missing columns

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Verify hero_slides data
SELECT 'Hero Slides:' as info, id, title, subtitle, image_url, display_order FROM hero_slides ORDER BY display_order LIMIT 10;

-- 3) FIX NEWS TABLE
-- Check if news table exists

ALTER TABLE news ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS date TEXT;

-- Verify news data
SELECT 'News:' as info, id, title, date FROM news ORDER BY id DESC LIMIT 10;

-- 4) FIX SITE_ASSETS TABLE
-- Check if site_assets table exists

ALTER TABLE site_assets ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE site_assets ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE site_assets ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify site_assets data
SELECT 'Site Assets:' as info, id, key, label, image_url FROM site_assets LIMIT 10;

-- 5) ENABLE RLS ON ALL TABLES (if not already enabled)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 6) CREATE PUBLIC READ POLICIES (if not exist)

-- Services policies
DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);

-- Hero slides policies
DROP POLICY IF EXISTS "Allow public read hero_slides" ON hero_slides;
CREATE POLICY "Allow public read hero_slides" ON hero_slides FOR SELECT USING (true);

-- News policies
DROP POLICY IF EXISTS "Allow public read news" ON news;
CREATE POLICY "Allow public read news" ON news FOR SELECT USING (true);

-- Site assets policies
DROP POLICY IF EXISTS "Allow public read site_assets" ON site_assets;
CREATE POLICY "Allow public read site_assets" ON site_assets FOR SELECT USING (true);

-- Registrations policies
DROP POLICY IF EXISTS "Allow public read registrations" ON registrations;
CREATE POLICY "Allow public read registrations" ON registrations FOR SELECT USING (true);

-- 7) VERIFY ALL TABLES HAVE DATA

SELECT 'Services count:' as info, COUNT(*) as count FROM services;
SELECT 'Hero Slides count:' as info, COUNT(*) as count FROM hero_slides;
SELECT 'News count:' as info, COUNT(*) as count FROM news;
SELECT 'Site Assets count:' as info, COUNT(*) as count FROM site_assets;
SELECT 'Registrations count:' as info, COUNT(*) as count FROM registrations;

-- 8) TEST QUERIES (these should work now)

-- Test services query
SELECT id, name, price, display_order FROM services ORDER BY display_order LIMIT 5;

-- Test hero_slides query  
SELECT id, title, subtitle, image_url FROM hero_slides ORDER BY id LIMIT 5;

-- Test news query
SELECT id, title, date FROM news ORDER BY id DESC LIMIT 5;

-- Test site_assets query
SELECT id, key, image_url FROM site_assets LIMIT 5;

-- ============================================
-- END OF FIX
-- ============================================
