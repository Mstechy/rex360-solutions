# 📊 Payment & Form Submission Flow Diagram

## Complete User Journey

```
START
  ↓
┌─────────────────────────────────┐
│  REGISTRATION PAGE LOADS        │
│  ┌─────────────────────────────┐│
│  │ Select Service Type         ││
│  │ Fill Form Fields            ││
│  │ Upload Documents (3)        ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  FORM VALIDATION                │
│  ┌─────────────────────────────┐│
│  │ ✓ Check all fields filled   ││
│  │ ✓ Check documents uploaded  ││
│  │ ✓ Check price loaded        ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
  ├─ NO → Show Alert → User Fixes
  │
  └─ YES → Continue
         ↓
┌─────────────────────────────────┐
│  PAYSTACK PAYMENT MODAL         │
│  ┌─────────────────────────────┐│
│  │ Enter Payment Details       ││
│  │ Complete Payment            ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
  ├─ CANCELLED → Show alert → Return to form
  │
  └─ SUCCESS → Continue
           ↓
┌─────────────────────────────────┐
│  DOCUMENT UPLOAD                │
│  (Console: 📤 Starting)         │
│  ┌─────────────────────────────┐│
│  │ ID Card Upload              ││ (Console: ⬆️ Uploading...)
│  │ ↓ ✅ Success                ││ (Console: ✅ Uploaded)
│  │                             ││
│  │ Signature Upload            ││ (Console: ⬆️ Uploading...)
│  │ ↓ ✅ Success                ││ (Console: ✅ Uploaded)
│  │                             ││
│  │ Passport Upload             ││ (Console: ⬆️ Uploading...)
│  │ ↓ ✅ Success                ││ (Console: ✅ Uploaded)
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
  ├─ UPLOAD ERROR → Show alert → User retries
  │
  └─ ALL UPLOADED → Continue
                ↓
┌─────────────────────────────────┐
│  DATABASE SAVE                  │
│  (Console: 💾 Saving)           │
│  ┌─────────────────────────────┐│
│  │ Combine all data            ││
│  │ + Document URLs             ││
│  │ Insert to registrations     ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
  ├─ DATABASE ERROR → Show alert → User tries again
  │
  └─ SAVED → Continue
          ↓
┌─────────────────────────────────┐
│  FORM CLEARING                  │
│  ┌─────────────────────────────┐│
│  │ Clear all inputs            ││
│  │ Clear file previews         ││
│  │ Clear category/nature       ││
│  │ setStep('success')          ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  SUCCESS SCREEN DISPLAYS        │
│  ┌─────────────────────────────┐│
│  │ ✅ Checkmark animation      ││
│  │ "Submission Successful!"    ││
│  │ Countdown: 5 4 3 2 1        ││ (Console: 🔄 Redirect)
│  │ Progress bar filling         ││
│  │                             ││
│  │ Buttons:                    ││
│  │ - CHAT ON WHATSAPP          ││
│  │ - GO TO DASHBOARD NOW       ││
│  │ - BACK TO HOME              ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
  ├─ User clicks button manually
  │  ↓
  └─ 5 seconds elapsed
     ↓
┌─────────────────────────────────┐
│  AUTO-REDIRECT                  │
│  Navigate to /admin             │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  ADMIN DASHBOARD                │
│  ┌─────────────────────────────┐│
│  │ Orders Tab Selected         ││
│  │                             ││
│  │ New Order Visible:          ││
│  │ [Client Name] [Service]     ││
│  │ [Eye] [Files]               ││
│  │                             ││
│  │ Click Eye:                  ││
│  │ → See all form data         ││
│  │ → See documents in gallery  ││
│  │                             ││
│  │ Click Files:                ││
│  │ → Download ZIP              ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
  ↓
END - Registration Complete ✅
```

---

## Console Output Timeline

