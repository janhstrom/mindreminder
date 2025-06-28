-- Create micro_actions table for habit tracking
CREATE TABLE IF NOT EXISTS micro_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('health', 'learning', 'mindfulness', 'productivity', 'relationships')),
    duration TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    time_of_day TEXT,
    habit_stack TEXT,
    is_active BOOLEAN DEFAULT true,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create micro_action_completions table for tracking daily completions
CREATE TABLE IF NOT EXISTS micro_action_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    micro_action_id UUID NOT NULL REFERENCES micro_actions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    UNIQUE(micro_action_id, completion_date)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_micro_actions_user_id ON micro_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_micro_actions_is_active ON micro_actions(is_active);
CREATE INDEX IF NOT EXISTS idx_micro_action_completions_user_id ON micro_action_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_micro_action_completions_date ON micro_action_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_micro_action_completions_micro_action_id ON micro_action_completions(micro_action_id);

-- Enable RLS (Row Level Security)
ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_action_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for micro_actions table
CREATE POLICY "Users can view their own micro-actions" ON micro_actions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own micro-actions" ON micro_actions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own micro-actions" ON micro_actions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own micro-actions" ON micro_actions
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for micro_action_completions table
CREATE POLICY "Users can view their own completions" ON micro_action_completions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own completions" ON micro_action_completions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own completions" ON micro_action_completions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own completions" ON micro_action_completions
    FOR DELETE USING (user_id = auth.uid());

-- Add updated_at trigger for micro_actions
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON micro_actions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update streak when completing a micro-action
CREATE OR REPLACE FUNCTION update_micro_action_streak(action_id UUID, user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    yesterday_completed BOOLEAN;
    current_streak_val INTEGER;
BEGIN
    -- Check if completed yesterday
    SELECT EXISTS(
        SELECT 1 FROM micro_action_completions 
        WHERE micro_action_id = action_id 
        AND completion_date = CURRENT_DATE - INTERVAL '1 day'
    ) INTO yesterday_completed;
    
    -- Get current streak
    SELECT current_streak INTO current_streak_val 
    FROM micro_actions 
    WHERE id = action_id;
    
    -- Update streak based on yesterday's completion
    IF yesterday_completed THEN
        -- Continue streak
        UPDATE micro_actions 
        SET 
            current_streak = current_streak + 1,
            best_streak = GREATEST(best_streak, current_streak + 1),
            total_completions = total_completions + 1,
            updated_at = NOW()
        WHERE id = action_id;
    ELSE
        -- Start new streak
        UPDATE micro_actions 
        SET 
            current_streak = 1,
            best_streak = GREATEST(best_streak, 1),
            total_completions = total_completions + 1,
            updated_at = NOW()
        WHERE id = action_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON micro_actions TO authenticated;
GRANT ALL ON micro_action_completions TO authenticated;

SELECT 'Micro-actions tables created successfully!' as status;
