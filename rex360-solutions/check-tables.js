const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oohabvgbrzrewwrekkfy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE'
);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  // Check posts table
  try {
    const { data, error } = await supabase.from('posts').select('*').limit(1);
    if (error) {
      console.log('❌ posts table: DOES NOT EXIST');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ posts table: EXISTS');
      console.log('   Records:', data.length);
    }
  } catch (err) {
    console.log('❌ posts table: ERROR -', err.message);
  }

  // Check slides table
  try {
    const { data, error } = await supabase.from('slides').select('*').limit(1);
    if (error) {
      console.log('❌ slides table: DOES NOT EXIST');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ slides table: EXISTS');
      console.log('   Records:', data.length);
    }
  } catch (err) {
    console.log('❌ slides table: ERROR -', err.message);
  }

  // Check services table
  try {
    const { data, error } = await supabase.from('services').select('*').limit(1);
    if (error) {
      console.log('❌ services table: DOES NOT EXIST');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ services table: EXISTS');
      console.log('   Records:', data.length);
    }
  } catch (err) {
    console.log('❌ services table: ERROR -', err.message);
  }

  console.log('\n✨ Check complete!');
}

checkTables();
