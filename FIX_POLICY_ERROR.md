# 🔧 Fix: Policies Already Exist

## The Problem
```
Error: policy "Public Document Upload" already exists
```

This means the policies are there, but may have issues. Let's fix them.

---

## Solution: Use This Safe Script

Go to **Supabase** → **SQL Editor** and run this:

```sql
-- STEP 1: Drop conflicting policies (if they exist)
DROP POLICY IF EXISTS "Public Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Document View" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Delete Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Document Update" ON storage.objects;

-- STEP 2: Create fresh policies
CREATE POLICY "Public Document Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public Document View"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Allow Admin Delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');
```

---

## If That Doesn't Work: Nuclear Option

Run this to see what policies exist:

```sql
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
```

Then copy the exact policy names and drop them:

```sql
-- Replace "POLICY_NAME" with actual names from above query
DROP POLICY IF EXISTS "POLICY_NAME_1" ON storage.objects;
DROP POLICY IF EXISTS "POLICY_NAME_2" ON storage.objects;
DROP POLICY IF EXISTS "POLICY_NAME_3" ON storage.objects;

-- Then create new ones
CREATE POLICY "documents_upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_view"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "documents_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');
```

---

## Step-by-Step Fix

### 1. Check Current Policies
In SQL Editor, run:
```sql
SELECT policyname 
FROM pg_policies 
WHERE schemaname='storage' AND tablename='objects'
ORDER BY policyname;
```

You'll see something like:
```
policyname
─────────────────────────────
Public Document Upload
Public Document View
Allow Admin Delete Documents
Public Insert
Public Update
Public Delete
... etc
```

### 2. Drop All Storage Policies
```sql
-- Drop ALL existing storage policies
DROP POLICY IF EXISTS "Public Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Document View" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Delete Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Document Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete documents" ON storage.objects;
```

### 3. Create Clean Policies
```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "allow_upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "allow_view"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "allow_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');
```

### 4. Verify
```sql
SELECT policyname, permissive, roles
FROM pg_policies
WHERE schemaname='storage' AND tablename='objects'
ORDER BY policyname;
```

Should show exactly 3 policies:
```
policyname       permissive  roles
─────────────────────────────────
allow_delete     t           {}
allow_upload     t           {}
allow_view       t           {}
```

---

## Verify Bucket Settings

Make sure your documents bucket is PUBLIC:

```sql
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE name = 'documents';
```

Should show:
```
id              name        public  created_at
────────────────────────────────────────────
<some-id>       documents   true    2026-01-22
```

If `public` is `false`, update it:
```sql
UPDATE storage.buckets 
SET public = true 
WHERE name = 'documents';
```

---

## Test Upload

After fixing policies:

1. Go to **Storage** → **documents** bucket
2. Click "Upload files"
3. Select a test image
4. Should upload successfully ✅

If error: Check RLS is enabled
```sql
SELECT * FROM pg_tables 
WHERE schemaname='storage' AND tablename='objects';
```

---

## For IMAGES Bucket (Same Fix)

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Create new ones
CREATE POLICY "images_upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "images_view"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "images_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');
```

---

## Complete Cleanup Script

Run this all at once for complete reset:

```sql
-- ============================================
-- CLEANUP: Remove ALL conflicting policies
-- ============================================

DROP POLICY IF EXISTS "Public Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Document View" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Delete Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Document Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete documents" ON storage.objects;

-- ============================================
-- SETUP: Create fresh policies
-- ============================================

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Documents bucket policies
CREATE POLICY "documents_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_select"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "documents_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');

-- Images bucket policies
CREATE POLICY "images_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "images_select"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "images_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');

-- ============================================
-- VERIFY: Check buckets are public
-- ============================================

UPDATE storage.buckets SET public = true WHERE name IN ('documents', 'images');

SELECT 
  name,
  public,
  CASE WHEN public THEN '✅' ELSE '❌' END as status
FROM storage.buckets
WHERE name IN ('documents', 'images')
ORDER BY name;
```

---

## If Still Getting Errors

### Error: "relation 'storage.objects' does not exist"
```
Storage tables not initialized. Go to Storage UI and create a bucket first.
Then run the policies.
```

### Error: "permission denied"
```
Make sure you're logged in as project owner/admin in Supabase
Check project permissions
```

### Error: "role does not exist"
```
Remove the role check - use simple policies:
WITH CHECK (bucket_id = 'documents');
USING (bucket_id = 'documents');
```

---

## Success Checklist

After running the script:

- [ ] No SQL errors
- [ ] Documents bucket is PUBLIC
- [ ] 3 policies for documents bucket
- [ ] 3 policies for images bucket
- [ ] Can upload files in Storage UI
- [ ] Registration form submits successfully
- [ ] Documents appear in admin dashboard

---

## Next: Test Registration

Once policies are fixed:

1. Go to registration page
2. Fill form + upload documents
3. Complete payment
4. Check:
   - ✅ Console shows: `⬆️ Uploading file...`
   - ✅ Console shows: `✅ Uploaded to: https://...`
   - ✅ Files in Storage → documents
   - ✅ Order in admin dashboard
   - ✅ Documents in admin gallery

---

## Support

If still having issues:
1. Run the "Complete Cleanup Script" above
2. Test file upload in Storage UI
3. Check console errors (F12)
4. Contact: +234 904 834 9548

