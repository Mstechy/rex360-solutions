# Fix for Admin Dashboard Not Showing on Website

## Problem
Everything uploaded/edited from admin dashboard is not showing on the website frontend.

## Root Cause
- Possible column mismatches in database tables
- Missing RLS policies
- Environment variables not properly configured

## Solution Steps

- [x] 1. Created COMPLETE_DATABASE_FIX.sql with all necessary fixes
- [ ] 2. Run COMPLETE_DATABASE_FIX.sql in Supabase SQL Editor
- [ ] 3. Verify the data is showing correctly on the website

## What the Fix Does

1. **Fixes Services Table**
   - Adds missing `name`, `display_order`, `old_price`, `title` columns
   - Copies data from `title` to `name` if needed
   - Sets `display_order` if not set

2. **Fixes Hero Slides Table**
   - Ensures all required columns exist: `title`, `subtitle`, `image_url`, `display_order`

3. **Fixes News Table**
   - Ensures all required columns exist: `title`, `content`, `date`

4. **Fixes Site Assets Table**
   - Ensures all required columns exist: `key`, `label`, `image_url`

5. **Enables RLS**
   - Enables Row Level Security on all tables
   - Creates public read policies for all tables

## How to Run the Fix

1. Go to https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Copy the contents of COMPLETE_DATABASE_FIX.sql
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL

## After Running the Fix

1. Refresh your website
2. Check if services are showing
3. Check if hero slides are showing
4. Check if news is showing
5. If still not working, check browser console for errors
