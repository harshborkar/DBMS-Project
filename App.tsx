import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import AddPlantModal from './components/AddPlantModal';
import PlantCard from './components/PlantCard';
import { Plant } from './types';
import { getPlants, addPlant, updatePlant, deletePlant } from './services/plantService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { AlertTriangle, Leaf, CheckCircle2, Droplets, Sprout, Heart } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { addDays, isBefore, isToday } from 'date-fns';

type FilterType = 'all' | 'thirsty' | 'healthy';

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('leaflink_email') || '');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadPlants();
  }, []);

  useEffect(() => {
    localStorage.setItem('leaflink_email', userEmail);
  }, [userEmail]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadPlants = async () => {
    setLoading(true);
    try {
      const data = await getPlants();
      setPlants(data);
    } catch (error) {
      console.error("Failed to load plants", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async (plantData: Omit<Plant, 'id'>) => {
    try {
      const newPlant = await addPlant({ ...plantData, userId: userEmail });
      setPlants(prev => [newPlant, ...prev]);
      
      if (userEmail) {
        setNotification(`Schedule created! Reminder emails will be sent to ${userEmail}`);
      } else {
        setNotification(`Plant added! Set your email in the header to receive reminders.`);
      }
    } catch (error) {
      console.error("Failed to add plant", error);
    }
  };

  const handleWaterPlant = async (plant: Plant) => {
    const updatedPlant = { ...plant, lastWateredDate: new Date().toISOString() };
    try {
      await updatePlant(updatedPlant);
      setPlants(prev => prev.map(p => p.id === plant.id ? updatedPlant : p));
    } catch (error) {
      console.error("Failed to water plant", error);
    }
  };

  const handleDeletePlant = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this plant?")) return;
    try {
      await deletePlant(id);
      setPlants(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete plant", error);
    }
  };

  const filteredPlants = useMemo(() => {
    const today = new Date();
    switch (activeFilter) {
      case 'thirsty':
        return plants.filter(p => {
          const nextWater = addDays(new Date(p.lastWateredDate), p.waterFrequencyDays);
          return isBefore(nextWater, today) || isToday(nextWater);
        });
      case 'healthy':
        return plants.filter(p => {
          const nextWater = addDays(new Date(p.lastWateredDate), p.waterFrequencyDays);
          return !isBefore(nextWater, today) && !isToday(nextWater);
        });
      default:
        return plants;
    }
  }, [plants, activeFilter]);

  const stats = useMemo(() => {
    const total = plants.length;
    const thirsty = plants.filter(p => {
      const nextWater = addDays(new Date(p.lastWateredDate), p.waterFrequencyDays);
      return isBefore(nextWater, new Date()) || isToday(nextWater);
    }).length;
    return { total, thirsty };
  }, [plants]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-earth-900 font-sans selection:bg-leaf-200">
      <Header 
        onAddClick={() => setIsModalOpen(true)} 
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!isSupabaseConfigured && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3 text-amber-800 shadow-sm"
          >
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium">Demo Mode Active</h4>
              <p className="text-sm opacity-90 mt-1">
                Supabase credentials are missing. Your data is saved locally. 
                Configure Supabase to enable email reminders.
              </p>
            </div>
          </motion.div>
        )}

        {/* Garden Stats & Filters */}
        {plants.length > 0 && (
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-6"
            >
              <div className="bg-white p-4 rounded-2xl border border-earth-100 shadow-sm flex items-center gap-4 min-w-[140px]">
                <div className="p-3 bg-leaf-100 rounded-full text-leaf-600">
                  <Sprout size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-earth-800">{stats.total}</div>
                  <div className="text-xs text-earth-500 font-medium uppercase tracking-wider">Total Plants</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-earth-100 shadow-sm flex items-center gap-4 min-w-[140px]">
                <div className={`p-3 rounded-full ${stats.thirsty > 0 ? 'bg-rose-100 text-rose-600' : 'bg-leaf-100 text-leaf-600'}`}>
                  <Droplets size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-earth-800">{stats.thirsty}</div>
                  <div className="text-xs text-earth-500 font-medium uppercase tracking-wider">Needs Water</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/50 backdrop-blur-sm p-1.5 rounded-xl border border-earth-200 flex gap-1 self-start md:self-auto"
            >
              {(['all', 'thirsty', 'healthy'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize relative ${
                    activeFilter === filter ? 'text-leaf-700' : 'text-earth-500 hover:text-earth-700 hover:bg-white/50'
                  }`}
                >
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-earth-100"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {filter === 'thirsty' && <Droplets size={14}/>}
                    {filter === 'healthy' && <Heart size={14}/>}
                    {filter}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-earth-400">
            <div className="animate-pulse flex flex-col items-center">
              <Leaf size={48} className="text-leaf-200 mb-4" />
              <p>Loading your garden...</p>
            </div>
          </div>
        ) : plants.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[50vh] text-center px-4"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-leaf-100 to-leaf-50 rounded-full flex items-center justify-center mb-8 shadow-inner relative overflow-hidden">
               <motion.div 
                 animate={{ y: [0, -5, 0] }} 
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
               >
                 <Sprout size={56} className="text-leaf-500 relative z-10" />
               </motion.div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>
            <h2 className="text-3xl font-bold text-earth-800 mb-3 tracking-tight">Your garden awaits</h2>
            <p className="text-earth-500 max-w-md mb-10 text-lg leading-relaxed">
              Start your collection by adding your first plant. We'll use AI to figure out the perfect care schedule.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-leaf-600 hover:bg-leaf-700 text-white px-10 py-4 rounded-full font-semibold shadow-xl shadow-leaf-200 transition-all flex items-center gap-2 group"
            >
              <Sprout size={20} className="group-hover:rotate-12 transition-transform" />
              Add Your First Plant
            </motion.button>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20"
            >
              <AnimatePresence mode="popLayout">
                {filteredPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onWater={handleWaterPlant}
                    onDelete={handleDeletePlant}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredPlants.length === 0 && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="text-center py-20 text-earth-400 italic"
               >
                 No plants match this filter.
               </motion.div>
            )}
          </LayoutGroup>
        )}
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50"
          >
            <div className="bg-earth-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3">
              <CheckCircle2 size={20} className="text-leaf-400" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddPlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPlant}
      />
    </div>
  );
};

export default App;