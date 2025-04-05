"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Swords } from "lucide-react";

interface CreateBattleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBattle: (tokenA: string, tokenB: string, durationInSeconds: number) => void;
}

export function CreateBattleDialog({
  open,
  onOpenChange,
  onCreateBattle,
}: CreateBattleDialogProps) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("days");

  const resetForm = () => {
    setTokenA("");
    setTokenB("");
    setDuration("");
    setDurationUnit("days");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCreateBattle = () => {
    if (!tokenA || !tokenB || !duration) return;

    // Convert duration to seconds based on selected unit
    const durationValue = parseFloat(duration);
    let durationInSeconds = 0;

    switch (durationUnit) {
      case "minutes":
        durationInSeconds = durationValue * 60;
        break;
      case "hours":
        durationInSeconds = durationValue * 60 * 60;
        break;
      case "days":
        durationInSeconds = durationValue * 24 * 60 * 60;
        break;
      default:
        durationInSeconds = durationValue * 24 * 60 * 60; // Default to days
    }

    // Round to integer seconds
    durationInSeconds = Math.floor(durationInSeconds);
    
    onCreateBattle(tokenA, tokenB, durationInSeconds);
    handleClose();
  };

  const isFormValid = () => {
    return (
      tokenA &&
      tokenB &&
      tokenA !== tokenB &&
      duration &&
      parseFloat(duration) > 0
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-none">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Create New Battle
          </DialogTitle>
          <DialogDescription>
            Create a new battle between two tokens. Users will stake their tokens to compete.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="token-a">First Token Address</Label>
            <Input
              id="token-a"
              placeholder="0x..."
              value={tokenA}
              onChange={(e) => setTokenA(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the contract address of the first token
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="token-b">Second Token Address</Label>
            <Input
              id="token-b"
              placeholder="0x..."
              value={tokenB}
              onChange={(e) => setTokenB(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the contract address of the second token
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Battle Duration</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration-unit">Duration Unit</Label>
              <Select
                value={durationUnit}
                onValueChange={(value) => setDurationUnit(value)}
              >
                <SelectTrigger id="duration-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tokenA && tokenB && tokenA === tokenB && (
            <div className="flex items-start gap-2 rounded-md bg-red-500/10 p-3 text-sm">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p>Token addresses must be different</p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 p-3 text-sm">
            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p>
              Creating a battle will deploy a new Battle contract. Please verify the token addresses 
              are correct before proceeding. The battle duration cannot be changed after creation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="hover:bg-red-500 hover:font-bold hover:border-black">
            Cancel
          </Button>
          <Button
            disabled={!isFormValid()}
            onClick={handleCreateBattle}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Battle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
