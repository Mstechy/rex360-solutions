const { supabase } = require('./src/SupabaseClient.js');

async function testConnection() {
  console.log('Testing services table...');
  const { data, error } = await supabase.from('services').select('*');
  console.log('Services data:', data);
  console.log('Services error:', error);

  console.log('Testing registrations table...');
  const { data: regData, error: regError } = await supabase.from('registrations').select('count').limit(1);
  console.log('Registrations data:', regData);
  console.log('Registrations error:', regError);
}

testConnection();
