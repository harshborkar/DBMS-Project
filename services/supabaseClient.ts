import { createClient } from '@supabase/supabase-js';

// Configuration using provided credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://zoubybvjjpijsfnssdai.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJ5YnZqanBpanNmbnNzZGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMzcyMDUsImV4cCI6MjA3ODkxMzIwNX0.vk7OD-fmCi-QUpMmMiGDa74rv373s5gwPHcq_Zxzdbs';

export const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;