# Supabase Database Schema

To make the Admin Dashboard work properly, you need to create these tables in your Supabase project:

## 1. **posts** table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'News',
  media_type TEXT,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS Policy (Public Read, Admin Write)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

## 2. **slides** table
```sql
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL DEFAULT 'hero',
  type TEXT NOT NULL DEFAULT 'image',
  image_url TEXT,
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
```

## 3. **services** table
```sql
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
```

## 4. **uploads** Storage Bucket
Make sure you have a storage bucket named `uploads` in Supabase with public access enabled.

---

## How to Create Tables in Supabase:

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste each SQL block above
5. Click **Run** for each one
6. Verify tables appear in the **Tables** section

## Troubleshooting:

- If you get "posts table does not exist" error, create the `posts` table above
- Make sure Row Level Security (RLS) is enabled on all tables
- Check that your Supabase API key has proper permissions
- Verify the `SUPABASE_URL` and `SUPABASE_KEY` in your backend `.env` file
