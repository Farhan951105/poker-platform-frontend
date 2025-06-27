import React from 'react';
import { motion } from 'framer-motion';

const DealerButton = () => {
  return (
    <motion.div
      className="absolute z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-gray-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-black font-extrabold text-lg sm:text-xl">D</span>
    </motion.div>
  );
};

export default DealerButton; 