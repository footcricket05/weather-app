/*
  # Create weather searches table

  1. New Tables
    - `weather_searches`
      - `id` (uuid, primary key)
      - `location` (text) - The location name or coordinates
      - `start_date` (date) - Start of date range
      - `end_date` (date) - End of date range
      - `temperature` (jsonb) - Temperature data for the date range
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `weather_searches` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS weather_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  temperature jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE weather_searches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read weather searches"
  ON weather_searches
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert weather searches"
  ON weather_searches
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update weather searches"
  ON weather_searches
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete weather searches"
  ON weather_searches
  FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_weather_searches_updated_at
  BEFORE UPDATE ON weather_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();