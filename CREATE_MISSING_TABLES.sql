-- ============================================
-- MISSING TABLES FOR ADMIN DASHBOARD
-- Run this in Supabase SQL Editor to create all missing tables
-- ============================================

-- 0) FIX SERVICES TABLE - Add missing old_price column
ALTER TABLE services ADD COLUMN IF NOT EXISTS old_price INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT;

-- 1) CREATE NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT,
  category TEXT DEFAULT 'Official Update',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read news" ON news
  FOR SELECT USING (true);

-- Allow public insert (for admin posting)
CREATE POLICY "Allow public insert news" ON news
  FOR INSERT WITH CHECK (true);

-- Allow public delete
CREATE POLICY "Allow public delete news" ON news
  FOR DELETE USING (true);


-- 2) CREATE HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read hero_slides" ON hero_slides
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert hero_slides" ON hero_slides
  FOR INSERT WITH CHECK (true);

-- Allow public delete
CREATE POLICY "Allow public delete hero_slides" ON hero_slides
  FOR DELETE USING (true);


-- 3) CREATE SITE ASSETS TABLE
CREATE TABLE IF NOT EXISTS site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read site_assets" ON site_assets
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert site_assets" ON site_assets
  FOR INSERT WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update site_assets" ON site_assets
  FOR UPDATE USING (true);

-- Allow public delete
CREATE POLICY "Allow public delete site_assets" ON site_assets
  FOR DELETE USING (true);


-- 4) INSERT DEFAULT SITE ASSETS
INSERT INTO site_assets (key, label, image_url) VALUES
('agent_photo', 'Doris Profile Photo', 'https://placehold.co/400x400?text=Upload+Photo'),
('oat_seal', 'Nigeria Accreditation Seal', 'https://placehold.co/400x400?text=Upload+Seal')
ON CONFLICT (key) DO NOTHING;


-- 5) INSERT SAMPLE NEWS (Optional - for testing)
INSERT INTO news (title, content, date, category) VALUES
('Welcome to REX360 Solutions', 'We are excited to announce the launch of our new website. Our team is committed to providing you with the best business registration services.', '2024-01-15', 'Announcement'),
('New Service: NGO Registration', 'We now offer NGO registration services. Contact us for more information.', '2024-02-01', 'Service Update')
ON CONFLICT DO NOTHING;


-- 6) INSERT SAMPLE HERO SLIDES (Optional - for testing)
INSERT INTO hero_slides (title, subtitle, image_url, display_order) VALUES
('REX360 Solutions', 'Your Trusted Business Registration Partner', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop', 1),
('Fast & Reliable', 'Register your business in days', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop', 2)
ON CONFLICT DO NOTHING;


-- 7) VERIFY TABLES CREATED
SELECT 'Tables created and sample data inserted!' as status;
SELECT COUNT(*) as news_count FROM news;
SELECT COUNT(*) as hero_slides_count FROM hero_slides;
SELECT COUNT(*) as site_assets_count FROM site_assets;
SELECT COUNT(*) as services_count FROM services;
SELECT COUNT(*) as registrations_count FROM registrations;
