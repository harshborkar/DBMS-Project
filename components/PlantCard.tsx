import React, { useState, useRef } from 'react';
import { Plant } from '../types';
import { Droplets, Sun, Calendar, Wind, Trash2 } from 'lucide-react';
import { addDays, differenceInDays, isToday } from 'date-fns';
import { motion, useAnimation, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const trashControls = useAnimation();
  
  // 3D Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth out the mouse movement
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]); // Subtle tilt
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const nextWaterDate = addDays(new Date(plant.lastWateredDate), plant.waterFrequencyDays);
  const daysUntil = differenceInDays(nextWaterDate, new Date());
  
  const isOverdue = daysUntil < 0;
  const isDueToday = isToday(nextWaterDate);
  
  let statusColor = "text-leaf-800 bg-white/60 border-leaf-200/50";
  let statusIcon = <Droplets size={12} className="fill-current" />;
  let statusText = `In ${daysUntil} days`;

  if (isOverdue) {
    statusColor = "text-rose-800 bg-rose-50/80 border-rose-200/50";
    statusIcon = <Wind size={12} />;
    statusText = `${Math.abs(daysUntil)} days overdue`;
  } else if (isDueToday) {
    statusColor = "text-amber-800 bg-amber-50/80 border-amber-200/50";
    statusIcon = <Sun size={12} className="fill-current" />;
    statusText = "Water today";
  }

  const handleWater = async () => {
    setIsWatering(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Longer for animation
    onWater(plant);
    setIsWatering(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // PERFORMANCE OPTIMIZATION: Disable expensive tilt/glow calculations on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    
    // For internal spotlight
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${offsetX}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${offsetY}px`);

    // For 3D Tilt (normalized -0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      style={{ 
        perspective: 1000,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        filter: "blur(10px)",
        transition: { duration: 0.3, ease: "backIn" } 
      }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="group relative bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-leaf-900/5 overflow-hidden flex flex-col h-full transform-gpu transition-all duration-300"
      >
        {/* Interactive Glass Glow - Stronger Light Source */}
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.35), transparent 60%)`
          }}
        />
        
        {/* Shine Border Overlay */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/50 pointer-events-none z-50 mix-blend-overlay opacity-50" />

        {/* Image Section */}
        <div className="relative h-56 overflow-hidden bg-earth-100/50 z-10 group-hover:shadow-lg transition-all duration-500">
          {/* Shimmer Loading State */}
          {!isImgLoaded && (
            <div className="absolute inset-0 bg-earth-200/50 animate-pulse z-20 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          )}
          
          <motion.img 
            src={imgSrc} 
            alt={plant.name}
            onLoad={() => setIsImgLoaded(true)}
            onError={() => {
              setImgSrc(PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)]);
              setIsImgLoaded(true);
            }}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`}
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent opacity-90" />

          {/* Animated Delete Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onDelete(plant.id); }}
            onHoverStart={() => trashControls.start("hover")}
            onHoverEnd={() => trashControls.start("idle")}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-rose-500 hover:border-rose-400 transition-colors duration-300 shadow-lg opacity-100 translate-x-0 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0"
            aria-label="Delete plant"
          >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <motion.g
                  initial="idle"
                  animate={trashControls}
                  variants={{
                    idle: { rotate: 0, y: 0 },
                    hover: { rotate: -25, y: -2, x: -1, transition: { type: "spring", stiffness: 400, damping: 15 } }
                  }}
                  style={{ originX: "100%", originY: "100%" }}
                >
                   <path d="M3 6h18" />
                   <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </motion.g>
                
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

          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold border ${statusColor} shadow-lg backdrop-blur-md z-10`}>
            <div className="flex items-center gap-1.5">
              {statusIcon}
              {statusText}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 p-5 text-white w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
             <h3 className="text-xl font-bold leading-tight drop-shadow-lg text-white">{plant.name}</h3>
             <p className="text-sm opacity-90 font-medium drop-shadow-md text-white/90">{plant.species}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
          <div className="space-y-3 mb-6">
             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors shadow-sm">
               <div className="w-8 h-8 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-700 shrink-0 shadow-inner border border-white/20">
                 <Sun size={16} />
               </div>
               <div className="text-xs text-earth-800">
                 <span className="block font-semibold text-earth-900 mb-0.5">Light</span>
                 {plant.lightNeeds || 'Unknown'}
               </div>
             </div>

             {plant.notes && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/40 border border-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors shadow-sm">
               <div className="w-8 h-8 rounded-full bg-blue-100/60 flex items-center justify-center text-blue-700 shrink-0 shadow-inner border border-white/20">
                 <Calendar size={16} />
               </div>
               <div className="text-xs text-earth-800">
                 <span className="block font-semibold text-earth-900 mb-0.5">Notes</span>
                 <p className="line-clamp-2 leading-relaxed opacity-90">{plant.notes}</p>
               </div>
             </div>
             )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWater}
            disabled={isWatering}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-leaf-900/5 relative overflow-hidden border border-white/20 group/btn ${
              isWatering 
                ? "text-white" 
                : "bg-earth-800 hover:bg-earth-900 text-white"
            }`}
          >
              <span className="relative z-20 flex items-center gap-2">
                {isWatering ? (
                   <motion.span 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }}
                     className="flex items-center gap-2"
                   >
                     <Droplets size={18} className="animate-bounce" />
                     Watering...
                   </motion.span>
                ) : (
                   <>
                     <Droplets size={18} className="group-hover/btn:fill-current transition-colors" />
                     Water Plant
                   </>
                )}
              </span>
              
               {/* Liquid Animation */}
               <AnimatePresence>
                 {isWatering && (
                  <motion.div 
                    className="absolute inset-0 z-10"
                    initial={{ y: "100%" }}
                    animate={{ y: "-20%" }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <div className="w-full h-[150%] bg-leaf-500 relative">
                       {/* Wave Top */}
                       <div className="absolute -top-4 left-0 w-full h-8 bg-leaf-500 rounded-[100%] scale-x-150 animate-[wave_2s_infinite_linear]" />
                    </div>
                  </motion.div>
                 )}
               </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlantCard;