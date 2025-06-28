-- Fix analytics tables and permissions
-- This script fixes the table name mismatch and sets up proper RLS

-- Drop the incorrectly named table if it exists
DROP TABLE IF EXISTS analytics_events;

-- Ensure user_events table exists with correct structure
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}',
  session_id TEXT,
  page_path TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own events" ON user_events;
DROP POLICY IF EXISTS "Users can view their own events" ON user_events;
DROP POLICY IF EXISTS "Allow anonymous event tracking" ON user_events;

-- Create policies for authenticated users
CREATE POLICY "Users can insert their own events" ON user_events
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can view their own events" ON user_events
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Allow anonymous event tracking (for non-logged-in users)
CREATE POLICY "Allow anonymous event tracking" ON user_events
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_event_name ON user_events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);

-- Grant necessary permissions
GRANT ALL ON user_events TO authenticated;
GRANT ALL ON user_events TO anon;
