
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/lib/types";
import { useState, useEffect } from "react";

interface BlindInfoProps {
  tournament: Tournament;
}

const BlindInfo = ({ tournament }: BlindInfoProps) => {
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes in seconds
  
  // Mock blind levels
  const currentBlinds = { small: 500, big: 1000 };
  const nextBlinds = { small: 750, big: 1500 };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 480)); // Reset to 8 minutes when reaches 0
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-black/50 border-green-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Blind Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-300 mb-1">Current Blinds</div>
          <Badge variant="secondary" className="bg-green-600 text-white text-lg">
            ${currentBlinds.small.toLocaleString()} / ${currentBlinds.big.toLocaleString()}
          </Badge>
        </div>
        
        <div>
          <div className="text-sm text-gray-300 mb-1">Next Blinds</div>
          <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-lg">
            ${nextBlinds.small.toLocaleString()} / ${nextBlinds.big.toLocaleString()}
          </Badge>
        </div>
        
        <div>
          <div className="text-sm text-gray-300 mb-1">Time to Next Blind</div>
          <div className="text-2xl font-bold text-red-400">
            {formatTime(timeLeft)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlindInfo;
