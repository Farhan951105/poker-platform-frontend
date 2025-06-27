import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNow } from "./useNow";
import { parseTournamentStartTime } from "@/lib/dateUtils";
import { calculateTournamentDynamicState } from "@/lib/tournamentUtils";
import { Tournament } from "@/lib/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useTournament = (tournamentId: string | undefined) => {
  const now = useNow();

  const { data: tournament, isLoading, isError } = useQuery<Tournament>({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      if (!tournamentId) throw new Error('Tournament ID is required');
      const res = await axios.get(`${API_BASE_URL}/api/users/tournaments/${tournamentId}`);
      const t = res.data;
      return {
        ...t,
        id: t.id,
        name: t.name ?? '',
        gameType: t.gameType ?? '',
        buyIn: t.entryFee?.toString() ?? "0",
        prizePool: t.prizePool?.toString() ?? "0",
        startTime: t.startsAt ?? 'Upcoming',
        status: t.status ?? 'Upcoming',
        durationHours: t.durationHours ?? 2,
        players: t.players ?? [],
        maxPlayers: t.maxPlayers ?? 0,
        parsedStartTime: parseTournamentStartTime(t.startsAt)
      };
    },
    enabled: !!tournamentId
  });

  const processedTournament = tournament ? calculateTournamentDynamicState(tournament, now) : null;

  return {
    tournament: processedTournament,
    isLoading,
    isError
  };
};
