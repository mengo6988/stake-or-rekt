"use client";

import { useState, useEffect } from "react";
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
import { CreateBattleDialog } from "./create-battle-dialog";
import { type Address } from "viem";
import { toast } from "react-hot-toast";
import { useAccount, useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { readConfig } from "@/config/wagmi";

// Import ABIs
import { battleFactoryAbi } from "@/config/abi/BattleFactory";
import { battleAbi } from "@/config/abi/Battle";
import { extendedERC20ABI } from "@/config/abi/ERC20";

export function ActiveBattlesView() {
  const { address } = useAccount();
  const [sortBy, setSortBy] = useState("timeLeft");
  const [filterToken, setFilterToken] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [selectedToken, setSelectedToken] = useState<
    "tokenA" | "tokenB" | null
  >(null);
  const [createBattle, setCreateBattle] = useState(false);
  const [contractBattles, setContractBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the factory address from environment variable
  const battleFactoryAddress =
    (process.env.NEXT_PUBLIC_BATTLE_FACTORY_ADDRESS as Address) ||
    ("0x0000000000000000000000000000000000000000" as Address);

  // Read the battle count from the BattleFactory contract
  const { data: battleCount } = useReadContract({
    address: battleFactoryAddress,
    abi: battleFactoryAbi,
    functionName: "getBattleCount",
  });

  // Get all battle addresses
  const { data: battleAddresses } = useReadContract({
    address: battleFactoryAddress,
    abi: battleFactoryAbi,
    functionName: "getAllBattles",
    query: {
      enabled: Boolean(battleCount && Number(battleCount) > 0),
    },
  });

  // Function to safely get token symbol with fallbacks
  const getTokenSymbol = async (tokenAddress: Address): Promise<string> => {
    try {
      // First try to get the symbol
      const symbol = (await readContract(readConfig, {
        address: tokenAddress,
        abi: extendedERC20ABI,
        functionName: "symbol",
      })) as string;

      return symbol;
    } catch (error) {
      // Try name as fallback
      try {
        const name = (await readContract(readConfig, {
          address: tokenAddress,
          abi: extendedERC20ABI,
          functionName: "name",
        })) as string;

        if (name && name.length > 0) {
          return name.slice(0, 4).toUpperCase();
        }
      } catch (nameError) {
        // Both symbol and name failed
      }

      // Last resort: use short address
      return `${tokenAddress.slice(0, 4)}...${tokenAddress.slice(-4)}`;
    }
  };

  // Fetch battle details when we have battle addresses
  useEffect(() => {
    const fetchBattleDetails = async () => {
      // Make sure battleAddresses is an array with length property
      const addresses = battleAddresses as Address[] | undefined;
      if (!addresses || addresses.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const battles: Battle[] = [];

        for (let i = 0; i < addresses.length; i++) {
          const battleAddress = addresses[i];

          // Read basic battle details using readContract directly
          try {
            // Get token addresses
            const tokenAAddress = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "tokenA",
            })) as Address;

            const tokenBAddress = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "tokenB",
            })) as Address;

            // Get staked amounts
            const totalTokenAStaked = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "totalTokenAStaked",
            })) as bigint;

            const totalTokenBStaked = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "totalTokenBStaked",
            })) as bigint;

            // Get battle timing info
            const battleStartTime = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "battleStartTime",
            })) as bigint;

            const battleDuration = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "battleDuration",
            })) as bigint;

            const battleResolved = (await readContract(readConfig, {
              address: battleAddress,
              abi: battleAbi,
              functionName: "battleResolved",
            })) as boolean;

            // Read token symbols
            const tokenASymbol = await getTokenSymbol(tokenAAddress);

            const tokenBSymbol = await getTokenSymbol(tokenBAddress);

            // Calculate time left
            const endTime = Number(battleStartTime) + Number(battleDuration);
            const now = Math.floor(Date.now() / 1000);
            const timeLeftInSeconds = Math.max(0, endTime - now);

            // Format time left as "XXh YYm"
            let timeLeft = "Ended";
            if (!battleResolved && timeLeftInSeconds > 0) {
              const hours = Math.floor(timeLeftInSeconds / 3600);
              const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
              timeLeft = `${hours}h ${minutes}m`;
            }

            // Calculate difficulty level based on total staked
            // This is hardcoded logic since difficulty isn't part of the contract
            let difficulty: "low" | "medium" | "high" | "extreme" = "low";
            const totalStakedValue =
              Number(totalTokenAStaked) + Number(totalTokenBStaked);
            if (totalStakedValue > 1000) {
              difficulty = "extreme";
            } else if (totalStakedValue > 500) {
              difficulty = "high";
            } else if (totalStakedValue > 100) {
              difficulty = "medium";
            }

            // Format the staked amounts - using basic formatting here
            // In a real implementation, you might want to get token decimals from the contract
            const formattedTokenAStaked = (
              Number(totalTokenAStaked) / 1e18
            ).toFixed(2);
            const formattedTokenBStaked = (
              Number(totalTokenBStaked) / 1e18
            ).toFixed(2);

            // Create a Battle object with the data we have
            // Note: Some data like participants info is hardcoded as it's not stored on-chain
            const battle: Battle = {
              id: `B${i + 1}`,
              address: battleAddress,
              name: `${tokenASymbol} vs ${tokenBSymbol}`,
              creator: "Unknown", // This is hardcoded as it's not easily available on-chain
              timeLeft,
              createdAt: "Unknown", // This is hardcoded as it's not easily available on-chain
              difficulty,
              tokenA: {
                address: tokenAAddress,
                symbol: tokenASymbol,
                stakeAmount: 0, // Hardcoded, as this is user-specific
                totalStaked: Number(formattedTokenAStaked),
                participants: 0, // Hardcoded, as this is not tracked on-chain
                participants_list: [], // Hardcoded, as this is not tracked on-chain
              },
              tokenB: {
                address: tokenBAddress,
                symbol: tokenBSymbol,
                stakeAmount: 0, // Hardcoded, as this is user-specific
                totalStaked: Number(formattedTokenBStaked),
                participants: 0, // Hardcoded, as this is not tracked on-chain
                participants_list: [], // Hardcoded, as this is not tracked on-chain
              },
              maxParticipantsPerSide: 5, // Hardcoded, as this is not tracked on-chain
            };

            // Add mock participant data since this is not stored on-chain
            battle.tokenA.participants = Math.floor(Math.random() * 5) + 1;
            battle.tokenB.participants = Math.floor(Math.random() * 5) + 1;

            // Create mock participants
            battle.tokenA.participants_list = Array.from(
              { length: battle.tokenA.participants },
              (_, j) => ({
                name: `Player${j + 1}`,
                avatar: "/placeholder.svg?height=32&width=32",
                stake: battle.tokenA.totalStaked / battle.tokenA.participants,
              })
            );

            battle.tokenB.participants_list = Array.from(
              { length: battle.tokenB.participants },
              (_, j) => ({
                name: `Player${j + battle.tokenA.participants + 1}`,
                avatar: "/placeholder.svg?height=32&width=32",
                stake: battle.tokenB.totalStaked / battle.tokenB.participants,
              })
            );

            battles.push(battle);
          } catch (err) {
            console.error(
              `Error fetching details for battle ${battleAddress}:`,
              err
            );
            continue; // Skip this battle and continue with the next one
          }
        }

        setContractBattles(battles);
      } catch (error) {
        console.error("Error fetching battle details:", error);
        toast.error("Failed to load battles from the blockchain");
      } finally {
        setIsLoading(false);
      }
    };

    if (battleAddresses) {
      fetchBattleDetails();
    } else {
      setIsLoading(false);
    }
  }, [battleAddresses]);

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
    durationInSeconds: number,
    battleAddress?: string
  ) => {
    console.log(
      `Battle created between ${tokenA} and ${tokenB} for ${durationInSeconds}s`
    );

    if (battleAddress) {
      console.log(`New battle deployed at: ${battleAddress}`);
      // 1. Refresh the battles list - we could add a refetch call here
      // 2. Highlight the new battle
      // 3. Show a more detailed success message

      // Example toast notification
      toast.success(
        <div>
          <div>Battle created successfully!</div>
          <div className="text-xs mt-1 font-mono break-all">
            {battleAddress}
          </div>
        </div>
      );
    }
  };

  // Filter and sort battles
  const filteredBattles = (contractBattles.length > 0 ? contractBattles : [])
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
        !battle.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !battle.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "timeLeft":
          // Convert timeLeft strings to seconds for comparison
          const getSeconds = (timeStr: string) => {
            if (timeStr === "Ended") return Infinity;
            const match = timeStr.match(/(\d+)h\s+(\d+)m/);
            if (!match) return Infinity;
            return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60;
          };
          return getSeconds(a.timeLeft) - getSeconds(b.timeLeft);
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
              <CardTitle>Coin v Coin Battles</CardTitle>
              <CardDescription>
                Join a side and stake your tokens to win the opposing tokens
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer "
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
              <Button
                size="sm"
                className="gap-1 bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
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

              {isLoading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin h-8 w-8 rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Loading battles from the blockchain...
                  </p>
                </div>
              ) : filteredBattles.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground">
                    No battles found. Create a new battle to get started!
                  </p>
                  <Button
                    onClick={() => setCreateBattle(true)}
                    className="mt-4 gap-2"
                  >
                    <Swords className="h-4 w-4" />
                    Create Battle
                  </Button>
                </div>
              ) : (
                <>
                  <TabsContent value="grid">
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
                    <div className="rounded-md overflow-hidden">
                      <div className="grid grid-cols-7 gap-2 p-3 text-sm font-medium bg-[#232333]">
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
                                variant="custom"
                                className="mt-1 w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
                                onClick={() =>
                                  handleJoinBattle(battle, "tokenA")
                                }
                              >
                                Stake {battle.tokenA.symbol}
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
                                className="mt-1 w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
                                onClick={() =>
                                  handleJoinBattle(battle, "tokenB")
                                }
                              >
                                Stake {battle.tokenB.symbol}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}
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
