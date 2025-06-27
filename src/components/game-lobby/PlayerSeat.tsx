import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatChips } from '@/lib/currencyUtils';
import PlayingCard from './PlayingCard';
import { motion } from 'framer-motion';
import TimerBar from './TimerBar';

export interface Player {
  id: string | number;
  name: string;
  chips: number;
  seat: number;
  position: string;
  isActive: boolean;
  isPlayer?: boolean;
  avatarColor?: string;
  cards?: string[];
  isInHand?: boolean;
  turnStartedAt?: string;
  turnExpiresAt?: string;
  handRank?: string;
  isWinner?: boolean;
}

interface PlayerSeatProps {
  player: Player | null;
  seatId: number;
  currentUserId: string | null;
  onSitDown: (seatId: number) => void;
  onStandUp: () => void;
  onAddChips: () => void;
}

const PlayerSeat: React.FC<PlayerSeatProps> = ({ 
  player, 
  seatId, 
  currentUserId,
  onSitDown,
  onStandUp,
  onAddChips
}) => {
  const getPositionStyles = () => {
    const baseClasses = "absolute flex flex-col items-center transform-gpu hover:scale-105 transition-all duration-300";
    switch (player?.position) {
      case "top":
        return `${baseClasses} -top-16 sm:-top-20 lg:-top-28 left-1/2 -translate-x-1/2`;
      case "top-left":
        return `${baseClasses} -top-12 sm:-top-16 lg:-top-24 left-4 sm:left-8 lg:left-16`;
      case "top-right":
        return `${baseClasses} -top-12 sm:-top-16 lg:-top-24 right-4 sm:right-8 lg:right-16`;
      case "left":
        return `${baseClasses} -left-20 sm:-left-24 lg:-left-32 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseClasses} -right-20 sm:-right-24 lg:-right-32 top-1/2 -translate-y-1/2`;
      case "bottom":
        return `${baseClasses} -bottom-24 sm:-bottom-32 lg:-bottom-40 left-1/2 -translate-x-1/2`;
      case "bottom-left":
        return `${baseClasses} -bottom-12 sm:-bottom-16 lg:-bottom-24 left-4 sm:left-8 lg:left-16`;
      case "bottom-right":
        return `${baseClasses} -bottom-12 sm:-bottom-16 lg:-bottom-24 right-4 sm:right-8 lg:right-16`;
      default:
        return baseClasses;
    }
  };

  const formatChips = (chips: number) => {
    return chips.toLocaleString();
  };

  // Show "SEAT OPEN" for empty seats
  if (player?.name === "SEAT OPEN") {
    return (
      <div className={`${getPositionStyles()} group`}>
        <div className="relative">
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/40 rounded-full blur-lg transform translate-y-2 scale-110"></div>
          
          {/* Seat Open Circle */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-teal-600/80 to-teal-800/80 backdrop-blur-lg rounded-full border-2 sm:border-3 border-teal-500/60 shadow-2xl transform-gpu hover:shadow-3xl transition-all duration-300 flex items-center justify-center">
            <div className="text-white text-xs sm:text-sm font-bold text-center leading-tight opacity-100 group-hover:opacity-0 transition-opacity">
              SEAT<br/>OPEN
            </div>
            <Button 
              onClick={() => onSitDown(seatId)}
              className="absolute inset-0 w-full h-full rounded-full bg-green-500/80 hover:bg-green-500 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Sit Here
            </Button>
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-teal-400/30 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const getAvatarColor = () => {
    switch (player?.avatarColor) {
      case "orange":
        return "from-orange-500 to-orange-700";
      case "blue":
        return "from-blue-500 to-blue-700";
      default:
        return "from-teal-500 to-teal-700";
    }
  };

  return (
    <div className={`${getPositionStyles()}`}>
      <div className="relative group">
        
        {/* Hole Cards */}
        {player && player.isInHand && (
          <motion.div 
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex justify-center w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex">
              {player.cards && player.cards.length === 2 ? (
                <>
                  <PlayingCard card={player.cards[0]} isFaceUp={true} className="-mr-8 -rotate-12" />
                  <PlayingCard card={player.cards[1]} isFaceUp={true} className="rotate-12" />
                </>
              ) : (
                <>
                  <PlayingCard card="back" isFaceUp={false} className="-mr-8" />
                  <PlayingCard card="back" isFaceUp={false} />
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Player Info Container */}
        {player ? (
          <>
            {/* Player Info Container with enhanced 3D */}
            <div className={`relative transform-gpu transition-all duration-500 ${
              player.isWinner ? 'animate-winner-glow' : ''
            }`}>
              {/* Multiple shadow layers for depth */}
              <div className={`absolute inset-0 bg-black/50 rounded-full blur-xl transform translate-y-2 group-hover:translate-y-3 transition-transform duration-300 ${
                player.isWinner ? 'shadow-yellow-400/80' : ''
              }`}></div>
              
              {/* Main player container */}
              <div className={`relative bg-gradient-to-br ${getAvatarColor()}/95 backdrop-blur-lg rounded-full p-2 sm:p-3 lg:p-4 border-2 sm:border-3 shadow-2xl transform-gpu hover:shadow-3xl transition-all duration-300 ${
                player.isActive 
                  ? 'border-yellow-400 shadow-yellow-400/40 shadow-2xl' 
                  : 'border-white/30 hover:border-white/50'
                } ${
                player.isWinner ? 'border-yellow-400 shadow-yellow-400/40' : ''
              } group`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Avatar with enhanced glow */}
                  <div className={`relative ${player.isActive ? 'animate-pulse' : ''}`}>
                    <div className={`absolute inset-0 rounded-full blur-md ${
                      player.isActive ? 'bg-yellow-400/60' : 'bg-white/30'
                    }`}></div>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 relative transform-gpu hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player?.name}`} />
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor()} text-white font-bold text-xs sm:text-sm lg:text-lg`}>
                        {player?.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Player details with enhanced styling */}
                  <div className="text-white min-w-0">
                    <div className="font-bold text-xs sm:text-sm lg:text-base bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent truncate">
                      {formatChips(player?.chips || 0)}
                    </div>
                    <div className="text-xs lg:text-sm text-white/80 font-medium truncate">
                      {player.handRank ? player.handRank : player?.name}
                    </div>
                  </div>
                </div>
                
                {player.isActive && player.turnStartedAt && player.turnExpiresAt && (
                  <div className="w-full px-2 pt-1">
                    <TimerBar startTime={player.turnStartedAt} endTime={player.turnExpiresAt} />
                  </div>
                )}
                
                {player?.isPlayer && (
                  <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex gap-1">
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={onStandUp}
                    >
                      Stand Up
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={onAddChips}
                    >
                      Add Chips
                    </Button>
                  </div>
                )}
                
                {/* Active player glowing ring */}
                {player?.isActive && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400/80 animate-pulse"></div>
                    <div className="absolute inset-1 rounded-full border border-yellow-300/60 animate-pulse"></div>
                  </>
                )}
                
                {/* Inner glow effect */}
                <div className="absolute inset-0.5 rounded-full border border-white/10 animate-pulse"></div>
              </div>
            </div>

            {/* Speech bubble for active player */}
            {player?.isActive && player?.name === "Vlad B." && (
              <div className="mt-2 sm:mt-3 transform-gpu animate-bounce">
                <div className="relative">
                  {/* Speech bubble shadow */}
                  <div className="absolute inset-0 bg-black/30 blur-md transform translate-y-1 scale-105 rounded-lg"></div>
                  
                  {/* Speech bubble */}
                  <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold shadow-2xl border border-green-400 overflow-hidden rounded-lg">
                    <span className="relative z-10">Great Game !</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                  
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-black/30 backdrop-blur-sm border-2 border-dashed border-white/20 flex items-center justify-center transform-gpu hover:scale-105 hover:border-green-400 transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <span className="text-white text-xs font-semibold">SIT HERE</span>
              </div>
            </div>
            <Button 
              onClick={() => onSitDown(seatId)}
              className="absolute inset-0 w-full h-full rounded-full bg-green-500/80 hover:bg-green-500 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Sit Here
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSeat; 