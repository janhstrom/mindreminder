-- Simple fix: Just disable RLS and work with existing structure

-- First, let's see what we're working with
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'reminders', 'micro_actions')
ORDER BY table_name;

-- Check the profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Simply disable RLS on all our tables for demo purposes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE micro_actions DISABLE ROW LEVEL SECURITY;

-- Also disable for other tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'micro_action_completions' AND table_schema = 'public') THEN
    ALTER TABLE micro_action_completions DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes' AND table_schema = 'public') THEN
    ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_settings' AND table_schema = 'public') THEN
    ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'friends' AND table_schema = 'public') THEN
    ALTER TABLE friends DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'friend_requests' AND table_schema = 'public') THEN
    ALTER TABLE friend_requests DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all operations on reminders" ON reminders;
DROP POLICY IF EXISTS "Allow all operations on micro_actions" ON micro_actions;
DROP POLICY IF EXISTS "Enable all operations for demo" ON profiles;
DROP POLICY IF EXISTS "Enable all operations for demo" ON reminders;
DROP POLICY IF EXISTS "Enable all operations for demo" ON micro_actions;

-- Try to insert a demo user directly (ignore if it fails due to constraints)
DO $$
BEGIN
  -- Try to insert with a specific UUID that we'll use in the app
  INSERT INTO profiles (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'demo@mindreminder.com',
    'Demo',
    'User',
    NOW(),
    NOW()
  );
  RAISE NOTICE 'Demo user created successfully';
EXCEPTION 
  WHEN others THEN
    RAISE NOTICE 'Demo user creation failed (might already exist or have constraints): %', SQLERRM;
END $$;

-- Show what we have in profiles table
SELECT id, email, first_name, last_name FROM profiles LIMIT 5;

COMMIT;
