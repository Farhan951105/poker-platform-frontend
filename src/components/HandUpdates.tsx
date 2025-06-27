
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface HandUpdatesProps {
  tournamentId: number;
}

const HandUpdates = ({ tournamentId }: HandUpdatesProps) => {
  const handUpdates = [
    { id: 1, text: "Player1 wins with a pair of Aces", amount: 2400, time: "10:25" },
    { id: 2, text: "Player3 eliminated in 15th place", amount: 0, time: "10:20" },
    { id: 3, text: "Player2 doubles up with a flush", amount: 8200, time: "10:18" },
    { id: 4, text: "Player4 calls all-in with pocket Kings", amount: 4500, time: "10:15" },
    { id: 5, text: "Player5 wins side pot", amount: 1200, time: "10:12" },
  ];

  return (
    <Card className="bg-black/50 border-green-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Hand Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="space-y-3">
            {handUpdates.map((update) => (
              <div key={update.id} className="border-b border-gray-700 pb-2 last:border-b-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-sm text-white flex-1">
                    {update.text}
                  </div>
                  <div className="text-xs text-gray-400">
                    {update.time}
                  </div>
                </div>
                {update.amount > 0 && (
                  <Badge variant="secondary" className="bg-green-600 text-white mt-1">
                    +${update.amount.toLocaleString()}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HandUpdates;
