import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onMuteToggle: (muted: boolean) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isMuted, 
  onMuteToggle,
  theme,
  onThemeChange
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-mute" className="text-white">
              Mute Sounds
            </Label>
            <Switch
              id="sound-mute"
              checked={isMuted}
              onCheckedChange={onMuteToggle}
            />
          </div>
          <hr className="border-slate-700" />
          <div className="space-y-2">
            <Label className="text-white">Table Felt Color</Label>
            <RadioGroup value={theme} onValueChange={onThemeChange} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="r-green" />
                <Label htmlFor="r-green">Green</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="r-blue" />
                <Label htmlFor="r-blue">Blue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="red" id="r-red" />
                <Label htmlFor="r-red">Red</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal; 