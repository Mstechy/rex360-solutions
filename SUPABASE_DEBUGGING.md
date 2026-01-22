# Supabase Debugging Queries

## 🔍 To Check if Data is Being Saved

### 1. View All Registrations
Open Supabase → SQL Editor and run:

```sql
SELECT 
  id,
  surname,
  firstname,
  email,
  phone,
  service_type,
  amount,
  paystack_ref,
  created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 20;
```

### 2. Check Specific Registration
```sql
SELECT 
  id,
  surname,
  firstname,
  full_details,
  created_at
FROM registrations
WHERE email = 'customer@email.com'
ORDER BY created_at DESC
LIMIT 1;
```

### 3. Count Registrations by Service Type
```sql
SELECT 
  service_type,
  COUNT(*) as count
FROM registrations
GROUP BY service_type
ORDER BY count DESC;
```

### 4. Check Document Upload Status
```sql
-- This shows if documents were uploaded (full_details has uploaded_docs)
SELECT 
  id,
  surname,
  firstname,
  (full_details->>'uploaded_docs' IS NOT NULL) as has_documents,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### 5. Verify Storage Bucket Exists
Go to Supabase → Storage tab and verify:
- [ ] Bucket named `documents` exists
- [ ] Bucket is marked as "Public" (not Private)
- [ ] Inside are folders: `ID Card`, `Signature`, `Passport`

### 6. Check Storage Policies
```sql
-- View storage policies
SELECT * FROM storage.objects
WHERE bucket_id = 'documents'
LIMIT 20;
```

---

## 🧪 Test Queries

### Find Registrations from Last Hour
```sql
SELECT 
  id,
  surname,
  firstname,
  email,
  service_type,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Find Registrations Missing Documents
```sql
SELECT 
  id,
  surname,
  firstname,
  (full_details->>'uploaded_docs') as documents
FROM registrations
WHERE (full_details->>'uploaded_docs' IS NULL OR full_details->>'uploaded_docs' = '{}')
ORDER BY created_at DESC
LIMIT 10;
```

### Check Payment Reference
```sql
SELECT 
  id,
  surname,
  firstname,
  paystack_ref,
  created_at
FROM registrations
WHERE paystack_ref = 'YOUR_PAYSTACK_REF_HERE'
LIMIT 1;
```

---

## 📊 Admin Dashboard Verification

### In the Admin Dashboard:

1. **Click Orders Tab**
   - Should show: Client name, Service type, Actions
   
2. **Click Eye Icon**
   - Shows: Full registration details
   - Shows: All form fields filled
   - Shows: Document gallery grid
   
3. **Click Files Icon**
   - Downloads ZIP with all documents
   - ZIP named: `Surname_Documents.zip`
   - Contains folders for each document type

### If Documents Not Showing:
Check console in admin page for errors:
```javascript
// Open DevTools → Console in admin dashboard
// Look for messages like:
// "Uploading: documents/ID Card/..."
// "Error: CORS policy"
// "Error: 403 Forbidden"
```

---

## 🔐 Storage Bucket Configuration

### Required Supabase Storage Settings:

1. **Storage Bucket Policies** should allow:
   - Authenticated users to read/write
   - Public access to read files
   
   Example policy:
   ```sql
   CREATE POLICY "Public Read" ON storage.objects
   FOR SELECT USING (bucket_id = 'documents');
   
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'documents');
   ```

2. **CORS Settings** should include:
   - Origin: `http://localhost:5173`
   - Origin: `https://yourdomain.com`
   - Methods: GET, POST, PUT, DELETE
   - Headers: Content-Type, Authorization

---

## 🆘 Emergency Fix Commands

If documents are not uploading, check:

### 1. Storage Bucket Exists
```sql
SELECT id, name, public FROM storage.buckets 
WHERE name = 'documents';
```

Expected output:
```
id    | name      | public
------|-----------|--------
<id>  | documents | true
```

### 2. Folder Structure Created
```sql
SELECT name FROM storage.objects 
WHERE bucket_id = 'documents' 
AND name LIKE '%/'
ORDER BY name;
```

Expected to see:
```
ID Card/
Signature/
Passport/
```

### 3. Files are Uploading
```sql
SELECT 
  id,
  name,
  bucket_id,
  created_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'documents'
ORDER BY created_at DESC
LIMIT 20;
```

---

## 📱 Quick Mobile Test

To test on mobile:

1. Use your laptop IP instead of localhost:
   ```
   http://192.168.1.xxx:5173
   ```

2. Fill registration form completely

3. Submit and watch console for messages

4. Go to admin dashboard on desktop

5. Check if mobile submission appears