```
Timeline of what appears in browser console (F12):

T+0ms
└─ Starting payment process...

T+100ms
└─ ✅ Payment successful, reference: 1704844800000

T+110ms
└─ 📤 Saving data to database...
└─ 📤 Starting document upload process...

T+150ms
└─ 📂 Uploading 1 file(s) for ID Card...

T+160ms
└─ ⬆️ Uploading file: documents/ID Card/1704844800000_0_abc123_image.jpg

T+1500ms (After upload completes)
└─ ✅ Uploaded ID Card to: https://...
└─ ✅ All files for ID Card uploaded successfully

T+1600ms
└─ 📂 Uploading 1 file(s) for Signature...
└─ ⬆️ Uploading file: documents/Signature/...

T+2500ms
└─ ✅ Uploaded Signature to: https://...
└─ ✅ All files for Signature uploaded successfully

T+2600ms
└─ 📂 Uploading 1 file(s) for Passport...
└─ ⬆️ Uploading file: documents/Passport/...

T+3500ms
└─ ✅ Uploaded Passport to: https://...
└─ ✅ All files for Passport uploaded successfully

T+3600ms
└─ 💾 Saving registration to database: {
     service_type: "Business Name",
     name: "John Doe",
     email: "john@email.com",
     phone: "+234 xxx xxx xxxx",
     amount: 5000,
     documents_uploaded: 3
   }

T+4100ms
└─ ✅ Successfully saved to database!
└─ ✅ Data saved successfully
└─ ✅ PDF generated
└─ ✅ Form cleared, showing success screen

T+4200ms
└─ 🔄 Redirecting to admin dashboard...

T+5000ms (User waits 5 seconds or clicks button)
└─ [Auto-navigates to /admin]
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────┐
│         USER BROWSER (React Component)           │
│                                                  │
│  Registration Form                               │
│  ├─ Personal Data                                │
│  │  ├─ surname                                   │
│  │  ├─ firstname                                 │
│  │  ├─ email                                     │
│  │  └─ phone                                     │
│  │                                               │
│  ├─ Service Data                                 │
│  │  ├─ service_type                              │
│  │  ├─ business_category                         │
│  │  └─ business_nature                           │
│  │                                               │
│  └─ Files                                        │
│     ├─ ID Card (image)                           │
│     ├─ Signature (image)                         │
│     └─ Passport (image)                          │
│                                                  │
└──────────────┬───────────────────────────────────┘
               │
               │ handleProcess()
               │ │
               │ ├─ Validate form
               │ ├─ Validate documents
               │ └─ Start Paystack payment
               │
               ↓
┌──────────────────────────────────────────────────┐
│           PAYSTACK PAYMENT API                   │
│                                                  │
│  ✓ User enters card details                      │
│  ✓ Payment verified                              │
│  ✓ Returns reference number                      │
│                                                  │
└──────────────┬───────────────────────────────────┘
               │
               │ Payment callback
               │ reference: "1704844800000"
               │
               ↓
┌──────────────────────────────────────────────────┐
│      SUPABASE STORAGE (Documents)                │
│                                                  │
│  documents bucket                                │
│  ├─ ID Card/                                     │
│  │  └─ 1704844800000_0_abc_image.jpg             │
│  ├─ Signature/                                   │
│  │  └─ 1704844800000_0_def_image.jpg             │
│  └─ Passport/                                    │
│     └─ 1704844800000_0_ghi_image.jpg             │
│                                                  │
│  ↓ Returns public URLs                           │
│  [https://...jpg, https://...jpg, https://...jpg]│
│                                                  │
└──────────────┬───────────────────────────────────┘
               │
               │ saveToDatabase()
               │ with document URLs
               │
               ↓
┌──────────────────────────────────────────────────┐
│      SUPABASE DATABASE                           │
│                                                  │
│  registrations table                             │
│  ├─ id                                           │
│  ├─ surname                                      │
│  ├─ firstname                                    │
│  ├─ email                                        │
│  ├─ phone                                        │
│  ├─ service_type                                 │
│  ├─ amount                                       │
│  ├─ paystack_ref: "1704844800000"                │
│  ├─ full_details: {                              │
│  │    business_category: "...",                  │
│  │    business_nature: "...",                    │
│  │    uploaded_docs: {                           │
│  │      "ID Card": ["https://...jpg"],           │
│  │      "Signature": ["https://...jpg"],         │
│  │      "Passport": ["https://...jpg"]           │
│  │    }                                          │
│  │  }                                            │
│  └─ created_at                                   │
│                                                  │
└──────────────┬───────────────────────────────────┘
               │
               │ Data saved ✅
               │
               ↓
┌──────────────────────────────────────────────────┐
│      ADMIN DASHBOARD                             │
│                                                  │
│  Orders Manager                                  │
│  ├─ Fetches from registrations table             │
│  ├─ Displays:                                    │
│  │  Client Name | Service Type | Actions         │
│  │                                               │
│  └─ On click "Eye" → Shows modal with:           │
│     ├─ All form data                             │
│     ├─ Document gallery                          │
│     │  ├─ ID Card image                          │
│     │  ├─ Signature image                        │
│     │  └─ Passport image                         │
│     └─ Download ZIP button                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Form Submission
  ↓
┌─ Price not loaded? 
│  └─ ❌ Show alert: "Price loading..."
│
├─ Documents missing?
│  └─ ❌ Show alert: "Missing Documents..."
│
├─ Form fields empty?
│  └─ ❌ Show alert: "Please fill required fields..."
│
├─ Payment cancelled?
│  └─ ❌ Show alert: "Payment Cancelled"
│
├─ Document upload failed?
│  ├─ ❌ Console: "Upload error for [type]"
│  └─ 🆘 Show alert: "[type] upload failed..."
│
├─ Database save failed?
│  ├─ ❌ Console: "Database insert error"
│  └─ 🆘 Show alert: "Error saving data..."
│
└─ Success! ✅
   ├─ Console: "✅ Data saved successfully"
   ├─ Console: "✅ Form cleared"
   ├─ Show: Success screen with countdown
   └─ Redirect: /admin after 5 seconds
```

