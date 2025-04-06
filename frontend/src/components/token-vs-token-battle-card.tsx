import { useState, useMemo, useEffect } from "react";
import { useReadContract } from "wagmi";
import { parseEther, formatEther, Address } from "viem";

import { Battle } from "@/types/battle";
import { Clock, Flame, Swords, Award, Repeat } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Import the necessary ABIs
import { battleAbi } from "@/config/abi/Battle";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import axios from "axios";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { useContractInteraction } from "@/hooks/useContractInteraction";

// Function to get avatar src based on index
const getAvatarSrc = (index: number) => {
  // Cycle through the 4 avatars
  const avatarNum = (index % 4) + 1;
  return `/avatar${avatarNum}.svg`;
};

interface TokenVsTokenBattleCardProps {
  battle: Battle;
  onJoinA: () => void;
  onJoinB: () => void;
}

export default function TokenVsTokenBattleCard({
  battle,
  onJoinA,
  onJoinB,
}: TokenVsTokenBattleCardProps) {
  const { address, isConfirmed } = useUnifiedWallet();

  const [tokenAPrice, setTokenAPrice] = useState(0);
  const [tokenBPrice, setTokenBPrice] = useState(0);

  // Read battle state
  const { data: battleResolved } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "battleResolved",
    query: { enabled: Boolean(battle.address) },
  }) as { data: boolean };

  const { data: winningToken } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "winningToken",
    query: { enabled: Boolean(battleResolved && battle.address) },
  }) as { data: bigint };

  const { data: winningsDeposited } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "winningsDeposited",
    query: { enabled: Boolean(battleResolved && battle.address) },
  }) as { data: boolean };

  // Read the winning token address
  const { data: winningTokenAddress } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: Number(winningToken) === 1 ? "tokenA" : "tokenB",
    query: {
      enabled: Boolean(
        battleResolved && winningToken && Number(winningToken) > 0
      ),
    },
  }) as { data: Address };

  // Read user's token balances
  const { data: tokenABalance } = useReadContract({
    address: battle.tokenA.address as `0x${string}`,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  }) as { data: bigint };

  const { data: tokenBBalance } = useReadContract({
    address: battle.tokenB.address as `0x${string}`,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  }) as { data: bigint };
  ("use client");

  // Add approval hook for deposit winnings
  const approveDeposit = useContractInteraction({
    to: winningTokenAddress as `0x${string}`,
    abi: extendedERC20ABI,
    functionName: "approve",
    args: [battle.address as `0x${string}`, parseEther("0.1")],
    description: "Approve Tokens for Deposit",
  });

  // Read user's current stakes in the battle
  const { data: userTokenAStake } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "tokenAStakes",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  }) as { data: bigint };

  const { data: userTokenBStake } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "tokenBStakes",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  }) as { data: bigint };

  // Check if user has already redeemed
  const { data: hasRedeemed } = useReadContract({
    address: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "hasRedeemed",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && battleResolved) },
  }) as { data: boolean };

  // Use contract interaction hooks for staking
  const stakeA = useContractInteraction({
    to: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "stakeTokenA",
    args: [parseEther("0.1")], // Default value, will be overridden when executed
    description: `Stake ${battle.tokenA.symbol}`,
  });

  const stakeB = useContractInteraction({
    to: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "stakeTokenB",
    args: [parseEther("0.1")], // Default value, will be overridden when executed
    description: `Stake ${battle.tokenB.symbol}`,
  });

  // Add new hooks for mockSwap, deposit winnings, and redeem
  const mockSwap = useContractInteraction({
    to: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "mockSwap",
    args: [],
    description: "Mock Swap",
  });

  const depositWinnings = useContractInteraction({
    to: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "depositWinnings",
    args: [parseEther("0.1")], // Default value, will be overridden when executed
    description: "Deposit Winnings",
  });

  const redeem = useContractInteraction({
    to: battle.address as `0x${string}`,
    abi: battleAbi,
    functionName: "redeem",
    args: [],
    description: "Redeem Winnings",
  });

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!battle.tokenA.address || !battle.tokenB.address) return;

      try {
        console.log("tokenA address: ", battle.tokenA.address);
        console.log("tokenB address: ", battle.tokenB.address);
        const response = await axios.get("/api/get-token-prices", {
          params: {
            tokenAAddress: battle.tokenA.address,
            tokenBAddress: battle.tokenB.address,
          },
        });

        const { tokenAPrice, tokenBPrice } = response.data;

        setTokenAPrice(tokenAPrice);
        setTokenBPrice(tokenBPrice);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
    };

    fetchTokenPrice();
  }, [battle.tokenA.address, battle.tokenB.address]);

  // Handle staking errors and successes
  useEffect(() => {
    if (stakeA.isSuccess) {
      toast.success(`Successfully staked ${battle.tokenA.symbol}`);
      onJoinA(); // Call the onJoinA callback on success
    }

    if (stakeB.isSuccess) {
      toast.success(`Successfully staked ${battle.tokenB.symbol}`);
      onJoinB(); // Call the onJoinB callback on success
    }

    if (stakeA.error) {
      toast.error(`Failed to stake ${battle.tokenA.symbol}: ${stakeA.error}`);
    }

    if (stakeB.error) {
      toast.error(`Failed to stake ${battle.tokenB.symbol}: ${stakeB.error}`);
    }

    // Handle mockSwap and redeem successes
    if (approveDeposit.isSuccess) {
      toast.success("Token approval successful, now depositing winnings...");
      // Automatically execute deposit after approval
      const depositAmount = parseEther("0.1");
      depositWinnings.execute({
        args: [depositAmount],
      });
    }

    if (approveDeposit.error) {
      toast.error(`Failed to approve tokens: ${approveDeposit.error}`);
    }

    if (mockSwap.isSuccess) {
      toast.success("Mock swap executed successfully");
    }

    if (depositWinnings.isSuccess) {
      toast.success("Winnings deposited successfully");
    }

    if (redeem.isSuccess) {
      toast.success("Successfully redeemed winnings");
    }

    if (mockSwap.error) {
      toast.error(`Failed to execute mock swap: ${mockSwap.error}`);
    }

    if (depositWinnings.error) {
      toast.error(`Failed to deposit winnings: ${depositWinnings.error}`);
    }

    if (redeem.error) {
      toast.error(`Failed to redeem winnings: ${redeem.error}`);
    }
  }, [
    stakeA.isSuccess,
    stakeB.isSuccess,
    stakeA.error,
    stakeB.error,
    battle.tokenA.symbol,
    battle.tokenB.symbol,
    onJoinA,
    onJoinB,
    approveDeposit.isSuccess,
    approveDeposit.error,
    mockSwap.isSuccess,
    mockSwap.error,
    depositWinnings.isSuccess,
    depositWinnings.error,
    redeem.isSuccess,
    redeem.error,
  ]);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "extreme":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Dollar value calculation
  const calculateDollarValue = (
    amount: number,
    symbol: string,
    price: number
  ) => {
    return (amount * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  // Override participants with generated avatars
  const tokenAParticipantsList = battle.tokenA.participants_list.map(
    (participant, index) => ({
      ...participant,
      avatar: getAvatarSrc(index),
    })
  );

  // Stake handlers
  const handleStakeTokenA = async (amount: number) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const stakeAmount = parseEther(amount.toString());

    try {
      stakeA.execute({
        args: [stakeAmount],
      });
    } catch (error: any) {
      console.error("Stake Token A Error:", error);
      toast.error(`Failed to stake ${battle.tokenA.symbol}: ${error.message}`);
    }
  };

  const handleStakeTokenB = async (amount: number) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const stakeAmount = parseEther(amount.toString());

    try {
      stakeB.execute({
        args: [stakeAmount],
      });
    } catch (error: any) {
      console.error("Stake Token B Error:", error);
      toast.error(`Failed to stake ${battle.tokenB.symbol}: ${error.message}`);
    }
  };

  // New handlers for mockSwap, deposit winnings, and redeem
  const handleMockSwap = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      mockSwap.execute();
    } catch (error: any) {
      console.error("Mock Swap Error:", error);
      toast.error(`Failed to execute mock swap: ${error.message}`);
    }
  };

  const handleDepositWinnings = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!winningTokenAddress) {
      toast.error("Cannot determine winning token address");
      return;
    }

    // First approve the tokens before depositing
    try {
      // Fixed amount for testing (0.1 tokens)
      const depositAmount = parseEther("0.1");

      toast.info("Approving tokens first...");
      approveDeposit.execute({
        args: [battle.address as `0x${string}`, depositAmount],
      });

      // Note: The actual deposit will happen in the useEffect after approval succeeds
    } catch (error: any) {
      console.error("Deposit Approval Error:", error);
      toast.error(`Failed to approve tokens: ${error.message}`);
    }
  };

  const handleRedeem = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      redeem.execute();
    } catch (error: any) {
      console.error("Redeem Error:", error);
      toast.error(`Failed to redeem: ${error.message}`);
    }
  };

  const tokenBParticipantsList = battle.tokenB.participants_list.map(
    (participant, index) => ({
      ...participant,
      avatar: getAvatarSrc(index + battle.tokenA.participants_list.length),
    })
  );

  // Check if user is admin (can execute mockSwap)
  const isAdmin = false; // This should be properly determined, for now simplified

  // Determine if user has stakes in winning token or if there was a tie
  const hasWinningStake = useMemo(() => {
    if (!battleResolved || winningToken === undefined || !address) return false;

    const winningTokenNum = Number(winningToken);
    // In case of a tie (winningToken = 0), user can redeem if they have any stake
    if (winningTokenNum === 0) {
      return (
        (userTokenAStake && userTokenAStake > BigInt(0)) ||
        (userTokenBStake && userTokenBStake > BigInt(0))
      );
    }
    // For token A win
    else if (
      winningTokenNum === 1 &&
      userTokenAStake &&
      userTokenAStake > BigInt(0)
    ) {
      return true;
    }
    // For token B win
    else if (
      winningTokenNum === 2 &&
      userTokenBStake &&
      userTokenBStake > BigInt(0)
    ) {
      return true;
    }
    return false;
  }, [battleResolved, winningToken, userTokenAStake, userTokenBStake, address]);

  return (
    <div className="rounded-lg bg-[#232333]">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{battle.name}</h3>
            <p
              className="text-sm text-muted-foreground truncate w-48"
              title={battle.id}
            >
              {battle.address.substring(0, 4)}...
              {battle.address.substring(battle.address.length - 4)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame
              className={`h-4 w-4 ${getDifficultyColor(battle.difficulty)}`}
            />
            <span className="capitalize">{battle.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center justify-start">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{battle.timeLeft}</span>
            {battleResolved && (
              <Badge
                variant="outline"
                className="ml-2 bg-blue-500/20 text-blue-500"
              >
                Resolved
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <Badge
                variant="outline"
                className={`font-bold ${
                  Number(winningToken) === 1 && battleResolved
                    ? "text-green-600 ring-1 ring-green-600"
                    : "text-green-600"
                }`}
              >
                {battle.tokenA.symbol}
                {Number(winningToken) === 1 && battleResolved && (
                  <Award className="ml-1 h-3 w-3 text-yellow-500" />
                )}
              </Badge>
              {address && tokenABalance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {parseFloat(formatEther(tokenABalance)).toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenA.totalStaked} {battle.tokenA.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(
                  battle.tokenA.totalStaked,
                  battle.tokenA.symbol,
                  tokenAPrice
                )}
              </div>
            </div>
            <Progress
              value={75} // This could be the percentage of pool filled
              className="h-1"
            />
            <div className="space-y-2">
              {address && userTokenAStake && (
                <div className="text-xs text-muted-foreground">
                  Your Stake: {formatEther(userTokenAStake)}{" "}
                  {battle.tokenA.symbol}
                </div>
              )}

              {!battleResolved ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
                  onClick={onJoinA}
                >
                  Stake {battle.tokenA.symbol}
                </Button>
              ) : hasRedeemed ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-500 text-white border-none cursor-not-allowed"
                  disabled
                >
                  Already Redeemed
                </Button>
              ) : userTokenAStake &&
                userTokenAStake > BigInt(0) &&
                (Number(winningToken) === 0 || Number(winningToken) === 1) ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-green-600 text-white border-none hover:bg-green-700 hover:text-white cursor-pointer"
                  onClick={handleRedeem}
                  disabled={redeem.isLoading || !winningsDeposited}
                >
                  {redeem.isLoading
                    ? "Redeeming..."
                    : !winningsDeposited
                    ? "Waiting for Winnings"
                    : "Redeem Winnings"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-500 text-white border-none cursor-not-allowed"
                  disabled
                >
                  {userTokenAStake && userTokenAStake > BigInt(0)
                    ? "Lost Battle"
                    : "Battle Ended"}
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border p-3 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <Badge
                variant="outline"
                className={`font-bold ${
                  Number(winningToken) === 2 && battleResolved
                    ? "text-red-600 ring-1 ring-red-600"
                    : "text-red-600"
                }`}
              >
                {battle.tokenB.symbol}
                {Number(winningToken) === 2 && battleResolved && (
                  <Award className="ml-1 h-3 w-3 text-yellow-500" />
                )}
              </Badge>
              {address && tokenBBalance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {parseFloat(formatEther(tokenBBalance)).toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {battle.tokenB.totalStaked} {battle.tokenB.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDollarValue(
                  battle.tokenB.totalStaked,
                  battle.tokenB.symbol,
                  tokenBPrice
                )}
              </div>
            </div>
            <Progress
              value={60} // This could be the percentage of pool filled
              className="h-1"
            />
            <div className="space-y-2">
              {address && userTokenBStake && (
                <div className="text-xs text-muted-foreground">
                  Your Stake: {formatEther(userTokenBStake)}{" "}
                  {battle.tokenB.symbol}
                </div>
              )}

              {!battleResolved ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-[#BEA8E0A3] text-white border-none hover:bg-[#BEA8E0] hover:text-white cursor-pointer"
                  onClick={onJoinB}
                >
                  Stake {battle.tokenB.symbol}
                </Button>
              ) : hasRedeemed ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-500 text-white border-none cursor-not-allowed"
                  disabled
                >
                  Already Redeemed
                </Button>
              ) : userTokenBStake &&
                userTokenBStake > BigInt(0) &&
                (Number(winningToken) === 0 || Number(winningToken) === 2) ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-green-600 text-white border-none hover:bg-green-700 hover:text-white cursor-pointer"
                  onClick={handleRedeem}
                  disabled={redeem.isLoading || !winningsDeposited}
                >
                  {redeem.isLoading
                    ? "Redeeming..."
                    : !winningsDeposited
                    ? "Waiting for Winnings"
                    : "Redeem Winnings"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-500 text-white border-none cursor-not-allowed"
                  disabled
                >
                  {userTokenBStake && userTokenBStake > BigInt(0)
                    ? "Lost Battle"
                    : "Battle Ended"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pt-1">
          <div className="flex -space-x-2">
            {tokenAParticipantsList.slice(0, 3).map((participant, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={participant.avatar}
                        alt={participant.name}
                      />
                      <AvatarFallback>
                        {participant.name.substring(0, 2)}
                      </AvatarFallback>
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
            {tokenBParticipantsList.slice(0, 3).map((participant, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={participant.avatar}
                        alt={participant.name}
                      />
                      <AvatarFallback>
                        {participant.name.substring(0, 2)}
                      </AvatarFallback>
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

        {/* Test buttons for admin functions */}
        {battleResolved && (
          <div className="mt-2 space-y-2">
            {/* Show Mock Swap button first if winnings not deposited */}
            {!winningsDeposited && (
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-amber-600 text-white border-none hover:bg-amber-700 hover:text-white cursor-pointer"
                onClick={handleMockSwap}
                disabled={mockSwap.isLoading}
              >
                <Repeat className="mr-2 h-4 w-4" />
                {mockSwap.isLoading ? "Processing..." : "Mock Swap (Test)"}
              </Button>
            )}

            {/* Show Deposit Winnings button after mock swap but before winnings deposited */}
            {battleResolved &&
              Number(winningToken) > 0 &&
              !winningsDeposited && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-green-600 text-white border-none hover:bg-green-700 hover:text-white cursor-pointer"
                  onClick={handleDepositWinnings}
                  disabled={depositWinnings.isLoading}
                >
                  <Award className="mr-2 h-4 w-4" />
                  {depositWinnings.isLoading
                    ? "Processing..."
                    : "Deposit Winnings (Test)"}
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
