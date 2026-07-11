-- ============================================
-- Missing Supabase Tables: certificate, agent_profile, transaction
-- Run each section separately in Supabase SQL Editor
-- ============================================

-- 1) agent_profile table (use underscore for safe naming)
CREATE TABLE IF NOT EXISTS agent_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE agent_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on agent_profile" ON agent_profile
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert on agent_profile" ON agent_profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete on agent_profile" ON agent_profile
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 2) certificate table
CREATE TABLE IF NOT EXISTS certificate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issued_to TEXT,
  image_url TEXT,
  issued_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE certificate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on certificate" ON certificate
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert on certificate" ON certificate
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete on certificate" ON certificate
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 3) transaction table
CREATE TABLE IF NOT EXISTS "transaction" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE,
  user_id UUID,
  amount NUMERIC,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "transaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on transaction" ON "transaction"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin insert on transaction" ON "transaction"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete on transaction" ON "transaction"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Notes:
-- - Paste each section (agent_profile, certificate, transaction) into Supabase SQL Editor and run.
-- - Use the project SQL Editor at https://app.supabase.com -> Your project -> SQL Editor
-- - If you prefer different table/column names (e.g. `agent profile` with a space), use a quoted identifier, but underscores are recommended.
