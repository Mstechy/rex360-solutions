# 🔐 Fix Registrations RLS Policies - STEP BY STEP

## ⚠️ THE PROBLEM
Your form is submitting but data isn't reaching Supabase because **RLS (Row Level Security) policies are blocking INSERT operations** on the registrations table.

## ✅ THE SOLUTION
Apply the correct RLS policies to allow:
- ✅ **PUBLIC** to INSERT (register)
- ✅ **AUTHENTICATED (admin)** to SELECT (view)
- ✅ **AUTHENTICATED (admin)** to UPDATE/DELETE (manage)

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)

### Step 2: Create a New Query
1. Click **New Query**
2. Copy ALL the SQL from: `REGISTRATIONS_RLS_POLICIES.sql` (in your project root)
3. Paste into the SQL Editor

### Step 3: Run the Queries
1. Click **Run** (or Ctrl+Enter)
2. You should see: "Success. No rows returned."
3. Ignore any "already exists" errors - they're fine

### Step 4: Verify Policies Applied
Run this query to check:
```sql
SELECT policyname, roles, qual FROM pg_policies 
WHERE tablename = 'registrations' 
ORDER BY policyname;
```

You should see:
- ✅ `Allow authenticated delete registrations`
- ✅ `Allow authenticated select registrations`
- ✅ `Allow authenticated update registrations`
- ✅ `Allow public insert registrations`
- ✅ `Allow public select own registration`

### Step 5: Test Registration
1. Go back to your app: http://localhost:3001
2. Fill out form completely
3. Submit and complete payment
4. **Check Console (F12)**:
   - Should see: `✅ Successfully saved to database!`
   - Success screen should appear
   - Form should clear

---

## 🔍 IF IT STILL DOESN'T WORK

### Check 1: Error in Console?
Open Console (F12) and look for exact error message:
- **Error code 23505**: Unique violation - duplicate paystack_ref
- **Error code 23503**: Foreign key violation
- **Error code 42P01**: Table doesn't exist
- **Error code 0**: RLS policy blocking it

**If you see any error, take a screenshot and check below:**

### Check 2: Verify Table Exists
Run in SQL Editor:
```sql
SELECT * FROM public.registrations LIMIT 1;
```

Should return: "Retrieves 0 rows"

### Check 3: Verify Table Structure
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
```

Should have these columns:
- id (uuid)
- service_type (text)
- surname (text)
- firstname (text)
- phone (text)
- email (text)
- amount (integer or numeric)
- paystack_ref (text)
- full_details (jsonb)
- created_at (timestamp)

### Check 4: Test Manual Insert
Try inserting test data in SQL Editor:
```sql
INSERT INTO public.registrations 
(service_type, surname, firstname, phone, email, amount, paystack_ref, full_details)
VALUES 
('Test', 'Test', 'User', '1234567890', 'test@example.com', 0, 'TEST_' || now()::text, '{"test": true}');
```

If this fails, your RLS policies are still wrong.

---

## 🚨 NUCLEAR OPTION (Testing Only!)
If nothing works, temporarily allow all public access:

```sql
-- DROP all existing policies first
DROP POLICY IF EXISTS "Allow authenticated delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated select registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow public insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow public select own registration" ON public.registrations;

-- Create one permissive policy for testing
CREATE POLICY "Allow all public operations TEST ONLY" ON public.registrations 
FOR ALL USING (true) WITH CHECK (true);
```

⚠️ **WARNING**: This allows ANYONE to read/modify/delete all registrations! Only use for testing, then apply proper policies.

---

## ✅ EXPECTED BEHAVIOR AFTER FIX

### Registration Form Submission:
1. Fill form → Submit → Complete payment ✅
2. Console shows: `🔗 CONNECTING TO SUPABASE`
3. Loading overlay with upload progress ✅
4. Console shows: `✅ Successfully saved to database!` ✅
5. Success screen appears with countdown ✅
6. Auto-redirects to /admin after 5 seconds ✅

### Admin Dashboard:
1. Go to /admin ✅
2. Click "Orders" tab ✅
3. Should see your registration with all documents ✅
4. Green status "VERIFIED" when all 3 docs uploaded ✅

---

## 📞 STILL STUCK?

If after applying these policies data still doesn't save:

1. **Screenshot the error** from console (F12)
2. **Copy the full error message**
3. **Check Supabase logs**: 
   - Supabase Dashboard → Logs → Postgres
   - Look for your INSERT query errors
4. **Contact support** with:
   - Error code
   - Error message
   - Payment reference
   - Screenshot of console

---

## 🎯 KEY POINTS

| What | Who | Can Do |
|------|-----|--------|
| **Register (INSERT)** | Anyone (public) | ✅ Yes |
| **View registrations (SELECT)** | Admin only | ✅ Yes |
| **Edit registrations (UPDATE)** | Admin only | ✅ Yes |
| **Delete registrations (DELETE)** | Admin only | ✅ Yes |

This setup matches your app:
- **Clients**: Submit registrations publicly
- **Admin**: View, edit, delete all registrations
