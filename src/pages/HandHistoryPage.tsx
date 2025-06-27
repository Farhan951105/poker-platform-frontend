import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockHandHistory } from "@/lib/mockHandHistory";
import { HandHistory, SortConfig, HandHistorySortKey } from "@/lib/types";
import { useState, useMemo } from "react";
import { HandReviewDialog } from "@/components/HandReviewDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HandHistoryTable } from "@/components/HandHistoryTable";
import { PaginationControl } from "@/components/PaginationControl";
import ResultsChart from "@/components/ResultsChart";

const ITEMS_PER_PAGE = 3;

const HandHistoryPage = () => {
  const [hands, setHands] = useState<HandHistory[]>(mockHandHistory);
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [handToDelete, setHandToDelete] = useState<HandHistory | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<HandHistorySortKey> | null>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);

  const handleReviewClick = (hand: HandHistory) => {
    setSelectedHand(hand);
    setIsReviewDialogOpen(true);
  };

  const handleDeleteClick = (hand: HandHistory) => {
    setHandToDelete(hand);
  };

  const confirmDelete = () => {
    if (handToDelete) {
      setHands((prevHands) => prevHands.filter((h) => h.id !== handToDelete.id));
      setHandToDelete(null);
    }
  };

  const sortedHands = useMemo(() => {
    let sortableItems = [...hands];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key as keyof HandHistory];
        const valB = b[sortConfig.key as keyof HandHistory];

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [hands, sortConfig]);

  const requestSort = (key: HandHistorySortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const pageCount = Math.ceil(sortedHands.length / ITEMS_PER_PAGE);
  const paginatedHands = sortedHands.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">Hand History</h1>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ResultsChart hands={hands} />
      </div>
      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Recent Hands</CardTitle>
        </CardHeader>
        <CardContent>
          {hands.length > 0 ? (
            <>
              <HandHistoryTable
                hands={paginatedHands}
                onSort={requestSort}
                sortConfig={sortConfig}
                onReview={handleReviewClick}
                onDelete={handleDeleteClick}
              />
              <PaginationControl
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hand history available yet.</p>
          )}
        </CardContent>
      </Card>
      {selectedHand && (
        <HandReviewDialog
          hand={selectedHand}
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
        />
      )}
      <AlertDialog open={!!handToDelete} onOpenChange={(open) => !open && setHandToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this hand from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHandToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HandHistoryPage;
