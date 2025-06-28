-- Ensure the profiles table exists and has a UUID primary key named id
-- This script assumes 'profiles.id' is UUID and is the PRIMARY KEY.

-- For the 'friends' table
-- Drop existing FKs if they exist (use actual names if different)
ALTER TABLE public.friends
    DROP CONSTRAINT IF EXISTS friends_user_id_fkey,
    DROP CONSTRAINT IF EXISTS friends_friend_id_fkey;

-- Add FKs for friends table referencing profiles.id
ALTER TABLE public.friends
    ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.profiles (id) ON DELETE CASCADE,
    ADD CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id)
    REFERENCES public.profiles (id) ON DELETE CASCADE;

-- For the 'shared_reminders' table
-- Drop existing FKs if they exist (use actual names if different)
ALTER TABLE public.shared_reminders
    DROP CONSTRAINT IF EXISTS shared_reminders_shared_by_fkey,
    DROP CONSTRAINT IF EXISTS shared_reminders_shared_with_fkey,
    DROP CONSTRAINT IF EXISTS shared_reminders_reminder_id_fkey; -- Assuming this FK is to reminders.id

-- Add FKs for shared_reminders table
ALTER TABLE public.shared_reminders
    ADD CONSTRAINT shared_reminders_shared_by_fkey FOREIGN KEY (shared_by)
    REFERENCES public.profiles (id) ON DELETE CASCADE,
    ADD CONSTRAINT shared_reminders_shared_with_fkey FOREIGN KEY (shared_with)
    REFERENCES public.profiles (id) ON DELETE CASCADE;
    -- Assuming you also have a reminders table and reminder_id should link to it:
    -- ADD CONSTRAINT shared_reminders_reminder_id_fkey FOREIGN KEY (reminder_id)
    -- REFERENCES public.reminders (id) ON DELETE CASCADE;
    -- If the reminders FK is already correctly defined and not causing issues, you can omit dropping/re-adding it.

-- After running this, it might be beneficial to refresh PostgREST's schema cache.
-- In Supabase, this can sometimes be encouraged by briefly pausing and resuming your project,
-- or by making a small, unrelated schema change via the UI (like adding a comment to a column).
-- However, often Supabase picks up changes automatically after a short delay.

COMMENT ON TABLE public.friends IS 'Re-affirmed foreign keys to profiles table on user_id and friend_id.';
COMMENT ON TABLE public.shared_reminders IS 'Re-affirmed foreign keys to profiles table on shared_by and shared_with.';
