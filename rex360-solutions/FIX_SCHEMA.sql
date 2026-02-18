-- ============================================
-- FIX SERVICES TABLE SCHEMA TO MATCH CODE
-- Run this in Supabase SQL Editor
-- ============================================

-- 1) Add missing columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- 2) Copy data from title to name if name is empty
UPDATE services SET name = title WHERE name IS NULL OR name = '';

-- 3) Set display_order based on id order (if not set)
UPDATE services SET display_order = id::integer WHERE display_order IS NULL;

-- 4) Verify the data
SELECT id, name, price, display_order FROM services ORDER BY display_order;

-- 5) Check if data exists
SELECT 'Services count:' as info, COUNT(*) as count FROM services;
