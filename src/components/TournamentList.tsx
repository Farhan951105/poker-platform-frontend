import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tournament, TournamentSortKey, SortConfig } from "@/lib/types";
import SortableTableHead from "./SortableTableHead";
import TournamentRow from "./TournamentRow";

interface TournamentListProps {
  tournaments: Tournament[];
  sortConfig: SortConfig<TournamentSortKey> | null;
  onSort: (key: TournamentSortKey) => void;
}

const TournamentList = ({ tournaments, sortConfig, onSort }: TournamentListProps) => {
  const sortableHeadProps = {
    sortConfig,
    onSort,
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead sortKey="name" {...sortableHeadProps}>Name</SortableTableHead>
            <SortableTableHead sortKey="status" {...sortableHeadProps}>Status</SortableTableHead>
            <SortableTableHead sortKey="buyIn" {...sortableHeadProps}>Buy-in</SortableTableHead>
            <SortableTableHead sortKey="prizePool" {...sortableHeadProps}>Prize Pool</SortableTableHead>
            <SortableTableHead sortKey="startTime" {...sortableHeadProps}>Starts In</SortableTableHead>
            <SortableTableHead sortKey="players" {...sortableHeadProps}>Players</SortableTableHead>
            <TableHead>Details</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TournamentRow key={tournament.id} tournament={tournament} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TournamentList;