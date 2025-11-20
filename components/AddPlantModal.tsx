import React, { useState, useCallback, useRef } from 'react';
import { X, Sparkles, Loader2, Sprout, Droplets, Image as ImageIcon, RefreshCw, Link as LinkIcon, Upload } from 'lucide-react';
import { getPlantCareAdvice } from '../services/geminiService';
import { getRandomPlantImage } from '../constants';
import { Plant } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plant: Omit<Plant, 'id'>) => void;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [frequency, setFrequency] = useState<number>(7);
  const [notes, setNotes] = useState('');
  const [lightNeeds, setLightNeeds] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateImage = useCallback((speciesName: string) => {
    if (!speciesName) return;
    setIsGeneratingImage(true);
    const query = encodeURIComponent(`${speciesName} houseplant aesthetic minimal bright soft lighting`);
    const seed = Math.floor(Math.random() * 10000);
    // Using Pollinations.ai for zero-config generative images
    const url = `https://image.pollinations.ai/prompt/${query}?seed=${seed}&width=600&height=600&nologo=true`;
    
    // Pre-load image to ensure it exists before showing
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setIsGeneratingImage(false);
    };
    img.onerror = () => {
      setIsGeneratingImage(false); // Fail silently, keep current or empty
    };
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!species) return;
    setIsAnalyzing(true);
    
    // Trigger image generation if empty
    if (!imageUrl) {
      generateImage(species);
    }

    try {
      const advice = await getPlantCareAdvice(species);
      if (advice) {
        setFrequency(advice.wateringFrequencyDays);
        setLightNeeds(advice.lightNeeds);
        setNotes(advice.careTip);
        if (!name) setName(species);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [species, name, imageUrl, generateImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGeneratingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 800x800 to save space
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImageUrl(dataUrl);
        setIsGeneratingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: name || species,
      species,
      waterFrequencyDays: frequency,
      lastWateredDate: new Date().toISOString(),
      imageUrl: imageUrl || getRandomPlantImage(),
      lightNeeds,
      notes
    });
    // Reset
    setName('');
    setSpecies('');
    setFrequency(7);
    setNotes('');
    setLightNeeds('');
    setImageUrl('');
    setShowUrlInput(false);
    onClose();
  };

  // Animation Variants
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        duration: 0.5, 
        bounce: 0.3,
        delayChildren: 0.1,
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-earth-900/20 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/80 backdrop-blur-2xl border border-white/50 w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-leaf-900/10 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-white/30 flex justify-between items-center bg-white/30 shrink-0 backdrop-blur-sm">
              <motion.h2 
                variants={itemVariants}
                className="text-lg font-bold text-earth-800 flex items-center gap-2"
              >
                <div className="p-2 bg-leaf-100/80 rounded-full text-leaf-600">
                   <Sprout size={18} />
                </div>
                Add New Plant
              </motion.h2>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full text-earth-400 hover:text-earth-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Image Preview Section */}
                <motion.div variants={itemVariants} className="flex justify-center mb-2">
                  <div className="relative group w-full h-48 rounded-3xl overflow-hidden bg-white/40 border-2 border-dashed border-white/60 hover:border-leaf-300/60 transition-colors backdrop-blur-sm">
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button 
                            type="button"
                            onClick={() => generateImage(species)}
                            className="p-3 bg-white/90 text-earth-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                            title="Regenerate AI Image"
                          >
                            <RefreshCw size={20} className={isGeneratingImage ? "animate-spin" : ""} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="p-3 bg-white/90 text-earth-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                            title="Paste URL"
                          >
                            <LinkIcon size={20} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-white/90 text-earth-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                            title="Upload Photo"
                          >
                            <Upload size={20} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-earth-400 p-4">
                        {isGeneratingImage ? (
                           <Loader2 size={32} className="animate-spin text-leaf-500" />
                        ) : (
                           <>
                             <ImageIcon size={32} className="mb-2 opacity-50" />
                             <span className="text-xs font-medium text-center mb-3">Image will auto-generate based on species</span>
                             
                             <div className="flex gap-2 w-full px-2">
                               <button 
                                 type="button"
                                 onClick={() => setShowUrlInput(!showUrlInput)}
                                 className="flex-1 py-2 bg-white/60 border border-white/50 rounded-lg text-xs font-semibold text-earth-600 hover:bg-white/80 transition-colors shadow-sm backdrop-blur-sm"
                               >
                                 Paste URL
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => fileInputRef.current?.click()}
                                 className="flex-1 py-2 bg-white/60 border border-white/50 rounded-lg text-xs font-semibold text-earth-600 hover:bg-white/80 transition-colors flex items-center justify-center gap-1.5 shadow-sm backdrop-blur-sm"
                               >
                                 <Upload size={12} />
                                 Upload
                               </button>
                             </div>
                           </>
                        )}
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>
                </motion.div>

                {/* URL Input (Collapsible) */}
                <AnimatePresence>
                  {showUrlInput && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 text-sm rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 outline-none mb-4 backdrop-blur-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-earth-700 ml-1">Species / Type</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      placeholder="e.g. Fiddle Leaf Fig"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 focus:bg-white/80 focus:border-leaf-300/50 outline-none transition-all backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={handleIdentify}
                      disabled={!species || isAnalyzing}
                      className="px-4 py-2 rounded-xl bg-violet-50/60 text-violet-600 border border-violet-100 hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[3.5rem] shadow-sm backdrop-blur-sm"
                      title="Auto-fill details & image"
                    >
                      {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-earth-400 ml-1">Enter species and click the sparkle to auto-fill info & image.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-earth-700 ml-1">Nickname</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Figgy"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 focus:bg-white/80 focus:border-leaf-300/50 outline-none transition-all backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-earth-700 ml-1">Water Every (Days)</label>
                    <div className="relative">
                      <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={frequency}
                        onChange={(e) => setFrequency(parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 focus:bg-white/80 focus:border-leaf-300/50 outline-none transition-all no-spinner backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-earth-700 ml-1">Light Needs</label>
                    <input
                      type="text"
                      value={lightNeeds}
                      onChange={(e) => setLightNeeds(e.target.value)}
                      placeholder="e.g. Bright indirect"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 focus:bg-white/80 focus:border-leaf-300/50 outline-none transition-all backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-earth-700 ml-1">Care Tips / Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Don't overwater..."
                    className="w-full px-4 py-3 rounded-xl bg-white/50 text-earth-800 placeholder-earth-400 border border-white/40 focus:ring-2 focus:ring-leaf-400/30 focus:bg-white/80 focus:border-leaf-300/50 outline-none transition-all resize-none backdrop-blur-sm"
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-leaf-500 hover:bg-leaf-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-leaf-500/20 transition-all mt-4 border border-white/20 backdrop-blur-md"
                >
                  Add Plant to Garden
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPlantModal;