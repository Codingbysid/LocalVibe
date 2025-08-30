-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_trails table
CREATE TABLE IF NOT EXISTS saved_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trail_data JSONB NOT NULL,
    vibes TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_trails_user_id ON saved_trails(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trails_created_at ON saved_trails(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_trails_vibes ON saved_trails USING GIN(vibes);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_trails_updated_at 
    BEFORE UPDATE ON saved_trails 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trails ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for saved_trails table
CREATE POLICY "Users can view own saved trails" ON saved_trails
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved trails" ON saved_trails
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved trails" ON saved_trails
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved trails" ON saved_trails
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some sample data for development (optional)
-- INSERT INTO profiles (email) VALUES ('demo@localvibe.com');
-- INSERT INTO saved_trails (user_id, trail_data, vibes) VALUES (
--     (SELECT id FROM profiles WHERE email = 'demo@localvibe.com'),
--     '{"narrative": {"title": "Sample Trail", "description": "A sample trail for demonstration"}, "stops": []}',
--     ARRAY['cozy', 'artsy']
-- );
