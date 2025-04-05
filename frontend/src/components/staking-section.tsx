"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"

export function StakingSection() {
  const [stakeAmount, setStakeAmount] = useState("100")
  const [selectedToken, setSelectedToken] = useState("TKNS")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Stake Tokens</CardTitle>
            <CardDescription>Stake your tokens to participate in PvP battles</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
              </TabsList>
              <TabsContent value="stake" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Select Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger id="token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TKNS">TKNS</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Amount</Label>
                    <span className="text-sm text-muted-foreground">Balance: 2,500 TKNS</span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => setStakeAmount("2500")}>
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Stake Duration</Label>
                    <span className="text-sm text-muted-foreground">7 days</span>
                  </div>
                  <Slider defaultValue={[7]} max={30} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="unstake" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="staked-token">Select Staked Token</Label>
                  <Select defaultValue="TKNS">
                    <SelectTrigger id="staked-token">
                      <SelectValue placeholder="Select staked token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TKNS">TKNS (1,245)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="unstake-amount">Amount</Label>
                    <span className="text-sm text-muted-foreground">Staked: 1,245 TKNS</span>
                  </div>
                  <div className="flex space-x-2">
                    <Input id="unstake-amount" type="number" placeholder="0.0" />
                    <Button variant="outline" size="sm">
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-yellow-500/10 p-3 text-sm flex items-start gap-2">
                  <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p>Unstaking before the lock period ends may result in penalties.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Stake Now</Button>
          </CardFooter>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Staking Overview</CardTitle>
            <CardDescription>Your current staking positions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Staked</span>
                <span className="font-medium">1,245 TKNS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available for Battle</span>
                <span className="font-medium">1,000 TKNS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Locked in Battles</span>
                <span className="font-medium">245 TKNS</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Active Stakes</h4>
              <div className="rounded-lg border p-3">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">1,000 TKNS</span>
                  <span className="text-sm text-muted-foreground">7 days lock</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staked on</span>
                  <span>Apr 2, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unlocks on</span>
                  <span>Apr 9, 2025</span>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">245 TKNS</span>
                  <span className="text-sm text-muted-foreground">14 days lock</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staked on</span>
                  <span>Mar 28, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unlocks on</span>
                  <span>Apr 11, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


