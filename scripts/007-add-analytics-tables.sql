-- Create analytics tables for tracking user engagement
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name VARCHAR(100) NOT NULL,
  event_properties JSONB DEFAULT '{}',
  session_id VARCHAR(100),
  page_path VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100)
);

-- Create analytics daily summaries
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sessions_count INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  reminders_created INTEGER DEFAULT 0,
  quotes_generated INTEGER DEFAULT 0,
  friends_added INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_user_id ON analytics_daily_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_date ON analytics_daily_summary(date);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics sessions" ON analytics_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics sessions" ON analytics_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics sessions" ON analytics_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics daily summary" ON analytics_daily_summary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics daily summary" ON analytics_daily_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics daily summary" ON analytics_daily_summary
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update daily summary
CREATE OR REPLACE FUNCTION update_analytics_daily_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO analytics_daily_summary (
    user_id, 
    date, 
    events_count,
    reminders_created,
    quotes_generated,
    friends_added
  )
  VALUES (
    NEW.user_id,
    CURRENT_DATE,
    1,
    CASE WHEN NEW.event_name = 'reminder_created' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_name = 'quote_generated' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_name = 'friend_added' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    events_count = analytics_daily_summary.events_count + 1,
    reminders_created = analytics_daily_summary.reminders_created + 
      CASE WHEN NEW.event_name = 'reminder_created' THEN 1 ELSE 0 END,
    quotes_generated = analytics_daily_summary.quotes_generated + 
      CASE WHEN NEW.event_name = 'quote_generated' THEN 1 ELSE 0 END,
    friends_added = analytics_daily_summary.friends_added + 
      CASE WHEN NEW.event_name = 'friend_added' THEN 1 ELSE 0 END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily summary updates
CREATE TRIGGER update_analytics_daily_summary_trigger
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_daily_summary();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON analytics_events TO authenticated;
GRANT ALL ON analytics_sessions TO authenticated;
GRANT ALL ON analytics_daily_summary TO authenticated;
