// ============================================
// CHECK STORAGE BUCKETS AND POLICIES
// Usage: node check_storage.js
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oohabvgbrzrewwrekkfy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('🔍 Checking Supabase Storage Configuration...\n');

  // Check all buckets
  console.log('📦 Checking storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase
    .from('storage.buckets')
    .select('*')
    .order('name');

  if (bucketsError) {
    console.error('❌ Error fetching buckets:', bucketsError.message);
  } else {
    console.log('✅ Buckets found:');
    console.table(buckets);
  }

  // Check site_assets table
  console.log('\n📄 Checking site_assets table...');
  const { data: assets, error: assetsError } = await supabase
    .from('site_assets')
    .select('*');

  if (assetsError) {
    console.error('❌ Error fetching assets:', assetsError.message);
  } else {
    console.log('✅ Site assets found:');
    console.table(assets);
    
    // Test each image URL
    console.log('\n🧪 Testing image URLs...');
    for (const asset of assets) {
      console.log(`\nTesting ${asset.key}:`);
      console.log(`  URL: ${asset.image_url}`);
      try {
        const response = await fetch(asset.image_url, { method: 'HEAD' });
        if (response.ok) {
          console.log(`  ✅ Status: ${response.status} - Image is accessible!`);
        } else {
          console.log(`  ❌ Status: ${response.status} - Image is NOT accessible`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
  }
}

checkStorage();
