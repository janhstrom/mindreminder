-- Explicitly set search_path for built-in auth functions
-- This is a defense-in-depth measure, ensuring these critical functions
-- operate with a known, safe search_path.
-- We use DO blocks to gracefully handle cases where a function might not exist.

DO $$
BEGIN
  ALTER FUNCTION auth.uid() SET search_path = pg_catalog, public, auth, extensions;
EXCEPTION
  WHEN undefined_function THEN
    RAISE NOTICE 'Function auth.uid() not found, skipping SET search_path.';
END;
$$;

DO $$
BEGIN
  ALTER FUNCTION auth.role() SET search_path = pg_catalog, public, auth, extensions;
EXCEPTION
  WHEN undefined_function THEN
    RAISE NOTICE 'Function auth.role() not found, skipping SET search_path.';
END;
$$;

DO $$
BEGIN
  ALTER FUNCTION auth.email() SET search_path = pg_catalog, public, auth, extensions;
EXCEPTION
  WHEN undefined_function THEN
    RAISE NOTICE 'Function auth.email() not found, skipping SET search_path.';
END;
$$;

DO $$
BEGIN
  ALTER FUNCTION auth.jwt() SET search_path = pg_catalog, public, auth, extensions;
EXCEPTION
  WHEN undefined_function THEN
    RAISE NOTICE 'Function auth.jwt() not found, skipping SET search_path.';
END;
$$;

-- Reminder: Set search_path for any custom SECURITY DEFINER functions
-- If you have created any custom functions with `SECURITY DEFINER`,
-- it is crucial to set their search_path explicitly to prevent potential misuse.
-- Example:
-- ALTER FUNCTION your_schema.your_security_definer_function(args)
--   SET search_path = your_schema, public; -- Or more restrictive

SELECT 'Attempted to harden search paths for common auth functions.';
