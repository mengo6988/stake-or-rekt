"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter, ArrowUpDown, Search, Swords } from "lucide-react";
import { Battle } from "@/types/battle";
import TokenVsTokenBattleCard from "./token-vs-token-battle-card";
import { BattleJoinDialog } from "@/components/battle-join-dialog";
import { battles } from "@/data/battle";
import { CreateBattleDialog } from "./create-battle-dialog";
import { type Address } from "viem";
import toast from "react-hot-toast";

export function ActiveBattlesView() {
  const [sortBy, setSortBy] = useState("timeLeft");
  const [filterToken, setFilterToken] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [selectedToken, setSelectedToken] = useState<
    "tokenA" | "tokenB" | null
  >(null);
  const [createBattle, setCreateBattle] = useState(false);

  // Get the factory address from environment variable
  const battleFactoryAddress = 
    process.env.NEXT_PUBLIC_BATTLE_FACTORY_ADDRESS as Address || 
    "0x0000000000000000000000000000000000000000" as Address;

  // Calculate dollar value based on token price
  const calculateDollarValue = (amount: number, symbol: string) => {
    // In a real implementation, you would use current market prices
    // This is a placeholder implementation
    const prices: Record<string, number> = {
      ETH: 3500,
      BTC: 62000,
      USDC: 1,
      TKNS: 2.5,
      SOL: 145,
      DOGE: 0.15,
      SHIB: 0.00002,
      DAI: 1,
    };

    // Fix the type error by using a type guard or optional chaining
    const price = prices[symbol] ?? 0; // Use nullish coalescing for safety
    return (amount * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  const onCreateBattle = (
    tokenA: string,
    tokenB: string,
    durationInSeconds: number
  ) => {
    toast.success("Battle created successfully!");
  };

  // Filter and sort battles
  const filteredBattles = battles
    .filter((battle) => {
      // Filter by token
      if (
        filterToken !== "all" &&
        battle.tokenA.symbol !== filterToken &&
        battle.tokenB.symbol !== filterToken
      )
        return false;

      // Filter by search query
      if (
        searchQuery &&
        !battle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !battle.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "timeLeft":
          return Number.parseInt(a.timeLeft) - Number.parseInt(b.timeLeft);
        case "totalStaked":
          const aTotalValue = a.tokenA.totalStaked + a.tokenB.totalStaked;
          const bTotalValue = b.tokenA.totalStaked + b.tokenB.totalStaked;
          return bTotalValue - aTotalValue;
        case "participants":
          const aParticipants = a.tokenA.participants + a.tokenB.participants;
          const bParticipants = b.tokenA.participants + b.tokenB.participants;
          return bParticipants - aParticipants;
        default:
          return 0;
      }
    });

  const handleJoinBattle = (battle: Battle, tokenSide: "tokenA" | "tokenB") => {
    setSelectedBattle(battle);
    setSelectedToken(tokenSide);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedBattle(null);
    }
  };

  // Format contract address for display
  const formatAddress = (address: string) => {
    if (address.length < 20) return address;
    return `${address.substring(0, 10)}...${address.substring(
      address.length - 8
    )}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Token vs Token Battles</CardTitle>
              <CardDescription>
                Join a side and stake your tokens to win the opposing tokens
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
              <Button
                size="sm"
                className="gap-1"
                onClick={() => setCreateBattle(true)}
              >
                <Swords className="h-4 w-4" />
                Create Battle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search battles by name or contract address..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterToken} onValueChange={setFilterToken}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tokens</SelectItem>
                    <SelectItem value="TKNS">TKNS</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="DOGE">DOGE</SelectItem>
                    <SelectItem value="SHIB">SHIB</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timeLeft">Time Left</SelectItem>
                    <SelectItem value="totalStaked">Total Staked</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="w-[200px] mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBattles.map((battle) => (
                    <TokenVsTokenBattleCard
                      key={battle.id}
                      battle={battle}
                      onJoinA={() => handleJoinBattle(battle, "tokenA")}
                      onJoinB={() => handleJoinBattle(battle, "tokenB")}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="pt-2">
                <div className="rounded-md border overflow-hidden">
                  <div className="grid grid-cols-7 gap-2 p-3 text-sm font-medium bg-muted/50">
                    <div>Battle</div>
                    <div className="col-span-2">Details</div>
                    <div className="col-span-2">Token A</div>
                    <div className="col-span-2">Token B</div>
                  </div>
                  <div className="divide-y">
                    {filteredBattles.map((battle) => (
                      <div
                        key={battle.id}
                        className="grid grid-cols-7 gap-2 p-3 text-sm items-center"
                      >
                        <div className="font-medium">
                          <div className="truncate" title={battle.id}>
                            {formatAddress(battle.address)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {battle.timeLeft}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div>{battle.name}</div>
                          <Badge
                            variant={
                              battle.difficulty === "low"
                                ? "outline"
                                : battle.difficulty === "medium"
                                ? "secondary"
                                : battle.difficulty === "high"
                                ? "default"
                                : "destructive"
                            }
                            className="mt-1"
                          >
                            {battle.difficulty.charAt(0).toUpperCase() +
                              battle.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold">
                              {battle.tokenA.symbol}
                            </Badge>
                            <span>{battle.tokenA.totalStaked} staked</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {calculateDollarValue(
                              battle.tokenA.totalStaked,
                              battle.tokenA.symbol
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-1 w-full"
                            onClick={() => handleJoinBattle(battle, "tokenA")}
                          >
                            Join {battle.tokenA.symbol}
                          </Button>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold">
                              {battle.tokenB.symbol}
                            </Badge>
                            <span>{battle.tokenB.totalStaked} staked</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {calculateDollarValue(
                              battle.tokenB.totalStaked,
                              battle.tokenB.symbol
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-1 w-full"
                            onClick={() => handleJoinBattle(battle, "tokenB")}
                          >
                            Join {battle.tokenB.symbol}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      {/* Battle join modal*/}
      <BattleJoinDialog
        open={!!selectedBattle}
        onOpenChange={handleDialogOpenChange}
        selectedBattle={selectedBattle}
        initialSelectedToken={selectedToken}
      />
      {/* Battle create modal */}
      <CreateBattleDialog
        open={createBattle}
        onOpenChange={setCreateBattle}
        onCreateBattle={onCreateBattle}
        battleFactoryAddress={battleFactoryAddress}
      />
    </div>
  );
}