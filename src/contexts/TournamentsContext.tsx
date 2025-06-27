import { createContext, useContext, useState, ReactNode } from 'react';
import { mockTournaments as initialTournaments } from '@/lib/mockData';
import { toast } from 'sonner';
import { BaseTournament } from '@/lib/types';
import { tournamentAPI } from '@/utils/api';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

type TournamentData = (typeof initialTournaments)[number];

interface TournamentsContextType {
  tournaments: BaseTournament[];
  registerPlayer: (tournamentId: number) => Promise<void>;
  unregisterPlayer: (tournamentId: number) => Promise<void>;
}

const TournamentsContext = createContext<TournamentsContextType | undefined>(undefined);

export const TournamentsProvider = ({ children }: { children: ReactNode }) => {
  const [tournaments, setTournaments] = useState<BaseTournament[]>(initialTournaments as unknown as BaseTournament[]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const registerPlayer = async (tournamentId: number) => {
    if (!user) {
      toast.error('You must be logged in to register.');
      return;
    }
    try {
      await tournamentAPI.registerForTournament(String(tournamentId));
      toast.success('Successfully registered for tournament!');
      
      // Invalidate and refetch tournaments to update the UI
      await queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      await queryClient.refetchQueries({ queryKey: ['tournaments'] });
      
      // Also invalidate the individual tournament query
      await queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      await queryClient.refetchQueries({ queryKey: ['tournament', tournamentId] });
      
      // Force a refetch to ensure immediate update
      await queryClient.refetchQueries({ 
        queryKey: ['tournament', tournamentId],
        exact: true 
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed.');
      throw err; // Re-throw to let the component handle the error
    }
  };

  const unregisterPlayer = async (tournamentId: number) => {
    if (!user) {
      toast.error('You must be logged in to unregister.');
      return;
    }
    try {
      await tournamentAPI.unregisterFromTournament(String(tournamentId));
      toast.success('Successfully unregistered from tournament.');
      
      // Invalidate and refetch tournaments to update the UI
      await queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      await queryClient.refetchQueries({ queryKey: ['tournaments'] });
      
      // Also invalidate the individual tournament query
      await queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      await queryClient.refetchQueries({ queryKey: ['tournament', tournamentId] });
      
      // Force a refetch to ensure immediate update
      await queryClient.refetchQueries({ 
        queryKey: ['tournament', tournamentId],
        exact: true 
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Unregistration failed.');
      throw err; // Re-throw to let the component handle the error
    }
  };

  return (
    <TournamentsContext.Provider value={{ tournaments, registerPlayer, unregisterPlayer }}>
      {children}
    </TournamentsContext.Provider>
  );
};

export const useTournamentsData = () => {
  const context = useContext(TournamentsContext);
  if (context === undefined) {
    throw new Error('useTournamentsData must be used within a TournamentsProvider');
  }
  return context;
};
