-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Notification settings
    push_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT false,
    sound_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    quiet_hours BOOLEAN DEFAULT false,
    quiet_start TIME DEFAULT '22:00',
    quiet_end TIME DEFAULT '08:00',
    
    -- Profile settings
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Preference settings
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    reminder_style TEXT DEFAULT 'gentle',
    default_reminder_time TIME DEFAULT '09:00',
    week_starts_on TEXT DEFAULT 'monday',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own settings
CREATE POLICY "Users can update own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Add bio column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_settings
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
