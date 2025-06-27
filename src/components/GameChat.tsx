
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";

interface GameChatProps {
  tournamentId: number;
}

const GameChat = ({ tournamentId }: GameChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, player: "System", text: "Tournament started! Good luck everyone!", time: "10:00", isSystem: true },
    { id: 2, player: "Player1", text: "GL HF everyone!", time: "10:01", isSystem: false },
    { id: 3, player: "Player2", text: "Let's do this!", time: "10:02", isSystem: false },
    { id: 4, player: "System", text: "Blinds increased to 500/1000", time: "10:15", isSystem: true },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      player: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-black/50 border-green-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full">
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <span className="text-gray-400 text-xs">{msg.time}</span>
                <div className={`${msg.isSystem ? 'text-yellow-400' : 'text-white'}`}>
                  <span className="font-semibold">{msg.player}:</span>{' '}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-gray-800 border-gray-600 text-white"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameChat;
