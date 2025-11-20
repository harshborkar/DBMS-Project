import { Plant } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'leaflink_plants';

export const getPlants = async (): Promise<Plant[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data as Plant[] || [];
  } else {
    // Local Storage Fallback
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};

export const addPlant = async (plant: Omit<Plant, 'id'>): Promise<Plant> => {
  const newPlant = { ...plant, id: uuidv4() };

  if (isSupabaseConfigured && supabase) {
    // Ensure you have a 'plants' table in Supabase matching the Plant interface
    const { data, error } = await supabase
      .from('plants')
      .insert([newPlant])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
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
    
    if (error) console.error('Supabase update error:', error);
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
      
    if (error) console.error('Supabase delete error:', error);
  } else {
    const current = await getPlants();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
