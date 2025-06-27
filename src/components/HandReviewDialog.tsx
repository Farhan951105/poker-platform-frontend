
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HandHistory } from "@/lib/types";
import { formatCurrency } from "@/lib/currencyUtils";
import { format } from "date-fns";

interface HandReviewDialogProps {
  hand: HandHistory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HandReviewDialog = ({ hand, open, onOpenChange }: HandReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hand Review</DialogTitle>
          <DialogDescription>
            Details for hand played on {format(new Date(hand.date), "dd MMM yyyy, p")}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-muted-foreground">Your Hand</span>
            <div className="col-span-3 flex gap-1">
              {hand.myHand.map((card, index) => (
                <span key={index} className="font-mono border rounded px-1.5 py-0.5 text-sm bg-secondary text-secondary-foreground select-none">
                  {card}
                </span>
              ))}
            </div>
          </div>
          {hand.winningHand && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right text-muted-foreground">Winning Hand</span>
              <div className="col-span-3 flex gap-1 flex-wrap">
                {hand.winningHand.map((card, index) => (
                  <span key={index} className="font-mono border rounded px-1.5 py-0.5 text-sm bg-primary/10 text-primary select-none">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-muted-foreground">Pot Size</span>
            <span className="col-span-3 font-semibold">{formatCurrency(hand.potSize)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-muted-foreground">Result</span>
            <span className={`col-span-3 font-semibold ${hand.result > 0 ? "text-green-500" : hand.result < 0 ? "text-red-500" : "text-muted-foreground"}`}>
              {formatCurrency(hand.result)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
