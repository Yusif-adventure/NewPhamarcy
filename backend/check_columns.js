const { supabase } = require('./supabaseClient');

async function checkColumns() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
    } else {
      if (data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
        console.log('Sample Data:', data[0]);
      } else {
        console.log('No orders found to check columns.');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkColumns();
