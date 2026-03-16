-- ============================================
-- 1. CREATE POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'News',
  media_type TEXT,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- ============================================
-- 2. CREATE SLIDES TABLE
-- ============================================
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_part_1 TEXT NOT NULL,
  title_part_2 TEXT,
  subtitle TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  label TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON slides
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON slides
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete" ON slides
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- ============================================
-- 3. CREATE SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON services
  FOR SELECT USING (true);

CREATE POLICY "Allow admin update" ON services
  FOR UPDATE WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================
-- 4. CREATE APPLICATIONS TABLE
-- ============================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  city TEXT,
  address TEXT,
  service_type TEXT,
  status TEXT DEFAULT 'pending',
  is_express BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read" ON applications
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public insert" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update" ON applications
  FOR UPDATE USING (auth.uid() IS NOT NULL);


-- ============================================
-- 5. CREATE AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read" ON audit_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin insert" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================
-- 6. CREATE AGENT_PROFILE TABLE
-- ============================================
CREATE TABLE agent_profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  profile_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE agent_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON agent_profile
  FOR SELECT USING (true);

CREATE POLICY "Allow admin update" ON agent_profile
  FOR UPDATE USING (auth.uid() IS NOT NULL);


-- ============================================
-- 7. CREATE CONTENT_ASSETS TABLE
-- ============================================
CREATE TABLE content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read" ON content_assets
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin insert" ON content_assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete" ON content_assets
  FOR DELETE USING (auth.uid() IS NOT NULL);
