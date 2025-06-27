import { Toaster as Sonner } from "@/components/ui/sonner";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import TournamentsPage from "./pages/TournamentsPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import PokerGameLobbyPage from "./pages/PokerGameLobbyPage";
import LearnPage from "./pages/LearnPage";
import AboutPage from "./pages/AboutPage";
import HandHistoryPage from "./pages/HandHistoryPage";
import { ThemeProvider } from "@/components/theme-provider";
import SharedLayout from "./components/SharedLayout";
import { TournamentsProvider } from "./contexts/TournamentsContext";
import { AuthProvider } from "./contexts/AuthContext";
import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import GameLobbyPage from "./pages/GameLobbyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Sonner />
        <AuthProvider>
          <TournamentsProvider>
            <Routes>
              <Route element={<SharedLayout />}>
                <Route path="/" element={<Index />} />
              {/* <Route path="/platform" index element={<Index />} /> */}

                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/tournaments/:tournamentId" element={<TournamentDetailPage />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/about" element={<AboutPage />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/hand-history" element={<HandHistoryPage />} />
                </Route>
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              <Route path="/game-lobby" element={<GameLobbyPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TournamentsProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
