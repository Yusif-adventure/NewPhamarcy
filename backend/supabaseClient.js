const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase project details
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };