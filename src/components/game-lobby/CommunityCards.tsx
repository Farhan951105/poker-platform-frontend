import PlayingCard from "./PlayingCard";

interface CommunityCardsProps {
  cards: string[];
}

const CommunityCards = ({ cards }: CommunityCardsProps) => {
  // Don't render anything if there are no cards
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Cards container with 3D perspective */}
      <div className="flex gap-2 transform-gpu hover:scale-105 transition-all duration-500 perspective-1000">
        {cards.map((card, index) => (
          <div
            key={index}
            className="transform-gpu transition-all duration-300 hover:-translate-y-3"
            style={{
              animationDelay: `${index * 0.1}s`,
              transform: `rotateY(${index * 2}deg) translateZ(${index * 5}px)`
            }}
          >
            <PlayingCard 
              card={card} 
            />
          </div>
        ))}
      </div>
      
      {/* Glowing base effect */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full blur-sm animate-pulse"></div>
    </div>
  );
};

export default CommunityCards; 