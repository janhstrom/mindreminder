DO $$
DECLARE
    func_oid oid;
    func_args TEXT;
BEGIN
    -- For public.get_mutual_friends
    BEGIN
        SELECT p.oid, pg_get_function_identity_arguments(p.oid) INTO func_oid, func_args
        FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'get_mutual_friends'
        LIMIT 1; -- In case of overloading, pick one. Ideally, identify by args.

        IF func_oid IS NOT NULL THEN
            RAISE NOTICE 'Altering public.get_mutual_friends(%)', func_args;
            EXECUTE format('ALTER FUNCTION public.get_mutual_friends(%s) SET search_path = pg_catalog, public;', func_args);
        ELSE
            RAISE WARNING 'Function public.get_mutual_friends not found. Skipping.';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error altering public.get_mutual_friends: %', SQLERRM;
    END;

    -- For public.get_user_stats
    BEGIN
        SELECT p.oid, pg_get_function_identity_arguments(p.oid) INTO func_oid, func_args
        FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'get_user_stats'
        LIMIT 1;

        IF func_oid IS NOT NULL THEN
            RAISE NOTICE 'Altering public.get_user_stats(%)', func_args;
            EXECUTE format('ALTER FUNCTION public.get_user_stats(%s) SET search_path = pg_catalog, public;', func_args);
        ELSE
            RAISE WARNING 'Function public.get_user_stats not found. Skipping.';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error altering public.get_user_stats: %', SQLERRM;
    END;

    -- For public.update_micro_action_streak
    BEGIN
        SELECT p.oid, pg_get_function_identity_arguments(p.oid) INTO func_oid, func_args
        FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'update_micro_action_streak'
        LIMIT 1;

        IF func_oid IS NOT NULL THEN
            RAISE NOTICE 'Altering public.update_micro_action_streak(%)', func_args;
            EXECUTE format('ALTER FUNCTION public.update_micro_action_streak(%s) SET search_path = pg_catalog, public;', func_args);
        ELSE
            RAISE WARNING 'Function public.update_micro_action_streak not found. Skipping.';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error altering public.update_micro_action_streak: %', SQLERRM;
    END;

END $$;

-- Verify the proconfig for these specific functions
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
        'get_mutual_friends',
        'get_user_stats',
        'update_micro_action_streak'
    )
ORDER BY
    schema_name, function_name;
