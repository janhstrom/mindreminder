-- Fix quotes table structure
-- Run this script in your Supabase SQL editor

-- First, let's check if the quotes table exists and add missing columns
DO $$
BEGIN
    -- Add is_favorite column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'is_favorite'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN is_favorite BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_favorite column to quotes table';
    END IF;

    -- Add author column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'author'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN author TEXT NOT NULL DEFAULT 'Unknown';
        RAISE NOTICE 'Added author column to quotes table';
    END IF;

    -- Update existing quotes to have author if they don't
    UPDATE public.quotes SET author = 'Unknown' WHERE author IS NULL OR author = '';
    
    RAISE NOTICE 'Quotes table structure updated successfully!';
END $$;

-- Create index for is_favorite if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_quotes_is_favorite ON public.quotes(is_favorite);

-- Update the RLS policy for quotes (drop and recreate to ensure it works)
DROP POLICY IF EXISTS "Users can view own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete own quotes" ON public.quotes;

-- Recreate policies for quotes
CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes" ON public.quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes" ON public.quotes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes" ON public.quotes
  FOR DELETE USING (auth.uid() = user_id);

-- Verify the table structure
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'quotes' 
    AND column_name IN ('id', 'user_id', 'content', 'topic', 'author', 'is_favorite', 'created_at');
    
    IF col_count = 7 THEN
        RAISE NOTICE 'SUCCESS: Quotes table has all required columns!';
    ELSE
        RAISE NOTICE 'WARNING: Quotes table is missing some columns. Expected 7, found %', col_count;
    END IF;
END $$;
