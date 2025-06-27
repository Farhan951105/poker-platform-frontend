import { useState, useEffect } from "react";
import PlayerSeat from "./PlayerSeat";
import CommunityCards from "./CommunityCards";
import ActionButtons from "./ActionButtons";
import ChatPanel from "./ChatPanel";
import PotDisplay from "./PotDisplay";
import Timeline from "./Timeline";
import { getSocket } from "@/utils/socket";
import { useAuth } from "@/contexts/AuthContext";
import ActionLogPanel from "./ActionLogPanel";
import { Volume2, VolumeX, Settings } from "lucide-react";
import SettingsModal from './SettingsModal';
import BuyInModal from './BuyInModal';
import { useToast } from "@/hooks/use-toast";
import ChipStack from './ChipStack';
import DealerButton from './DealerButton';
import { AnimatePresence, motion } from "framer-motion";
import { formatChips } from "@/lib/currencyUtils";

// Define a type for individual bets
interface Bet {
  playerId: string;
  amount: number;
  seat: number; // Add seat for positioning during animation
  handRank?: string;
  isInHand?: boolean;
  isWinner?: boolean;
}

interface Player {
  id: number | string;
  name: string;
  chips: number;
  position: string;
  cards: any[];
  isActive: boolean;
  avatarColor?: string;
  isPlayer?: boolean;
  seat: number;
  handRank?: string;
  isInHand?: boolean;
  isWinner?: boolean;
}

// This should be in PlayerSeat.tsx, but for simplicity of this step, modifying here.
// In a real scenario, this would be in a shared types file.

