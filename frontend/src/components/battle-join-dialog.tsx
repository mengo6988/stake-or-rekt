import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Swords, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Battle } from "@/types/battle";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import { battleAbi } from "@/config/abi/Battle";
import { useReadContract } from "wagmi";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { useContractInteraction } from "@/hooks/useContractInteraction";
import { getTokensOwnedByAccount, TokenData } from "../lib/token-utils";

interface BattleJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBattle: Battle | null;
  initialSelectedToken: "tokenA" | "tokenB" | null;
}

export function BattleJoinDialog({
  open,
  onOpenChange,
  selectedBattle,
  initialSelectedToken,
}: BattleJoinDialogProps) {
  const [selectedToken, setSelectedToken] = useState<
    "tokenA" | "tokenB" | null
  >(initialSelectedToken);
  const { address, isConfirmed } = useUnifiedWallet();

  const [stakeAmount, setStakeAmount] = useState("");
  const [maxStakeAmount, setMaxStakeAmount] = useState(2500);
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [relevantToken, setRelevantToken] = useState<TokenData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Token Balance Contracts
  const { data: tokenABalance = BigInt(0) } = useReadContract({
    address: selectedBattle?.tokenA.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    args: [address as Address],
    query: {
      enabled: Boolean(selectedBattle && address),
      enabled: Boolean(selectedBattle && address),
    },
  }) as { data: bigint };

  const { data: tokenBBalance = BigInt(0) } = useReadContract({
    address: selectedBattle?.tokenB.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    args: [address as Address],
    query: {
      enabled: Boolean(selectedBattle && address),
      enabled: Boolean(selectedBattle && address),
    },
  }) as { data: bigint };

  const faucetA = useContractInteraction({
    to: selectedBattle?.tokenA.address as Address,
    abi: extendedERC20ABI,
    functionName: "faucet",
    args: [parseUnits("1000", 18)],
  });

  const faucetB = useContractInteraction({
    to: selectedBattle?.tokenB.address as Address,
    abi: extendedERC20ABI,
    functionName: "faucet",
    args: [parseUnits("1000", 18)],
    description: "faucet",
  });

  // const { writeContract: faucetTokenA } = useWriteContract();
  //
  // const { writeContract: faucetTokenB } = useWriteContract();

  // Staking Contracts
  const stakeA = useContractInteraction({
    to: selectedBattle?.address as Address,
    abi: battleAbi,
    functionName: "stakeTokenA",
    args: [BigInt(0)],
  });

  const stakeB = useContractInteraction({
    to: selectedBattle?.address as Address,
    abi: battleAbi,
    functionName: "stakeTokenB",
    args: [BigInt(0)],
  });

  const approveA = useContractInteraction({
    to: selectedBattle?.tokenA.address as Address,
    abi: erc20Abi,
    functionName: "approve",
    args: [selectedBattle?.address as Address, BigInt(0)],
    description: "Approve Token A",
  });

  const approveB = useContractInteraction({
    to: selectedBattle?.tokenB.address as Address,
    abi: erc20Abi,
    functionName: "approve",
    args: [selectedBattle?.address as Address, BigInt(0)],
    description: "Approve Token B",
  });

  // Handle Stake Success/Error
  useEffect(() => {
    async function fetchUserTokens() {
      if (!address || !open) return;

      setIsLoadingTokens(true);

      try {
        const tokens = await getTokensOwnedByAccount(address);
        setUserTokens(tokens);
      } catch (error) {
        console.error("Failed to load user tokens:", error);
      } finally {
        setIsLoadingTokens(false);
      }
    }

    fetchUserTokens();
  }, [address, address, open]);

  // Update relevant token when selectedToken changes
  useEffect(() => {
    if (!selectedBattle || !selectedToken || !userTokens.length) {
      setRelevantToken(null);
      return;
    }

    const tokenAddress =
      selectedToken === "tokenA"
        ? selectedBattle.tokenA.address.toLowerCase()
        : selectedBattle.tokenB.address.toLowerCase();

    const relevantToken = userTokens.find(
      (token) => token.tokenAddress.toLowerCase() === tokenAddress
    );

    setRelevantToken(relevantToken || null);
  }, [selectedToken, selectedBattle, userTokens]);

  // Handle Stake Success
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Successfully staked tokens!");
      onOpenChange(false);
    }
  }, [isConfirmed, onOpenChange]);

  // Update selectedToken when initialSelectedToken changes
  useEffect(() => {
    setSelectedToken(initialSelectedToken);
  }, [initialSelectedToken]);

  const handleFaucetClick = async () => {
    if (selectedBattle) {
      if (selectedToken === "tokenA") {
        faucetA.execute({
          args: [parseUnits("1000", 18)],
        });
      } else {
        faucetB.execute({
          args: [parseUnits("1000", 18)],
        });
      }
    }
  };

  // Handle MAX button click
  const handleMaxClick = () => {
    if (relevantToken) {
      setStakeAmount(relevantToken.balance);
    } else {
      const currentBalance =
        selectedToken === "tokenA" ? tokenABalance : tokenBBalance;
      const formattedBalance = formatUnits(currentBalance, 18);
      setStakeAmount(formattedBalance);
    }
  };

  const handleStake = async () => {
    if (!selectedBattle || !selectedToken || !address) {
      toast.error("Please select a battle and token side");
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid stake amount");
      return;
    }

    try {
      const stakeAmountWei = parseUnits(stakeAmount, 18);

      if (selectedToken === "tokenA") {
        await approveA.execute({
          args: [selectedBattle.address as Address, stakeAmountWei],
        });
      } else {
        await approveB.execute({
          args: [selectedBattle.address as Address, stakeAmountWei],
        });
      }

      if (selectedToken === "tokenA") {
        stakeA.execute({
          args: [stakeAmountWei],
        });
      } else {
        stakeB.execute({
          args: [stakeAmountWei],
        });
      }

      setStakeAmount("");
      onOpenChange(false);
      toast.success("Successfully staked tokens!");
    } catch (error: any) {
      console.error("Stake process error:", error);

      // More detailed error handling
      let errorMessage = "Stake failed";
      if (error.message) {
        if (error.message.includes("insufficient balance")) {
          errorMessage = "Insufficient token balance";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "Transaction rejected by user";
        } else if (error.message.includes("exceeds allowance")) {
          errorMessage = "Token approval amount too low";
        }
      }

      toast.error(errorMessage);
    }
  };

  if (!selectedBattle) {
    return null;
  }

  // Calculate potential reward based on user's stake
  const calculatePotentialReward = () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) return "0";

    const userStake = parseFloat(stakeAmount);
    const yourTeamStake =
      selectedToken === "tokenA"
        ? selectedBattle.tokenA.totalStaked + userStake
        : selectedBattle.tokenB.totalStaked + userStake;

    const opposingTeamStake =
      selectedToken === "tokenA"
        ? selectedBattle.tokenB.totalStaked
        : selectedBattle.tokenA.totalStaked;

    const userShare = userStake / yourTeamStake;
    const potentialReward = userShare * opposingTeamStake;

    return potentialReward.toFixed(6);
  };

  // Get symbol of opposing token
  const opposingTokenSymbol =
    selectedToken === "tokenA"
      ? selectedBattle.tokenB.symbol
      : selectedBattle.tokenA.symbol;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#171725] text-white border-none max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl">
            Join Battle: {selectedBattle.name}
          </DialogTitle>
          <DialogDescription>
            Stake your tokens to join this battle and compete for the opposing
            tokens
          </DialogDescription>
        </DialogHeader>

        {selectedBattle && (
          <div className="space-y-3 py-1">
            {/* Choose Side Section */}
            <div className="rounded-lg border p-3 bg-[#232333]">
              <h4 className="font-medium mb-2">Choose Your Side</h4>

              <RadioGroup
                value={selectedToken || ""}
                onValueChange={(value) =>
                  setSelectedToken(value as "tokenA" | "tokenB")
                }
                className="space-y-2"
              >
                <div
                  className={`flex items-center justify-between rounded-md border-none p-2 ${
                    selectedToken === "tokenA"
                      ? "bg-white/5 border border-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tokenA" id="tokenA" />
                    <Label htmlFor="tokenA" className="font-medium">
                      Team {selectedBattle.tokenA.symbol}
                    </Label>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">
                      {selectedBattle.tokenA.totalStaked}{" "}
                      {selectedBattle.tokenA.symbol} staked
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-1">
                    <Swords className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between rounded-md border-none p-2 ${
                    selectedToken === "tokenB"
                      ? "bg-white/5 border border-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tokenB" id="tokenB" />
                    <Label htmlFor="tokenB" className="font-medium">
                      Team {selectedBattle.tokenB.symbol}
                    </Label>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">
                      {selectedBattle.tokenB.totalStaked}{" "}
                      {selectedBattle.tokenB.symbol} staked
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="stake-amount">Stake Amount</Label>
                <span className="text-sm text-muted-foreground">
                  Available:{" "}
                  {formatUnits(
                    selectedToken === "tokenA" ? tokenABalance : tokenBBalance,
                    18,
                  )}{" "}
                  {selectedToken === "tokenA"
                    ? selectedBattle.tokenA.symbol
                    : selectedBattle.tokenB.symbol}
                </span>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="Enter amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleMaxClick}>
                  MAX
                </Button>
              </div>
              <button onClick={handleFaucetClick}>FAUCET</button>
              <p className="text-xs text-muted-foreground">
                Enter the amount you wish to stake in this battle
              </p>
            </div>
            {/* Stake Amount Section */}
            {selectedToken && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="stake-amount">Stake Amount</Label>
                    <span className="text-sm text-muted-foreground">
                      Available:{" "}
                      {relevantToken
                        ? relevantToken.balance
                        : formatUnits(
                            selectedToken === "tokenA"
                              ? tokenABalance
                              : tokenBBalance,
                            18
                          )}{" "}
                      {selectedToken === "tokenA"
                        ? selectedBattle.tokenA.symbol
                        : selectedBattle.tokenB.symbol}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="stake-amount"
                      type="number"
                      placeholder="Enter amount to stake"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMaxClick}
                    >
                      MAX
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFaucetClick}
                      className="h-8 px-2 text-xs"
                    >
                      Get Test Tokens
                    </Button>
                    {isLoadingTokens && (
                      <span className="text-xs text-muted-foreground">
                        Loading token data...
                      </span>
                    )}
                  </div>
                </div>

                {/* Battle Summary */}
                <div className="rounded-lg border p-3 space-y-2 bg-[#232333]">
                  <h4 className="font-medium flex items-center gap-2">
                    <Swords className="h-4 w-4" />
                    Battle Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Your Stake</span>
                    <span className="text-right">
                      {stakeAmount || "0"}{" "}
                      {selectedToken === "tokenA"
                        ? selectedBattle.tokenA.symbol
                        : selectedBattle.tokenB.symbol}
                    </span>

                    <span className="text-muted-foreground">
                      Potential Reward
                    </span>
                    <span className="text-right text-green-500">
                      +{calculatePotentialReward()} {opposingTokenSymbol}
                    </span>

                    <span className="text-muted-foreground">
                      Potential Loss
                    </span>
                    <span className="text-right text-red-500">
                      -{stakeAmount || "0"}{" "}
                      {selectedToken === "tokenA"
                        ? selectedBattle.tokenA.symbol
                        : selectedBattle.tokenB.symbol}
                    </span>
                  </div>
                </div>

                {/* Details Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full text-muted-foreground"
                >
                  {showDetails ? "Hide Details" : "Show More Details"}
                </Button>

                {/* Additional Details Section */}
                {showDetails && (
                  <>
                    <div className="space-y-2">
                      <Label>Current Participants</Label>
                      <div className="flex flex-wrap gap-2">
                        {(selectedToken === "tokenA"
                          ? selectedBattle.tokenA.participants_list
                          : selectedBattle.tokenB.participants_list
                        ).map((participant, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <Avatar className="h-8 w-8 border border-background">
                                    <AvatarImage
                                      src={participant.avatar}
                                      alt={participant.name}
                                    />
                                    <AvatarFallback>
                                      {participant.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{participant.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Staked: {participant.stake}{" "}
                                  {selectedToken === "tokenA"
                                    ? selectedBattle.tokenA.symbol
                                    : selectedBattle.tokenB.symbol}
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
                            className="h-8 w-8 rounded-full border border-dashed border-muted flex items-center justify-center"
                          >
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">
                          {"Your Team's Total"}
                        </span>
                        <span className="text-right">
                          {(selectedToken === "tokenA"
                            ? selectedBattle.tokenA.totalStaked
                            : selectedBattle.tokenB.totalStaked) +
                            (parseFloat(stakeAmount) || 0)}{" "}
                          {selectedToken === "tokenA"
                            ? selectedBattle.tokenA.symbol
                            : selectedBattle.tokenB.symbol}
                        </span>

                        <span className="text-muted-foreground">
                          {"Opposing Team's Total"}
                        </span>
                        <span className="text-right">
                          {selectedToken === "tokenA"
                            ? selectedBattle.tokenB.totalStaked
                            : selectedBattle.tokenA.totalStaked}{" "}
                          {opposingTokenSymbol}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Warning */}
                <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 p-2 text-sm">
                  <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p>
                    By joining, you stake {stakeAmount || "0"}{" "}
                    {selectedToken === "tokenA"
                      ? selectedBattle.tokenA.symbol
                      : selectedBattle.tokenB.symbol}
                    . If your team loses, your tokens will be distributed to
                    winners.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-red-500 hover:font-bold hover:border-black bg-[#171725]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStake}
            disabled={
              !stakeAmount || parseFloat(stakeAmount) <= 0 || !address
            }
            className="bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
          >
            Join Battle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
