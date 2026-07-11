-- ============================================
-- ADD PAYMENT STATUS COLUMN
-- ============================================
-- Run this in Supabase SQL Editor to add payment tracking

-- Step 1: Add payment_status column to registrations table
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- Step 2: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status 
ON public.registrations(payment_status);

-- Step 3: Verify column exists
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'registrations' AND column_name = 'payment_status';

-- Step 4: Update RLS policies to allow updates based on payment status
-- Admin can update payment_status (already covered by authenticated update policy)

-- Status values:
-- 'pending' = Registration submitted, awaiting payment
-- 'paid' = Payment completed, ready for processing
-- 'verified' = Admin has verified and processed
-- 'rejected' = Application rejected
