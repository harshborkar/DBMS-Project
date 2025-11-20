import { createClient } from '@supabase/supabase-js';

// Configuration using provided credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://zoubybvjjpijsfnssdai.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJ5YnZqanBpanNmbnNzZGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMzcyMDUsImV4cCI6MjA3ODkxMzIwNX0.vk7OD-fmCi-QUpMmMiGDa74rv373s5gwPHcq_Zxzdbs';

export const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Auth Helpers
export const signIn = async (email: string, pass: string) => {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, pass: string) => {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signUp({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};