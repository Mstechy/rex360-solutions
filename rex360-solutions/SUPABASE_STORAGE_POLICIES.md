# 🔐 Supabase Storage Policies - Setup Guide

## Problem Identified

Documents bucket exists but policies are missing/incomplete. This prevents:
- ❌ Document uploads failing silently
- ❌ Documents not appearing in admin
- ❌ No public access to download files

## Solution: Add Storage Policies

### Step-by-Step Setup

#### 1. Go to Supabase Dashboard
```
https://app.supabase.com
→ Your Project
→ Storage
→ documents bucket
→ Policies tab
```

#### 2. Copy & Run These SQL Policies

Run each policy in: **SQL Editor** → Paste → Run

---

## SQL POLICIES TO CREATE

### Policy 1: Allow Public Upload to Documents
```sql
CREATE POLICY "Public Document Upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated' OR auth.role() = 'anon'
);
```

### Policy 2: Allow Public View Documents
```sql
CREATE POLICY "Public Document View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');
```

### Policy 3: Allow Authenticated Delete
```sql
CREATE POLICY "Allow Admin Delete Documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);
```

### Policy 4: Allow Update (if needed)
```sql
CREATE POLICY "Allow Document Update"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);
```

---

## Alternative: One-Click Setup

### Use This Script Instead (Safer)

Go to **SQL Editor** and run:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Delete existing problematic policies for documents bucket
DELETE FROM storage.objects WHERE bucket_id = 'documents' AND auth.role() = 'anon';

-- Create new policies
CREATE POLICY "Public can upload to documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
);

CREATE POLICY "Public can view documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
);

CREATE POLICY "Authenticated can delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);
```

---

## Verify Policies Are Working

### In Supabase UI:
1. Go to **Storage** → **documents**
2. Click **Policies** tab
3. Should see at least 3 policies:
   - ✅ Public can upload to documents (INSERT)
   - ✅ Public can view documents (SELECT)
   - ✅ Authenticated can delete documents (DELETE)

### Test Upload:
1. Go to **Storage** → **documents**
2. Click "Upload files"
3. Select an image
4. Should upload successfully ✅

### Verify in Database:
Run in SQL Editor:
```sql
SELECT 
  name,
  bucket_id,
  created_at,
  (regexp_split_to_array(name, '/'))[1] as folder
FROM storage.objects
WHERE bucket_id = 'documents'
ORDER BY created_at DESC
LIMIT 10;
```

Expected output:
```
name                               bucket_id    created_at         folder
1704844800000_0_abc_ID_Card.jpg   documents    2026-01-22...      ID Card
1704844800000_0_def_Signature.jpg documents    2026-01-22...      Signature
1704844800000_0_ghi_Passport.jpg  documents    2026-01-22...      Passport
```

---

## If You Already Have Policies

### Check Existing Policies:
Run in **SQL Editor**:
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;
```

### List All Bucket Policies:
```sql
SELECT
  policyname,
  qual as "SELECT (if any)",
  with_check as "INSERT/UPDATE/DELETE (if any)"
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
```

---

## Quick Fix: Remove & Recreate

If policies exist but not working:

### 1. Check Current Policies
```sql
-- List policies for documents
SELECT policyname 
FROM pg_policies 
WHERE schemaname='storage' AND tablename='objects';
```

### 2. Drop All & Recreate
```sql
-- Drop existing
DROP POLICY IF EXISTS "Public Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Document View" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Delete Documents" ON storage.objects;

-- Recreate fresh
CREATE POLICY "Public Document Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public Document View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Allow Admin Delete Documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

---

## Troubleshooting

### Issue: "Storage access denied" error
```
Solution: Run the policies above
Make sure bucket is set to PUBLIC
Check RLS is enabled: ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### Issue: "bucket does not exist"
```
Create it: Go to Storage → New bucket → Name: documents → Public → Create
Then add policies
```

### Issue: Policies show but still can't upload
```
1. Verify bucket is PUBLIC (not Private)
2. Check auth.role() is set correctly
3. Try removing role() check - allow all:
   WITH CHECK (bucket_id = 'documents');
```

### Issue: Still not working
```sql
-- Nuclear option: Allow everything (temporary testing only)
CREATE POLICY "Allow all" ON storage.objects 
FOR ALL USING (bucket_id = 'documents');

-- Then test upload
-- Once working, add proper restrictive policies
```

---

## After Policies Are Set

### Test Complete Flow:

1. **Fill registration form** with documents
2. **Submit payment** 
3. **Watch console (F12)** for upload messages
4. **Check Supabase storage**:
   - Storage → documents → ID Card folder
   - Should show: `1704844800000_0_xxx_filename.jpg`
5. **Check admin dashboard**:
   - Orders tab → click Eye icon
   - Should see documents in gallery
6. **Try ZIP download**:
   - Click Files icon
   - Download should work ✅

---

## Complete Bucket Configuration

### DOCUMENTS Bucket
```
Name: documents
Access: PUBLIC ✅
Policies:
  ✅ Public can upload
  ✅ Public can view
  ✅ Authenticated can delete
```

### IMAGES Bucket
```
Name: images
Access: PUBLIC ✅
Policies:
  ✅ Public can upload
  ✅ Public can view
  ✅ Authenticated can delete
```

### UPLOADS Bucket (Optional)
```
Name: uploads
Access: PUBLIC ✅
Policies:
  ✅ Public can upload
  ✅ Public can view
  ✅ Authenticated can delete
```

---

## Validation SQL

Run this to confirm everything is set up:

```sql
-- Check buckets exist
SELECT id, name, public FROM storage.buckets;

-- Check documents bucket is public
SELECT * FROM storage.buckets WHERE name = 'documents';

-- Check policies exist
SELECT policyname, permissive, roles 
FROM pg_policies 
WHERE schemaname='storage' AND tablename='objects'
ORDER BY tablename;

-- Check RLS enabled
SELECT tablename 
FROM pg_tables 
WHERE schemaname='storage' AND tablename='objects';
```

---

## Success Indicators

After setup, you should have:

✅ Buckets exist (documents, images, uploads)
✅ All buckets are PUBLIC
✅ Documents bucket has 3+ policies
✅ Can upload files in UI
✅ Files appear in folder structure
✅ Can download files
✅ Public URLs work

---

## Next: Test Registration Form

Once policies are set:

1. Go to registration page
2. Fill form completely
3. Upload 3 documents (ID Card, Signature, Passport)
4. Click "PROCEED TO SECURE PAYMENT"
5. Complete test payment
6. Check:
   - ✅ Console shows upload progress
   - ✅ Files in storage/documents/[type]/
   - ✅ Order in admin dashboard
   - ✅ Documents visible in gallery

---

## Support

If policies don't work:
1. Verify bucket is PUBLIC
2. Check RLS is enabled
3. Run the SQL policies above
4. Contact: +234 904 834 9548

