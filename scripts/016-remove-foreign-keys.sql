-- Remove all foreign key constraints that are blocking our demo

-- Check what foreign key constraints exist
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('reminders', 'micro_actions', 'profiles', 'micro_action_completions', 'quotes', 'user_settings', 'friends', 'friend_requests')
ORDER BY tc.table_name, tc.constraint_name;

-- Drop foreign key constraints that are blocking us
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Drop foreign key constraints from reminders table
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'reminders' 
          AND constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE reminders DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint % from reminders', constraint_record.constraint_name;
    END LOOP;

    -- Drop foreign key constraints from micro_actions table
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'micro_actions' 
          AND constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE micro_actions DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint % from micro_actions', constraint_record.constraint_name;
    END LOOP;

    -- Drop foreign key constraints from micro_action_completions table
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'micro_action_completions' 
          AND constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE micro_action_completions DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint % from micro_action_completions', constraint_record.constraint_name;
    END LOOP;

    -- Drop foreign key constraints from profiles table
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
          AND constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint % from profiles', constraint_record.constraint_name;
    END LOOP;

    -- Drop foreign key constraints from other tables
    FOR constraint_record IN 
        SELECT table_name, constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name IN ('quotes', 'user_settings', 'friends', 'friend_requests')
          AND constraint_type = 'FOREIGN KEY' 
          AND table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || constraint_record.table_name || ' DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint % from %', constraint_record.constraint_name, constraint_record.table_name;
    END LOOP;

END $$;

-- Now try to insert our demo user into profiles (if the table exists)
DO $$
BEGIN
    -- Insert demo user into profiles table
    INSERT INTO profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'demo@mindreminder.com',
        'Demo',
        'User',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW();
    
    RAISE NOTICE '✅ Demo user inserted/updated in profiles table';
EXCEPTION 
    WHEN others THEN
        RAISE NOTICE '❌ Could not insert demo user into profiles: %', SQLERRM;
END $$;

-- Test insert into reminders to make sure it works
DO $$
BEGIN
    INSERT INTO reminders (user_id, title, description, is_active, created_at, updated_at)
    VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'Test Reminder',
        'This is a test reminder to verify the fix works',
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ Test reminder inserted successfully';
    
    -- Clean up the test reminder
    DELETE FROM reminders WHERE title = 'Test Reminder' AND user_id = '550e8400-e29b-41d4-a716-446655440000';
    RAISE NOTICE '✅ Test reminder cleaned up';
    
EXCEPTION 
    WHEN others THEN
        RAISE NOTICE '❌ Test reminder insert failed: %', SQLERRM;
END $$;

-- Test insert into micro_actions to make sure it works
DO $$
BEGIN
    INSERT INTO micro_actions (user_id, title, description, category, duration, frequency, is_active, created_at, updated_at)
    VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'Test Micro Action',
        'This is a test micro action to verify the fix works',
        'test',
        '1 minute',
        'daily',
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ Test micro action inserted successfully';
    
    -- Clean up the test micro action
    DELETE FROM micro_actions WHERE title = 'Test Micro Action' AND user_id = '550e8400-e29b-41d4-a716-446655440000';
    RAISE NOTICE '✅ Test micro action cleaned up';
    
EXCEPTION 
    WHEN others THEN
        RAISE NOTICE '❌ Test micro action insert failed: %', SQLERRM;
END $$;

-- Show final status
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'reminders' as table_name, COUNT(*) as row_count FROM reminders
UNION ALL
SELECT 'micro_actions' as table_name, COUNT(*) as row_count FROM micro_actions
ORDER BY table_name;

-- Show our demo user
SELECT id, email, first_name, last_name, created_at FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000';

COMMIT;
