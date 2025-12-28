const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Update User Location
router.post('/update-location', async (req, res) => {
  const { role, phone, lat, lng } = req.body;
  
  console.log('Received update-location request:', { role, phone, lat, lng });

  if (!role || !phone || lat === undefined || lng === undefined) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const table = role === 'pharmacy' ? 'pharmacies' : 'riders';

    const { data, error } = await supabase
      .from(table)
      .update({ latitude: lat, longitude: lng })
      .eq('phone', phone)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    if (data.length === 0) {
      console.log('No user found with that phone number to update.');
    } else {
      console.log('Location updated successfully:', data);
    }

    res.json({ message: 'Location updated successfully', data });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
