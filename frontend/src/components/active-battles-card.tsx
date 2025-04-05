import { Swords, ArrowRight, Clock, Flame, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for user's active battles
const userActiveBattles = [
  {
    id: "101",
    name: "ETH vs USDC",
    joinedSide: "tokenA",
    yourStake: { amount: 0.5, symbol: "ETH", usdValue: 1430 },
    potentialReward: { amount: 1400, symbol: "USDC", usdValue: 1400 },
    endsIn: "11h 31m",
    status: "winning", // winning, losing, tied
    teamSize: { yours: 3, opponent: 2 },
  },
  {
    id: "202",
    name: "TKNS vs BTC",
    joinedSide: "tokenA",
    yourStake: { amount: 500, symbol: "TKNS", usdValue: 450 },
    potentialReward: { amount: 0.0075, symbol: "BTC", usdValue: 465 },
    endsIn: "12h 32m",
    status: "tied",
    teamSize: { yours: 4, opponent: 4 },
  },
  {
    id: "303",
    name: "SOL vs DAI",
    joinedSide: "tokenB",
    yourStake: { amount: 200, symbol: "DAI", usdValue: 200 },
    potentialReward: { amount: 2.5, symbol: "SOL", usdValue: 205 },
    endsIn: "13h 33m",
    status: "losing",
    teamSize: { yours: 4, opponent: 5 },
  },
];

export default function ActiveBattlesCard() {
  // Calculate total USD value at stake
  const totalStaked = userActiveBattles.reduce(
    (sum, battle) => sum + battle.yourStake.usdValue,
    0
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "winning":
        return "text-green-500";
      case "losing":
        return "text-red-500";
      case "tied":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  // Get status icon
  const getStatusIcon = (status: any) => {
    switch (status) {
      case "winning":
        return <ArrowRight className="h-4 w-4 text-green-500" />;
      case "losing":
        return <ArrowRight className="h-4 w-4 text-red-500" />;
      case "tied":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your Active Battles</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total staked:</span>{" "}
              <span className="font-medium">
                ${totalStaked.toLocaleString()}
              </span>
            </div>
            {/* New Active Battles button */}
            <Link href="/active-battles">
              <Button
                variant="outline"
                className="bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white"
                size="sm"
              >
                <Swords className="h-4 w-4" />
                All Active Battles
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {userActiveBattles.map((battle) => (
            <div
              key={battle.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ${getStatusColor(
                    battle.status
                  )}`}
                >
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {battle.name}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        battle.status === "winning"
                          ? "bg-green-100 text-green-800"
                          : battle.status === "losing"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {battle.status.charAt(0).toUpperCase() +
                        battle.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      You staked: {battle.yourStake.amount}{" "}
                      {battle.yourStake.symbol}{" "}
                      <span className="text-xs">
                        ($
                        {battle.yourStake.usdValue.toLocaleString()})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 opacity-70" />
                  <span>{battle.endsIn}</span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-muted-foreground">
                    Potential reward:{" "}
                  </span>
                  <span className="font-medium">
                    {battle.potentialReward.amount}{" "}
                    {battle.potentialReward.symbol}{" "}
                    <span className="text-xs">
                      ($
                      {battle.potentialReward.usdValue.toLocaleString()})
                    </span>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Team size: {battle.teamSize.yours} vs{" "}
                  {battle.teamSize.opponent}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button className="btn btn-sm btn-outline w-full gap-2">
            <Swords className="h-4 w-4" />
            Find more battles
          </button>
        </div>
      </div>
    </div>
  );
}

export { ActiveBattlesCard };
