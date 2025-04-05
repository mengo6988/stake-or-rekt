"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { Battle } from "@/types/battle";
import { Clock, Flame, Swords } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Import the necessary ABIs
import { battleAbi } from "@/config/abi/Battle";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import axios from "axios";

interface TokenVsTokenBattleCardProps {
  battle: Battle;
  onJoinA: () => void;
  onJoinB: () => void;
}

export default function TokenVsTokenBattleCard({
  battle,
  onJoinA,
  onJoinB,
}: TokenVsTokenBattleCardProps) {
  const { address, isConnected } = useAccount();

  const [tokenAPrice, setTokenAPrice] = useState(0);
  const [tokenBPrice, setTokenBPrice] = useState(0);

  // Read user's token balances
  const { data: tokenABalance } = useReadContract({
    address: battle.tokenA.address as `0x${string}`,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  }) as { data: bigint };

  const { data: tokenBBalance } = useReadContract({
    address: battle.tokenB.address as `0x${string}`,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  }) as { data: bigint };

  // Read user's current stakes in the battle
  const { data: userTokenAStake } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "tokenAStakes",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  }) as { data: bigint };

  const { data: userTokenBStake } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "tokenBStakes",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  }) as { data: bigint };

  // Prepare write contract hooks for staking
  const {
    writeContract: stakeTokenAWrite,
    data: stakeTokenATxHash,
    error: stakeTokenAError,
  } = useWriteContract();

  const {
    writeContract: stakeTokenBWrite,
    data: stakeTokenBTxHash,
    error: stakeTokenBError,
  } = useWriteContract();

  // Wait for transaction confirmations
  const { isSuccess: isStakeTokenASuccess } = useWaitForTransactionReceipt({
    hash: stakeTokenATxHash,
  });

  const { isSuccess: isStakeTokenBSuccess } = useWaitForTransactionReceipt({
    hash: stakeTokenBTxHash,
  });

  useEffect(() => {

    const fetchTokenPrice = async () => {
      if (!battle.tokenA.address || !battle.tokenB.address) return;
      
      try {
        console.log("tokanaddress: ", battle.tokenA.address)
        console.log("tokanbddress: ", battle.tokenB.address)
        const response = await axios.get("/api/get-token-prices", {
          params: {
            tokenAAddress: battle.tokenA.address,
            tokenBAddress: battle.tokenB.address,
          },
        });

        const { tokenAPrice, tokenBPrice } = response.data;

        setTokenAPrice(tokenAPrice);
        setTokenBPrice(tokenBPrice);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
    };
    
    fetchTokenPrice();
  }, [battle.tokenA.address, battle.tokenB.address])

  // Handle staking errors and successes
  useMemo(() => {
    if (stakeTokenAError) {
      toast.error(
        `Failed to stake ${battle.tokenA.symbol}: ${stakeTokenAError.message}`
      );
    }
    if (stakeTokenBError) {
      toast.error(
        `Failed to stake ${battle.tokenB.symbol}: ${stakeTokenBError.message}`
      );
    }
    if (isStakeTokenASuccess) {
      toast.success(`Successfully staked ${battle.tokenA.symbol}`);
    }
    if (isStakeTokenBSuccess) {
      toast.success(`Successfully staked ${battle.tokenB.symbol}`);
    }
  }, [
    stakeTokenAError,
    stakeTokenBError,
    isStakeTokenASuccess,
    isStakeTokenBSuccess,
    battle.tokenA.symbol,
    battle.tokenB.symbol,
  ]);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "extreme":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Dollar value calculation
  const calculateDollarValue = (amount: number, symbol: string, price: number) => {
    // const prices: Record<string, number> = {
    //   ETH: 3500,
    //   BTC: 62000,
    //   USDC: 1,
    //   TKNS: 2.5,
    //   SOL: 145,
    //   DOGE: 0.15,
    //   SHIB: 0.00002,
    //   DAI: 1,
    // };
    //
    // const price = prices[symbol] || 0;
    // return 69
    return (amount * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  // Stake handlers
  const handleStakeTokenA = async (amount: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const stakeAmount = parseEther(amount.toString());

    try {
      stakeTokenAWrite({
        address: battle.address as `0x${string}`,
        abi: battleAbi,
        functionName: "stakeTokenA",
        args: [stakeAmount],
      });
    } catch (error: any) {
      console.error("Stake Token A Error:", error);
      toast.error(`Failed to stake ${battle.tokenA.symbol}: ${error.message}`);
    }
  };

  const handleStakeTokenB = async (amount: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const stakeAmount = parseEther(amount.toString());

    try {
      stakeTokenBWrite({
        address: battle.address as `0x${string}`,
        abi: battleAbi,
        functionName: "stakeTokenB",
        args: [stakeAmount],
      });
    } catch (error: any) {
      console.error("Stake Token B Error:", error);
      toast.error(`Failed to stake ${battle.tokenB.symbol}: ${error.message}`);
    }
  };

  return (
    <div className="rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{battle.name}</h3>
            <p
              className="text-sm text-muted-foreground truncate w-48"
              title={battle.id}
            >
              {battle.address.substring(0, 4)}...
              {battle.address.substring(battle.address.length - 4)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame
              className={`h-4 w-4 ${getDifficultyColor(battle.difficulty)}`}
            />
            <span className="capitalize">{battle.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center justify-start">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{battle.timeLeft}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="font-bold text-green-600">
                {battle.tokenA.symbol}
              </Badge>
              {isConnected && tokenABalance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {formatEther(tokenABalance)}
                </span>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenA.totalStaked} {battle.tokenA.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(
                  battle.tokenA.totalStaked,
                  battle.tokenA.symbol,
                  tokenAPrice,
                )}
              </div>
            </div>
            <Progress
              value={75} // This could be the percentage of pool filled
              className="h-1"
            />
            <div className="space-y-2">
              {isConnected && userTokenAStake && (
                <div className="text-xs text-muted-foreground">
                  Your Stake: {formatEther(userTokenAStake)}{" "}
                  {battle.tokenA.symbol}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onJoinA}
                // onClick={() => handleStakeTokenA(0.1)} // Example stake amount
              >
                Join {battle.tokenA.symbol}
              </Button>
            </div>
          </div>

          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="font-bold text-red-600">
                {battle.tokenB.symbol}
              </Badge>
              {isConnected && tokenBBalance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {formatEther(tokenBBalance)}
                </span>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenB.totalStaked} {battle.tokenB.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(
                  battle.tokenB.totalStaked,
                  battle.tokenB.symbol,
                  tokenBPrice,
                )}
              </div>
            </div>
            <Progress
              value={60} // This could be the percentage of pool filled
              className="h-1"
            />
            <div className="space-y-2">
              {isConnected && userTokenBStake && (
                <div className="text-xs text-muted-foreground">
                  Your Stake: {formatEther(userTokenBStake)}{" "}
                  {battle.tokenB.symbol}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onJoinB}
                // onClick={() => handleStakeTokenB(0.1)} // Example stake amount
              >
                Join {battle.tokenB.symbol}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pt-1">
          <div className="flex -space-x-2">
            {battle.tokenA.participants_list
              .slice(0, 3)
              .map((participant, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>

          <div className="flex items-center gap-1">
            <Swords className="h-4 w-4" />
            <span className="text-xs font-medium">VS</span>
          </div>

          <div className="flex -space-x-2">
            {battle.tokenB.participants_list
              .slice(0, 3)
              .map((participant, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
