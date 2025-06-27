import React from 'react';
import { motion } from 'framer-motion';
import { formatChips } from '@/lib/currencyUtils';

// You might need to adjust the path based on your project structure
import ChipImage from '/chips/chip-red.png'; 

interface ChipStackProps {
  amount: number;
  // Position can be more complex, e.g., an object with x, y coords
  // For now, we assume it's controlled by the parent's layout
}

const ChipStack: React.FC<ChipStackProps> = ({ amount }) => {
  if (amount <= 0) return null;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <img src={ChipImage} alt="Poker Chip" className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-lg" />
      <div className="mt-[-10px] bg-black/70 text-white text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full border border-yellow-400/50 shadow-md">
        {formatChips(amount)}
      </div>
    </motion.div>
  );
};

export default ChipStack; 