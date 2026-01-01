-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_phone TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_phone, receiver_phone);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
