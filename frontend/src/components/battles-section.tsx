"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Users } from "lucide-react";

// Sample data to match the userActiveBattles format
const activeBattlesData = [
  {
    id: "BRETT vs TOSHI",
    creator: "Player4",
    stake: 400,
    participants: 4,
    maxParticipants: 5,
    timeLeft: "7h 16m",
    status: "active",
  },
  {
    id: "DEGEN vs PONKE",
    creator: "Player5",
    stake: 500,
    participants: 5,
    maxParticipants: 5,
    timeLeft: "8h 17m",
    status: "active",
  },
];

const completedBattlesData = [
  {
    id: "PEPE vs WOJAK",
    creator: "Player6",
    stake: 600,
    participants: 5,
    maxParticipants: 5,
    timeLeft: "Completed",
    status: "completed",
    winner: "You",
  },
  {
    id: "SAMO vs BONK",
    creator: "Player7",
    stake: 700,
    participants: 5,
    maxParticipants: 5,
    timeLeft: "Completed",
    status: "completed",
    winner: "Player8",
  },
  {
    id: "SHIB vs DOGE",
    creator: "Player8",
    stake: 800,
    participants: 5,
    maxParticipants: 5,
    timeLeft: "Completed",
    status: "completed",
    winner: "You",
  },
];

export function BattlesSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>My Battles</CardTitle>
            <CardDescription>
              Monitor your active battles or view your completed battles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {activeBattlesData.map((battle) => (
                    <BattleCard
                      key={battle.id}
                      id={battle.id}
                      creator={battle.creator}
                      stake={battle.stake}
                      participants={battle.participants}
                      maxParticipants={battle.maxParticipants}
                      timeLeft={battle.timeLeft}
                      status="active"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {completedBattlesData.map((battle) => (
                    <BattleCard
                      key={battle.id}
                      id={battle.id}
                      creator={battle.creator}
                      stake={battle.stake}
                      participants={battle.participants}
                      maxParticipants={battle.maxParticipants}
                      timeLeft={battle.timeLeft}
                      status="completed"
                      winner={battle.winner}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface BattleCardProps {
  id: string;
  creator: string;
  stake: number;
  participants: number;
  maxParticipants: number;
  timeLeft: string;
  status: "active" | "completed";
  winner?: string;
}

function BattleCard({
  id,
  creator,
  stake,
  participants,
  maxParticipants,
  timeLeft,
  status,
  winner,
}: BattleCardProps) {
  return (
    <div className="rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{id}</h3>
            <Badge variant={status === "active" ? "secondary" : "default"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Created by {creator}</p>
        </div>
        <div className="text-right">
          <div className="font-medium">{stake} TKNS</div>
          <p className="text-sm text-muted-foreground">average per player</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{participants} stakers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeLeft}</span>
          </div>
        </div>

        <Progress
          value={(participants / maxParticipants) * 100}
          className="h-2 bg-[#BEA8E0A3]"
        />

        {status === "completed" && (
          <div className="flex items-center gap-2 text-sm mt-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>
              Winner: <span className="font-medium">{winner}</span>
            </span>
          </div>
        )}

        <div className="pt-2">
          {status === "active" ? (
            <Button
              variant="outline"
              className="w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
            >
              View Details
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
            >
              View Results
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
