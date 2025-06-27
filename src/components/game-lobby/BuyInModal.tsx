import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface BuyInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  walletBalance: number;
  minBuyIn?: number;
  maxBuyIn?: number;
  isProcessing: boolean;
  title?: string;
  confirmText?: string;
}

const BuyInModal: React.FC<BuyInModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  walletBalance,
  minBuyIn = 50,
  maxBuyIn = 500,
  isProcessing,
  title = "Buy-in to Table",
  confirmText = "Confirm Buy-in"
}) => {
  const effectiveMax = Math.min(walletBalance, maxBuyIn);
  const [buyInAmount, setBuyInAmount] = useState(Math.min(100, effectiveMax));

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(buyInAmount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center text-sm">
            <Label className="text-gray-400">Your Balance:</Label>
            <span className="font-bold">${walletBalance.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="buy-in-amount" className="text-white">
              Buy-in Amount:
            </Label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">${buyInAmount.toLocaleString()}</span>
              <Input
                id="buy-in-amount"
                type="number"
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(Math.max(minBuyIn, Math.min(effectiveMax, Number(e.target.value))))}
                className="w-24 bg-slate-800 border-slate-600"
              />
            </div>
          </div>
          <Slider
            value={[buyInAmount]}
            onValueChange={(value) => setBuyInAmount(value[0])}
            min={minBuyIn}
            max={effectiveMax}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>${minBuyIn}</span>
            <span>${effectiveMax}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={buyInAmount < minBuyIn || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Joining..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyInModal; 