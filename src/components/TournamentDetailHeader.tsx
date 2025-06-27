
import { Link } from "react-router-dom";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import Countdown from "@/components/Countdown";
import { getTournamentStatusVariant } from "@/lib/tournamentUtils";

interface TournamentDetailHeaderProps {
  name: string;
  dynamicStatus: string;
  parsedStartTime: Date | null;
  lateRegEndDate: Date | null;
}

const TournamentDetailHeader = ({ name, dynamicStatus, parsedStartTime, lateRegEndDate }: TournamentDetailHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div>
          <CardTitle className="text-3xl font-bold text-primary">{name}</CardTitle>
          <div className="flex items-center flex-wrap gap-4 mt-2">
            <Badge variant={getTournamentStatusVariant(dynamicStatus)}>{dynamicStatus}</Badge>
            <span className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <Countdown 
                targetDate={parsedStartTime} 
                status={dynamicStatus} 
                lateRegEndDate={lateRegEndDate} 
              />
            </span>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link to="/tournaments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tournaments
          </Link>
        </Button>
      </div>
    </CardHeader>
  );
};

export default TournamentDetailHeader;
