-- Clean up any potential cross-user quote data and verify RLS policies

-- First, let's check if there are any quotes without proper user association
SELECT COUNT(*) as orphaned_quotes FROM quotes WHERE user_id IS NULL;

-- Enable RLS on quotes table if not already enabled
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can only see their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can only insert their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can only update their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can only delete their own quotes" ON quotes;

-- Create proper RLS policies for quotes table
CREATE POLICY "Users can only see their own quotes" ON quotes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own quotes" ON quotes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own quotes" ON quotes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own quotes" ON quotes
    FOR DELETE USING (auth.uid() = user_id);

-- Clean up any orphaned quotes (quotes without user_id)
DELETE FROM quotes WHERE user_id IS NULL;

-- Verify the policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'quotes';
