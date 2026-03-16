const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oohabvgbrzrewwrekkfy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE';

console.log('🔌 Testing Supabase Connection...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test services table
    console.log('📊 Testing services table...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(3);
    
    console.log('Services:', services ? `${services.length} records` : 'none');
    if (servicesError) console.error('Services error:', servicesError.message);

    // Test registrations table
    console.log('📋 Testing registrations table...');
    const { data: regs, error: regsError, count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    console.log('Registrations:', count || 0, 'total records');
    if (regsError) console.error('Registrations error:', regsError.message);

    console.log('✅ Test complete!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();
