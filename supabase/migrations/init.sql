-- Create user_recommendations table
CREATE TABLE IF NOT EXISTS user_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_answers jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create phone_reviews table
CREATE TABLE IF NOT EXISTS phone_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create phone_pricing table
CREATE TABLE IF NOT EXISTS phone_pricing (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_id text NOT NULL,
  retailer text NOT NULL,
  price decimal(10, 2) NOT NULL,
  url text,
  last_updated timestamp DEFAULT now()
);

-- Create user_saved_phones table
CREATE TABLE IF NOT EXISTS user_saved_phones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_id text NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, phone_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme text DEFAULT 'dark',
  language text DEFAULT 'en',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own recommendations"
  ON user_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create recommendations"
  ON user_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all reviews"
  ON phone_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON phone_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view pricing"
  ON phone_pricing FOR SELECT
  USING (true);

CREATE POLICY "Users can view their saved phones"
  ON user_saved_phones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their saved phones"
  ON user_saved_phones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved phones"
  ON user_saved_phones FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
