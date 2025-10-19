// supabase-client.js
// Supabase client initialization for Japan Travel Planner
// Note: The actual credentials will be set in config.js

// Initialize Supabase client using config values
const supabase = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.anonKey
);

// Trip data ID (singleton row - only one trip data record exists)
const TRIP_DATA_ID = '00000000-0000-0000-0000-000000000001';
