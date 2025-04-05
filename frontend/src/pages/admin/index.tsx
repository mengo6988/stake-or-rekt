import { useState, useEffect } from "react";
import {
  parseEther,
  formatEther,
  formatUnits,
  type Address,
  parseUnits,
  encodeFunctionData,
  Abi,
} from "viem";
import {
  useAccount,
  useReadContract,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/router";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import axios from "axios";
import { useContractInteraction } from "@/hooks/useContractInteraction";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";

// Battle contract ABI
const battleAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "tokenAPrice", type: "uint256" },
      { internalType: "uint256", name: "tokenBPrice", type: "uint256" },
    ],
    name: "forceResolveBattle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenAPrice", type: "uint256" },
      { internalType: "uint256", name: "tokenBPrice", type: "uint256" },
    ],
    name: "resolveBattle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "depositWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "winningToken",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenA",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenB",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "battleResolved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenAStaked",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenBStaked",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const ONE_INCH_ROUTER_ADDRESS =
  "0x111111125421cA6dc452d289314280a0f8842A65" as Address;

export default function BattleAdminPage() {
  const router = useRouter();
  const { battleAddress } = router.query;
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { isSuccess } = useUnifiedWallet();

  // State variables
  const [tokenAPrice, setTokenAPrice] = useState("1.5");
  const [tokenBPrice, setTokenBPrice] = useState("2.0");
  const [depositAmount, setDepositAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [winningTokenSymbol, setWinningTokenSymbol] = useState("");
  const [losingTokenSymbol, setLosingTokenSymbol] = useState("");
  const [losingTokenAddress, setLosingTokenAddress] = useState<
    Address | undefined
  >();
  const [winningTokenAddress, setWinningTokenAddress] = useState<
    Address | undefined
  >();
  const [error, setError] = useState("");
  const [isSwapApproved, setIsSwapApproved] = useState(false);
  const [isManualSwapMode, setIsManualSwapMode] = useState(false);
  const [swapData, setSwapData] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  // Read contract data
  const { data: battleResolved } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "battleResolved",
  }) as { data: boolean | undefined };

  const { data: winningTokenId } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "winningToken",
    query: {
      enabled: Boolean(battleResolved),
    },
  }) as { data: bigint | undefined };

  const { data: tokenAAddress } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "tokenA",
  }) as { data: Address | undefined };

  const { data: tokenBAddress } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "tokenB",
  }) as { data: Address | undefined };

  const { data: totalTokenAStaked } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "totalTokenAStaked",
  }) as { data: bigint | undefined };

  const { data: totalTokenBStaked } = useReadContract({
    address: battleAddress as Address,
    abi: battleAbi,
    functionName: "totalTokenBStaked",
  }) as { data: bigint | undefined };

  // Get token symbols
  const { data: tokenASymbol } = useReadContract({
    address: tokenAAddress as Address,
    abi: extendedERC20ABI,
    functionName: "symbol",
    query: {
      enabled: Boolean(tokenAAddress),
    },
  }) as { data: string | undefined };

  const { data: tokenBSymbol } = useReadContract({
    address: tokenBAddress as Address,
    abi: extendedERC20ABI,
    functionName: "symbol",
    query: {
      enabled: Boolean(tokenBAddress),
    },
  }) as { data: string | undefined };

  // Token balance
  const { data: losingTokenBalance } = useReadContract({
    address: losingTokenAddress,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(losingTokenAddress && address),
    },
  }) as { data: bigint | undefined };

  const { data: winningTokenBalance } = useReadContract({
    address: winningTokenAddress,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(winningTokenAddress && address),
    },
  }) as { data: bigint | undefined };

  const { data: losingTokenDecimals } = useReadContract({
    address: losingTokenAddress,
    abi: extendedERC20ABI,
    functionName: "decimals",
    query: {
      enabled: Boolean(losingTokenAddress),
    },
  }) as { data: number | undefined };

  const { data: winningTokenDecimals } = useReadContract({
    address: winningTokenAddress,
    abi: extendedERC20ABI,
    functionName: "decimals",
    query: {
      enabled: Boolean(winningTokenAddress),
    },
  }) as { data: number | undefined };

  // Contract interaction hooks
  const resolve = useContractInteraction({
    to: battleAddress as Address,
    abi: battleAbi as Abi,
    functionName: "resolveBattle",
    args: [BigInt(0), BigInt(0)],
    description: "Resolve Battle",
  });

  const forceResolve = useContractInteraction({
    to: battleAddress as Address,
    abi: battleAbi as Abi,
    functionName: "forceResolveBattle",
    args: [BigInt(0), BigInt(0)],
    description: "Force Resolve Battle",
  });

  const approve = useContractInteraction({
    to: losingTokenAddress as Address,
    abi: extendedERC20ABI,
    functionName: "approve",
    args: [ONE_INCH_ROUTER_ADDRESS, BigInt(0)],
    description: "Approve Tokens"
  });

  const transfer = useContractInteraction({
    to: losingTokenAddress as Address,
    abi: extendedERC20ABI,
    functionName: "transfer",
    args: [winningTokenAddress as Address, BigInt(0)],
    description: "Transfer Tokens"
  });

  const depositWinnings = useContractInteraction({
    to: battleAddress as Address,
    abi: battleAbi as Abi,
    functionName: "depositWinnings",
    args: [parseEther(depositAmount || "0")],
    description: "Deposit Winnings",
  });

  // Update winning and losing tokens after battle resolution
  useEffect(() => {
    if (
      battleResolved &&
      winningTokenId !== undefined &&
      tokenAAddress &&
      tokenBAddress
    ) {
      if (Number(winningTokenId) === 1) {
        setWinningTokenAddress(tokenAAddress);
        setLosingTokenAddress(tokenBAddress);
        setWinningTokenSymbol(tokenASymbol || "Token A");
        setLosingTokenSymbol(tokenBSymbol || "Token B");
      } else if (Number(winningTokenId) === 2) {
        setWinningTokenAddress(tokenBAddress);
        setLosingTokenAddress(tokenAAddress);
        setWinningTokenSymbol(tokenBSymbol || "Token B");
        setLosingTokenSymbol(tokenASymbol || "Token A");
      }
    }
  }, [
    battleResolved,
    winningTokenId,
    tokenAAddress,
    tokenBAddress,
    tokenASymbol,
    tokenBSymbol,
  ]);

  // Handle transaction results
  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction successful!");
      // Reset swap approval status if it was a successful swap
      if (isSwapping) {
        setIsSwapApproved(false);
        setIsSwapping(false);
      }
    }
  }, [isSuccess, isSwapping]);

  // Handlers
