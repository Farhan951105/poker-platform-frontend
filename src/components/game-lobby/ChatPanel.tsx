import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { getSocket } from "@/utils/socket";
import { useAuth } from "@/contexts/AuthContext";

const notificationAudio = typeof Audio !== "undefined" ? new Audio("/notification.mp3") : null;

const ChatPanel = ({ mute = false }: { mute?: boolean }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { player: "Vlad B.", message: "Great Game !", color: "text-green-400", timestamp: Date.now() - 300000 },
    { player: "Vlad B.", message: "Wins with 3 Aces !", color: "text-green-400", timestamp: Date.now() - 240000 },
    { player: "Anna", message: "You have 30 seconds.", color: "text-yellow-400", timestamp: Date.now() - 180000 },
    { player: "John Doe", message: "You have 5 seconds. Hurry up !", color: "text-red-400", timestamp: Date.now() - 120000 }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    // Listen for chat messages from server
    socket.on("chat-message", (msg) => {
      setMessages(prev => {
        // Play sound if not from current user
        if (!mute && msg.player !== user?.username && notificationAudio) {
          notificationAudio.currentTime = 0;
          notificationAudio.play();
        }
        return [...prev, msg];
      });
    });
    // Listen for player join/leave events
    socket.on("player-joined", (playerName) => {
      setMessages(prev => [...prev, {
        player: "System",
        message: `${playerName} joined the table.`,
        color: "text-gray-400",
        timestamp: Date.now()
      }]);
    });
    socket.on("player-left", (playerName) => {
      setMessages(prev => [...prev, {
        player: "System",
        message: `${playerName} left the table.`,
        color: "text-gray-400",
        timestamp: Date.now()
      }]);
    });
    return () => {
      socket.off("chat-message");
      socket.off("player-joined");
      socket.off("player-left");
    };
  }, [user, mute]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Simulate incoming messages for demo (optional, can be removed)
  // useEffect(() => {
  //   const demoMessages = [
  //     { player: "Mike D.", message: "Nice hand!", color: "text-blue-400" },
  //     { player: "Marie L.", message: "All in!", color: "text-purple-400" },
  //     { player: "System", message: "New player joined", color: "text-gray-400" },
  //     { player: "Anna", message: "Good luck everyone", color: "text-yellow-400" }
  //   ];
  //   const interval = setInterval(() => {
  //     const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
  //     setMessages(prev => [...prev, { 
  //       ...randomMessage, 
  //       timestamp: Date.now(),
  //       message: `${randomMessage.message} ${Math.floor(Math.random() * 100)}` 
  //     }]);
  //   }, 8000);
  //   return () => clearInterval(interval);
  // }, []);

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      const msg = {
        player: user.username,
        message: newMessage,
        color: "text-blue-400",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, { ...msg, player: "You" }]); // Show as 'You' locally
      const socket = getSocket();
      socket.emit("chat-message", msg);
      setNewMessage("");
    }
  };

  const tabs = ["Chat", "Stats", "Info"];

  const statsData = [
    { label: "Hands Played", value: "1,247" },
    { label: "Hands Won", value: "342" },
    { label: "Win Rate", value: "27.4%" },
    { label: "Total Winnings", value: "$12,450" },
    { label: "Biggest Win", value: "$2,100" },
    { label: "Playing Time", value: "45h 23m" },
    { label: "Best Hand", value: "Royal Flush" },
    { label: "Bluffs Won", value: "89" },
    { label: "All-ins", value: "23" },
    { label: "Fold Rate", value: "64.2%" }
  ];

  const infoData = [
    { label: "Table Stakes", value: "$10/$20" },
    { label: "Max Players", value: "8" },
    { label: "Game Type", value: "Texas Hold'em" },
    { label: "Blinds Timer", value: "15:00" },
    { label: "Tournament ID", value: "#TRN-2024-001" },
    { label: "Buy-in", value: "$100 + $10" },
    { label: "Prize Pool", value: "$1,500" },
    { label: "Players Left", value: "6/8" },
    { label: "Average Stack", value: "25,000" },
    { label: "Next Break", value: "12:45" }
  ];

  return (
    <div className="w-72 sm:w-80 lg:w-96 h-56 sm:h-64 lg:h-72 transform-gpu hover:scale-105 transition-all duration-300 max-w-[280px] sm:max-w-[320px] lg:max-w-[384px]">
      {/* Multiple shadow layers for enhanced depth */}
      <div className="absolute inset-0 bg-black/50 blur-2xl transform translate-y-3 scale-110"></div>
      <div className="absolute inset-0 bg-black/30 blur-xl transform translate-y-2 scale-105"></div>
      
      {/* Main panel */}
      <div className="relative bg-gradient-to-br from-teal-900/95 via-slate-900/95 to-slate-800/95 backdrop-blur-lg overflow-hidden border border-teal-700/50 shadow-2xl h-full flex flex-col">
        {/* Enhanced tabs */}
        <div className="flex border-b border-teal-700/50 bg-gradient-to-r from-teal-800/50 to-slate-800/50 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-bold relative transform-gpu hover:scale-105 transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-teal-300 bg-gradient-to-br from-teal-800 to-teal-900 shadow-inner' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-teal-800/30'
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === tab && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-yellow-400 animate-pulse"></div>
                  <div className="absolute inset-0 bg-teal-400/10 animate-pulse"></div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Chat Content */}
          {activeTab === "Chat" && (
            <>
              <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4" ref={scrollAreaRef}>
                <div className="space-y-1 sm:space-y-2">
                  {messages.map((msg, index) => (
                    <div key={index} className="transform-gpu hover:scale-[1.02] transition-all duration-200 hover:bg-teal-800/20 p-1 sm:p-2">
                      <div className="flex items-start gap-1 sm:gap-2">
                        <span className={`font-bold ${msg.color} text-xs sm:text-sm min-w-fit shrink-0`}>{msg.player}:</span>
                        <span className="text-gray-300 text-xs sm:text-sm flex-1 break-words hyphens-auto overflow-wrap-anywhere leading-relaxed">{msg.message}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Enhanced chat input */}
              <div className="p-2 sm:p-3 lg:p-4 border-t border-teal-700/50 bg-gradient-to-r from-teal-800/30 to-slate-800/30 flex-shrink-0">
                <div className="flex gap-1 sm:gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type here to chat"
                      className="bg-gradient-to-br from-teal-800/90 to-slate-800/90 border-teal-600/50 text-white placeholder-gray-400 transform-gpu hover:scale-[1.02] focus:scale-[1.02] transition-all duration-300 shadow-inner text-xs sm:text-sm break-words"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <div className="absolute inset-0 border border-teal-400/20 pointer-events-none animate-pulse"></div>
                  </div>
                  
                  <div className="transform-gpu hover:scale-105 hover:-translate-y-0.5 transition-all duration-200">
                    <Button
                      onClick={sendMessage}
                      className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold shadow-xl transform-gpu hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group px-3 sm:px-4 lg:px-6 text-xs sm:text-sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Stats Content */}
          {activeTab === "Stats" && (
            <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-teal-300 font-bold text-sm sm:text-lg mb-3 sm:mb-4">Player Statistics</h3>
                {statsData.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-teal-800/30 to-slate-800/30 border border-teal-700/30 transform-gpu hover:scale-[1.02] transition-all duration-200">
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">{stat.label}</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Info Content */}
          {activeTab === "Info" && (
            <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-teal-300 font-bold text-sm sm:text-lg mb-3 sm:mb-4">Table Information</h3>
                {infoData.map((info, index) => (
                  <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-teal-800/30 to-slate-800/30 border border-teal-700/30 transform-gpu hover:scale-[1.02] transition-all duration-200">
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">{info.label}</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{info.value}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {/* Panel glow border */}
        <div className="absolute inset-0 border border-teal-400/20 animate-pulse pointer-events-none"></div>
        <div className="absolute inset-1 border border-teal-300/10 animate-pulse pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ChatPanel; 