import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  currentBet: number;
  playerChips: number;
  onAction: (action: string, amount?: number) => void;
  isMyTurn: boolean;
  selectedPreAction: string | null;
  onSetPreAction: (action: string | null) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentBet,
  playerChips,
  onAction,
  isMyTurn,
  selectedPreAction,
  onSetPreAction,
}) => {
  const [betAmount, setBetAmount] = useState(500);

  if (!isMyTurn) {
    // Pre-action buttons
    const preActionChoices = [
      { id: 'fold', label: 'Fold' },
      { id: 'check-fold', label: 'Check/Fold' },
      { id: 'call-any', label: 'Call Any' }
    ];

    return (
      <div className="flex justify-center items-center gap-2 p-2 bg-black/20 rounded-lg">
        {preActionChoices.map(choice => (
          <Button
            key={choice.id}
            variant={selectedPreAction === choice.id ? "default" : "secondary"}
            onClick={() => onSetPreAction(selectedPreAction === choice.id ? null : choice.id)}
          >
            {choice.label}
          </Button>
        ))}
      </div>
    );
  }

  // Regular action buttons for when it's the player's turn
  const canCheck = currentBet === 0;

  return (
    <div className="p-4 bg-black/20 rounded-lg space-y-4 max-w-sm">
      <div className="space-y-2">
        <Slider
          value={[betAmount]}
          onValueChange={(value) => setBetAmount(value[0])}
          max={playerChips}
          min={currentBet * 2 || 100} // Basic min raise logic
          step={50}
        />
        <div className="text-center text-white font-semibold text-lg">
          {betAmount.toLocaleString()}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => onAction('fold')} variant="destructive">
          Fold
        </Button>
        <Button onClick={() => onAction(canCheck ? 'check' : 'call', canCheck ? undefined : currentBet)} variant="secondary">
          {canCheck ? 'Check' : `Call ${currentBet}`}
        </Button>
        <Button onClick={() => onAction('raise', betAmount)}>
          Raise
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons; 