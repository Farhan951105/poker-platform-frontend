import { useState, useMemo } from "react";
import { Tournament, TournamentSortKey, SortConfig, SortDirection } from "@/lib/types";
import { useNow } from "./useNow";
import { parseTournamentStartTime } from "@/lib/dateUtils";
import { calculateTournamentDynamicState } from "@/lib/tournamentUtils";
import { parseCurrency } from "@/lib/currencyUtils";
import { useQuery } from '@tanstack/react-query';
import { tournamentAPI } from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useTournaments = (searchTerm: string, gameFilter: string, statusFilter: string) => {
  const [tournamentSortConfig, setTournamentSortConfig] = useState<SortConfig<TournamentSortKey> | null>({ key: 'status', direction: 'asc' });
  const now = useNow();

  const { data: tournaments = [], isLoading, isError } = useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const data = await tournamentAPI.getAllTournaments();
      return data.map((t: any) => ({
        ...t,
        id: t.id ?? 0,
        name: t.name ?? '',
        gameType: t.gameType ?? '',
        buyIn: t.entryFee?.toString() ?? "0",
        prizePool: t.prizePool?.toString() ?? "0",
        startTime: t.startsAt ?? 'Upcoming',
        status: t.status ?? 'Upcoming',
        durationHours: t.durationHours ?? 2,
        players: t.players ?? [],
        maxPlayers: t.maxPlayers ?? 0,
        isRegistered: t.isRegistered ?? false,
      }));
    },
  });

  const handleTournamentSort = (key: TournamentSortKey) => {
    let direction: SortDirection = 'asc';
    if (tournamentSortConfig && tournamentSortConfig.key === key && tournamentSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setTournamentSortConfig({ key, direction });
  };

  const tournamentsWithParsedTime = useMemo(() => 
    tournaments.map(t => ({
      ...t,
      parsedStartTime: parseTournamentStartTime(t.startTime)
    })),
    [tournaments]
  );

  const processedTournaments = useMemo(() => 
    tournamentsWithParsedTime.map(tournament => calculateTournamentDynamicState(tournament, now)), 
    [tournamentsWithParsedTime, now]
  );

  const filteredTournaments = useMemo(() => 
    processedTournaments.filter((tournament) => {
      const searchMatch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
      const gameFilterMatch = gameFilter === 'all' || tournament.gameType === gameFilter;
      
      const statusFilterMatch = (() => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'active') return tournament.dynamicStatus !== 'Finished';
        return tournament.dynamicStatus === statusFilter;
      })();

      return searchMatch && gameFilterMatch && statusFilterMatch;
    }), 
    [searchTerm, gameFilter, statusFilter, processedTournaments]
  );

  const sortedTournaments = useMemo(() => {
    let sortableItems = [...filteredTournaments];
    if (tournamentSortConfig !== null) {
      const statusOrder = ['Registering', 'Late Reg', 'Running', 'Upcoming', 'Finished'];

      sortableItems.sort((a, b) => {
        const key = tournamentSortConfig.key;

        if (key === 'status') {
          const aIndex = statusOrder.indexOf(a.dynamicStatus);
          const bIndex = statusOrder.indexOf(b.dynamicStatus);
          const result = aIndex - bIndex;
          return tournamentSortConfig.direction === 'asc' ? result : -result;
        }

        let aVal, bVal;

        switch (key) {
          case 'buyIn':
          case 'prizePool':
            aVal = parseCurrency(a[key as 'buyIn' | 'prizePool']);
            bVal = parseCurrency(b[key as 'buyIn' | 'prizePool']);
            break;
          case 'startTime':
            if (!a.parsedStartTime) return 1;
            if (!b.parsedStartTime) return -1;
            aVal = a.parsedStartTime.getTime();
            bVal = b.parsedStartTime.getTime();
            break;
          case 'players':
            aVal = a.players.length;
            bVal = b.players.length;
            break;
          default:
            aVal = a[key as keyof typeof a];
            bVal = b[key as keyof typeof b];
        }

        if (aVal < bVal) {
          return tournamentSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return tournamentSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTournaments, tournamentSortConfig]);

  return {
    sortedTournaments,
    tournamentSortConfig,
    handleTournamentSort,
    isLoading,
    isError
  };
};
