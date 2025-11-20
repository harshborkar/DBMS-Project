import React, { useState } from 'react';
import { Plant } from '../types';
import { Droplets, Sun, Calendar, Trash2, Check, Wind } from 'lucide-react';
import { format, addDays, differenceInDays, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Fake delay for animation pleasure
    await new Promise(resolve => setTimeout(resolve, 600));
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
      className="group relative bg-white rounded-[2rem] border border-earth-100 shadow-lg shadow-earth-100/50 hover:shadow-2xl hover:shadow-leaf-100/50 overflow-hidden flex flex-col h-full transform-gpu"
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Delete Button (Top Right) */}
        <motion.button 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          onClick={(e) => { e.stopPropagation(); onDelete(plant.id); }}
          className="absolute top-4 right-4 p-2 bg-white/30 backdrop-blur-md text-white rounded-full hover:bg-rose-500 transition-colors"
        >
          <Trash2 size={16} />
        </motion.button>

        {/* Status Badge (Top Left) */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold border ${statusColor} shadow-sm backdrop-blur-md bg-opacity-90 z-10`}>
          <div className="flex items-center gap-1.5">
            {statusIcon}
            {statusText}
          </div>
        </div>

        {/* Plant Name Overlay (Bottom Left) */}
        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
           <h3 className="text-xl font-bold leading-tight drop-shadow-md">{plant.name}</h3>
           <p className="text-sm opacity-90 font-medium drop-shadow-md">{plant.species}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white relative z-10">
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
                <span className="line-clamp-2">{plant.notes}</span>
              </div>
            </div>
           )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleWater}
          disabled={isWatering}
          className="relative w-full overflow-hidden group/btn bg-earth-900 hover:bg-leaf-600 text-white py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
             {isWatering ? (
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               >
                 <Droplets size={18} />
               </motion.div>
             ) : (
               <>
                 <Droplets size={18} className="group-hover/btn:animate-bounce" />
                 <span>Water Plant</span>
               </>
             )}
          </div>
          
          {/* Liquid Fill Effect */}
          <AnimatePresence>
            {isWatering && (
              <motion.div 
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-full bg-leaf-500 z-0"
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlantCard;