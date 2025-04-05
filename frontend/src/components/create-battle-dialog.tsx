"use client";

import { useCallback, useEffect, useState } from "react";
import { type Address } from "viem";
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
import { AlertCircle, Swords, Loader } from "lucide-react";
import { battleFactoryAbi } from "@/config/abi/BattleFactory";
import { toast } from "react-hot-toast"; // Assuming you have this for notifications
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { useContractInteraction } from "@/hooks/useContractInteraction";

interface CreateBattleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBattle?: (
    tokenA: string,
    tokenB: string,
    durationInSeconds: number,
    battleAddress?: string,
  ) => void;
  battleFactoryAddress: Address;
}

export function CreateBattleDialog({
  open,
  onOpenChange,
  onCreateBattle,
  battleFactoryAddress,
}: CreateBattleDialogProps) {
  const { address, isConfirmed, receipt } = useUnifiedWallet();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("days");
  const [pendingBattleCreation, setPendingBattleCreation] = useState(false);

  // Contract write hook
  const createBattle = useContractInteraction({
    to: battleFactoryAddress,
    abi: battleFactoryAbi,
    functionName: "createBattle",
    args: [tokenA as Address, tokenB as Address, BigInt(0)],
    description: "Create Battle"
  });

  // Debug logging
  useEffect(() => {
    console.log("CreateBattleDialog State:", { 
      pendingBattleCreation,
      createBattleState: {
        isLoading: createBattle.isLoading,
        isSuccess: createBattle.isSuccess,
        error: createBattle.error,
      },
      unifiedWalletState: {
        isConfirmed,
        latestHash: createBattle.latestHash,
      }
    });
  }, [
    pendingBattleCreation, 
    createBattle.isLoading, 
    createBattle.isSuccess, 
    createBattle.error, 
    isConfirmed, 
    createBattle.latestHash
  ]);

  // Reset latestHash after transaction is confirmed or failed
  useEffect(() => {
    if (isConfirmed && createBattle.latestHash) {
      // Small delay to ensure hooks have time to process the confirmation
      const timer = setTimeout(() => {
        createBattle.setLatestHash(undefined);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, createBattle.latestHash, createBattle.setLatestHash]);

  const resetForm = () => {
    setTokenA("");
    setTokenB("");
    setDuration("");
    setDurationUnit("days");
    setPendingBattleCreation(false);
    createBattle.reset();
  };

  const handleClose = () => {
    // Only prevent closing if an actual transaction is in progress
    if (createBattle.isLoading) {
      toast.error("Please wait for the transaction to complete");
      return;
    }
    
    resetForm();
    onOpenChange(false);
  };

  const calculateDurationInSeconds = useCallback(() => {
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
    return Math.floor(durationInSeconds);
  }, [duration, durationUnit]);

  const handleCreateBattle = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!tokenA || !tokenB || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    if (tokenA === tokenB) {
      toast.error("Token addresses must be different");
      return;
    }

    try {
      // Convert duration to seconds based on selected unit
      const durationInSeconds = calculateDurationInSeconds();
      
      // Mark as pending to handle callback after confirmation
      setPendingBattleCreation(true);

      // Reset prior transaction state just to be safe
      createBattle.reset();

      // Call the BattleFactory contract's createBattle function
      await createBattle.execute({
        args: [tokenA as Address, tokenB as Address, BigInt(durationInSeconds)],
      });
    } catch (err) {
      console.error("Error creating battle:", err);
      toast.error("Failed to create battle. Please try again.");
      setPendingBattleCreation(false);
    }
  };

  // Track transaction completion and call the callback
  useEffect(() => {
    if (isConfirmed && pendingBattleCreation && receipt && onCreateBattle) {
      try {
        const durationInSeconds = calculateDurationInSeconds();
        
        // Extract battle address from logs if possible
        let battleAddress;
        
        // If we have a receipt, try to extract the battle address from event logs
        if (receipt.logs && receipt.logs.length > 0) {
          // Look for BattleCreated event in logs
          // This is an example - adjust based on your actual event structure
          try {
            // Find the right log entry
            // This is just a placeholder - you'll need to implement this based on your contract's event structure
            const battleCreatedEvent = receipt.logs.find(log => 
              log.topics && log.topics[0] === "0x..." // Your event signature hash
            );
            
            if (battleCreatedEvent && battleCreatedEvent.data) {
              // Extract the battle address from the event data
              // Again, this is just an example
              // battleAddress = "0x" + battleCreatedEvent.data.slice(26, 66);
            }
          } catch (parseErr) {
            console.error("Error parsing event logs:", parseErr);
          }
        }
        
        // Call the callback with the battle information
        onCreateBattle(tokenA, tokenB, durationInSeconds, battleAddress);
        
        toast.success("Battle created successfully!");
        
        // Reset form and close dialog after successful transaction
        resetForm();
        onOpenChange(false);
      } catch (err) {
        console.error("Error handling battle creation completion:", err);
        toast.success("Battle created, but couldn't verify details");
        
        // Still call callback on best effort
        try {
          const durationInSeconds = calculateDurationInSeconds();
          onCreateBattle(tokenA, tokenB, durationInSeconds);
        } catch (callbackErr) {
          console.error("Error in callback:", callbackErr);
        }
        
        resetForm();
        onOpenChange(false);
      }
      
      // Reset the pending state
      setPendingBattleCreation(false);
    }
  }, [
    isConfirmed,
    pendingBattleCreation,
    receipt,
    onCreateBattle,
    tokenA,
    tokenB,
    calculateDurationInSeconds,
    onOpenChange
  ]);

  const isFormValid = () => {
    return (
      tokenA &&
      tokenB &&
      tokenA !== tokenB &&
      duration &&
      parseFloat(duration) > 0 &&
      address
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
            Create a new battle between two tokens. Users will stake their
            tokens to compete.
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
              disabled={createBattle.isLoading}
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
              disabled={createBattle.isLoading}
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
                disabled={createBattle.isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration-unit">Duration Unit</Label>
              <Select
                value={durationUnit}
                onValueChange={(value) => setDurationUnit(value)}
                disabled={createBattle.isLoading}
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
              Creating a battle will deploy a new Battle contract. Please verify
              the token addresses are correct before proceeding. The battle
              duration cannot be changed after creation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="hover:bg-red-500 hover:font-bold hover:border-black"
            disabled={createBattle.isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={!isFormValid() || createBattle.isLoading}
            onClick={handleCreateBattle}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {createBattle.isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating Battle...
              </>
            ) : (
              "Create Battle"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
