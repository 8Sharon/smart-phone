
-- Create phones table with comprehensive specs
CREATE TABLE public.phones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price_usd NUMERIC NOT NULL,
  image_url TEXT,
  -- Scores (1-10 scale for easy comparison)
  camera_score NUMERIC NOT NULL DEFAULT 5,
  performance_score NUMERIC NOT NULL DEFAULT 5,
  battery_score NUMERIC NOT NULL DEFAULT 5,
  display_score NUMERIC NOT NULL DEFAULT 5,
  build_quality_score NUMERIC NOT NULL DEFAULT 5,
  -- Key specs for display
  ram_gb INTEGER NOT NULL DEFAULT 4,
  storage_gb INTEGER NOT NULL DEFAULT 64,
  battery_mah INTEGER NOT NULL DEFAULT 4000,
  screen_size_inches NUMERIC NOT NULL DEFAULT 6.1,
  chipset TEXT,
  os TEXT DEFAULT 'Android',
  -- Metadata
  release_year INTEGER DEFAULT 2024,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access (no auth needed for browsing phones)
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Phones are publicly readable"
ON public.phones
FOR SELECT
USING (true);
