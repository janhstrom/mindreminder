DO $$
DECLARE
  demo_user_profile_id UUID;
BEGIN
  -- Attempt to find the user ID for the demo email from the profiles table
  SELECT id INTO demo_user_profile_id FROM public.profiles WHERE email = 'demo@mindreminder.com' LIMIT 1;

  -- If a profile with the demo email is found:
  IF demo_user_profile_id IS NOT NULL THEN
    RAISE NOTICE 'Found profile for demo@mindreminder.com with ID: %', demo_user_profile_id;

    -- Ensure its details (first_name, last_name, bio) are correct
    UPDATE public.profiles
    SET
      first_name = 'Demo',
      last_name = 'User',
      bio = 'Building better habits one micro-action at a time!'
    WHERE id = demo_user_profile_id;
    RAISE NOTICE 'Updated profile details for ID: %', demo_user_profile_id;

    -- Insert default settings for this demo user ID, doing nothing if settings already exist
    INSERT INTO public.user_settings (
      user_id, push_enabled, email_enabled, sound_enabled, vibration_enabled,
      quiet_hours, quiet_start, quiet_end, timezone, theme, language,
      reminder_style, default_reminder_time, week_starts_on, date_format, time_format
    ) VALUES (
      demo_user_profile_id, true, false, true, true,
      false, '22:00', '08:00', 'America/New_York', 'system', 'en',
      'gentle', '09:00', 'monday', 'MM/dd/yyyy', '12h'
    ) ON CONFLICT (user_id) DO NOTHING;

    IF FOUND THEN
      RAISE NOTICE 'Inserted default settings for user ID: %', demo_user_profile_id;
    ELSE
      RAISE NOTICE 'Settings already existed for user ID: % (ON CONFLICT DO NOTHING)', demo_user_profile_id;
    END IF;

  ELSE
    -- This case implies that no profile exists for 'demo@mindreminder.com'.
    -- This might happen if the auth user exists but the trigger to create the profile failed,
    -- or if the auth user itself doesn't exist.
    -- For this script, we'll assume the auth user and profile should exist.
    RAISE WARNING 'Profile for demo@mindreminder.com not found in public.profiles. Cannot insert settings or update profile.';
    RAISE WARNING 'Please ensure the user demo@mindreminder.com exists in auth.users and that the trigger to create a profile has run successfully.';
  END IF;
END $$;
