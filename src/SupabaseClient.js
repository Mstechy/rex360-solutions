import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oohabvgbrzrewwrekkfy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Testing Supabase connection...');
    console.log('📍 URL:', supabaseUrl);
    
    // Test 1: Check auth status
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', session ? 'exists' : 'none');
    
    // Test 2: Try to select from registrations (simple query, no count)
    const { data, error, status } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    console.log('📊 Query status:', status);
    console.log('📈 Registrations table accessible:', data ? 'YES ✅' : 'EMPTY');
    
    if (error) {
      console.error('❌ Query error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      return false;
    }
    
    // Test 3: Try a simple insert with test data
    console.log('📝 Testing INSERT...');
    const testData = {
      service_type: 'TEST',
      surname: 'Test',
      firstname: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      amount: 0,
      paystack_ref: 'TEST_' + Date.now(),
      full_details: { test: true }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('registrations')
      .insert([testData]);
    
    if (insertError) {
      console.error('❌ INSERT failed:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      console.error('Error hint:', insertError.hint);
      console.error('Error details:', insertError.details);
      return false;
    }
    
    console.log('✅ INSERT successful:', insertData);
    console.log('✅ Supabase connection WORKING!');
    return true;
  } catch (err) {
    console.error('❌ Connection test error:', err);
    return false;
  }
};