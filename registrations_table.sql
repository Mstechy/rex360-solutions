-- ============================================
-- REGISTRATIONS TABLE
-- ============================================
CREATE TABLE registrations (
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

-- Policy for public insert (anyone can submit registration)
CREATE POLICY "Allow public insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- Policy for public read (to check own registration)
CREATE POLICY "Allow public read registrations" ON registrations
  FOR SELECT USING (true);

-- Policy for admin full access
CREATE POLICY "Allow admin full access registrations" ON registrations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX idx_registrations_service_type ON registrations(service_type);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
