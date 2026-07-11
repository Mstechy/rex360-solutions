// ============================================
// UPDATE SITE ASSETS - Run this to update the images
// Usage: node update_site_assets.js
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oohabvgbrzrewwrekkfy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE';

const supabase = createClient(supabaseUrl, supabaseKey);

const newAssets = [
  {
    key: 'agent_photo',
    image_url: 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/1771164736870_agent_photo.jpg'
  },
  {
    key: 'oat_seal',
    image_url: 'https://oohabvgbrzrewwrekkfy.supabase.co/storage/v1/object/public/images/1771164332506_oat_seal.jpg'
  }
];

async function updateSiteAssets() {
  console.log('🔄 Updating site assets...\n');

  for (const asset of newAssets) {
    console.log(`📝 Updating ${asset.key}...`);
    
    const { data, error } = await supabase
      .from('site_assets')
      .update({ 
        image_url: asset.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('key', asset.key)
      .select();

    if (error) {
      console.error(`❌ Error updating ${asset.key}:`, error.message);
    } else {
      console.log(`✅ ${asset.key} updated successfully!`);
      console.log(`   New URL: ${asset.image_url}\n`);
    }
  }

  // Verify the updates
  console.log('🔍 Verifying updates...');
  const { data: assets, error: fetchError } = await supabase
    .from('site_assets')
    .select('key, image_url, updated_at')
    .in('key', ['agent_photo', 'oat_seal']);

  if (fetchError) {
    console.error('❌ Error fetching assets:', fetchError.message);
  } else {
    console.log('📊 Current site_assets:');
    console.table(assets);
  }
}

updateSiteAssets();
