# 📊 Database Tables Verification Checklist

## ✅ TABLES USED BY YOUR WEBSITE

Your app uses these tables in Supabase:

| Table Name | Purpose | Used By |
|-----------|---------|---------|
| `registrations` | Store client registrations + documents | Registration.jsx, AdminDashboard.jsx |
| `services` | Service types & pricing | Registration.jsx, AdminDashboard.jsx |
| `news` | News/blog posts | AdminDashboard.jsx, NewsSection.jsx |
| `hero_slides` | Hero banner slides | AdminDashboard.jsx, HeroSlider.jsx |
| `site_assets` | Site images (agent photo, seal) | AdminDashboard.jsx |

---

## 🔍 VERIFY EACH TABLE IN SUPABASE

### 1️⃣ REGISTRATIONS TABLE

**Location in code:** `Registration.jsx`, `AdminDashboard.jsx`

**Required columns:**
```
- id (UUID, Primary Key)
- service_type (TEXT)
- surname (TEXT)
- firstname (TEXT)
- phone (TEXT)
- email (TEXT)
- amount (INTEGER or NUMERIC)
- paystack_ref (TEXT)
- full_details (JSONB)
- created_at (TIMESTAMP)
```

**To verify in Supabase:**
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations'
ORDER BY ordinal_position;
```

**Expected output:** Should show all columns above ✅

---

### 2️⃣ SERVICES TABLE

**Location in code:** `Registration.jsx`, `AdminDashboard.jsx`

**Required columns:**
```
- id (INTEGER or UUID, Primary Key)
- name (TEXT) - must include: "Business Name", "Company Name", "NGO Registration", etc.
- price (INTEGER or NUMERIC)
- old_price (INTEGER or NUMERIC) - optional
```

**To verify in Supabase:**
```sql
SELECT * FROM public.services;
```

**Expected output:** List of services with prices
- Business Name
- Company Name
- NGO Registration
- Annual Returns
- Etc.

---

### 3️⃣ NEWS TABLE

**Location in code:** `AdminDashboard.jsx`, `NewsSection.jsx`

**Required columns:**
```
- id (UUID, Primary Key)
- title (TEXT)
- content (TEXT)
- date (DATE or TIMESTAMP)
```

**To verify in Supabase:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news'
ORDER BY ordinal_position;
```

---

### 4️⃣ HERO_SLIDES TABLE

**Location in code:** `AdminDashboard.jsx`, `HeroSlider.jsx`

**Required columns:**
```
- id (UUID, Primary Key)
- title (TEXT) - optional, for banner title
- subtitle (TEXT) - optional
- image_url (TEXT) - URL to slide image
- created_at (TIMESTAMP)
```

**To verify in Supabase:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hero_slides'
ORDER BY ordinal_position;
```

---

### 5️⃣ SITE_ASSETS TABLE

**Location in code:** `AdminDashboard.jsx`

**Required columns:**
```
- id (UUID, Primary Key)
- key (TEXT) - example: "agent_photo", "oat_seal"
- image_url (TEXT) - URL to image
```

**To verify in Supabase:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_assets'
ORDER BY ordinal_position;
```

---

## 🚨 CHECKING FOR WRONG NAMES

### Common Issues:

1. **Table named `registration` instead of `registrations`** ❌
   - Code uses: `registrations` (PLURAL)
   - Check your Supabase table name

2. **Column named `firstname` instead of `first_name`** ❌
   - Code uses: `firstname` (NO underscore)
   - Make sure all columns match exactly

3. **Column named `servicetype` instead of `service_type`** ❌
   - Code uses: `service_type` (WITH underscore)

4. **Column named `paystackref` instead of `paystack_ref`** ❌
   - Code uses: `paystack_ref` (WITH underscores)

---

## ✅ HOW TO VERIFY ALL TABLES ARE CORRECT

Run this SQL in Supabase SQL Editor to check everything:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check registrations table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Check services table has data
SELECT COUNT(*) as service_count FROM public.services;

-- Check hero_slides table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'hero_slides' 
ORDER BY ordinal_position;

-- Check news table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;

-- Check site_assets table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'site_assets' 
ORDER BY ordinal_position;
```

---

## ✅ EXPECTED OUTPUT

### Tables list should show:
```
hero_slides
news
registrations
services
site_assets
```

### Registrations columns should show:
```
id             | uuid
service_type   | text
surname        | text
firstname      | text
phone          | text
email          | text
amount         | integer or numeric
paystack_ref   | text
full_details   | jsonb
created_at     | timestamp
```

### Services data should show:
```
id | name               | price  | old_price
1  | Business Name      | 5000   | 6000
2  | Company Name       | 8000   | 10000
3  | NGO Registration   | 3500   | 4500
4  | Annual Returns     | 2000   | 2500
...etc
```

---

## 🔐 ALSO VERIFY RLS POLICIES

Run this to check RLS is enabled and policies exist:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('registrations', 'services', 'news', 'hero_slides', 'site_assets');

-- Check policies on registrations
SELECT policyname, permissive, roles 
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;
```

**Expected output for registrations:**
```
policyname                              | permissive | roles
Allow authenticated delete registrations| true       | {}
Allow authenticated select registrations| true       | {}
Allow authenticated update registrations| true       | {}
Allow public insert registrations       | true       | {}
Allow public select own registration    | true       | {}
```

---

## 🎯 CHECKLIST

- [ ] All 5 tables exist in Supabase
- [ ] `registrations` table has all required columns
- [ ] `services` table has at least 4 services with prices
- [ ] `news` table exists
- [ ] `hero_slides` table exists
- [ ] `site_assets` table exists
- [ ] RLS is enabled on all tables
- [ ] RLS policies exist on `registrations` table
- [ ] Column names match exactly (no underscores in wrong places)
- [ ] No typos in table names (e.g., `registrations` not `registration`)

---

## 📞 IF SOMETHING IS WRONG

**If a table doesn't exist:**
1. Create it with proper columns (see above)
2. OR run the SQL from `supabase_tables.sql` file

**If a column name is wrong:**
1. Rename it in Supabase
2. OR update the code to match

**If a table has wrong name:**
1. Best: Rename it in Supabase to match
2. OR: Create new table with correct name and copy data

---

## 🚀 AFTER VERIFICATION

Once all tables are verified correct:
1. ✅ Run the RLS policies SQL: `REGISTRATIONS_RLS_POLICIES.sql`
2. ✅ Test registration form
3. ✅ Check admin dashboard shows data
