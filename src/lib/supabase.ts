
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the values from the integrated Supabase client
const supabaseUrl = "https://wrcpbmqmkeuvgweyvpqo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BibXFta2V1dmd3ZXl2cHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzIxMzcsImV4cCI6MjA2MjcwODEzN30.wopfhV1IbWlTCQbLmOPup6Kp8ekTUIZOm7qVrz1wYEw";

// Create the Supabase client with the URL and key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured with real credentials
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
