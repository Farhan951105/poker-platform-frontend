import React from 'react';
import { motion } from 'framer-motion';

interface PlayingCardProps {
  card: string; // e.g., 'As', 'Th', '2c' or 'back'
  isFaceUp?: boolean;
  className?: string;
}

const rankMap: { [key: string]: string } = {
  'A': '14', 'K': '13', 'Q': '12', 'J': '11', 'T': '10',
  '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2'
};

const suitMap: { [key: string]: string } = {
  's': 'S', 'h': 'H', 'd': 'D', 'c': 'C'
};

const PlayingCard: React.FC<PlayingCardProps> = ({ card, isFaceUp = true, className = '' }) => {
  const getCardImageSrc = () => {
    if (!isFaceUp || card === 'back') {
      return '/PlayingCard/back_cards-07.png';
    }

    const rank = card.charAt(0).toUpperCase();
    const suit = card.charAt(1).toLowerCase();

    const rankValue = rankMap[rank];
    const suitValue = suitMap[suit];

    if (!rankValue || !suitValue) {
      // Return a default or error image if card format is invalid
      return '/PlayingCard/back_cards-07.png';
    }

    return `/PlayingCard/${rankValue}${suitValue}.png`;
  };
  
  const cardImage = getCardImageSrc();

  return (
    <motion.div
      className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg shadow-md transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <img
        src={cardImage}
        alt={isFaceUp ? card : 'Card back'}
        className="w-full h-full object-contain rounded-lg"
      />
    </motion.div>
  );
};

export default PlayingCard; 