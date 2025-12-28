const express = require('express');
const { supabase } = require('../supabaseClient');
const router = express.Router();

// Sign-In Endpoint
router.post('/', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingCustomer) {
      // Return existing customer
      return res.status(200).json(existingCustomer);
    }

    // Create new customer
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({ phone, name })
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error signing in customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;