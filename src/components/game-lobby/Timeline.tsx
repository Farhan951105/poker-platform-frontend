import { useState, useEffect } from "react";

const Timeline = () => {
  const [gameStartTime] = useState(new Date()); // Game start time
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed seconds since game start
  const [blindLevel, setBlindLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate elapsed time since game start
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - gameStartTime.getTime()) / 1000);
      setElapsedTime(elapsed);
      
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setBlindLevel(level => level + 1);
          return 15 * 60; // Reset to 15 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStartTime]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-4 z-30">
      <div className="transform-gpu hover:scale-105 transition-all duration-300">
        {/* Container with multiple shadow layers */}
        <div className="absolute inset-0 bg-black/50 blur-2xl transform translate-y-3 scale-110 rounded-lg"></div>
        <div className="absolute inset-0 bg-black/30 blur-xl transform translate-y-2 scale-105 rounded-lg"></div>
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-teal-800/95 via-teal-900/95 to-slate-900/95 backdrop-blur-lg p-3 sm:p-4 lg:p-5 border border-teal-700/50 shadow-2xl rounded-lg">
          <div className="space-y-2 sm:space-y-3">
            {/* Game Elapsed Time */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full animate-pulse shadow-lg shadow-teal-400/50"></div>
              <div className="text-white text-xs sm:text-sm font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                Game Time: {formatElapsedTime(elapsedTime)}
              </div>
            </div>
            
            {/* Blind Level */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-400/50"></div>
              <div className="text-teal-300 text-xs sm:text-sm font-semibold">
                Blind Level: {blindLevel}
              </div>
            </div>
            
            {/* Next Level Timer */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
              <div className="text-yellow-400 text-xs font-medium">
                Next: {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          
          {/* Container glow effect */}
          <div className="absolute inset-0 border border-teal-400/20 animate-pulse pointer-events-none rounded-lg"></div>
          <div className="absolute inset-1 border border-teal-300/10 animate-pulse pointer-events-none rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline; 