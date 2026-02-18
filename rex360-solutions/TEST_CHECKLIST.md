# Form Submission Test Checklist

## Pre-Test Setup
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Keep console visible while testing

## Test Steps

### Step 1: Fill Form
- [ ] Enter Surname
- [ ] Enter First Name
- [ ] Enter Email
- [ ] Enter Phone
- [ ] Select Service Type
- [ ] Fill all required fields for that service type
- [ ] Select Business Category and Activity
- [ ] Enter all other required details

### Step 2: Upload Documents
- [ ] Upload ID Card image
- [ ] Upload Signature image
- [ ] Upload Passport image
- [ ] All three should show preview thumbnails

### Step 3: Submit
- [ ] Click "PROCEED TO SECURE PAYMENT" button
- [ ] Watch console for messages:
  - ✅ Should see: "Starting payment process..."
  - ✅ Should see: Paystack payment modal appears

### Step 4: Complete Payment
- [ ] Enter test payment details (from Paystack documentation)
- [ ] Complete payment
- [ ] Watch console for messages:
  - ✅ Should see: "Payment successful, reference: [xxxxx]"
  - ✅ Should see: "📤 Starting document upload process..."
  - ✅ Should see: "⬆️ Uploading file..." (multiple times)
  - ✅ Should see: "✅ All files for [doctype] uploaded successfully"
  - ✅ Should see: "💾 Saving registration to database..."

### Step 5: Verify Success Screen
- [ ] Form clears completely (all fields empty)
- [ ] Success screen appears with checkmark animation
- [ ] Success message shows: "Registration Successful! ✅"
- [ ] Countdown timer visible (5, 4, 3, 2, 1)
- [ ] Progress bar fills up

### Step 6: Auto-Redirect
- [ ] After 5 seconds, automatically redirected to `/admin` dashboard
- [ ] Orders tab selected by default
- [ ] New registration appears in the orders table

### Step 7: Verify Admin Dashboard
- [ ] Click Eye icon to view full details
- [ ] Verify form data is all there:
  - Name, email, phone, service type
  - All business details filled
  - Document count shows
- [ ] Click Files icon (download zip button)
- [ ] ZIP downloads with all documents

### Step 8: Verify Documents in Storage
- [ ] Go to Supabase Dashboard
- [ ] Click Storage → documents folder
- [ ] Should see folders: ID Card, Signature, Passport
- [ ] Each folder has the uploaded files with timestamps

---

## ✅ Success Criteria

All of the following should be true after completing the test:

1. ✅ Form is completely empty/cleared
2. ✅ Success screen appeared
3. ✅ Countdown was visible
4. ✅ Auto-redirected to admin dashboard
5. ✅ New order visible in Orders tab
6. ✅ All form data preserved in admin view
7. ✅ Document URLs working in modal
8. ✅ ZIP download contains all uploaded files
9. ✅ Supabase registrations table shows new entry
10. ✅ Supabase documents storage has files

---

## Console Expected Output

Here's what the console should show (in order):

```
✅ Payment successful, reference: 1704844800000
📤 Saving data to database...
📤 Starting document upload process...
📂 Uploading 1 file(s) for ID Card...
⬆️ Uploading file: documents/ID Card/1704844800000_0_abc123_document.jpg
✅ Uploaded ID Card to: https://...
✅ All files for ID Card uploaded successfully
📂 Uploading 1 file(s) for Signature...
⬆️ Uploading file: documents/Signature/1704844800000_0_def456_document.jpg
✅ Uploaded Signature to: https://...
✅ All files for Signature uploaded successfully
📂 Uploading 1 file(s) for Passport...
⬆️ Uploading file: documents/Passport/1704844800000_0_ghi789_document.jpg
✅ Uploaded Passport to: https://...
✅ All files for Passport uploaded successfully
💾 Saving registration to database: {service_type, name, email, phone, amount...}
✅ Data saved successfully
✅ PDF generated
✅ Form cleared, showing success screen
🔄 Redirecting to admin dashboard...
```

