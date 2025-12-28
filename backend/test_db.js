const { supabase } = require('./supabaseClient');

async function testConnection() {
  console.log('Testing connection to orders table...');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Error connecting to orders table:', error);
    } else {
      console.log('Successfully connected to orders table. Count:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
