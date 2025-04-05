import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, Medal } from "lucide-react"

export function LeaderboardSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top performers in PvP battles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="pt-4">
              <LeaderboardTable timeframe="daily" />
            </TabsContent>
            <TabsContent value="weekly" className="pt-4">
              <LeaderboardTable timeframe="weekly" />
            </TabsContent>
            <TabsContent value="alltime" className="pt-4">
              <LeaderboardTable timeframe="all time" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Most Battles Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Player1", value: "42 battles" },
                { name: "Player7", value: "38 battles" },
                { name: "You", value: "16 battles", highlight: true },
              ].map((player, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                      <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className={player.highlight ? "font-medium" : ""}>{player.name}</span>
                  </div>
                  <span className="text-sm">{player.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Highest Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Player9", value: "92%" },
                { name: "Player3", value: "85%" },
                { name: "You", value: "68%", highlight: true },
              ].map((player, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                      <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className={player.highlight ? "font-medium" : ""}>{player.name}</span>
                  </div>
                  <span className="text-sm">{player.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Most Tokens Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Player5", value: "12,450 TKNS" },
                { name: "Player2", value: "8,320 TKNS" },
                { name: "You", value: "850 TKNS", highlight: true },
              ].map((player, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                      <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className={player.highlight ? "font-medium" : ""}>{player.name}</span>
                  </div>
                  <span className="text-sm">{player.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface LeaderboardTableProps {
  timeframe: string
}

function LeaderboardTable({ timeframe }: LeaderboardTableProps) {
  const leaderboardData = [
    {
      rank: 1,
      name: "Player5",
      battles: 48,
      wins: 42,
      winRate: "87%",
      tokensWon: "12,450",
      change: "+2",
    },
    {
      rank: 2,
      name: "Player2",
      battles: 36,
      wins: 30,
      winRate: "83%",
      tokensWon: "8,320",
      change: "-1",
    },
    {
      rank: 3,
      name: "Player9",
      battles: 24,
      wins: 22,
      winRate: "92%",
      tokensWon: "6,540",
      change: "+5",
    },
    {
      rank: 4,
      name: "Player7",
      battles: 52,
      wins: 38,
      winRate: "73%",
      tokensWon: "5,280",
      change: "0",
    },
    {
      rank: 5,
      name: "Player3",
      battles: 32,
      wins: 27,
      winRate: "85%",
      tokensWon: "4,950",
      change: "-2",
    },
    {
      rank: 12,
      name: "You",
      battles: 24,
      wins: 16,
      winRate: "68%",
      tokensWon: "850",
      change: "+3",
      highlight: true,
    },
  ]

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-7 gap-2 p-4 text-sm font-medium border-b">
        <div>Rank</div>
        <div className="col-span-2">Player</div>
        <div>Battles</div>
        <div>Win Rate</div>
        <div>Tokens Won</div>
        <div>Change</div>
      </div>
      <div className="divide-y">
        {leaderboardData.map((player) => (
          <div
            key={player.rank}
            className={`grid grid-cols-7 gap-2 p-4 text-sm ${player.highlight ? "bg-muted/50" : ""}`}
          >
            <div className="flex items-center">
              {player.rank <= 3 ? (
                <Medal
                  className={`h-5 w-5 mr-1 ${
                    player.rank === 1 ? "text-yellow-500" : player.rank === 2 ? "text-gray-400" : "text-amber-700"
                  }`}
                />
              ) : (
                player.rank
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className={player.highlight ? "font-medium" : ""}>{player.name}</span>
            </div>
            <div>{player.battles}</div>
            <div>{player.winRate}</div>
            <div>{player.tokensWon} TKNS</div>
            <div
              className={`flex items-center ${
                player.change.startsWith("+") ? "text-green-500" : player.change.startsWith("-") ? "text-red-500" : ""
              }`}
            >
              {player.change !== "0" && (
                <>
                  {player.change.startsWith("+") ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : player.change.startsWith("-") ? (
                    <ArrowUp className="h-3 w-3 mr-1 rotate-180" />
                  ) : null}
                </>
              )}
              {player.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


