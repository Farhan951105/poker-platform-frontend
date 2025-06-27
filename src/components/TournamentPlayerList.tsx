import { useEffect, useState } from "react";
import { Users, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { tournamentAPI } from "@/utils/api";

interface TournamentPlayerListProps {
  tournamentId: string | number;
}

const TournamentPlayerList = ({ tournamentId }: TournamentPlayerListProps) => {
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Fetching players for tournament:', tournamentId);
    
    tournamentAPI.getTournamentRegistrations(tournamentId.toString())
      .then(res => {
        console.log('API response:', res);
        // Extract players from registrations - each registration has a User property
        const playersFromRegistrations = res.registrations ? 
          res.registrations.map((registration: any) => registration.User).filter(Boolean) : [];
        setPlayers(playersFromRegistrations);
      })
      .catch(err => {
        console.error('API error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [tournamentId]);

  return (
    <div>
      <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center">
        <Users className="h-5 w-5 mr-3 text-primary" />
        Registered Players ({players.length})
      </h3>
      <div className="rounded-lg border bg-background max-h-60 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="p-4 text-sm text-destructive">{error}</p>
        ) : players.length > 0 ? (
          <ul className="divide-y divide-border">
            {players.map((player) => (
              <li key={player.id} className="p-3 flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} alt={player.username} />
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{player.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No players have registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default TournamentPlayerList;
