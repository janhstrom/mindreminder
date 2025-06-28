-- Ensure user_settings table exists and is properly configured
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    
    -- Notification settings
    push_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT false,
    sound_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    quiet_hours BOOLEAN DEFAULT false,
    quiet_start TEXT DEFAULT '22:00',
    quiet_end TEXT DEFAULT '08:00',
    
    -- Profile settings
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Preference settings
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    reminder_style TEXT DEFAULT 'gentle',
    default_reminder_time TEXT DEFAULT '09:00',
    week_starts_on TEXT DEFAULT 'monday',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure profiles table has the bio column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Insert default settings for our demo user
INSERT INTO user_settings (user_id) 
VALUES ('550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (user_id) DO NOTHING;

-- Show current settings
SELECT 'Current user_settings:' as info;
SELECT * FROM user_settings WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

SELECT 'Current profiles:' as info;
SELECT * FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000';
