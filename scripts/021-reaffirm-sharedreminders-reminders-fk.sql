-- This script assumes your 'reminders' table has a PRIMARY KEY column named 'id' of type UUID.
-- And your 'shared_reminders' table has a column named 'reminder_id' of type UUID.

-- For the 'shared_reminders' table, focusing on the link to 'reminders'
-- Drop existing FK if it exists (use actual name if different, or if it was created without a specific name)
ALTER TABLE public.shared_reminders
    DROP CONSTRAINT IF EXISTS shared_reminders_reminder_id_fkey;

-- Add the FK for shared_reminders.reminder_id referencing reminders.id
ALTER TABLE public.shared_reminders
    ADD CONSTRAINT shared_reminders_reminder_id_fkey FOREIGN KEY (reminder_id)
    REFERENCES public.reminders (id) ON DELETE CASCADE;

COMMENT ON TABLE public.shared_reminders IS 'Re-affirmed foreign key from reminder_id to reminders.id.';
