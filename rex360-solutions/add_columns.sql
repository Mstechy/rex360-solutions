ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS business_nature TEXT,
ADD COLUMN IF NOT EXISTS business_category TEXT;

UPDATE registrations
SET
  business_nature = full_details->>'business_nature',
  business_category = full_details->>'business_category'
WHERE full_details IS NOT NULL;
