-- Migration script to add missing tables and columns safely
-- This script checks for existing tables before creating them

-- Create reminders table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reminders') THEN
        CREATE TABLE public.reminders (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            image TEXT,
            scheduled_time TIMESTAMP WITH TIME ZONE,
            location TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS for reminders
        ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for reminders
        CREATE POLICY "Users can view own reminders" ON public.reminders
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own reminders" ON public.reminders
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own reminders" ON public.reminders
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete own reminders" ON public.reminders
            FOR DELETE USING (auth.uid() = user_id);
            
        -- Add updated_at trigger for reminders
        CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.reminders
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
            
        RAISE NOTICE 'Created reminders table with policies and triggers';
    ELSE
        RAISE NOTICE 'Reminders table already exists, skipping creation';
    END IF;
END $$;

-- Create quotes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
        CREATE TABLE public.quotes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            content TEXT NOT NULL,
            topic TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS for quotes
        ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for quotes
        CREATE POLICY "Users can view own quotes" ON public.quotes
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own quotes" ON public.quotes
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Created quotes table with policies';
    ELSE
        RAISE NOTICE 'Quotes table already exists, skipping creation';
    END IF;
END $$;

-- Create or replace the updated_at trigger function (in case it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'handle_updated_at' 
        AND event_object_table = 'profiles'
    ) THEN
        CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        RAISE NOTICE 'Added updated_at trigger to profiles table';
    ELSE
        RAISE NOTICE 'Updated_at trigger already exists on profiles table';
    END IF;
END $$;

-- Ensure the handle_new_user function exists and is up to date
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger for new user creation exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        RAISE NOTICE 'Created trigger for new user creation';
    ELSE
        RAISE NOTICE 'New user creation trigger already exists';
    END IF;
END $$;

-- Add any missing columns to existing tables
DO $$
BEGIN
    -- Check if updated_at column exists in profiles table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to profiles table';
    ELSE
        RAISE NOTICE 'Updated_at column already exists in profiles table';
    END IF;
END $$;

-- Final verification - show what tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'reminders', 'quotes');
    
    RAISE NOTICE 'Migration complete. Found % tables in public schema', table_count;
    
    -- List the tables
    FOR table_count IN 
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'reminders', 'quotes')
    LOOP
        RAISE NOTICE 'Table exists: %', 
            (SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name IN ('profiles', 'reminders', 'quotes')
             LIMIT 1 OFFSET table_count-1);
    END LOOP;
END $$;
