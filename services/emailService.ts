import emailjs from '@emailjs/browser';
import { Plant } from '../types';

// Try to get credentials from environment variables
// Supports both standard process.env (Node/Webpack) and VITE_ prefixed (Vite)
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendPlantAddedEmail = async (plant: Omit<Plant, 'id'>, userEmail: string) => {
  // If credentials aren't set up, fallback to simulation mode
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.log("%c[EmailJS Simulation] Credentials missing. Email would have been sent:", "color: #3aa075; font-weight: bold;");
    console.log({
      to: userEmail,
      subject: `Welcome to the garden, ${plant.name}!`,
      body: `You've added a new ${plant.species}. We'll remind you to water it every ${plant.waterFrequencyDays} days.`
    });
    return { status: 200, text: 'Simulated OK' };
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: userEmail,
        to_name: userEmail.split('@')[0], // Simple name extraction
        plant_name: plant.name,
        plant_species: plant.species,
        water_freq: plant.waterFrequencyDays,
        message: `Your new plant ${plant.name} (${plant.species}) has been added to your LeafLink garden. We will remind you to water it every ${plant.waterFrequencyDays} days. Happy growing!`
      },
      PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    // Don't throw, just log so the UI doesn't break if email fails
    return { status: 400, text: 'Failed' };
  }
};
