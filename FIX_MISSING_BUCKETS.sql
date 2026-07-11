-- ============================================================================
-- FIX MISSING STORAGE BUCKETS AND POLICIES
-- This fixes the uploads bucket which has no policies
-- And creates the hero_slides bucket if needed
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE UPLOADS BUCKET (if not exists)
-- ============================================================================

-- Insert uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'uploads', 'uploads', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'uploads');

-- ============================================================================
-- STEP 2: CREATE POLICIES FOR UPLOADS BUCKET
-- ============================================================================

-- Drop existing policies for uploads
DROP POLICY IF EXISTS "Public Upload Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public View Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Uploads" ON storage.objects;

-- Create new policies for uploads bucket
CREATE POLICY "Public Upload Uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Public View Uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Admin Delete Uploads"
ON storage.objects
FOR DELETE
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 3: CREATE HERO_SLIDES BUCKET (if not exists)
-- ============================================================================

-- Insert hero_slides bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'hero_slides', 'hero_slides', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'hero_slides');

-- ============================================================================
-- STEP 4: CREATE POLICIES FOR HERO_SLIDES BUCKET
-- ============================================================================

-- Drop existing policies for hero_slides
DROP POLICY IF EXISTS "Public Upload Hero Slides" ON storage.objects;
DROP POLICY IF EXISTS "Public View Hero Slides" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Hero Slides" ON storage.objects;

-- Create new policies for hero_slides bucket
CREATE POLICY "Public Upload Hero Slides"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hero_slides');

CREATE POLICY "Public View Hero Slides"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero_slides');

CREATE POLICY "Admin Delete Hero Slides"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hero_slides' AND auth.role() = 'authenticated');

-- ============================================================================
-- STEP 5: VERIFY ALL BUCKETS NOW
-- ============================================================================

-- Check all buckets exist
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- Check all policies
SELECT 
  policyname,
  tablename,
  permissive,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- END OF FIX
-- ============================================================================
