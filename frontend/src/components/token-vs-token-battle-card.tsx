"use client"

import { Battle } from "@/types/battle";
import { Clock, Flame, Swords } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

  // This function would calculate dollar value based on token price
  const calculateDollarValue = (amount: number, symbol: string) => {
    // In a real implementation, you would use current market prices
    // This is a placeholder implementation
    const prices = {
      ETH: 3500,
      BTC: 62000,
      USDC: 1,
      TKNS: 2.5,
      SOL: 145,
      DOGE: 0.15,
      SHIB: 0.00002,
      DAI: 1
    };
    
    const price = prices[symbol] || 0;
    return (amount * price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{battle.name}</h3>
            <p className="text-sm text-muted-foreground truncate w-48" title={battle.id}>
              {battle.address.substring(0, 4)}...{battle.address.substring(battle.address.length - 4)}
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
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenA.totalStaked} {battle.tokenA.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(battle.tokenA.totalStaked, battle.tokenA.symbol)}
              </div>
            </div>
            <Progress
              value={75} // This could be the percentage of pool filled
              className="h-1"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onJoinA}
            >
              Join {battle.tokenA.symbol}
            </Button>
          </div>

          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="font-bold text-red-600">
                {battle.tokenB.symbol}
              </Badge>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenB.totalStaked} {battle.tokenB.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(battle.tokenB.totalStaked, battle.tokenB.symbol)}
              </div>
            </div>
            <Progress
              value={60} // This could be the percentage of pool filled
              className="h-1"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onJoinB}
            >
              Join {battle.tokenB.symbol}
            </Button>
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
