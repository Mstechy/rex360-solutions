-- ============================================
-- REGISTRATIONS TABLE RLS POLICIES
-- ============================================
-- IMPORTANT: Run these SQL queries in Supabase SQL Editor
-- Path: Supabase Dashboard → SQL Editor → New Query → Paste and Run

-- Step 1: Enable RLS on registrations table
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Step 2: DROP existing policies (if any cause errors, skip and continue)
DROP POLICY IF EXISTS "Allow public insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow public select registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated select registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admin Full Access Reg" ON public.registrations;
DROP POLICY IF EXISTS "Enable insert for all" ON public.registrations;
DROP POLICY IF EXISTS "Enable select for all" ON public.registrations;
DROP POLICY IF EXISTS "Enable update for admin" ON public.registrations;

-- Step 3: Create new RLS policies

-- POLICY 1: Allow PUBLIC to INSERT (registration submission)
-- This allows anyone to submit a registration form
CREATE POLICY "Allow public insert registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- POLICY 2: Allow AUTHENTICATED (admin) to SELECT (view all registrations)
-- Only authenticated users (admin) can see registrations
CREATE POLICY "Allow authenticated select registrations"
ON public.registrations
FOR SELECT
USING (auth.role() = 'authenticated');

-- POLICY 3: Allow PUBLIC to SELECT their own registration
-- Users can only see their own registration by email (using JWT)
CREATE POLICY "Allow public select own registration"
ON public.registrations
FOR SELECT
USING (email = (auth.jwt()->>'email') OR auth.role() = 'authenticated');

-- POLICY 4: Allow AUTHENTICATED (admin) to UPDATE registrations
-- Only authenticated users can update registrations
CREATE POLICY "Allow authenticated update registrations"
ON public.registrations
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- POLICY 5: Allow AUTHENTICATED (admin) to DELETE registrations
-- Only authenticated users can delete registrations
CREATE POLICY "Allow authenticated delete registrations"
ON public.registrations
FOR DELETE
USING (auth.role() = 'authenticated');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify policies are working:

-- Check if RLS is enabled:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'registrations';

-- Check all policies on registrations table:
-- SELECT policyname, permissive, roles, qual, with_check FROM pg_policies WHERE tablename = 'registrations';

-- Test INSERT (should succeed):
-- INSERT INTO public.registrations (service_type, surname, firstname, phone, email, amount, paystack_ref, full_details)
-- VALUES ('Test', 'Test', 'User', '1234567890', 'test@example.com', 0, 'TEST_' || now()::text, '{"test": true}');

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If registrations still don't insert:
-- 1. Check the exact error message in browser console
-- 2. Verify the table name is 'registrations' (not 'registration')
-- 3. Verify all column names match (service_type, surname, firstname, phone, email, amount, paystack_ref, full_details)
-- 4. Try inserting a simple test record manually in Supabase
-- 5. Check if the table has any database triggers blocking inserts
-- 6. Verify the anon key in SupabaseClient.js is correct

-- ============================================
-- ALTERNATIVE: If you want to allow ALL operations (for testing only)
-- ============================================
-- DROP ALL POLICIES FIRST, then:
-- CREATE POLICY "Allow all public operations" ON public.registrations FOR ALL USING (true) WITH CHECK (true);

-- This allows public access for testing, but should NOT be used in production!
