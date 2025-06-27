import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SortableTableHead from "./SortableTableHead";
import { CashGame, CashGameSortKey, SortConfig } from "@/lib/types";

type CashGameListProps = {
    handleJoinGame: (gameName: string, stakes: string) => void;
    games: CashGame[];
    sortConfig: SortConfig<CashGameSortKey> | null;
    onSort: (key: CashGameSortKey) => void;
};

const CashGameList = ({ handleJoinGame, games, sortConfig, onSort }: CashGameListProps) => {
    if (games.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No cash games found matching your criteria.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead sortKey="name" sortConfig={sortConfig} onSort={onSort}>
                      Game
                    </SortableTableHead>
                    <SortableTableHead sortKey="stakes" sortConfig={sortConfig} onSort={onSort}>
                      Stakes
                    </SortableTableHead>
                    <SortableTableHead sortKey="players" sortConfig={sortConfig} onSort={onSort}>
                      Players
                    </SortableTableHead>
                    <SortableTableHead sortKey="type" sortConfig={sortConfig} onSort={onSort}>
                      Type
                    </SortableTableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {games.map((game) => {
                    const [currentPlayers, maxPlayers] = game.players.split('/').map(Number);
                    const progressPercentage = maxPlayers > 0 ? (currentPlayers / maxPlayers) * 100 : 0;
                    
                    return (
                      <TableRow key={game.id}>
                          <TableCell className="font-medium">{game.name}</TableCell>
                          <TableCell>{game.stakes}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{game.players}</span>
                              <Progress value={progressPercentage} className="w-[60px]" />
                            </div>
                          </TableCell>
                          <TableCell>
                              <Badge variant="secondary">{game.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                              <Button onClick={() => handleJoinGame(game.name, game.stakes)}>
                                  Join Table
                              </Button>
                          </TableCell>
                      </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
};

export default CashGameList;
