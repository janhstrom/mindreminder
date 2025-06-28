-- Fix RLS policies to allow demo user operations

-- First, let's drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;

DROP POLICY IF EXISTS "Users can view own micro_actions" ON micro_actions;
DROP POLICY IF EXISTS "Users can insert own micro_actions" ON micro_actions;
DROP POLICY IF EXISTS "Users can update own micro_actions" ON micro_actions;
DROP POLICY IF EXISTS "Users can delete own micro_actions" ON micro_actions;

DROP POLICY IF EXISTS "Users can view own completions" ON micro_action_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON micro_action_completions;
DROP POLICY IF EXISTS "Users can update own completions" ON micro_action_completions;
DROP POLICY IF EXISTS "Users can delete own completions" ON micro_action_completions;

-- Create more permissive policies for demo purposes
-- Profiles table
CREATE POLICY "Allow all operations on profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Reminders table  
CREATE POLICY "Allow all operations on reminders" ON reminders
  FOR ALL USING (true) WITH CHECK (true);

-- Micro actions table
CREATE POLICY "Allow all operations on micro_actions" ON micro_actions
  FOR ALL USING (true) WITH CHECK (true);

-- Micro action completions table
CREATE POLICY "Allow all operations on micro_action_completions" ON micro_action_completions
  FOR ALL USING (true) WITH CHECK (true);

-- Quotes table (if it exists)
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;

CREATE POLICY "Allow all operations on quotes" ON quotes
  FOR ALL USING (true) WITH CHECK (true);

-- User settings table (if it exists)
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

CREATE POLICY "Allow all operations on user_settings" ON user_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Make sure RLS is enabled but with permissive policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_action_completions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on other tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
    ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_settings') THEN
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Insert the demo user directly to avoid RLS issues
INSERT INTO profiles (id, email, first_name, last_name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo@mindreminder.com',
  'Demo',
  'User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the demo user exists
SELECT id, email, first_name, last_name FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000';
