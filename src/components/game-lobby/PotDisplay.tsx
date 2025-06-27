interface PotDisplayProps {
  pot: number;
}

const PotDisplay = ({ pot }: PotDisplayProps) => {
  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu hover:scale-105 transition-all duration-300">
      {/* Pot shadow */}
      <div className="absolute inset-0 bg-black/40 blur-lg transform translate-y-2 scale-110"></div>
      
      {/* Main pot container */}
      <div className="relative">
        {/* Pot amount with 3D effect */}
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 sm:px-6 py-2 sm:py-3 font-bold shadow-2xl transform-gpu hover:shadow-3xl transition-all duration-300 border-2 border-yellow-300 relative overflow-hidden">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
          
          {/* Pot text */}
          <span className="relative z-10 text-sm sm:text-lg font-extrabold bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900 bg-clip-text text-transparent">
            pot: {pot.toLocaleString()}
          </span>
          
          {/* Inner glow */}
          <div className="absolute inset-1 border border-yellow-200/50 animate-pulse"></div>
        </div>
        
        {/* Table name with glow */}
        <div className="text-center mt-2">
          <div className="inline-block bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg text-white text-xs sm:text-sm px-3 sm:px-4 py-1 shadow-xl border border-slate-700/50 transform-gpu hover:scale-105 transition-all duration-300">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent font-semibold">
              Table: Studio Royal Arts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotDisplay; 