const handleResolveBattle = () => {
  if (!tokenAPrice || !tokenBPrice) {
    toast.error("Please provide both token prices");
    return;
  }
  
  setError("");
  
  try {
    // Convert to strings to ensure we're working with string values
    const tokenAPriceStr = tokenAPrice.toString();
    const tokenBPriceStr = tokenBPrice.toString();
    
    // Use parseUnits to handle the decimals properly (scaling to 18 decimals)
    resolve.execute({
      args: [
        parseUnits(tokenAPriceStr, 18), 
        parseUnits(tokenBPriceStr, 18)
      ],
    });
  } catch (err) {
    console.error("Error in handleResolveBattle:", err);
    toast.error(`Failed to resolve battle: ${(err as Error).message}`);
  }
};

const handleForceResolveBattle = () => {
  if (!tokenAPrice || !tokenBPrice) {
    toast.error("Please provide both token prices");
    return;
  }
  
  setError("");
  
  try {
    // Convert to strings to ensure we're working with string values
    const tokenAPriceStr = tokenAPrice.toString();
    const tokenBPriceStr = tokenBPrice.toString();
    
    // Use parseUnits to handle the decimals properly (scaling to 18 decimals)
    forceResolve.execute({
      args: [
        parseUnits(tokenAPriceStr, 18), 
        parseUnits(tokenBPriceStr, 18)
      ],
    });
  } catch (err) {
    console.error("Error in handleForceResolveBattle:", err);
    toast.error(`Failed to force resolve battle: ${(err as Error).message}`);
  }
};
  const handleDepositWinnings = () => {
    if (!depositAmount) {
      toast.error("Please provide a deposit amount");
      return;
    }

    setError("");
    depositWinnings.execute({
      args: [parseEther(depositAmount)],
    });
  };

  // Fetch token prices from API endpoint
  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!tokenAAddress || !tokenBAddress) return;

      try {
        const response = await axios.get("/api/get-token-prices", {
          params: {
            tokenAAddress,
            tokenBAddress,
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
  }, [tokenAAddress, tokenBAddress]);

  // Get swap data from 1inch API
  const fetchSwapData = async () => {
    if (
      !losingTokenAddress ||
      !winningTokenAddress ||
      !swapAmount ||
      !losingTokenDecimals ||
      !address
    ) {
      toast.error("Missing required data for swap");
      return;
    }

    try {
      toast.info("Fetching swap data from 1inch API...");

      // Calculate amount with proper decimals
      const fromTokenAmount = parseUnits(
        swapAmount,
        losingTokenDecimals,
      ).toString();

      // Call your backend API to get the swap data
      const response = await axios.get("/api/get-swap-data", {
        params: {
          fromTokenAddress: losingTokenAddress,
          toTokenAddress: winningTokenAddress,
          fromTokenAmount,
          fromAddress: address,
        },
      });
      console.log("RESPONSE: ", response.data);

      // Get the tx data from the response
      const { tx } = response.data;

      if (tx && tx.data) {
        setSwapData(tx.data);
        toast.success("Swap data fetched successfully");
        return tx.data;
      } else {
        throw new Error("Invalid swap data received");
      }
    } catch (error) {
      console.error("Error fetching swap data:", error);
      toast.error("Failed to fetch swap data: " + (error as Error).message);
      return null;
    }
  };

  const handleApproveTokens = () => {
    if (!swapAmount || !losingTokenAddress || !address) {
      toast.error("Please provide swap amount and ensure battle is resolved");
      return;
    }

    setError("");
    const decimals = losingTokenDecimals || 18;
    const amountToSwap = parseUnits(swapAmount, decimals);

    approve.execute({
      args: [ONE_INCH_ROUTER_ADDRESS, amountToSwap],
    });

    setIsSwapApproved(true);
    toast.success("Tokens approved for swapping");
  };

  const handleSwapTokens = async () => {
    if (!walletClient || !swapData) {
      const newSwapData = await fetchSwapData();
      if (!newSwapData || !walletClient) {
        toast.error("Swap data or wallet client not available");
        return;
      }

      setSwapData(newSwapData);
    }

    try {
      setIsSwapping(true);
      toast.info("Executing swap...");

      // Prepare transaction data for the 1inch router
      const txData = {
        to: ONE_INCH_ROUTER_ADDRESS,
        data: swapData as `0x${string}`,
        value: BigInt(0), // Set to 0 for ERC20 swaps
      };

      // Send the transaction
      const hash = await walletClient.sendTransaction(txData);

      // Track the transaction for success/failure
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        toast.success("Swap completed successfully!");
        setIsSwapApproved(false);
        setIsSwapping(false);
      } else {
        toast.error("Swap failed");
        setIsSwapping(false);
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      toast.error("Swap failed: " + (error as Error).message);
      setIsSwapping(false);
    }
  };

  const handleManualTransfer = () => {
    if (
      !swapAmount ||
      !losingTokenAddress ||
      !winningTokenAddress ||
      !address
    ) {
      toast.error("Please provide swap amount and ensure battle is resolved");
      return;
    }

    setError("");
    const decimals = losingTokenDecimals || 18;
    const amountToSwap = parseUnits(swapAmount, decimals);

    transfer.execute({
      args: [winningTokenAddress, amountToSwap],
    });
  };

  const handleUseForDeposit = () => {
    if (!winningTokenBalance || winningTokenBalance <= BigInt(0)) {
      toast.error("No tokens available to deposit");
      return;
    }

    const amountToDeposit = formatEther(winningTokenBalance);
    setDepositAmount(amountToDeposit);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0E1015] to-[#2d0e59]">
      <DashboardHeader />
      <h1 className="text-3xl font-bold mb-6">Battle Admin Dashboard</h1>

      {!isConnected ? (
        <div className="text-center p-8">
          <h2 className="text-xl">
            Please connect your wallet to access admin functions
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Battle Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Battle Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <span className="font-semibold">Address: </span>
                  {battleAddress}
                </p>
                <div>
                  <p className="font-semibold">
                    Status: {battleResolved ? "Resolved" : "In Progress"}
                  </p>
                  {battleResolved && winningTokenId !== undefined && (
                    <p className="font-semibold">
                      Winner:{" "}
                      {Number(winningTokenId) === 1
                        ? tokenASymbol || "Token A"
                        : Number(winningTokenId) === 2
                          ? tokenBSymbol || "Token B"
                          : "Tie"}
                    </p>
                  )}
                </div>
                <div>
                  <p>
                    {tokenASymbol || "Token A"} Staked:{" "}
                    {totalTokenAStaked ? formatEther(totalTokenAStaked) : "0"}
                  </p>
                  <p>
                    {tokenBSymbol || "Token B"} Staked:{" "}
                    {totalTokenBStaked ? formatEther(totalTokenBStaked) : "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolve Battle Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resolve Battle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenAPrice">
                    {tokenASymbol || "Token A"} Price
                  </Label>
                  <Input
                    id="tokenAPrice"
                    value={tokenAPrice}
                    onChange={(e) => setTokenAPrice(e.target.value)}
                    placeholder="Enter Token A Price"
                    disabled={!!battleResolved}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenBPrice">
                    {tokenBSymbol || "Token B"} Price
                  </Label>
                  <Input
                    id="tokenBPrice"
                    value={tokenBPrice}
                    onChange={(e) => setTokenBPrice(e.target.value)}
                    placeholder="Enter Token B Price"
                    disabled={!!battleResolved}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleResolveBattle}
                    disabled={
                      !!battleResolved ||
                      resolve.isLoading ||
                      !tokenAPrice ||
                      !tokenBPrice
                    }
                  >
                    {resolve.isLoading
                      ? "Processing..."
                      : "Resolve Battle"}
                  </Button>
                  <Button
                    onClick={handleForceResolveBattle}
                    variant="outline"
                    disabled={
                      !!battleResolved ||
                      forceResolve.isLoading ||
                      !tokenAPrice ||
                      !tokenBPrice
                    }
                  >
                    {forceResolve.isLoading
                      ? "Processing..."
                      : "Force Resolve"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Token Transfer Card */}
          {battleResolved && (
            <Card>
              <CardHeader>
                <CardTitle>Token Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p>Transfer losing tokens to winning tokens</p>
                    <div className="flex items-center my-2">
                      <input
                        type="checkbox"
                        id="manualMode"
                        checked={isManualSwapMode}
                        onChange={() => setIsManualSwapMode(!isManualSwapMode)}
                        className="mr-2"
                      />
                      <Label htmlFor="manualMode">
                        Use Manual Transfer Mode
                      </Label>
                    </div>
                    {losingTokenBalance && losingTokenDecimals && (
                      <p className="text-sm text-gray-500 mt-1">
                        Available:{" "}
                        {formatUnits(losingTokenBalance, losingTokenDecimals)}{" "}
                        {losingTokenSymbol}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swapAmount">
                      Amount to Transfer ({losingTokenSymbol})
                    </Label>
                    <Input
                      id="swapAmount"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="Enter Amount"
                    />
                  </div>

                  {isManualSwapMode ? (
                    <Button
                      onClick={handleManualTransfer}
                      disabled={
                        !swapAmount ||
                        transfer.isLoading
                      }
                    >
                      {transfer.isLoading
                        ? "Processing..."
                        : "Transfer Tokens"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={handleApproveTokens}
                        disabled={
                          !swapAmount ||
                          approve.isLoading ||
                          isSwapApproved
                        }
                      >
                        {approve.isLoading
                          ? "Processing..."
                          : isSwapApproved
                            ? "Approved"
                            : "Approve Tokens"}
                      </Button>

                      {isSwapApproved && (
                        <Button
                          onClick={handleSwapTokens}
                          disabled={
                            !swapAmount ||
                            isSwapping
                          }
                          className="ml-2"
                        >
                          {isSwapping
                            ? "Processing..."
                            : "Swap Tokens"}
                        </Button>
                      )}
                    </div>
                  )}

                  {winningTokenBalance && winningTokenBalance > BigInt(0) && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <p className="font-medium">Available Winning Tokens:</p>
                      <p>
                        {formatUnits(
                          winningTokenBalance,
                          winningTokenDecimals || 18,
                        )}{" "}
                        {winningTokenSymbol}
                      </p>
                      <Button
                        className="mt-2"
                        onClick={handleUseForDeposit}
                        variant="outline"
                      >
                        Use for Deposit
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deposit Winnings Card */}
          {battleResolved && (
            <Card>
              <CardHeader>
                <CardTitle>Deposit Winnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">
                      Deposit Amount ({winningTokenSymbol})
                    </Label>
                    <Input
                      id="depositAmount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter Amount to Deposit"
                    />
                  </div>
                  <Button
                    onClick={handleDepositWinnings}
                    disabled={
                      depositWinnings.isLoading ||
                      !depositAmount
                    }
                  >
                    {depositWinnings.isLoading
                      ? "Processing..."
                      : "Deposit Winnings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="col-span-full p-4 bg-red-100 text-red-700 rounded-md">
              <div className="font-bold">Error:</div>
              <div className="text-sm">{error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
