-- ============================================
-- RESTORE DATABASE - Run this in Supabase SQL Editor
-- This will create all tables and insert sample data
-- ============================================

-- 1) CREATE SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2) INSERT SERVICES DATA
INSERT INTO services (name, price, description, display_order) VALUES
('Business Name', 3000, 'Register your business name with CAC', 1),
('Company Name', 5000, 'Register your company with CAC', 2),
('NGO Registration', 15000, 'Register a non-governmental organization', 3),
('Export Licence', 25000, 'Get export licence from NEPC', 4),
('Trademark', 20000, 'Register your trademark', 5),
('Copyright', 25000, 'Register copyright', 6),
('Annual Returns', 5000, 'File annual returns', 7)
ON CONFLICT DO NOTHING;

-- 3) CREATE REGISTRATIONS TABLE
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

-- 4) ENABLE RLS ON REGISTRATIONS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read registrations" ON registrations
  FOR SELECT USING (true);

-- 5) CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

-- 6) VERIFY DATA
SELECT 'Services count:' as info, COUNT(*) as count FROM services;
SELECT 'Registrations count:' as info, COUNT(*) as count FROM registrations;
