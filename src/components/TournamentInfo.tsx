
import { Trophy, DollarSign, Users, Puzzle, Clock } from "lucide-react";

interface TournamentInfoProps {
  prizePool: string;
  buyIn: string;
  playersLength: number;
  maxPlayers: number;
  gameType: string;
  durationHours: number;
}

const TournamentInfo = ({ prizePool, buyIn, playersLength, maxPlayers, gameType, durationHours }: TournamentInfoProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Tournament Details</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 mr-3 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Prize Pool</p>
            <p className="font-bold text-lg">{prizePool}</p>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 mr-3 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Buy-in</p>
            <p className="font-bold text-lg">{buyIn}</p>
          </div>
        </div>
          <div className="flex items-center">
          <Users className="h-5 w-5 mr-3 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Players</p>
            <p className="font-bold text-lg">{playersLength} / {maxPlayers}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Puzzle className="h-5 w-5 mr-3 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Game</p>
            <p className="font-bold text-lg">{gameType}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-3 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-bold text-lg">{durationHours} hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
