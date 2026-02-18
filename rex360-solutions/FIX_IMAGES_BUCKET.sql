-- ============================================================================
- ============================================================================

-- ============================================================================
-- STEP 1: CREATE IMAGES BUCKET (if not exists)
-- ============================================================================

-- Insert images bucket if it doesn't exist (make it PUBLIC)
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
SELECT 'images', 'images', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images');

-- Update existing bucket to be public if needed
UPDATE storage.buckets SET public = true WHERE id = 'images';

-- ============================================================================
-- STEP 2: CREATE POLICIES FOR IMAGES BUCKET - ALLOW ALL ACCESS
-- ============================================================================

-- Drop existing policies for images bucket
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all reads from images" ON storage.objects;

-- Create PERMISSIVE policies for images bucket - FULL PUBLIC ACCESS
-- These policies use WITH CHECK and allow all users (including anon) to access

-- Allow anyone to VIEW (SELECT) images
CREATE POLICY "Public View Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow anyone to UPLOAD (INSERT) images
CREATE POLICY "Public Upload Images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to UPDATE images
CREATE POLICY "Public Update Images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow anyone to DELETE images
CREATE POLICY "Public Delete Images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');

-- ============================================================================
-- STEP 3: ENABLE RLS (if not already) AND BYPASS FOR STORAGE
-- ============================================================================

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a bypass policy for storage (allows all operations)
CREATE POLICY "Allow all storage operations"
ON storage.objects
FOR ALL
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- ============================================================================
-- STEP 4: VERIFY BUCKETS AND POLICIES
-- ============================================================================

-- Check all buckets exist and are public
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- Check policies for images bucket
SELECT 
  policyname,
  tablename,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%Images%' OR policyname LIKE '%storage%'
ORDER BY policyname;

-- ============================================================================
-- STEP 5: TEST UPLOAD (optional - run in Supabase SQL Editor)
-- ============================================================================
-- Run this to test: 
-- SELECT * FROM storage.objects WHERE bucket_id = 'images' ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- END OF FIX
