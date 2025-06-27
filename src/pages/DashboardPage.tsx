
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, History, Trophy, ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTournaments } from "@/hooks/useTournaments";
import { getTournamentStatusVariant } from "@/lib/tournamentUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";

const DashboardPage = () => {
  const { sortedTournaments } = useTournaments("", "all", "all");
  const { user } = useAuth();
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary">Welcome, {user?.firstName || 'Player'}!</h1>
        <Button asChild variant="outline">
          <Link to="/profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Wallet Card */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(user?.walletBalance)}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsDepositDialogOpen(true)}>Deposit</Button>
              <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(true)}>Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You are registered for {user?.registeredTournamentIds?.length || 0} upcoming tournaments.</p>
            <Button variant="link" className="px-0" asChild>
              <Link to="/tournaments">View Tournaments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hand History</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Review your recent games and strategies.</p>
            <Button variant="link" className="px-0" asChild>
              <Link to="/hand-history">View Hand History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Available Tournaments</h2>
            <Button variant="link" asChild>
              <Link to="/tournaments">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTournaments.slice(0, 3).map((tournament) => {
              const displayBuyIn = tournament.buyIn.toLowerCase() === 'free' ? 'Free' : formatCurrency(parseCurrency(tournament.buyIn));
              const displayPrizePool = formatCurrency(parseCurrency(tournament.prizePool));
              return (
              <Link key={tournament.id} to={`/tournaments/${tournament.id}`} className="block transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg">
                <Card className="h-full">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Buy-in:</span>
                      <span className="font-medium text-foreground">{displayBuyIn}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>Prize Pool:</span>
                      <span className="font-medium text-foreground">{displayPrizePool}</span>
                    </div>
                      <div className="flex justify-between items-center mt-4">
                        <Badge variant={getTournamentStatusVariant(tournament.dynamicStatus)}>{tournament.dynamicStatus}</Badge>
                        <span className="text-sm text-muted-foreground">{tournament.startTime.split(',')[0]}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>
      </div>
      <DepositDialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen} />
      <WithdrawDialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen} />
    </>
  );
};

export default DashboardPage;
