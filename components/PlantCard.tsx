import React, { useState } from 'react';
import { Plant } from '../types';
import { Droplets, Sun, Calendar, Wind } from 'lucide-react';
import { addDays, differenceInDays, isToday } from 'date-fns';
import { motion, useAnimation } from 'framer-motion';
import { PLACEHOLDER_IMAGES } from '../constants';

interface PlantCardProps {
  plant: Plant;
  onWater: (plant: Plant) => void;
  onDelete: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onWater, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [imgSrc, setImgSrc] = useState(plant.imageUrl || PLACEHOLDER_IMAGES[0]);
  const trashControls = useAnimation();
  
  const nextWaterDate = addDays(new Date(plant.lastWateredDate), plant.waterFrequencyDays);
  const daysUntil = differenceInDays(nextWaterDate, new Date());
  
  const isOverdue = daysUntil < 0;
  const isDueToday = isToday(nextWaterDate);
  
  let statusColor = "text-leaf-600 bg-leaf-50 border-leaf-100";
  let statusIcon = <Droplets size={12} className="fill-current" />;
  let statusText = `In ${daysUntil} days`;

  if (isOverdue) {
    statusColor = "text-rose-600 bg-rose-50 border-rose-100";
    statusIcon = <Wind size={12} />;
    statusText = `${Math.abs(daysUntil)} days overdue`;
  } else if (isDueToday) {
    statusColor = "text-amber-600 bg-amber-50 border-amber-100";
    statusIcon = <Sun size={12} className="fill-current" />;
    statusText = "Water today";
  }

  const handleWater = async () => {
    setIsWatering(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onWater(plant);
    setIsWatering(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 15 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-[2rem] border border-earth-100 shadow-lg shadow-earth-100/50 hover:shadow-2xl hover:shadow-leaf-100/50 overflow-hidden flex flex-col h-full transform-gpu transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-earth-100">
        <motion.img 
          src={imgSrc} 
          alt={plant.name}
          onError={() => setImgSrc(PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)])}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Animated Delete Button */}
        <motion.button 
          onClick={(e) => { e.stopPropagation(); onDelete(plant.id); }}
          onHoverStart={() => trashControls.start("hover")}
          onHoverEnd={() => trashControls.start("idle")}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-rose-500 transition-colors duration-300 shadow-sm opacity-100 translate-x-0 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0"
          aria-label="Delete plant"
        >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Lid Group: Handle and Top Line */}
              <motion.g
                initial="idle"
                animate={trashControls}
                variants={{
                  idle: { rotate: 0, y: 0 },
                  hover: { rotate: -25, y: -2, x: -1, transition: { type: "spring", stiffness: 400, damping: 15 } }
                }}
                style={{ originX: "100%", originY: "100%" }} // Pivot around bottom right of lid
              >
                 <path d="M3 6h18" />
                 <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </motion.g>
              
              {/* Bin Body */}
              <motion.g
                 initial="idle"
                 animate={trashControls}
                 variants={{
                    idle: { rotate: 0 },
                    hover: { rotate: [0, -2, 2, -1, 1, 0], transition: { delay: 0.1, duration: 0.4 } }
                 }}
              >
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </motion.g>
           </svg>
        </motion.button>

        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold border ${statusColor} shadow-sm backdrop-blur-md bg-opacity-90 z-10`}>
          <div className="flex items-center gap-1.5">
            {statusIcon}
            {statusText}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
           <h3 className="text-xl font-bold leading-tight drop-shadow-md">{plant.name}</h3>
           <p className="text-sm opacity-90 font-medium drop-shadow-md">{plant.species}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div className="space-y-3 mb-6">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-earth-50 border border-earth-100">
             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
               <Sun size={16} />
             </div>
             <div className="text-xs text-earth-600">
               <span className="block font-semibold text-earth-800 mb-0.5">Light</span>
               {plant.lightNeeds || 'Unknown'}
             </div>
           </div>

           {plant.notes && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-earth-50 border border-earth-100">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Calendar size={16} />
             </div>
             <div className="text-xs text-earth-600">
               <span className="block font-semibold text-earth-800 mb-0.5">Notes</span>
               {plant.notes}
             </div>
           </div>
           )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleWater}
          disabled={isWatering}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg relative overflow-hidden ${
            isWatering 
              ? "bg-leaf-400 cursor-wait text-white" 
              : "bg-earth-800 hover:bg-leaf-600 text-white hover:shadow-leaf-200"
          }`}
        >
            <span className="relative z-10 flex items-center gap-2">
              {isWatering ? (
                 <>Watering...</>
              ) : (
                 <>
                   <Droplets size={18} />
                   Water Plant
                 </>
              )}
            </span>
            
             {isWatering && (
              <motion.div 
                layoutId="water-fill"
                className="absolute inset-0 bg-leaf-500 z-0"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
             )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlantCard;