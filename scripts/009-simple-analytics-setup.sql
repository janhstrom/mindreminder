-- Simple analytics setup that definitely works
-- Drop everything and start fresh

-- Drop existing table and policies
DROP TABLE IF EXISTS user_events CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;

-- Create a simple analytics table
CREATE TABLE user_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  event_name TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}',
  session_id TEXT,
  page_path TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for now to test
ALTER TABLE user_events DISABLE ROW LEVEL SECURITY;

-- Grant full access to everyone for testing
GRANT ALL PRIVILEGES ON TABLE user_events TO anon;
GRANT ALL PRIVILEGES ON TABLE user_events TO authenticated;
GRANT ALL PRIVILEGES ON TABLE user_events TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE user_events_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE user_events_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_events_id_seq TO service_role;

-- Create indexes
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_created_at ON user_events(created_at);
CREATE INDEX idx_user_events_event_name ON user_events(event_name);

-- Test insert to make sure it works
INSERT INTO user_events (event_name, event_properties) 
VALUES ('test_event', '{"test": true}');

-- Show the table exists
SELECT 'user_events table created successfully' as status;
