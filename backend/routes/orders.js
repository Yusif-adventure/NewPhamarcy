const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Create new order
router.post('/create', async (req, res) => {
  const { customerPhone, pharmacyPhone, amount } = req.body;

  if (!customerPhone || !pharmacyPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newOrder = {
      customer_phone: customerPhone, 
      pharmacy_phone: pharmacyPhone,
      status: amount ? 'payment-pending' : 'new',
      ...(amount && { amount: parseFloat(amount) })
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get orders for a pharmacy
router.get('/pharmacy/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('pharmacy_phone', phone)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching pharmacy orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active order for a customer
router.get('/customer/:phone/active', async (req, res) => {
  const { phone } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      // .neq('status', 'delivered') // Removed to allow customer to see delivered status
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

    res.json(data || null);
  } catch (error) {
    console.error('Error fetching customer active order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order cost (Pharmacy enters amount)
router.post('/update-cost', async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ amount, status: 'payment-pending' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating order cost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm payment (Customer pays)
router.post('/confirm-payment', async (req, res) => {
  const { orderId } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'payment-received' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available orders for riders
router.get('/available', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'ready')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching available orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request rider (Pharmacy requests)
router.post('/request-rider', async (req, res) => {
  const { orderId } = req.body;
  console.log('Requesting rider for order:', orderId);

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'ready' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error requesting rider:', error);
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error requesting rider:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Accept delivery (Rider accepts)
router.post('/accept-delivery', async (req, res) => {
  const { orderId, riderName, riderPhone } = req.body;

  try {
    // First check if order is still available
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;

    if (order.status !== 'ready') {
      return res.status(400).json({ error: 'Order is no longer available' });
    }

    // Update order with rider info
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: 'out-for-delivery', 
        rider_name: riderName,
        rider_phone: riderPhone
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error accepting delivery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get delivery history for a rider
router.get('/rider/:phone/history', async (req, res) => {
  const { phone } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('rider_phone', phone)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching rider history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order history for a customer
router.get('/customer/:phone/history', async (req, res) => {
  const { phone } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching customer history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete delivery (Rider completes)
router.post('/complete-delivery', async (req, res) => {
  const { orderId } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error completing delivery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request delivery fee (Rider requests)
router.post('/request-delivery-fee', async (req, res) => {
  const { orderId } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'delivery-fee-requested' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error requesting delivery fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm delivery fee (Customer confirms)
router.post('/confirm-delivery-fee', async (req, res) => {
  const { orderId } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'delivery-fee-paid' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error confirming delivery fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
