# 📋 DOCUMENT UPLOAD - QUICK SETUP CARD

## WHAT WAS FIXED (Code Changes)

### ✅ Registration.jsx
- Enhanced document upload with detailed console logs
- Fixed filename format (preserves file extensions)
- Better error handling and reporting
- Validates URLs before saving

### ✅ AdminDashboard.jsx
- Better document display in admin modal
- Filters out invalid/empty URLs
- Error handling for failed image loads
- Proper array validation

---

## WHAT YOU MUST DO IN SUPABASE (5 Minutes)

### Go to: https://app.supabase.com

#### 1️⃣ Create Storage Bucket
```
Storage → New Bucket

Name: documents
Make Public: ✅ YES
Create
```

#### 2️⃣ Create 3 RLS Policies
```
Click "documents" bucket
Click "Policies"

POLICY 1:
  Name: Allow Public Upload
  Type: CREATE
  Expression: true
  
POLICY 2:
  Name: Allow Public Read
  Type: SELECT
  Expression: true
  
POLICY 3:
  Name: Allow Admin Delete
  Type: DELETE
  Expression: auth.role() = 'authenticated'
```

**Result: You should see 3 policies listed ✅**

---

## HOW TO TEST (5 Minutes)

### 1. Open Registration Form
```
http://localhost:3002/register?selectedService=Company Name
```

### 2. Fill & Upload
```
- Surname: Test
- Firstname: User
- Email: test@example.com
- Phone: 08012345678
- Upload 3 files: ID Card, Signature, Passport
```

### 3. Watch Console (F12)
```
Look for:
📤 Starting document uploads...
✅ All documents uploaded: {...}
💾 Saving registration data...
✅ Registration saved successfully
```

### 4. Complete Payment
```
Card: 4084 0343 1234 5010
OTP: 123456
```

### 5. Check Admin Dashboard
```
http://localhost:3002/admin
Orders → Find TestUser → VIEW
Scroll down → See 3 document images
```

---

## ERROR SOLUTIONS (Quick Fix)

| Error | Solution |
|-------|----------|
| 403 Forbidden | Check RLS policies in Supabase |
| Could not get public URL | Make bucket PUBLIC |
| No documents showing | Check bucket name = "documents" |
| Image broken link | Verify upload completed (console logs) |
| "No documents uploaded yet" | Documents didn't save - check console |

---

## SUCCESS INDICATORS

```
✅ Console shows "📤 Starting document uploads..."
✅ Console shows "✅ All documents uploaded: {...}"
✅ Admin sees thumbnails in document gallery
✅ Can click image to open in new tab
✅ Document badges show correct counts
```

---

## FILE CHANGES SUMMARY

**Modified Files:**
- `src/pages/Registration.jsx` (lines 162-211)
- `src/pages/AdminDashboard.jsx` (lines 263-293)

**New Supabase Resources:**
- `documents` bucket (storage)
- 3 RLS policies (upload, read, delete)

---

## ESTIMATED TIME

- Supabase setup: 5 minutes
- Testing registration: 5 minutes
- Verifying in admin: 2 minutes
- **Total: ~12 minutes to 100% working**

---

## IF STUCK

**Step 1:** Open browser console (F12)
**Step 2:** Look for red error messages
**Step 3:** If "403" → fix RLS policies
**Step 4:** If "404" → check bucket name
**Step 5:** If "Could not get public URL" → make bucket PUBLIC
**Step 6:** If no logs → code not running (clear cache, reload)

---

## CONFIRMATION

You're done when:
- ✅ Supabase bucket created
- ✅ 3 RLS policies set
- ✅ Registration form uploads without errors
- ✅ Documents appear in admin dashboard
- ✅ Images clickable and viewable

**🚀 System Ready for Production!**
