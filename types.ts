export interface Plant {
  id: string;
  name: string;
  species: string;
  waterFrequencyDays: number;
  lastWateredDate: string;
  imageUrl?: string;
  lightNeeds?: string;
  notes?: string;
  userId?: string;
}

export interface PlantCareSuggestion {
  wateringFrequencyDays: number;
  lightNeeds: string;
  careTip: string;
  scientificName?: string;
}

export type ViewMode = 'grid' | 'list';
