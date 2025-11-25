import emailjs from '@emailjs/browser';
import { Plant } from '../types';

// EMAILJS CONFIGURATION
// ---------------------
const PUBLIC_KEY = "aU2mqobQUhngFI7wo"; 
const SERVICE_ID = "service_g5q6sqd"; 
const TEMPLATE_ID = "template_w2ke85q"; 

/* 
   -----------------------------------------------------------
   CRITICAL SETUP STEP:
   -----------------------------------------------------------
   1. Go to EmailJS Dashboard -> Email Templates -> Settings
   2. Set the "To Email" field to: {{to_email}}
   
   If you don't do this, emails will always go to your own account!
   -----------------------------------------------------------

   HTML TEMPLATE CONTENT:
   ----------------------
   <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px;">
     <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
       <div style="background-color: #e1f6e8; padding: 30px; text-align: center;">
         <h1 style="color: #1f523f; margin: 0; font-size: 24px; letter-spacing: -0.5px;">LeafLink</h1>
       </div>
       <div style="padding: 30px;">
         <h2 style="color: #2a805d; margin-top: 0; font-size: 20px;">New Plant Added! 🌿</h2>
         <p style="color: #57534e; line-height: 1.6;">Hello <strong>{{to_name}}</strong>,</p>
         <p style="color: #57534e; line-height: 1.6;">You have successfully added a new companion to your garden.</p>
         <div style="background-color: #f2fbf5; border: 1px solid #c4ebd4; border-radius: 12px; padding: 20px; margin-top: 20px;">
           <table width="100%" border="0" cellspacing="0" cellpadding="0">
             <tr>
               <td>
                 <div style="font-size: 18px; font-weight: bold; color: #1f523f;">{{plant_name}}</div>
                 <div style="font-size: 14px; color: #61bf93;">{{plant_species}}</div>
               </td>
               <td align="right" style="vertical-align: middle;">
                 <div style="background-color: #ffffff; border: 1px solid #96d9b6; color: #2a805d; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; white-space: nowrap;">
                   Every {{water_freq}} days
                 </div>
               </td>
             </tr>
           </table>
         </div>
         <div style="margin-top: 30px; border-top: 1px solid #e7e5e4; padding-top: 20px; text-align: center; color: #a8a29e; font-size: 12px;">
           <p>Happy Growing,<br>The LeafLink Team</p>
         </div>
       </div>
     </div>
   </div>
*/

// Fallback to environment variables if the above are empty
const getServiceId = () => SERVICE_ID || process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || "";
const getTemplateId = () => TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || "";
const getPublicKey = () => PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || "";

export const sendPlantAddedEmail = async (plant: Omit<Plant, 'id'>, userEmail: string) => {
  const serviceId = getServiceId();
  const templateId = getTemplateId();
  const publicKey = getPublicKey();

  // If credentials aren't set up, fallback to simulation mode
  if (!serviceId || !templateId || !publicKey) {
    console.log("%c[EmailJS Simulation] Credentials missing. Email would have been sent:", "color: #3aa075; font-weight: bold;");
    console.log("Missing:", { 
      Service_ID: serviceId ? "OK" : "MISSING", 
      Template_ID: templateId ? "OK" : "MISSING", 
      Public_Key: publicKey ? "OK" : "MISSING" 
    });
    console.log({
      to: userEmail,
      subject: `Welcome to the garden, ${plant.name}!`,
      body: `You've added a new ${plant.species}. We'll remind you to water it every ${plant.waterFrequencyDays} days.`
    });
    return { status: 200, text: 'Simulated OK' };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        // We provide multiple variations to ensure it works with different template defaults
        to_email: userEmail,   // <--- Make sure Dashboard "To Email" is set to {{to_email}}
        email: userEmail,      // Alternate variable name
        reply_to: userEmail,   // Allows you to reply to the user
        
        to_name: userEmail.split('@')[0], 
        plant_name: plant.name,
        plant_species: plant.species,
        water_freq: plant.waterFrequencyDays,
        message: `Your new plant ${plant.name} (${plant.species}) has been added to your LeafLink garden. We will remind you to water it every ${plant.waterFrequencyDays} days. Happy growing!`
      },
      publicKey
    );
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    // Don't throw, just log so the UI doesn't break if email fails
    return { status: 400, text: 'Failed' };
  }
};
