import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oohabvgbrzrewwrekkfy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE';
const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

if (!paystackSecret) {
  console.error('❌ ERROR: PAYSTACK_SECRET_KEY is not set in environment variables.');
  console.error('   Please set it before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPaystackTransaction(reference) {
  console.log(`\n🔍 Verifying Paystack reference: ${reference}`);
  
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`   ❌ Paystack API error:`, data);
      return { verified: false, error: data };
    }

    if (!data?.data) {
      console.error(`   ❌ No transaction data returned`);
      return { verified: false, error: 'No data' };
    }

    const txn = data.data;
    console.log(`   ✅ Transaction found:`);
    console.log(`      Status: ${txn.status}`);
    console.log(`      Amount: ₦${(txn.amount / 100).toLocaleString()}`);
    console.log(`      Email: ${txn.customer?.email || 'N/A'}`);
    console.log(`      Paid at: ${txn.paid_at || 'N/A'}`);
    console.log(`      Reference: ${txn.reference}`);

    if (txn.status === 'success') {
      console.log(`   ✅ Payment is REAL and VERIFIED on Paystack`);
      return { verified: true, transaction: txn };
    } else {
      console.log(`   ⚠️  Payment status is "${txn.status}" (not success)`);
      return { verified: false, error: `Status is ${txn.status}` };
    }
  } catch (error) {
    console.error(`   💥 Error verifying on Paystack:`, error.message);
    return { verified: false, error: error.message };
  }
}

async function fetchAndVerifyRegistrations() {
  console.log('📦 Fetching paid registrations from database...\n');

  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('id, paystack_ref, payment_status, surname, firstname, email, amount, created_at')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching registrations:', error);
      return;
    }

    if (!registrations || registrations.length === 0) {
      console.log('⚠️  No paid registrations found in database.');
      return;
    }

    console.log(`Found ${registrations.length} paid registration(s):\n`);

    for (const reg of registrations) {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID: ${reg.id}`);
      console.log(`Name: ${reg.surname} ${reg.firstname}`);
      console.log(`Email: ${reg.email}`);
      console.log(`Amount: ₦${(reg.amount || 0).toLocaleString()}`);
      console.log(`Created: ${new Date(reg.created_at).toLocaleString()}`);
      console.log(`Paystack Ref: ${reg.paystack_ref}`);

      if (!reg.paystack_ref) {
        console.log(`⚠️  No Paystack reference - cannot verify`);
        continue;
      }

      const result = await verifyPaystackTransaction(reg.paystack_ref);
      
      if (!result.verified) {
        console.log(`\n   🚨 WARNING: This payment could not be verified!`);
        console.log(`   Error: ${result.error}`);
        console.log(`   Consider manually reviewing this transaction.`);
      }
    }

    console.log(`\n${'━'.repeat(40)}\n✅ Verification complete!\n`);

  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run
console.log('🔐 Old Payment Verification Tool');
console.log('══════════════════════════════════\n');
console.log(`Using Supabase: ${supabaseUrl}`);
console.log(`Paystack Secret Key: ${paystackSecret.substring(0, 10)}...`);
console.log('\n🚀 Starting verification...');

fetchAndVerifyRegistrations();
