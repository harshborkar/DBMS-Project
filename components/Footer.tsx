import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 py-8 mt-4 flex flex-col items-center justify-center text-earth-400 text-sm relative z-10"
    >
      <div className="flex items-center gap-2 mb-2">
        <span>Grown with</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Heart size={14} className="fill-rose-400 text-rose-400" />
        </motion.div>
        <span>by LeafLink</span>
      </div>
      <div className="flex gap-4 opacity-70">
        <a href="#" className="hover:text-leaf-600 transition-colors hover:underline">Privacy</a>
        <a href="#" className="hover:text-leaf-600 transition-colors hover:underline">Terms</a>
      </div>
    </motion.footer>
  );
};

export default Footer;