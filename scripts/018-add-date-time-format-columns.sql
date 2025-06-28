-- Add date and time format columns to user_settings table
-- This script adds new columns for date/time formatting preferences

-- First, let's check if the columns already exist and add them if they don't
DO $$ 
BEGIN
    -- Add date_format column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_settings' 
        AND column_name = 'date_format'
    ) THEN
        ALTER TABLE user_settings ADD COLUMN date_format VARCHAR(20) DEFAULT 'MM/dd/yyyy';
        RAISE NOTICE 'Added date_format column';
    ELSE
        RAISE NOTICE 'date_format column already exists';
    END IF;

    -- Add time_format column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_settings' 
        AND column_name = 'time_format'
    ) THEN
        ALTER TABLE user_settings ADD COLUMN time_format VARCHAR(10) DEFAULT '12h';
        RAISE NOTICE 'Added time_format column';
    ELSE
        RAISE NOTICE 'time_format column already exists';
    END IF;
END $$;

-- Show the updated table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_settings' 
ORDER BY ordinal_position;

-- Show current settings if any exist
SELECT * FROM user_settings LIMIT 5;
