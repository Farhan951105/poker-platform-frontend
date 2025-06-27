import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNow } from '@/hooks/useNow';

interface TimerBarProps {
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
}

const TimerBar: React.FC<TimerBarProps> = ({ startTime, endTime }) => {
  const now = useNow();
  const [percentRemaining, setPercentRemaining] = useState(100);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (isNaN(start) || isNaN(end) || start >= end) {
      setPercentRemaining(0);
      return;
    }
    
    const totalDuration = end - start;
    const elapsed = now.getTime() - start;
    
    const remaining = Math.max(0, totalDuration - elapsed);
    const percentage = (remaining / totalDuration) * 100;

    setPercentRemaining(percentage);

  }, [now, startTime, endTime]);

  const barColor = percentRemaining > 50 
    ? 'bg-green-500' 
    : percentRemaining > 20 
    ? 'bg-yellow-500' 
    : 'bg-red-500';

  return (
    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden border border-white/20 mt-1">
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={{ width: '100%' }}
        animate={{ width: `${percentRemaining}%` }}
        transition={{ ease: "linear", duration: 1 }}
      />
    </div>
  );
};

export default TimerBar; 