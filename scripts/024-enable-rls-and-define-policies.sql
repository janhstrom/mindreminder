-- Enable Row Level Security on tables where policies exist but RLS is disabled,
-- and add policies for tables missing them.

-- For tables where policies are reported to exist but RLS is disabled:
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_action_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- For user_settings table:
-- Ensure RLS is enabled
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to redefine them cleanly for user_settings
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
  ON public.user_settings FOR DELETE
  USING (auth.uid() = user_id);

-- For user_events table (if it exists and has a user_id column)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_events') THEN
    ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to redefine them cleanly for user_events
    DROP POLICY IF EXISTS "Users can manage their own events" ON public.user_events;
    DROP POLICY IF EXISTS "Users can view their own events" ON public.user_events;
    DROP POLICY IF EXISTS "Users can insert their own events" ON public.user_events;
    DROP POLICY IF EXISTS "Users can update their own events" ON public.user_events;
    DROP POLICY IF EXISTS "Users can delete their own events" ON public.user_events;

    -- Check if user_id column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_events' AND column_name = 'user_id') THEN
      CREATE POLICY "Users can view their own events"
        ON public.user_events FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own events"
        ON public.user_events FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own events"
        ON public.user_events FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own events"
        ON public.user_events FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
  END IF;
END $$;

-- Ensure profiles table has RLS enabled and correct policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Re-affirm profiles policies (from 019-complete-auth-setup.sql)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMIT;

-- Final check for RLS status using pg_class
SELECT
    n.nspname as table_schema,
    c.relname as table_name,
    c.relrowsecurity as rls_enabled -- This will be true if RLS is enabled, false otherwise
FROM
    pg_catalog.pg_class c
JOIN
    pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE
    n.nspname = 'public' AND
    c.relkind = 'r' AND -- 'r' for ordinary table
    c.relname IN ('friends', 'micro_action_completions', 'micro_actions', 'quotes', 'reminders', 'user_settings', 'user_events', 'profiles')
ORDER BY
    n.nspname, c.relname;
