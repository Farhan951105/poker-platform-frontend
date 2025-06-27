import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NotFound from "./NotFound";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTournamentById } from "@/hooks/useTournamentById";
import TournamentDetailHeader from "@/components/TournamentDetailHeader";
import TournamentInfo from "@/components/TournamentInfo";
import TournamentPlayerList from "@/components/TournamentPlayerList";
import TournamentRegistration from "@/components/TournamentRegistration";
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
// In client/src/lib/types.ts

import type { User } from '../lib/types'; // if not already present

export type BaseTournament = {
  // ... other fields ...
  // players: string[];
  players: User[];
  // ... other fields ...
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Card>
      <Skeleton className="h-32" />
      <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-96" />
      </CardContent>
    </Card>
  </div>
);

const ErrorMessage = () => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Error loading tournament details. Please try again later.
    </AlertDescription>
  </Alert>
);

const TournamentDetailPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { tournament, isLoading, isError } = useTournamentById(tournamentId);
  const [playerListRefreshKey, setPlayerListRefreshKey] = useState(0);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  if (!tournament) {
    return <NotFound />;
  }

  const displayBuyIn = tournament.buyIn.toLowerCase() === 'free' ? 'Free' : formatCurrency(parseCurrency(tournament.buyIn));
  const displayPrizePool = formatCurrency(parseCurrency(tournament.prizePool));

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tournaments">Tournaments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tournament.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <TournamentDetailHeader 
          name={tournament.name}
          dynamicStatus={tournament.dynamicStatus}
          parsedStartTime={tournament.parsedStartTime}
          lateRegEndDate={tournament.lateRegEndDate}
        />
        <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
          <div>
            <TournamentInfo 
              prizePool={displayPrizePool}
              buyIn={displayBuyIn}
              playersLength={tournament.players.length}
              maxPlayers={tournament.maxPlayers}
              gameType={tournament.gameType}
              durationHours={tournament.durationHours}
            />
            <TournamentPlayerList tournamentId={tournament.id} key={playerListRefreshKey} />
          </div>
          <TournamentRegistration tournament={tournament} onRegistrationChange={() => setPlayerListRefreshKey(k => k + 1)} />
        </CardContent>
      </Card>
    </>
  );
};

export default TournamentDetailPage;
