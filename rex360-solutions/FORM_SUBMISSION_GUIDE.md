# Form Submission & Payment Guide

## ✅ What Was Fixed

### 1. **Form Not Clearing After Submission**
- Form now automatically clears all fields when payment is successful
- Document previews are removed
- Category and nature selections are reset

### 2. **Success Screen Not Appearing**
- Enhanced success screen now displays with:
  - Large success checkmark animation
  - Countdown timer (5 seconds)
  - Progress bar showing redirect progress
  - Multiple action buttons

### 3. **Better Error Handling**
- Detailed console logging for debugging
- Better error messages with support contact info
- Validation of all required fields before payment
- Check for documents before processing payment

### 4. **Form Validation**
Added checks for:
- ✓ All required fields filled (surname, firstname, email, phone)
- ✓ All documents uploaded (ID Card, Signature, Passport)
- ✓ Price loaded correctly
- ✓ Payment completed successfully

---

## 🔍 How to Debug if Issues Persist

### **Step 1: Check Browser Console**
1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Fill form and submit
4. Look for messages starting with:
   - 📤 = Uploading documents
   - ✅ = Success
   - ❌ = Error
   - 💾 = Saving to database
   - 🔄 = Redirecting

### **Step 2: Check Supabase**
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Run this query:
```sql
SELECT id, surname, firstname, service_type, created_at 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 10;
```

4. Check if your new registrations appear

### **Step 3: Check Documents Storage**
1. Go to Supabase Dashboard
2. Click **Storage** → **documents** folder
3. You should see folders: `ID Card`, `Signature`, `Passport`
4. Each should have files with names like: `1704844800000_0_abc123_document.jpg`

---

## 📋 Expected Flow After Payment

1. **Payment Successful** → Console shows: `✅ Payment successful`
2. **Documents Upload** → Console shows: `⬆️ Uploading file...`
3. **Database Save** → Console shows: `💾 Saving registration...`
4. **Form Clears** → All form fields become empty
5. **Success Screen** → Shows confirmation with countdown
6. **Auto Redirect** → After 5 seconds, redirects to `/admin` dashboard
7. **Admin Dashboard** → New order appears in "Orders" tab

---

## 🛑 Common Issues & Solutions

### **Issue: Form still filled after payment**
- **Cause:** JavaScript error before form clearing
- **Fix:** Check console for red errors
- **Solution:** Refresh page and try again

### **Issue: Success screen doesn't appear**
- **Cause:** Document upload failed silently
- **Fix:** Check console for upload errors starting with ❌
- **Solution:** Ensure documents are valid image files (JPG, PNG)

### **Issue: Order not appearing in admin dashboard**
- **Cause:** Database save failed or wrong table
- **Fix:** Check Supabase registrations table exists
- **Solution:** Run SQL query above to verify data was saved

### **Issue: Document URLs not working**
- **Cause:** Storage bucket permissions incorrect
- **Fix:** Check Supabase storage policies are public
- **Solution:** Enable public access to documents bucket

---

## 📞 Support Contacts

**WhatsApp:** +234 904 834 9548

**If contacting support, include:**
- Browser console logs (Screenshot or copy)
- Paystack reference number
- User email address
- What documents were uploaded

---

## 🔧 Admin Dashboard Checks

After form submission:

1. Go to `/admin`
2. Click **Orders** tab
3. You should see the new registration
4. Click **Eye icon** to view details
5. Click **Files icon** to download all documents as ZIP

