-- ============================================
-- UPDATE SITE ASSETS WITH NEW IMAGE URLs
-- Run this in Supabase SQL Editor
-- ============================================

-- Update agent_photo with the new URL
UPDATE site_assets 
SET image_url = 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/1771164736870_agent_photo.jpg',
    updated_at = NOW()
WHERE key = 'agent_photo';

-- Update oat_seal with the new URL
UPDATE site_assets 
SET image_url = 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/1771164332506_oat_seal.jpg',
    updated_at = NOW()
WHERE key = 'oat_seal';

-- Verify the updates
SELECT key, image_url, description, updated_at FROM site_assets WHERE key IN ('agent_photo', 'oat_seal');
