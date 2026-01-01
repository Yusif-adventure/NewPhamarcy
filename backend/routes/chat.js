const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Send a message
router.post('/send', async (req, res) => {
  const { senderPhone, receiverPhone, content, image } = req.body;

  if (!senderPhone || !receiverPhone) {
    return res.status(400).json({ error: 'Missing sender or receiver phone' });
  }

  if (!content && !image) {
    return res.status(400).json({ error: 'Message must have content or image' });
  }

  try {
    const newMessage = {
      sender_phone: senderPhone,
      receiver_phone: receiverPhone,
      content: content || '',
      image_url: image || null, // Storing base64 string directly for now (or URL if provided)
      is_read: false
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get conversation between two users
router.get('/conversation/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_phone.eq.${user1},receiver_phone.eq.${user2}),and(sender_phone.eq.${user2},receiver_phone.eq.${user1})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get list of chats for a user (e.g., for Pharmacy to see all customers who messaged)
router.get('/list/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    // This is a bit complex in Supabase/SQL without a dedicated "conversations" table.
    // We fetch all messages involving the user, then group by the other party in JS.
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_phone.eq.${phone},receiver_phone.eq.${phone}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by the "other" person
    const conversations = {};
    data.forEach(msg => {
      const otherPhone = msg.sender_phone === phone ? msg.receiver_phone : msg.sender_phone;
      if (!conversations[otherPhone]) {
        conversations[otherPhone] = {
          phone: otherPhone,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      if (msg.receiver_phone === phone && !msg.is_read) {
        conversations[otherPhone].unreadCount++;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error('Error fetching chat list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark messages as read
router.post('/read', async (req, res) => {
  const { senderPhone, receiverPhone } = req.body;

  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_phone', senderPhone)
      .eq('receiver_phone', receiverPhone);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
