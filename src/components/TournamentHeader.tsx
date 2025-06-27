
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { Tournament } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface TournamentHeaderProps {
  tournament: Tournament;
}

const TournamentHeader = ({ tournament }: TournamentHeaderProps) => {
  const playersLeft = tournament.players.length;
  
  return (
    <Card className="bg-black/50 border-green-600">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <Badge variant="secondary" className="bg-green-600 text-white">
              {tournament.dynamicStatus}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{playersLeft} Players Left</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {tournament.parsedStartTime && 
                  formatDistanceToNow(tournament.parsedStartTime, { addSuffix: true })
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentHeader;
