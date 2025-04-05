import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { BattlesSection } from "@/components/battles-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActiveBattlesCard from "@/components/active-battles-card";
// import { Swords, ArrowUp, ArrowDown } from "lucide-react"

export const metadata: Metadata = {
  title: "TokenBattle - PvP Token Battle dApp",
  description: "Stake your tokens and battle other players to win their tokens",
}

// Mock data for portfolio tokens
const portfolioTokens = [
  { symbol: "ETH", amount: 1.25, usdValue: 3568.75, change: 2.3 },
  { symbol: "USDC", amount: 1500, usdValue: 1500, change: 0 },
  { symbol: "TKNS", amount: 1245, usdValue: 1120.50, change: 12.5 },
  { symbol: "BTC", amount: 0.04, usdValue: 2480, change: -1.8 },
  { symbol: "SOL", amount: 12, usdValue: 984, change: 4.2 },
]

// Active battles data with different tokens
const activeBattles = [
  {
    id: "101",
    name: "ETH vs USDC",
    tokenA: { symbol: "ETH", amount: 0.5, usdValue: 1430 },
    tokenB: { symbol: "USDC", amount: 1400, usdValue: 1400 },
    participants: { tokenA: 3, tokenB: 2 },
    endsIn: "11h 31m",
    difficulty: "medium"
  },
  {
    id: "202",
    name: "TKNS vs BTC",
    tokenA: { symbol: "TKNS", amount: 1000, usdValue: 900 },
    tokenB: { symbol: "BTC", amount: 0.015, usdValue: 930 },
    participants: { tokenA: 4, tokenB: 3 },
    endsIn: "12h 32m", 
    difficulty: "hard"
  },
  {
    id: "303",
    name: "SOL vs DAI",
    tokenA: { symbol: "SOL", amount: 10, usdValue: 820 },
    tokenB: { symbol: "DAI", amount: 800, usdValue: 800 },
    participants: { tokenA: 5, tokenB: 4 },
    endsIn: "13h 33m",
    difficulty: "easy"
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
      <DashboardHeader />
      <main className="flex-1 py-6 px-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 text-black">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="battles">Battles</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PortfolioOverviewCard />
              <BattleStatsCard />
              <RewardsCard />
            </div>
            <ActiveBattlesCard />
          </TabsContent>
          <TabsContent value="battles">
            <BattlesSection />
          </TabsContent>
          <TabsContent value="leaderboard">
            <LeaderboardSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function PortfolioOverviewCard() {
  // Calculate total USD value
  const totalUsdValue = portfolioTokens.reduce((sum, token) => sum + token.usdValue, 0);
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-3">
        <h3 className="text-lg font-medium">Your Portfolio</h3>
        <div className="text-3xl font-bold">${totalUsdValue.toLocaleString()}</div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {portfolioTokens.map((token) => (
            <div key={token.symbol} className="flex justify-between items-center text-sm p-1 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                  {token.symbol.charAt(0)}
                </div>
                <span>{token.amount.toLocaleString()} {token.symbol}</span>
              </div>
              <div className="flex flex-col items-end">
                <div>${token.usdValue.toLocaleString()}</div>
                <div className={`text-xs ${token.change > 0 ? 'text-green-500' : token.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {token.change > 0 ? '+' : ''}{token.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-lg font-medium">68%</div>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <div className="text-xs text-muted-foreground">Total Battles</div>
            <div className="text-lg font-medium">24</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BattleStatsCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Battle Stats</h3>
        <div className="text-3xl font-bold">16 Wins</div>
        <p className="text-sm text-muted-foreground">8 Losses</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-green-500/10 p-2">
            <div className="text-xs text-muted-foreground">Winnings</div>
            <div className="text-lg font-medium">+$2,480</div>
            <div className="text-xs text-muted-foreground">
              Mixed tokens worth $2,480
            </div>
          </div>
          <div className="rounded-md bg-red-500/10 p-2">
            <div className="text-xs text-muted-foreground">Losses</div>
            <div className="text-lg font-medium">-$940</div>
            <div className="text-xs text-muted-foreground">
              Mixed tokens worth $940
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RewardsCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Global Battle Stats</h3>
        <div className="text-3xl font-bold">$1.24M</div>
        <p className="text-sm text-muted-foreground">Total value currently in battles</p>
        <div className="mt-4 space-y-2">
          <div className="rounded-md bg-primary/10 p-2">
            <div className="text-xs text-muted-foreground">Your Active Stake</div>
            <div className="text-lg font-medium">$3,150</div>
            <div className="text-xs text-muted-foreground">
              Across 3 active battles
            </div>
          </div>
          
          <div className="flex justify-between text-sm mt-2">
            <span>Most active token:</span>
            <span className="font-medium">ETH ($580K)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
