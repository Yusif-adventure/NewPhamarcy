const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Signup
router.post('/signup', async (req, res) => {
  const { role, name, phone, password, vehicleType } = req.body;

  if (!phone || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Determine table based on role
    const table = role === 'pharmacy' ? 'pharmacies' : 'riders';
    
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const newUser = {
      name,
      phone,
      password, // Note: In production, password should be hashed
      ...(role === 'rider' && { vehicle_type: vehicleType }),
      created_at: new Date()
    };

    const { data, error: insertError } = await supabase
      .from(table)
      .insert(newUser)
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Signup successful', data });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { role, phone, password } = req.body;

  if (!phone || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const table = role === 'pharmacy' ? 'pharmacies' : 'riders';

    const { data: user, error } = await supabase
      .from(table)
      .select('*')
      .eq('phone', phone)
      .eq('password', password) // Note: In production, compare hashed password
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', data: user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
