-- ============================================
-- QUICK DATABASE VERIFICATION SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to verify everything
-- Copy and paste ALL of this, then click RUN

-- 1. CHECK ALL TABLES EXIST
SELECT 'TABLE CHECK' as check_type, tablename as result
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. CHECK REGISTRATIONS TABLE STRUCTURE
SELECT 'REGISTRATIONS COLUMNS' as check_type, column_name || ' (' || data_type || ')' as result
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- 3. CHECK SERVICES DATA
SELECT 'SERVICES COUNT' as check_type, count(*) || ' services found' as result
FROM public.services;

-- 4. CHECK HERO_SLIDES TABLE STRUCTURE
SELECT 'HERO_SLIDES COLUMNS' as check_type, column_name || ' (' || data_type || ')' as result
FROM information_schema.columns 
WHERE table_name = 'hero_slides' 
ORDER BY ordinal_position;

-- 5. CHECK NEWS TABLE STRUCTURE
SELECT 'NEWS COLUMNS' as check_type, column_name || ' (' || data_type || ')' as result
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;

-- 6. CHECK SITE_ASSETS TABLE STRUCTURE
SELECT 'SITE_ASSETS COLUMNS' as check_type, column_name || ' (' || data_type || ')' as result
FROM information_schema.columns 
WHERE table_name = 'site_assets' 
ORDER BY ordinal_position;

-- 7. CHECK RLS IS ENABLED
SELECT 'RLS STATUS' as check_type, tablename || ': ' || CASE WHEN rowsecurity THEN 'ENABLED ✅' ELSE 'DISABLED ❌' END as result
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('registrations', 'services', 'news', 'hero_slides', 'site_assets');

-- 8. CHECK REGISTRATIONS POLICIES
SELECT 'REGISTRATIONS POLICIES' as check_type, policyname as result
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;
