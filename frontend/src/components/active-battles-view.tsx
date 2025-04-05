"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowUpDown, Clock, Filter, Flame, Search, Swords, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ActiveBattlesView() {
  const [sortBy, setSortBy] = useState("timeLeft")
  const [filterToken, setFilterToken] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null)
  const [selectedToken, setSelectedToken] = useState<"tokenA" | "tokenB" | null>(null)
  const [stakeAmount, setStakeAmount] = useState("100")

  // Mock data for active battles with token A vs token B structure
  const battles: Battle[] = [
    {
      id: "B1001",
      name: "ETH vs USDC Showdown",
      creator: "Player1",
      timeLeft: "18h 45m",
      createdAt: "2 hours ago",
      difficulty: "medium",
      tokenA: {
        symbol: "ETH",
        stakeAmount: 0.5,
        totalStaked: 1.5,
        participants: 3,
        participants_list: [
          { name: "Player1", avatar: "/placeholder.svg?height=32&width=32", stake: 0.5 },
          { name: "Player7", avatar: "/placeholder.svg?height=32&width=32", stake: 0.5 },
          { name: "Player3", avatar: "/placeholder.svg?height=32&width=32", stake: 0.5 },
        ],
      },
      tokenB: {
        symbol: "USDC",
        stakeAmount: 1000,
        totalStaked: 2000,
        participants: 2,
        participants_list: [
          { name: "Player5", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
          { name: "Player9", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
    {
      id: "B1002",
      name: "TKNS vs BTC Battle",
      creator: "Player5",
      timeLeft: "6h 20m",
      createdAt: "5 hours ago",
      difficulty: "hard",
      tokenA: {
        symbol: "TKNS",
        stakeAmount: 1000,
        totalStaked: 4000,
        participants: 4,
        participants_list: [
          { name: "Player5", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
          { name: "Player2", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
          { name: "Player9", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
          { name: "Player4", avatar: "/placeholder.svg?height=32&width=32", stake: 1000 },
        ],
      },
      tokenB: {
        symbol: "BTC",
        stakeAmount: 0.05,
        totalStaked: 0.15,
        participants: 3,
        participants_list: [
          { name: "Player6", avatar: "/placeholder.svg?height=32&width=32", stake: 0.05 },
          { name: "Player8", avatar: "/placeholder.svg?height=32&width=32", stake: 0.05 },
          { name: "Player10", avatar: "/placeholder.svg?height=32&width=32", stake: 0.05 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
    {
      id: "B1003",
      name: "Stablecoin War",
      creator: "Player8",
      timeLeft: "23h 10m",
      createdAt: "1 hour ago",
      difficulty: "easy",
      tokenA: {
        symbol: "USDC",
        stakeAmount: 500,
        totalStaked: 2500,
        participants: 5,
        participants_list: [
          { name: "Player8", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player12", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player15", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player3", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player7", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
        ],
      },
      tokenB: {
        symbol: "DAI",
        stakeAmount: 500,
        totalStaked: 2000,
        participants: 4,
        participants_list: [
          { name: "Player1", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player4", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player6", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player11", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
    {
      id: "B1004",
      name: "Meme Coin Battle",
      creator: "Player2",
      timeLeft: "12h 35m",
      createdAt: "8 hours ago",
      difficulty: "extreme",
      tokenA: {
        symbol: "DOGE",
        stakeAmount: 10000,
        totalStaked: 30000,
        participants: 3,
        participants_list: [
          { name: "Player2", avatar: "/placeholder.svg?height=32&width=32", stake: 10000 },
          { name: "Player5", avatar: "/placeholder.svg?height=32&width=32", stake: 10000 },
          { name: "Player9", avatar: "/placeholder.svg?height=32&width=32", stake: 10000 },
        ],
      },
      tokenB: {
        symbol: "SHIB",
        stakeAmount: 50000000,
        totalStaked: 100000000,
        participants: 2,
        participants_list: [
          { name: "Player3", avatar: "/placeholder.svg?height=32&width=32", stake: 50000000 },
          { name: "Player7", avatar: "/placeholder.svg?height=32&width=32", stake: 50000000 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
    {
      id: "B1005",
      name: "TKNS vs ETH Duel",
      creator: "Player7",
      timeLeft: "36h 15m",
      createdAt: "3 hours ago",
      difficulty: "medium",
      tokenA: {
        symbol: "TKNS",
        stakeAmount: 500,
        totalStaked: 1500,
        participants: 3,
        participants_list: [
          { name: "Player7", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player3", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
          { name: "Player11", avatar: "/placeholder.svg?height=32&width=32", stake: 500 },
        ],
      },
      tokenB: {
        symbol: "ETH",
        stakeAmount: 0.25,
        totalStaked: 0.75,
        participants: 3,
        participants_list: [
          { name: "Player2", avatar: "/placeholder.svg?height=32&width=32", stake: 0.25 },
          { name: "Player5", avatar: "/placeholder.svg?height=32&width=32", stake: 0.25 },
          { name: "Player9", avatar: "/placeholder.svg?height=32&width=32", stake: 0.25 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
    {
      id: "B1006",
      name: "Layer 1 Showdown",
      creator: "Player4",
      timeLeft: "2h 50m",
      createdAt: "10 hours ago",
      difficulty: "hard",
      tokenA: {
        symbol: "ETH",
        stakeAmount: 0.2,
        totalStaked: 0.8,
        participants: 4,
        participants_list: [
          { name: "Player4", avatar: "/placeholder.svg?height=32&width=32", stake: 0.2 },
          { name: "Player6", avatar: "/placeholder.svg?height=32&width=32", stake: 0.2 },
          { name: "Player8", avatar: "/placeholder.svg?height=32&width=32", stake: 0.2 },
          { name: "Player10", avatar: "/placeholder.svg?height=32&width=32", stake: 0.2 },
        ],
      },
      tokenB: {
        symbol: "SOL",
        stakeAmount: 5,
        totalStaked: 25,
        participants: 5,
        participants_list: [
          { name: "Player1", avatar: "/placeholder.svg?height=32&width=32", stake: 5 },
          { name: "Player3", avatar: "/placeholder.svg?height=32&width=32", stake: 5 },
          { name: "Player5", avatar: "/placeholder.svg?height=32&width=32", stake: 5 },
          { name: "Player7", avatar: "/placeholder.svg?height=32&width=32", stake: 5 },
          { name: "Player9", avatar: "/placeholder.svg?height=32&width=32", stake: 5 },
        ],
      },
      maxParticipantsPerSide: 5,
    },
  ]

  // Filter and sort battles
  const filteredBattles = battles
    .filter((battle) => {
      // Filter by token
      if (filterToken !== "all" && battle.tokenA.symbol !== filterToken && battle.tokenB.symbol !== filterToken)
        return false

      // Filter by search query
      if (
        searchQuery &&
        !battle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !battle.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false

      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "timeLeft":
          return Number.parseInt(a.timeLeft) - Number.parseInt(b.timeLeft)
        case "totalStaked":
          const aTotalValue = a.tokenA.totalStaked + a.tokenB.totalStaked
          const bTotalValue = b.tokenA.totalStaked + b.tokenB.totalStaked
          return bTotalValue - aTotalValue
        case "participants":
          const aParticipants = a.tokenA.participants + a.tokenB.participants
          const bParticipants = b.tokenA.participants + b.tokenB.participants
          return bParticipants - aParticipants
        default:
          return 0
      }
    })

  const handleJoinBattle = (battle: Battle, tokenSide: "tokenA" | "tokenB") => {
    setSelectedBattle(battle)
    setSelectedToken(tokenSide)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Token vs Token Battles</CardTitle>
              <CardDescription>Join a side and stake your tokens to win the opposing tokens</CardDescription>
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
              <Button size="sm" className="gap-1">
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
                    placeholder="Search battles by name or ID..."
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
                  <div className="grid grid-cols-8 gap-2 p-3 text-sm font-medium bg-muted/50">
                    <div>Battle</div>
                    <div className="col-span-2">Details</div>
                    <div className="col-span-2">Token A</div>
                    <div className="col-span-2">Token B</div>
                    <div>Time Left</div>
                  </div>
                  <div className="divide-y">
                    {filteredBattles.map((battle) => (
                      <div key={battle.id} className="grid grid-cols-8 gap-2 p-3 text-sm items-center">
                        <div className="font-medium">{battle.id}</div>
                        <div className="col-span-2">
                          <div>{battle.name}</div>
                          <div className="text-xs text-muted-foreground">Created by {battle.creator}</div>
                          <Badge
                            variant={
                              battle.difficulty === "easy"
                                ? "outline"
                                : battle.difficulty === "medium"
                                  ? "secondary"
                                  : battle.difficulty === "hard"
                                    ? "default"
                                    : "destructive"
                            }
                            className="mt-1"
                          >
                            {battle.difficulty.charAt(0).toUpperCase() + battle.difficulty.slice(1)}
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
                            {battle.tokenA.participants}/{battle.maxParticipantsPerSide} participants
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
                            {battle.tokenB.participants}/{battle.maxParticipantsPerSide} participants
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
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{battle.timeLeft}</span>
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

      {/* Battle Join Dialog */}
      <Dialog open={!!selectedBattle} onOpenChange={(open) => !open && setSelectedBattle(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Battle: {selectedBattle?.name}</DialogTitle>
            <DialogDescription>
              Stake your tokens to join this battle and compete for the opposing tokens
            </DialogDescription>
          </DialogHeader>

          {selectedBattle && selectedToken && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Battle ID</div>
                <div className="font-medium">{selectedBattle.id}</div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <h4 className="font-medium mb-3">Choose Your Side</h4>

                <RadioGroup
                  value={selectedToken}
                  onValueChange={(value) => setSelectedToken(value as "tokenA" | "tokenB")}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center justify-between rounded-md border p-3 ${selectedToken === "tokenA" ? "bg-primary/10 border-primary" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tokenA" id="tokenA" />
                      <Label htmlFor="tokenA" className="font-medium">
                        Team {selectedBattle.tokenA.symbol}
                      </Label>
                    </div>
                    <div className="text-sm">
                      <div>
                        {selectedBattle.tokenA.participants}/{selectedBattle.maxParticipantsPerSide} participants
                      </div>
                      <div className="text-muted-foreground">
                        {selectedBattle.tokenA.totalStaked} {selectedBattle.tokenA.symbol} staked
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-2">
                      <Swords className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-md border p-3 ${selectedToken === "tokenB" ? "bg-primary/10 border-primary" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tokenB" id="tokenB" />
                      <Label htmlFor="tokenB" className="font-medium">
                        Team {selectedBattle.tokenB.symbol}
                      </Label>
                    </div>
                    <div className="text-sm">
                      <div>
                        {selectedBattle.tokenB.participants}/{selectedBattle.maxParticipantsPerSide} participants
                      </div>
                      <div className="text-muted-foreground">
                        {selectedBattle.tokenB.totalStaked} {selectedBattle.tokenB.symbol} staked
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stake-amount">Stake Amount</Label>
                  <span className="text-sm text-muted-foreground">
                    Available: 2,500{" "}
                    {selectedToken === "tokenA" ? selectedBattle.tokenA.symbol : selectedBattle.tokenB.symbol}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.0"
                    value={
                      selectedToken === "tokenA" ? selectedBattle.tokenA.stakeAmount : selectedBattle.tokenB.stakeAmount
                    }
                    disabled
                  />
                  <Button variant="outline" size="sm" disabled>
                    MAX
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This battle requires a fixed stake of{" "}
                  {selectedToken === "tokenA"
                    ? `${selectedBattle.tokenA.stakeAmount} ${selectedBattle.tokenA.symbol}`
                    : `${selectedBattle.tokenB.stakeAmount} ${selectedBattle.tokenB.symbol}`}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Current Participants on Your Side</Label>
                <div className="flex flex-wrap gap-2">
                  {(selectedToken === "tokenA"
                    ? selectedBattle.tokenA.participants_list
                    : selectedBattle.tokenB.participants_list
                  ).map((participant, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{participant.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Staked: {participant.stake}{" "}
                            {selectedToken === "tokenA" ? selectedBattle.tokenA.symbol : selectedBattle.tokenB.symbol}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {Array.from({
                    length:
                      selectedBattle.maxParticipantsPerSide -
                      (selectedToken === "tokenA"
                        ? selectedBattle.tokenA.participants
                        : selectedBattle.tokenB.participants),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-dashed border-muted flex items-center justify-center"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                <h4 className="font-medium flex items-center gap-2">
                  <Swords className="h-4 w-4" />
                  Battle Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Stake</span>
                    <span>
                      {selectedToken === "tokenA"
                        ? `${selectedBattle.tokenA.stakeAmount} ${selectedBattle.tokenA.symbol}`
                        : `${selectedBattle.tokenB.stakeAmount} ${selectedBattle.tokenB.symbol}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Team's Total</span>
                    <span>
                      {selectedToken === "tokenA"
                        ? `${selectedBattle.tokenA.totalStaked} ${selectedBattle.tokenA.symbol}`
                        : `${selectedBattle.tokenB.totalStaked} ${selectedBattle.tokenB.symbol}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Opposing Team's Total</span>
                    <span>
                      {selectedToken === "tokenA"
                        ? `${selectedBattle.tokenB.totalStaked} ${selectedBattle.tokenB.symbol}`
                        : `${selectedBattle.tokenA.totalStaked} ${selectedBattle.tokenA.symbol}`}
                    </span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potential Reward</span>
                    <span className="text-green-500">
                      {selectedToken === "tokenA"
                        ? `+${selectedBattle.tokenB.totalStaked} ${selectedBattle.tokenB.symbol}`
                        : `+${selectedBattle.tokenA.totalStaked} ${selectedBattle.tokenA.symbol}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potential Loss</span>
                    <span className="text-red-500">
                      {selectedToken === "tokenA"
                        ? `-${selectedBattle.tokenA.stakeAmount} ${selectedBattle.tokenA.symbol}`
                        : `-${selectedBattle.tokenB.stakeAmount} ${selectedBattle.tokenB.symbol}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 p-3 text-sm">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p>
                  By joining this battle, you agree to stake{" "}
                  {selectedToken === "tokenA"
                    ? `${selectedBattle.tokenA.stakeAmount} ${selectedBattle.tokenA.symbol}`
                    : `${selectedBattle.tokenB.stakeAmount} ${selectedBattle.tokenB.symbol}`}
                  . If your team loses, your staked tokens will be swapped and distributed among the winners.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBattle(null)}>
              Cancel
            </Button>
            <Button>Join Battle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface Battle {
  id: string
  name: string
  creator: string
  timeLeft: string
  createdAt: string
  difficulty: "easy" | "medium" | "hard" | "extreme"
  tokenA: {
    symbol: string
    stakeAmount: number
    totalStaked: number
    participants: number
    participants_list: {
      name: string
      avatar: string
      stake: number
    }[]
  }
  tokenB: {
    symbol: string
    stakeAmount: number
    totalStaked: number
    participants: number
    participants_list: {
      name: string
      avatar: string
      stake: number
    }[]
  }
  maxParticipantsPerSide: number
}

interface TokenVsTokenBattleCardProps {
  battle: Battle
  onJoinA: () => void
  onJoinB: () => void
}

function TokenVsTokenBattleCard({ battle, onJoinA, onJoinB }: TokenVsTokenBattleCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "hard":
        return "bg-orange-500/10 text-orange-500"
      case "extreme":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{battle.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {battle.id}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame className={`h-4 w-4 ${getDifficultyColor(battle.difficulty)}`} />
            <span className="capitalize">{battle.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{battle.timeLeft}</span>
          </div>
          <div className="text-sm text-muted-foreground">Created by {battle.creator}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="font-bold">
                {battle.tokenA.symbol}
              </Badge>
              <span className="text-sm">
                {battle.tokenA.participants}/{battle.maxParticipantsPerSide}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenA.totalStaked} {battle.tokenA.symbol}
              </div>
              <div className="text-xs text-muted-foreground">Total Staked</div>
            </div>
            <Progress value={(battle.tokenA.participants / battle.maxParticipantsPerSide) * 100} className="h-1" />
            <Button variant="outline" size="sm" className="w-full" onClick={onJoinA}>
              Join {battle.tokenA.symbol}
            </Button>
          </div>

          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="font-bold">
                {battle.tokenB.symbol}
              </Badge>
              <span className="text-sm">
                {battle.tokenB.participants}/{battle.maxParticipantsPerSide}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenB.totalStaked} {battle.tokenB.symbol}
              </div>
              <div className="text-xs text-muted-foreground">Total Staked</div>
            </div>
            <Progress value={(battle.tokenB.participants / battle.maxParticipantsPerSide) * 100} className="h-1" />
            <Button variant="outline" size="sm" className="w-full" onClick={onJoinB}>
              Join {battle.tokenB.symbol}
            </Button>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pt-1">
          <div className="flex -space-x-2">
            {battle.tokenA.participants_list.slice(0, 3).map((participant, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
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
            {battle.tokenB.participants_list.slice(0, 3).map((participant, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
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
  )
}


