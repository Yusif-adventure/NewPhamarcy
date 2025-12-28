const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all pharmacies
router.get('/', async (req, res) => {
  try {
    const { data: pharmacies, error } = await supabase
      .from('pharmacies')
      .select('id, name, phone, latitude, longitude, address');

    if (error) throw error;

    res.json(pharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