const PokerTable = () => {
  const { user, updateUser, updateWalletBalance } = useAuth();
  const [pot, setPot] = useState(5000);
  const [currentBet, setCurrentBet] = useState(200);
  const [playerChips, setPlayerChips] = useState(500);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "John Doe", chips: 1000234, position: "top-left", cards: [], isActive: false, avatarColor: "orange", seat: 1 },
    { id: 2, name: "Anna", chips: 3230234, position: "top-right", cards: [], isActive: false, avatarColor: "blue", seat: 2 },
    { id: 3, name: "Marie L.", chips: 2300234, position: "right", cards: [], isActive: false, avatarColor: "blue", seat: 3 },
    { id: 4, name: "SEAT OPEN", chips: 0, position: "bottom-right", cards: [], isActive: false, seat: 4 },
    { id: 5, name: "You", chips: playerChips, position: "bottom", cards: [], isActive: true, isPlayer: true, avatarColor: "blue", seat: 5 },
    { id: 6, name: "SEAT OPEN", chips: 0, position: "bottom-left", cards: [], isActive: false, seat: 6 },
    { id: 7, name: "Mike D.", chips: 1230234, position: "left", cards: [], isActive: false, avatarColor: "orange", seat: 7 },
    { id: 8, name: "Vlad B.", chips: 3230234, position: "top", cards: [], isActive: true, avatarColor: "blue", seat: 8 }
  ]);
  const [communityCards, setCommunityCards] = useState([]);
  const [actionLog, setActionLog] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBuyInModalOpen, setIsBuyInModalOpen] = useState(false);
  const [isAddChipsModalOpen, setIsAddChipsModalOpen] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [isSittingDown, setIsSittingDown] = useState(false);
  const [isAddingChips, setIsAddingChips] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [collectedBets, setCollectedBets] = useState<Bet[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [dealerSeat, setDealerSeat] = useState<number | null>(null);
  const [selectedPreAction, setSelectedPreAction] = useState<string | null>(null);
  const [mute, setMute] = useState(() => {
    // Initialize mute state from localStorage
    const savedMute = localStorage.getItem("gameMuted");
    return savedMute ? JSON.parse(savedMute) : false;
  });
  const actionAudio = typeof Audio !== "undefined" ? new Audio("/sounds/action.mp3") : null;
  const { toast } = useToast();

  const me = players.find(p => String(p.id) === user?.id);

  useEffect(() => {
    // Save mute state to localStorage whenever it changes
    localStorage.setItem("gameMuted", JSON.stringify(mute));
  }, [mute]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join-table", { tableId: "demo-table" });
    });

    socket.on("game-state", (state) => {
      // Pre-action execution logic
      const myPlayer = state.players.find(p => String(p.id) === user?.id);
      const wasMyTurn = players.find(p => String(p.id) === user?.id)?.isActive;
      if (myPlayer?.isActive && !wasMyTurn && selectedPreAction) {
        // It's now my turn, and I have a pre-action selected.
        let actionToExecute = selectedPreAction;
        let amount;

        if (actionToExecute === 'check-fold') {
          actionToExecute = state.currentBet > 0 ? 'fold' : 'check';
        } else if (actionToExecute === 'call-any') {
          actionToExecute = state.currentBet > 0 ? 'call' : 'check';
          if (actionToExecute === 'call') {
            amount = state.currentBet;
          }
        }
        
        handleAction(actionToExecute, amount);
        setSelectedPreAction(null); // Reset after execution
      }

      // If we were waiting to sit down and now we are in the player list, stop loading.
      if (isSittingDown && state.players.some(p => String(p.id) === user?.id)) {
        setIsSittingDown(false);
      }
      // If we were adding chips and our chip count has increased, stop loading.
      if (isAddingChips && me && state.players.some(p => String(p.id) === user?.id && p.chips > me.chips)) {
        setIsAddingChips(false);
      }
      if (state.pot !== undefined) setPot(state.pot);
      if (state.currentBet !== undefined) setCurrentBet(state.currentBet);
      if (state.playerChips !== undefined) setPlayerChips(state.playerChips);
      
      if (state.players) {
        let playersData = state.players;
        // If this game state includes hole cards, merge them into the player object
        if (state.holeCards && user) {
          setHoleCards(state.holeCards);
          const myPlayerIndex = playersData.findIndex(p => String(p.id) === user.id);
          if (myPlayerIndex !== -1) {
            playersData[myPlayerIndex].cards = state.holeCards;
          }
        }
        setPlayers(playersData);
      }
      
      if (state.communityCards) setCommunityCards(state.communityCards);
      if (state.actionLog) setActionLog(state.actionLog);
      if (state.dealerSeat !== undefined) setDealerSeat(state.dealerSeat);
      
      if (state.bets) {
        setBets(state.bets);
      } else {
        setBets([]); // Clear bets if not present in state (e.g., end of round)
      }
    });

    socket.on("player-action-log", (entry) => {
      setActionLog(prev => {
        if (!mute && entry.player !== user?.username && entry.player !== "System" && actionAudio) {
          actionAudio.currentTime = 0;
          actionAudio.play();
        }
        return [...prev, entry];
      });
    });

    socket.on("showdown", (showdownData) => {
      setPlayers(currentPlayers => {
        const updatedPlayers = JSON.parse(JSON.stringify(currentPlayers));

        // Update cards and hand ranks for all players in showdown
        showdownData.players.forEach(showdownPlayer => {
          const playerIndex = updatedPlayers.findIndex(p => String(p.id) === String(showdownPlayer.id));
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].cards = showdownPlayer.cards;
            updatedPlayers[playerIndex].handRank = showdownPlayer.handRank;
            updatedPlayers[playerIndex].isInHand = true;
          }
        });

        // Mark the winners
        showdownData.winners.forEach(winner => {
          const winnerIndex = updatedPlayers.findIndex(p => String(p.id) === String(winner.id));
          if (winnerIndex !== -1) {
            updatedPlayers[winnerIndex].isWinner = true;
          }
        });
        
        return updatedPlayers;
      });
    });

    // More event types
    socket.on("hand-start", (handData) => {
      setPlayers(currentPlayers => 
        currentPlayers.map(p => {
          // Determine if this player is the user
          const isMe = String(p.id) === user?.id;
          
          // Reset properties for the new hand
          const newPlayerState = {
            ...p,
            isWinner: false,
            handRank: undefined,
            // Clear cards for everyone initially
            cards: [], 
            // Everyone is in the hand at the start, until they fold
            isInHand: p.chips > 0, 
            isActive: false, // Reset active player for the new hand
          };

          // If it's the current user, assign their new hole cards
          if (isMe && handData.holeCards) {
            newPlayerState.cards = handData.holeCards;
          }
          
          return newPlayerState;
        })
      );
      // Also reset central community cards
      setCommunityCards([]);
      setActionLog(prev => [...prev, { action: "hand-start", player: "System", handNumber: handData.handNumber, timestamp: Date.now() }]);
    });

    socket.on("hand-end", (handNumber) => {
      setActionLog(prev => [...prev, { action: "hand-end", player: "System", handNumber, timestamp: Date.now() }]);
    });

    socket.on("blind-posted", (data) => {
      setActionLog(prev => [...prev, { action: "blind-posted", player: data.player, amount: data.amount, blindType: data.blindType, timestamp: Date.now() }]);
    });

    socket.on("pot-won", (data) => {
      setActionLog(prev => [...prev, { action: "pot-won", player: data.player, amount: data.amount, timestamp: Date.now() }]);
    });

    socket.on("collect-bets", (betsToCollect: Bet[]) => {
      setIsCollecting(true);
      setCollectedBets(betsToCollect); // Store the bets that are being collected
      setBets([]); // Immediately clear the visible bets on the table

      // After the animation duration, clear the collected bets
      setTimeout(() => {
        setIsCollecting(false);
        setCollectedBets([]);
      }, 500); // This duration should match the animation time
    });

    // Add more listeners as needed (e.g., chat-message)

    return () => {
      socket.off("connect");
      socket.off("game-state");
      socket.off("player-action-log");
      socket.off("showdown");
      socket.off("hand-start");
      socket.off("hand-end");
      socket.off("blind-posted");
      socket.off("pot-won");
      socket.off("collect-bets");
    };
  }, [user, mute, isSittingDown, isAddingChips, players, me]);

  useEffect(() => {
    const socket = getSocket();
    const handleSitDownFailed = (data: { message: string }) => {
      toast({
        title: "Could not join table",
        description: data.message,
        variant: "destructive",
      });
      setIsSittingDown(false);
    };

    socket.on("sit-down-failed", handleSitDownFailed);
    return () => {
      socket.off("sit-down-failed", handleSitDownFailed);
    };
  }, [toast]);

  useEffect(() => {
    const socket = getSocket();
    const handleAddChipsFailed = (data: { message: string }) => {
      toast({
        title: "Could not add chips",
        description: data.message,
        variant: "destructive",
      });
      setIsAddingChips(false);
    };

    socket.on("add-chips-failed", handleAddChipsFailed);
    return () => {
      socket.off("add-chips-failed", handleAddChipsFailed);
    };
  }, [toast]);

  // Function to get positioning for chip stacks
  const getBetPosition = (seatId: number) => {
    // These positions are approximate and might need tweaking.
    // They place the chip stack in front of the player's seat, towards the center.
    const positions: { [key: number]: string } = {
      1: 'top-[30%] left-[50%] -translate-x-1/2',    // Top middle
      2: 'top-[35%] left-[30%] -translate-x-1/2',    // Top-left
      3: 'top-[50%] left-[20%] -translate-y-1/2',    // Mid-left
      4: 'bottom-[35%] left-[30%] -translate-x-1/2', // Bottom-left
      5: 'bottom-[30%] left-[50%] -translate-x-1/2',   // Bottom middle
      6: 'bottom-[35%] right-[30%] translate-x-1/2',  // Bottom-right
      7: 'top-[50%] right-[20%] -translate-y-1/2',   // Mid-right
      8: 'top-[35%] right-[30%] translate-x-1/2',     // Top-right
    };
    return positions[seatId] || 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
  };

  const getDealerButtonPosition = (seatId: number) => {
    // Positions the dealer button to the side of the player's bet
    const positions: { [key: number]: string } = {
      1: 'top-[30%] left-[60%] -translate-x-1/2',
      2: 'top-[35%] left-[40%]',
      3: 'top-[50%] left-[30%] -translate-y-1/2',
      4: 'bottom-[35%] left-[40%]',
      5: 'bottom-[30%] left-[60%] -translate-x-1/2',
      6: 'bottom-[35%] right-[40%]',
      7: 'top-[50%] right-[30%] -translate-y-1/2',
      8: 'top-[35%] right-[40%]',
    };
    return positions[seatId] || 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
  };

  const handleSitDownClick = (seatId: number) => {
    if (!user) {
      console.log("Please log in to sit down.");
      return;
    }
    setSelectedSeatId(seatId);
    setIsBuyInModalOpen(true);
  };

  const handleConfirmBuyIn = (amount: number) => {
    if (!user || selectedSeatId === null) return;
    
    if (user.walletBalance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You do not have enough funds in your wallet to complete this buy-in.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSittingDown(true);
    const socket = getSocket();
    socket.emit("sit-down", {
      seatId: selectedSeatId,
      buyInAmount: amount,
      player: { name: user.username, id: user.id }
    });
    setIsBuyInModalOpen(false);
    setSelectedSeatId(null);
  };

  const handleAddChipsClick = () => {
    setIsAddChipsModalOpen(true);
  };

  const handleConfirmAddChips = (amount: number) => {
    if (!user) return;

    if (user.walletBalance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You do not have enough funds in your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingChips(true);
    const socket = getSocket();
    socket.emit("add-chips", { amount });
    setIsAddChipsModalOpen(false);
  };

  const handleStandUp = () => {
    const socket = getSocket();
    socket.emit("stand-up"); // Server should know who this is from the socket connection
  };

  const handleAction = (action: string, amount?: number) => {
    if (!user) return;
    const socket = getSocket();
    const entry = { action, amount, player: user.username, timestamp: Date.now() };
    setActionLog(prev => [...prev, entry]);
    socket.emit("player-action", { action, amount, player: user.username });
    // Optionally update local state optimistically
    if (action === 'fold') {
      // Handle fold
    } else if (action === 'call') {
      setPlayerChips(prev => prev - currentBet);
      setPot(prev => prev + currentBet);
    } else if (action === 'all-in') {
      setPot(prev => prev + playerChips);
      setPlayerChips(0);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Timeline Component */}
      <Timeline />

      {/* Top Control Bar */}
      <div className="absolute top-4 right-4 flex justify-end items-center z-20">
        <div className="flex gap-3">
          <button
            title="Settings"
            onClick={() => setIsSettingsOpen(true)}
            className="bg-black/20 p-3 text-white rounded-lg"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full h-full max-w-[1000px] max-h-[500px] relative">
          {/* Main table surface with racetrack shape */}
          <div className="relative w-full h-full bg-yellow-800 shadow-2xl border-4 border-yellow-900 rounded-[250px]">
            {/* Inner table felt surface */}
            <div className="absolute inset-4 bg-green-800 shadow-inner border-4 border-green-900 rounded-[250px]">
              
              {/* Chip Stacks, Pot, and Community Cards Area */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {bets.map(bet => {
                    const player = players.find(p => String(p.id) === bet.playerId);
                    if (!player || bet.amount <= 0) return null;
                    
                    return (
                      <motion.div
                        key={player.id}
                        className={`absolute ${getBetPosition(player.seat)}`}
                        layoutId={`chip-stack-${player.id}`}
                      >
                        <ChipStack amount={bet.amount} />
                      </motion.div>
                    );
                  })}
                  {isCollecting && collectedBets.map(bet => {
                    const player = players.find(p => String(p.id) === bet.playerId);
                    if (!player) return null;
                    return (
                       <motion.div
                        key={player.id}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        layoutId={`chip-stack-${player.id}`}
                        initial={false}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                      >
                        <ChipStack amount={bet.amount} />
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {/* Dealer Button */}
                {dealerSeat !== null && (
                  <motion.div
                    layoutId="dealer-button"
                    className={`absolute ${getDealerButtonPosition(dealerSeat)}`}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <DealerButton />
                  </motion.div>
                )}

                {/* Central Pot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="text-white font-bold text-xl md:text-2xl drop-shadow-lg">
                    Pot: {formatChips(pot)}
                  </span>
                </div>

                {/* Community Cards */}
                <CommunityCards cards={communityCards} />
              </div>
            </div>
          </div>
          
          {/* Player Seats are positioned relative to the table shape */}
          {players.map((player) => (
            <PlayerSeat 
              key={player.id} 
              seatId={player.seat}
              player={players.find(p => p.seat === player.seat) || null}
              currentUserId={user?.id || null}
              onSitDown={handleSitDownClick}
              onStandUp={handleStandUp}
              onAddChips={handleAddChipsClick}
            />
          ))}
        </div>
      </div>

      {/* Responsive Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col items-center gap-2 p-2 sm:hidden">
          <ActionLogPanel log={actionLog} currentUser={user?.username} />
          <ActionButtons 
            currentBet={currentBet}
            playerChips={players.find(p => String(p.id) === user?.id)?.chips || 0}
            onAction={handleAction}
            isMyTurn={players.find(p => String(p.id) === user?.id)?.isActive || false}
            selectedPreAction={selectedPreAction}
            onSetPreAction={setSelectedPreAction}
          />
        </div>

        {/* Tablet and Desktop Layout: Side by side */}
        <div className="hidden sm:flex justify-between items-end p-4 lg:p-6">
          <div className="max-w-[35%]">
            <ChatPanel mute={mute} />
          </div>
          <div className="mx-4 flex-grow">
            {/* <ActionLogPanel log={actionLog} currentUser={user?.username} /> */}
          </div>
          <div>
            <ActionButtons 
              currentBet={currentBet}
              playerChips={players.find(p => String(p.id) === user?.id)?.chips || 0}
              onAction={handleAction}
              isMyTurn={players.find(p => String(p.id) === user?.id)?.isActive || false}
              selectedPreAction={selectedPreAction}
              onSetPreAction={setSelectedPreAction}
            />
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMuted={mute}
        onMuteToggle={setMute}
        theme={"green"} // Hardcode theme for now
        onThemeChange={() => {}} // No-op
      />
      <BuyInModal
        isOpen={isBuyInModalOpen}
        onClose={() => setIsBuyInModalOpen(false)}
        onConfirm={handleConfirmBuyIn}
        walletBalance={user?.walletBalance || 0}
        isProcessing={isSittingDown}
      />
      <BuyInModal
        isOpen={isAddChipsModalOpen}
        onClose={() => setIsAddChipsModalOpen(false)}
        onConfirm={handleConfirmAddChips}
        walletBalance={user?.walletBalance || 0}
        isProcessing={isAddingChips}
        title="Add More Chips"
        confirmText="Confirm Top-up"
        minBuyIn={10} // Example: min top-up
      />
    </div>
  );
};

export default PokerTable; 