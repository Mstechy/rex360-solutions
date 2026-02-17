-- ============================================================================
-- FIX STORAGE URLs AND POLICIES
-- This SQL fixes the storage connections for:
-- - Hero Slides images
-- - Services images  
-- - Documents storage
-- ============================================================================

-- ============================================================================
-- STEP 1: UPDATE HERO SLIDES IMAGE URLs
-- Replace old Supabase URL with new correct URL
-- ============================================================================

-- Update hero_slides image_url to use correct storage
UPDATE hero_slides 
SET image_url = REPLACE(image_url, 'hghdfvuxpmluzyqfofia.supabase.co', 'oohabvgbrzrewwrekkfy.supabase.co')
WHERE image_url LIKE '%hghdfvuxpmluzyqfofia.supabase.co%';

-- Verify the update
SELECT id, title, image_url FROM hero_slides ORDER BY id LIMIT 10;

-- ============================================================================
-- STEP 2: UPDATE SERVICES IMAGE URLs (if any)
-- ============================================================================

-- Update services image_url if it exists
UPDATE services 
SET image_url = REPLACE(image_url, 'hghdfvuxpmluzyqfofia.supabase.co', 'oohabvgbrzrewwrekkfy.supabase.co')
WHERE image_url LIKE '%hghdfvuxpmluzyqfofia.supabase.co%' OR image_url IS NULL;

-- Check services
SELECT id, name, price, image_url FROM services ORDER BY id LIMIT 10;

-- ============================================================================
-- STEP 3: UPDATE NEWS IMAGE URLs (if any)
-- ============================================================================

-- Update news image_url if it exists
UPDATE news 
SET image_url = REPLACE(image_url, 'hghdfvuxpmluzyqfofia.supabase.co', 'oohabvgbrzrewwrekkfy.supabase.co')
WHERE image_url LIKE '%hghdfvuxpmluzyqfofia.supabase.co%' OR image_url IS NULL;

-- Check news
SELECT id, title, image_url FROM news ORDER BY id DESC LIMIT 10;

-- ============================================================================
-- STEP 4: UPDATE SITE_ASSETS IMAGE URLs (if any)
-- ============================================================================

-- Update site_assets image_url if it exists
UPDATE site_assets 
SET image_url = REPLACE(image_url, 'hghdfvuxpmluzyqfofia.supabase.co', 'oohabvgbrzrewwrekkfy.supabase.co')
WHERE image_url LIKE '%hghdfvuxpmluzyqfofia.supabase.co%' OR image_url IS NULL;

-- Check site_assets
SELECT id, key, label, image_url FROM site_assets LIMIT 10;

-- ============================================================================
-- STEP 5: SET UP STORAGE POLICIES FOR DOCUMENTS BUCKET
-- ============================================================================

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for documents bucket (public access)
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Document View" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Delete Documents" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Document Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public Document View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Allow Admin Delete Documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 6: SET UP STORAGE POLICIES FOR IMAGES BUCKET (if exists)
-- ============================================================================

DROP POLICY IF EXISTS "Public Images View" ON storage.objects;
DROP POLICY IF EXISTS "Public Images Upload" ON storage.objects;

CREATE POLICY "Public Images View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public Images Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- ============================================================================
-- STEP 7: SET UP STORAGE POLICIES FOR HERO_SLIDES BUCKET (if exists)
-- ============================================================================

DROP POLICY IF EXISTS "Public Hero Slides View" ON storage.objects;
DROP POLICY IF EXISTS "Public Hero Slides Upload" ON storage.objects;

CREATE POLICY "Public Hero Slides View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero_slides');

CREATE POLICY "Public Hero Slides Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hero_slides');

-- ============================================================================
-- STEP 8: VERIFY STORAGE BUCKETS
-- ============================================================================

-- Check all buckets
SELECT id, name, public FROM storage.buckets;

-- Check storage policies
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- STEP 9: VERIFY ALL DATA IS CORRECT
-- ============================================================================

-- Check hero_slides data
SELECT 'Hero Slides:' as table_name, COUNT(*) as count FROM hero_slides;

-- Check services data
SELECT 'Services:' as table_name, COUNT(*) as count FROM services;

-- Check news data
SELECT 'News:' as table_name, COUNT(*) as count FROM news;

-- Check site_assets data
SELECT 'Site Assets:' as table_name, COUNT(*) as count FROM site_assets;

-- Check registrations data
SELECT 'Registrations:' as table_name, COUNT(*) as count FROM registrations;

-- ============================================================================
-- END OF FIX
-- ============================================================================
