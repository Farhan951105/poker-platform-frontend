
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/lib/types";

interface PokerTableProps {
  tournament: Tournament;
}

const PokerTable = ({ tournament }: PokerTableProps) => {
  // Mock player seats (in a real implementation, this would come from game state)
  const seats = Array.from({ length: 9 }, (_, i) => ({
    seatNumber: i + 1,
    player: tournament.players[i] || null,
    chips: Math.floor(Math.random() * 50000) + 10000,
    isActive: i < tournament.players.length,
    isDealer: i === 0,
    isSmallBlind: i === 1,
    isBigBlind: i === 2,
  }));

  return (
    <Card className="bg-green-800 border-green-600 relative overflow-hidden">
      <CardContent className="p-8">
        {/* Poker Table Oval */}
        <div className="relative mx-auto" style={{ width: '600px', height: '400px' }}>
          {/* Table Surface */}
          <div className="absolute inset-4 bg-green-700 rounded-full border-8 border-amber-600 shadow-2xl">
            {/* Community Cards Area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((card) => (
                  <div
                    key={card}
                    className="w-12 h-16 bg-white rounded border-2 border-gray-300 shadow-lg flex items-center justify-center"
                  >
                    <span className="text-xs text-gray-400">?</span>
                  </div>
                ))}
              </div>
              {/* Pot */}
              <div className="text-center mt-2">
                <Badge variant="secondary" className="bg-yellow-600 text-white">
                  Pot: $12,500
                </Badge>
              </div>
            </div>
          </div>

          {/* Player Seats */}
          {seats.map((seat) => {
            const angle = (seat.seatNumber - 1) * (360 / 9);
            const radius = 280;
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

            return (
              <div
                key={seat.seatNumber}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${300 + x}px`,
                  top: `${200 + y}px`,
                }}
              >
                {seat.player ? (
                  <div className="text-center">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                          {seat.player.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {seat.isDealer && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          D
                        </div>
                      )}
                      {seat.isSmallBlind && (
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          SB
                        </div>
                      )}
                      {seat.isBigBlind && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          BB
                        </div>
                      )}
                    </div>
                    <div className="mt-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      <div className="font-semibold">{seat.player}</div>
                      <div className="text-green-400">${seat.chips.toLocaleString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center bg-green-600/50">
                    <span className="text-gray-300 text-sm">Empty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PokerTable;
