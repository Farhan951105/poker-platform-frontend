import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useTournament } from "@/hooks/useTournament";
import NotFound from "./NotFound";
import PokerTable from "@/components/PokerTable";
import TournamentHeader from "@/components/TournamentHeader";
import GameChat from "@/components/GameChat";
import HandUpdates from "@/components/HandUpdates";
import BlindInfo from "@/components/BlindInfo";

const PokerGameLobbyPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { tournament, isLoading, isError } = useTournament(tournamentId);

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4 flex items-center justify-center">
      <div className="text-white">Loading tournament...</div>
    </div>;
  }

  if (isError || !tournament) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Tournament Header with Title, Blinds, Timer, Players Left */}
        <TournamentHeader tournament={tournament} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Poker Table Area */}
          <div className="lg:col-span-3">
            <PokerTable tournament={tournament} />
          </div>
          
          {/* Sidebar with Chat and Hand Updates */}
          <div className="space-y-4">
            <BlindInfo tournament={tournament} />
            <GameChat tournamentId={tournament.id} />
            <HandUpdates tournamentId={tournament.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerGameLobbyPage;
