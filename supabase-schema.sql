-- Supabase Database Schema for Japan Travel Planner
-- Run this in your Supabase SQL Editor after creating your project

-- Users table is automatically managed by Supabase Auth
-- No custom users table needed

-- Shared trip data table
CREATE TABLE trip_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  users JSONB DEFAULT '{}'::jsonb,
  favorites JSONB DEFAULT '{}'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '{}'::jsonb,
  budget JSONB DEFAULT '{"hotels":[],"food":[],"transport":[],"activities":[],"shopping":[]}'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE trip_data ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read
CREATE POLICY "Anyone can read trip data"
  ON trip_data FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Anyone authenticated can update
CREATE POLICY "Anyone can update trip data"
  ON trip_data FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Note: INSERT and DELETE policies are intentionally omitted
-- This is a singleton table with exactly one row for collaborative trip planning
-- The single row is created below and should never be deleted or additional rows inserted
-- All updates happen via the UPDATE policy above

-- Insert initial row (only one row will exist)
-- Using ON CONFLICT DO NOTHING for idempotent schema application
INSERT INTO trip_data (id) VALUES ('00000000-0000-0000-0000-000000000001')
  ON CONFLICT (id) DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE trip_data;
