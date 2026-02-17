-- ============================================
-- FIX DATABASE - Create tables and insert data
-- Run this in Supabase SQL Editor
-- ============================================

-- 1) CREATE REGISTRATIONS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  surname TEXT NOT NULL,
  firstname TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  amount INTEGER DEFAULT 0,
  paystack_ref TEXT,
  payment_status TEXT DEFAULT 'pending',
  full_details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read registrations" ON registrations
  FOR SELECT USING (true);

-- 2) INSERT SERVICES DATA (if services table exists and is empty)
-- First check if services table exists, then insert data
INSERT INTO services (title, price, description, display_order) VALUES
('Company Registration', '5000', 'Register your company with CAC', 1),
('Business Name', '3000', 'Register your business name', 2),
('NGO Registration', '15000', 'Register a non-governmental organization', 3),
('Export Licence', '25000', 'Get export licence from NEPC', 4),
('Trademark', '20000', 'Register your trademark', 5),
('Copyright', '25000', 'Register copyright', 6),
('Annual Returns', '5000', 'File annual returns', 7)
ON CONFLICT DO NOTHING;

-- 3) INSERT HERO SLIDES DATA (if slides table exists and is empty)
INSERT INTO slides (title_part_1, title_part_2, subtitle, label, media_type) VALUES
('REX360 SOLUTIONS', 'Your Trusted CAC Agent', 'Fast, Reliable, Professional', 'Get Started', 'image'),
('Business Registration', 'Made Simple', 'Register your business in minutes', 'Learn More', 'image'),
('Expert Guidance', 'Every Step of the Way', 'Professional support for all your registration needs', 'Contact Us', 'image')
ON CONFLICT DO NOTHING;

-- 4) CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_registrations_service_type ON registrations(service_type);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- 5) VERIFY DATA
SELECT 'Services:' as info, COUNT(*) as count FROM services;
SELECT 'Slides:' as info, COUNT(*) as count FROM slides;
SELECT 'Registrations:' as info, COUNT(*) as count FROM registrations;
