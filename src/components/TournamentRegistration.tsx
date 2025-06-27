import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/lib/types";
import { useTournamentsData } from "@/contexts/TournamentsContext";

interface TournamentRegistrationProps {
  tournament: Tournament;
  onRegistrationChange?: () => void;
}

const TournamentRegistration = ({ tournament, onRegistrationChange }: TournamentRegistrationProps) => {
  const { registerPlayer, unregisterPlayer } = useTournamentsData();

  const { id, players, maxPlayers, dynamicStatus, lateRegEndDate, isRegistered } = tournament;

  console.log('TournamentRegistration Debug:', {
    tournamentId: id,
    isRegistered,
    dynamicStatus,
    playersLength: players.length,
    maxPlayers,
    lateRegEndDate
  });

  // Local state for instant UI feedback
  const [localRegistered, setLocalRegistered] = useState(isRegistered);
  const [loading, setLoading] = useState(false);

  // Sync local state with prop when it changes
  useEffect(() => {
    setLocalRegistered(isRegistered);
  }, [isRegistered]);

  // Assume current user is identified by AuthContext or server-side
  // For now, treat 'You' as placeholder for current user
  const isFull = players.length >= maxPlayers;

  // Registration logic per requirements
  const registrationOpen = ['Registering', 'registering', 'Late Reg', 'late reg'].includes(dynamicStatus);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setLocalRegistered(true); // Optimistic update
      
      // Use the context function which handles API call and query invalidation
      await registerPlayer(id);
      
      onRegistrationChange?.();
    } catch (error) {
      // Revert optimistic update on error
      setLocalRegistered(false);
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setLoading(true);
      setLocalRegistered(false); // Optimistic update
      
      // Use the context function which handles API call and query invalidation
      await unregisterPlayer(id);
      
      onRegistrationChange?.();
    } catch (error) {
      // Revert optimistic update on error
      setLocalRegistered(true);
      console.error('Unregistration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationMessage = () => {
    if (localRegistered) {
      return "You are registered. You can unregister any time before the tournament starts.";
    }
    if (isFull) {
      return "This tournament is full. No more registrations are allowed.";
    }
    if (registrationOpen) {
      return "Registration is currently open. Join now to secure your spot!";
    }
    return "Registration is closed for this tournament.";
  };

  const getButtonState = () => {
    if (localRegistered) {
      return { text: "Unregister", disabled: false, action: 'unregister' as const };
    }
    if (isFull) return { text: "Tournament Full", disabled: true, action: 'none' as const };
    if (registrationOpen) return { text: "Register Now", disabled: false, action: 'register' as const };
    return { text: "Registration Closed", disabled: true, action: 'none' as const };
  }

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col justify-between rounded-lg bg-card-foreground/5 p-6 dark:bg-card-foreground/10">
      <div>
        <h3 className="text-xl font-semibold">Registration</h3>
        <p className="text-muted-foreground mt-2">
          {getRegistrationMessage()}
        </p>
      </div>
      <Button
        size="lg"
        disabled={buttonState.disabled || loading}
        className="mt-4"
        onClick={
          buttonState.action === 'register' ? handleRegister :
            buttonState.action === 'unregister' ? handleUnregister :
              undefined
        }
        variant={buttonState.action === 'unregister' ? 'destructive' : 'default'}
      >
        {loading ? 'Processing...' : buttonState.text}
      </Button>
    </div>
  );
};

export default TournamentRegistration;
