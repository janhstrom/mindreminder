-- Set a secure search_path for functions to mitigate CVE-2018-1058 risk
-- and resolve "function_search_path_mutable" warnings.

-- List of functions identified from the warnings:
-- public.are_friends
-- public.create_reciprocal_friendship
-- public.handle_new_user
-- public.handle_updated_at
-- public.update_analytics_daily_summary
-- public.update_updated_at_column
-- public.get_mutual_friends
-- public.get_user_stats
-- public.send_friend_request_notification
-- public.update_micro_action_streak

-- It's good practice to set search_path for all user-defined functions.
-- The standard secure search_path is usually 'public', or 'pg_catalog', 'public'.
-- If you use extensions in other schemas, add them explicitly.

ALTER FUNCTION public.are_friends(uuid, uuid) SET search_path = pg_catalog, public;
ALTER FUNCTION public.create_reciprocal_friendship() SET search_path = pg_catalog, public;
ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public;
-- handle_updated_at seems to be a trigger function template, often created by ORMs or extensions.
-- If it's a generic trigger function, ensure its definition is secure or it's from a trusted source.
-- If it's your custom function:
-- ALTER FUNCTION public.handle_updated_at() SET search_path = pg_catalog, public;
-- update_updated_at_column is likely similar.
-- ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public;

-- For functions that might not have standard signatures or are overloaded,
-- you might need to specify parameter types if ALTER FUNCTION complains.
-- Example: ALTER FUNCTION public.my_func(integer, text) SET search_path = ...;

-- Assuming standard or no parameters for the rest for now.
-- If these fail due to signature issues, you'll need to add parameter types.
ALTER FUNCTION public.update_analytics_daily_summary() SET search_path = pg_catalog, public;
ALTER FUNCTION public.get_mutual_friends(p_user_id uuid) SET search_path = pg_catalog, public;
ALTER FUNCTION public.get_user_stats(p_user_id uuid) SET search_path = pg_catalog, public;
ALTER FUNCTION public.send_friend_request_notification() SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_micro_action_streak() SET search_path = pg_catalog, public;

-- The functions handle_updated_at and update_updated_at_column are often
-- created by extensions or are generic. If they are standard trigger functions
-- that simply call `NEW.updated_at = now()`, they might not need a search_path alteration,
-- or it might be handled by the extension that created them.
-- However, if they are custom, it's good to set it.
-- Let's try to alter them assuming they take no arguments for the ALTER command.
-- If they are trigger functions, their definition might be more complex.

DO $$
BEGIN
    -- Attempt to alter handle_updated_at if it exists and is a function
    IF EXISTS (
        SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'handle_updated_at'
    ) THEN
        BEGIN
            ALTER FUNCTION public.handle_updated_at() SET search_path = pg_catalog, public;
            RAISE NOTICE 'Set search_path for public.handle_updated_at()';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not set search_path for public.handle_updated_at() without arguments. Manual check for signature needed. SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
        END;
    END IF;

    -- Attempt to alter update_updated_at_column if it exists and is a function
    IF EXISTS (
        SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column'
    ) THEN
        BEGIN
            ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public;
            RAISE NOTICE 'Set search_path for public.update_updated_at_column()';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not set search_path for public.update_updated_at_column() without arguments. Manual check for signature needed. SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
        END;
    END IF;
END $$;

SELECT
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) as function_args,
    proconfig
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
        'send_friend_request_notification',
        'update_micro_action_streak'
    )
ORDER BY
    schema_name, function_name;
