import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Countdown from "./Countdown";
import { Tournament } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";
import { getTournamentStatusVariant } from "@/lib/tournamentUtils";
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";
import { useTournamentsData } from "@/contexts/TournamentsContext";

interface TournamentRowProps {
  tournament: Tournament;
}

const TournamentRow = ({ tournament }: TournamentRowProps) => {
  const { registerPlayer, unregisterPlayer } = useTournamentsData();
  const navigate = useNavigate();

  const handleAction = async () => {
    try {
      console.log('TournamentRow handleAction:', {
        tournamentId: tournament.id,
        isRegistered: tournament.isRegistered,
        action: tournament.isRegistered ? 'unregister' : 'register'
      });

      if (tournament.isRegistered) {
        if (tournament.dynamicStatus === 'Running' || tournament.dynamicStatus === 'Late Reg') {
          navigate(`/tournaments/lobby/${tournament.id}`);
        } else {
          await unregisterPlayer(tournament.id);
        }
      } else {
        await registerPlayer(tournament.id);
      }
    } catch (error) {
      console.error('TournamentRow handleAction error:', error);
    }
  };

  const getButtonInfo = () => {
    console.log('TournamentRow Debug:', {
      tournamentId: tournament.id,
      isRegistered: tournament.isRegistered,
      dynamicStatus: tournament.dynamicStatus,
      playersLength: tournament.players.length,
      maxPlayers: tournament.maxPlayers
    });

    if (tournament.isRegistered) {
      if (tournament.dynamicStatus === 'Running' || tournament.dynamicStatus === 'Late Reg') {
        return { text: "Enter Lobby", variant: "default" as const, disabled: false };
      }
      // Allow unregistration during Registering and Late Reg phases
      return { text: "Unregister", variant: "destructive" as const, disabled: false };
    }

    // For non-registered users, check if registration is open
    const registrationOpen = ['Registering', 'registering', 'Late Reg', 'late reg'].includes(tournament.dynamicStatus);
    const isFull = tournament.players.length >= tournament.maxPlayers;
    
    console.log('Registration check:', { registrationOpen, isFull, dynamicStatus: tournament.dynamicStatus });
    
    if (!registrationOpen) {
      return { text: "Registration Closed", variant: "secondary" as const, disabled: true };
    }
    
    if (isFull) {
      return { text: "Tournament Full", variant: "secondary" as const, disabled: true };
    }
    
    return { text: "Register", variant: "default" as const, disabled: false };
  };

  const handleViewDetails = () => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const displayBuyIn = tournament.buyIn.toLowerCase() === 'free' ? 'Free' : formatCurrency(parseCurrency(tournament.buyIn));
  const displayPrizePool = formatCurrency(parseCurrency(tournament.prizePool));
  const buttonInfo = getButtonInfo();

  return (
    <TableRow className="animate-fade-in-up">
      <TableCell>
        <div className="font-medium">{tournament.name}</div>
      </TableCell>
      <TableCell>
        <Badge variant={getTournamentStatusVariant(tournament.dynamicStatus)}>
          {tournament.dynamicStatus}
        </Badge>
      </TableCell>
      <TableCell>{displayBuyIn}</TableCell>
      <TableCell>{displayPrizePool}</TableCell>
      <TableCell>
        <Countdown targetDate={tournament.parsedStartTime} status={tournament.status}/>
      </TableCell>
      <TableCell>{`${tournament.players.length} / ${tournament.maxPlayers}`}</TableCell>
      <TableCell>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </TableCell>
      <TableCell>
        <Button 
          variant={buttonInfo.variant}
          size="sm"
          disabled={buttonInfo.disabled}
          onClick={handleAction}
        >
          {buttonInfo.text}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TournamentRow;
