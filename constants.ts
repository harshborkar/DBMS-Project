import { Sprout, Droplets, Sun, Wind, Check, Calendar } from "lucide-react";

export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1509423355108-138903112362?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=600"
];

export const getRandomPlantImage = () => {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
};
