import React from 'react';
import { Sprout, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAddClick: () => void;
  userEmail: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, userEmail, onSignOut }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }}
      className="bg-white/30 backdrop-blur-xl border-b border-white/30 sticky top-0 z-40 transition-colors duration-300 supports-[backdrop-filter]:bg-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2 sm:gap-3 group cursor-default"
          whileHover="hover"
        >
          <motion.div 
            variants={{
              hover: { rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/40 border border-white/50 flex items-center justify-center text-leaf-600 shadow-sm backdrop-blur-sm transition-colors"
          >
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-semibold text-earth-800 tracking-tight transition-colors select-none">
            Leaf<span className="text-leaf-600">Link</span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          {userEmail && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex items-center gap-2 text-sm text-earth-600 bg-white/30 px-4 py-1.5 rounded-full border border-white/40 shadow-sm backdrop-blur-sm transition-colors"
            >
              <User size={14} />
              <span className="font-medium opacity-80">{userEmail}</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(97, 191, 147, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className="bg-leaf-500/90 hover:bg-leaf-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-lg shadow-leaf-500/20 border border-white/20 backdrop-blur-md flex items-center gap-1.5 sm:gap-2"
          >
            <Sprout size={16} className="hidden sm:block" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Plant</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSignOut}
            className="p-2 sm:p-2.5 rounded-full text-earth-500 hover:bg-rose-50/50 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-200"
            title="Sign Out"
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;