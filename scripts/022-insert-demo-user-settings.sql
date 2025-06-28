-- Insert default settings for the demo user
-- The demo user ID is the one used in UserService.ensureDemoUser()

INSERT INTO user_settings (
  user_id,
  push_enabled,
  email_enabled,
  sound_enabled,
  vibration_enabled,
  quiet_hours,
  quiet_start,
  quiet_end,
  timezone,
  theme,
  language,
  reminder_style,
  default_reminder_time,
  week_starts_on,
  date_format,
  time_format
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  true,                                    -- push_enabled
  false,                                   -- email_enabled  
  true,                                    -- sound_enabled
  true,                                    -- vibration_enabled
  false,                                   -- quiet_hours
  '22:00',                                 -- quiet_start
  '08:00',                                 -- quiet_end
  'America/New_York',                      -- timezone
  'system',                                -- theme
  'en',                                    -- language
  'gentle',                                -- reminder_style
  '09:00',                                 -- default_reminder_time
  'monday',                                -- week_starts_on
  'MM/dd/yyyy',                            -- date_format
  '12h'                                    -- time_format
) ON CONFLICT (user_id) DO NOTHING; -- Don't overwrite if settings already exist

-- Also ensure the demo user has a profile record
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  bio
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@mindreminder.com',
  'Demo',
  'User',
  'Building better habits one micro-action at a time!'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio;
