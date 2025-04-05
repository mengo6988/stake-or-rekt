"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Users } from "lucide-react"

export function BattlesSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Available Battles</CardTitle>
            <CardDescription>Join existing battles or create your own</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="open" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="open" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <BattleCard
                      key={i}
                      id={`B${i}00${i}`}
                      creator={`Player${i}`}
                      stake={100 * i}
                      participants={i}
                      maxParticipants={5}
                      timeLeft={`${12 + i}h ${30 + i}m`}
                      status="open"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="active" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {[4, 5].map((i) => (
                    <BattleCard
                      key={i}
                      id={`B${i}00${i}`}
                      creator={`Player${i}`}
                      stake={100 * i}
                      participants={5}
                      maxParticipants={5}
                      timeLeft={`${6 + i}h ${15 + i}m`}
                      status="active"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {[6, 7, 8].map((i) => (
                    <BattleCard
                      key={i}
                      id={`B${i}00${i}`}
                      creator={`Player${i}`}
                      stake={100 * i}
                      participants={5}
                      maxParticipants={5}
                      timeLeft="Completed"
                      status="completed"
                      winner={i % 2 === 0 ? "You" : `Player${i + 1}`}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create New Battle</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

interface BattleCardProps {
  id: string
  creator: string
  stake: number
  participants: number
  maxParticipants: number
  timeLeft: string
  status: "open" | "active" | "completed"
  winner?: string
}

function BattleCard({ id, creator, stake, participants, maxParticipants, timeLeft, status, winner }: BattleCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{id}</h3>
            <Badge variant={status === "open" ? "outline" : status === "active" ? "secondary" : "default"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Created by {creator}</p>
        </div>
        <div className="text-right">
          <div className="font-medium">{stake} TKNS</div>
          <p className="text-sm text-muted-foreground">per player</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {participants}/{maxParticipants} players
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeLeft}</span>
          </div>
        </div>

        <Progress value={(participants / maxParticipants) * 100} className="h-2" />

        {status === "completed" && (
          <div className="flex items-center gap-2 text-sm mt-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>
              Winner: <span className="font-medium">{winner}</span>
            </span>
          </div>
        )}

        <div className="pt-2">
          {status === "open" ? (
            <Button className="w-full">Join Battle</Button>
          ) : status === "active" ? (
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              View Results
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}


