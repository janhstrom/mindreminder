-- Set a secure search_path for functions to mitigate CVE-2018-1058 risk
-- and resolve "function_search_path_mutable" warnings.

-- Functions identified from warnings (excluding update_micro_action_streak as it was reported missing):
-- public.are_friends
-- public.create_reciprocal_friendship
-- public.handle_new_user
-- public.handle_updated_at
-- public.update_analytics_daily_summary
-- public.update_updated_at_column
-- public.get_mutual_friends
-- public.get_user_stats
-- public.send_friend_request_notification

DO $$
DECLARE
    func_record RECORD;
    alter_stmt TEXT;
BEGIN
    -- Attempt to alter functions if they exist.
    -- This is a more dynamic approach to avoid errors if a function doesn't exist
    -- or if its signature is not parameterless.

    -- are_friends(uuid, uuid)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'are_friends' AND pg_get_function_identity_arguments(p.oid) = 'user1_id uuid, user2_id uuid') THEN
        ALTER FUNCTION public.are_friends(user1_id uuid, user2_id uuid) SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.are_friends(uuid, uuid)';
    ELSE
        RAISE WARNING 'Function public.are_friends(uuid, uuid) not found or signature mismatch. Skipping.';
    END IF;

    -- create_reciprocal_friendship()
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'create_reciprocal_friendship' AND pg_get_function_identity_arguments(p.oid) = '') THEN
        ALTER FUNCTION public.create_reciprocal_friendship() SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.create_reciprocal_friendship()';
    ELSE
        RAISE WARNING 'Function public.create_reciprocal_friendship() not found or signature mismatch. Skipping.';
    END IF;

    -- handle_new_user()
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'handle_new_user' AND pg_get_function_identity_arguments(p.oid) = '') THEN
        ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.handle_new_user()';
    ELSE
        RAISE WARNING 'Function public.handle_new_user() not found or signature mismatch. Skipping.';
    END IF;

    -- update_analytics_daily_summary()
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'update_analytics_daily_summary' AND pg_get_function_identity_arguments(p.oid) = '') THEN
        ALTER FUNCTION public.update_analytics_daily_summary() SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.update_analytics_daily_summary()';
    ELSE
        RAISE WARNING 'Function public.update_analytics_daily_summary() not found or signature mismatch. Skipping.';
    END IF;

    -- get_mutual_friends(uuid)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_mutual_friends' AND pg_get_function_identity_arguments(p.oid) = 'p_user_id uuid') THEN
        ALTER FUNCTION public.get_mutual_friends(p_user_id uuid) SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.get_mutual_friends(uuid)';
    ELSE
        RAISE WARNING 'Function public.get_mutual_friends(uuid) not found or signature mismatch. Skipping.';
    END IF;

    -- get_user_stats(uuid)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_user_stats' AND pg_get_function_identity_arguments(p.oid) = 'p_user_id uuid') THEN
        ALTER FUNCTION public.get_user_stats(p_user_id uuid) SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.get_user_stats(uuid)';
    ELSE
        RAISE WARNING 'Function public.get_user_stats(uuid) not found or signature mismatch. Skipping.';
    END IF;

    -- send_friend_request_notification()
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'send_friend_request_notification' AND pg_get_function_identity_arguments(p.oid) = '') THEN
        ALTER FUNCTION public.send_friend_request_notification() SET search_path = pg_catalog, public;
        RAISE NOTICE 'Set search_path for public.send_friend_request_notification()';
    ELSE
        RAISE WARNING 'Function public.send_friend_request_notification() not found or signature mismatch. Skipping.';
    END IF;

    -- Handle handle_updated_at and update_updated_at_column (often trigger functions without explicit args in ALTER)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'handle_updated_at') THEN
        BEGIN
            ALTER FUNCTION public.handle_updated_at() SET search_path = pg_catalog, public;
            RAISE NOTICE 'Set search_path for public.handle_updated_at()';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not set search_path for public.handle_updated_at() (may need specific signature). SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Function public.handle_updated_at() not found. Skipping.';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column') THEN
        BEGIN
            ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public;
            RAISE NOTICE 'Set search_path for public.update_updated_at_column()';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not set search_path for public.update_updated_at_column() (may need specific signature). SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Function public.update_updated_at_column() not found. Skipping.';
    END IF;

END $$;

-- Verify the proconfig for the functions
SELECT
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) as function_args,
    p.proconfig -- This array contains settings like search_path
FROM
    pg_proc p
JOIN
    pg_namespace n ON p.pronamespace = n.oid
WHERE
    n.nspname = 'public' AND
    p.proname IN (
        'are_friends',
        'create_reciprocal_friendship',
        'handle_new_user',
        'handle_updated_at',
        'update_analytics_daily_summary',
        'update_updated_at_column',
        'get_mutual_friends',
        'get_user_stats',
        'send_friend_request_notification'
        -- 'update_micro_action_streak' -- Removed
    )
ORDER BY
    schema_name, function_name;
