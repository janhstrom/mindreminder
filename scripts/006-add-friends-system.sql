-- Create friends table for managing friend relationships
CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Create shared_reminders table for sharing reminders between friends
CREATE TABLE IF NOT EXISTS shared_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shared_with UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create friend_notifications table for friend-related notifications
CREATE TABLE IF NOT EXISTS friend_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('friend_request', 'friend_accepted', 'reminder_shared')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);
CREATE INDEX IF NOT EXISTS idx_shared_reminders_shared_with ON shared_reminders(shared_with);
CREATE INDEX IF NOT EXISTS idx_shared_reminders_shared_by ON shared_reminders(shared_by);
CREATE INDEX IF NOT EXISTS idx_friend_notifications_user_id ON friend_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_notifications_is_read ON friend_notifications(is_read);

-- Enable RLS (Row Level Security)
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friends table
CREATE POLICY "Users can view their own friends and friend requests" ON friends
    FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friend requests" ON friends
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update friend requests they received" ON friends
    FOR UPDATE USING (friend_id = auth.uid());

CREATE POLICY "Users can delete their own friend relationships" ON friends
    FOR DELETE USING (user_id = auth.uid() OR friend_id = auth.uid());

-- RLS Policies for shared_reminders table
CREATE POLICY "Users can view reminders shared with them or by them" ON shared_reminders
    FOR SELECT USING (shared_with = auth.uid() OR shared_by = auth.uid());

CREATE POLICY "Users can share their own reminders" ON shared_reminders
    FOR INSERT WITH CHECK (shared_by = auth.uid());

CREATE POLICY "Users can update shared reminders they received" ON shared_reminders
    FOR UPDATE USING (shared_with = auth.uid());

CREATE POLICY "Users can delete reminders they shared" ON shared_reminders
    FOR DELETE USING (shared_by = auth.uid());

-- RLS Policies for friend_notifications table
CREATE POLICY "Users can view their own notifications" ON friend_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON friend_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON friend_notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" ON friend_notifications
    FOR DELETE USING (user_id = auth.uid());

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON friends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful functions
CREATE OR REPLACE FUNCTION are_friends(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM friends 
        WHERE ((user_id = user1_id AND friend_id = user2_id) 
               OR (user_id = user2_id AND friend_id = user1_id))
        AND status = 'accepted'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON friends TO authenticated;
GRANT ALL ON shared_reminders TO authenticated;
GRANT ALL ON friend_notifications TO authenticated;
