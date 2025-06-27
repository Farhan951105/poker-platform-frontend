import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import TournamentList from "@/components/TournamentList";
import CashGameList from "@/components/CashGameList";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTournaments } from "@/hooks/useTournaments";
import { useCashGames } from "@/hooks/useCashGames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TournamentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  const { sortedTournaments, tournamentSortConfig, handleTournamentSort, isLoading, isError } = useTournaments(searchTerm, gameFilter, statusFilter);
  const { sortedCashGames, cashGameSortConfig, handleCashGameSort } = useCashGames(searchTerm, gameFilter);

  const handleJoinGame = (gameName: string, stakes: string) => {
    toast.success(`Successfully joined ${gameName} (${stakes}) table!`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span></div>;
  }
  if (isError) {
    return <div className="text-center text-destructive py-8">Failed to load tournaments. Please try again later.</div>;
  }

  return (
    <>
      <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Tournament Lobby</h1>
          <p className="text-muted-foreground mb-8">Find your next challenge and claim your victory.</p>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by game name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <ToggleGroup
          type="single"
          value={gameFilter}
          onValueChange={(value) => {
            if (value) setGameFilter(value);
          }}
          aria-label="Filter by game type"
        >
          <ToggleGroupItem value="all" aria-label="All games">All</ToggleGroupItem>
          <ToggleGroupItem value="NLH" aria-label="No-Limit Hold'em">NLH</ToggleGroupItem>
          <ToggleGroupItem value="PLO" aria-label="Pot-Limit Omaha">PLO</ToggleGroupItem>
        </ToggleGroup>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active">Active & Upcoming</SelectItem>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Registering">Registering</SelectItem>
                <SelectItem value="Late Reg">Late Reg</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Finished">Finished</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="tournaments" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="cash">Cash Games</TabsTrigger>
        </TabsList>
        <TabsContent value="tournaments">
          <Card>
            <CardHeader>
                <CardTitle>All Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentList 
                tournaments={sortedTournaments}
                sortConfig={tournamentSortConfig}
                onSort={handleTournamentSort}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cash">
          <Card>
            <CardHeader>
                <CardTitle>Cash Games</CardTitle>
            </CardHeader>
            <CardContent>
              <CashGameList 
                handleJoinGame={handleJoinGame}
                games={sortedCashGames}
                sortConfig={cashGameSortConfig}
                onSort={handleCashGameSort}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TournamentsPage;
