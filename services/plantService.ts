import { Plant } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'leaflink_plants';

export const getPlants = async (userId?: string): Promise<Plant[]> => {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter by user if userId is provided
    if (userId) {
      query = query.eq('userId', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase fetch error:', error.message);
      return [];
    }
    return data as Plant[] || [];
  } else {
    // Local Storage Fallback
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    // Filter locally if needed
    if (userId) {
      return parsed.filter((p: Plant) => p.userId === userId);
    }
    return parsed;
  }
};

export const addPlant = async (plant: Omit<Plant, 'id'>): Promise<Plant> => {
  const newPlant = { ...plant, id: uuidv4() };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('plants')
      .insert([newPlant])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message, error.details);
      throw new Error(error.message || 'Failed to add plant');
    }
    return data as Plant;
  } else {
    // Local Storage Fallback
    const current = await getPlants();
    const updated = [newPlant, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newPlant;
  }
};

export const updatePlant = async (plant: Plant): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('plants')
      .update(plant)
      .eq('id', plant.id);
    
    if (error) {
      console.error('Supabase update error:', error.message, error.details);
      throw new Error(error.message || 'Failed to update plant');
    }
  } else {
    const current = await getPlants();
    const updated = current.map(p => p.id === plant.id ? plant : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};

export const deletePlant = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase delete error:', error.message, error.details);
      throw new Error(error.message || 'Failed to delete plant');
    }
  } else {
    const current = await getPlants();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};