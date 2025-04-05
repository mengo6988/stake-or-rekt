import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { StakingSection } from "@/components/staking-section"
import { BattlesSection } from "@/components/battles-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "TokenBattle - PvP Staking dApp",
  description: "Stake your tokens and battle other players to win their tokens",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
      <DashboardHeader />
      <main className="flex-1 container py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="battles">Battles</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StakingOverviewCard />
              <BattleStatsCard />
              <RewardsCard />
            </div>
            <ActiveBattlesCard />
          </TabsContent>
          <TabsContent value="stake">
            <StakingSection />
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

function StakingOverviewCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Your Stakes</h3>
        <div className="text-3xl font-bold">1,245 TKNS</div>
        <p className="text-sm text-muted-foreground">+12.5% from last week</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
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
            <div className="text-xs text-muted-foreground">Won</div>
            <div className="text-lg font-medium">+850 TKNS</div>
          </div>
          <div className="rounded-md bg-red-500/10 p-2">
            <div className="text-xs text-muted-foreground">Lost</div>
            <div className="text-lg font-medium">-320 TKNS</div>
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
        <h3 className="text-lg font-medium">Rewards Pool</h3>
        <div className="text-3xl font-bold">24,680 TKNS</div>
        <p className="text-sm text-muted-foreground">Current total staked by all players</p>
        <div className="mt-4">
          <div className="rounded-md bg-primary/10 p-2">
            <div className="text-xs text-muted-foreground">Your Share</div>
            <div className="text-lg font-medium">5.04%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveBattlesCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Active Battles</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                  P{i}
                </div>
                <div>
                  <div className="font-medium">
                    Battle #{i}0{i}
                  </div>
                  <div className="text-sm text-muted-foreground">500 TKNS at stake</div>
                </div>
              </div>
              <div className="text-sm font-medium">
                Ends in {10 + i}h {30 + i}m
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


