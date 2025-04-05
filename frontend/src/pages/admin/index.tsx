import { useState, useEffect, useCallback } from "react";
import {
  parseEther,
  formatEther,
  formatUnits,
  type Address,
  parseUnits,
} from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/router";

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

// ERC20 ABI for approvals
const erc20Abi = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

// 1inch Router ABI (partial)
const oneInchAbi = [
  {
    inputs: [
      {
        internalType: "contract IAggregationExecutor",
        name: "executor",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "srcToken",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "dstToken",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "srcReceiver",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "dstReceiver",
            type: "address",
          },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "minReturnAmount", type: "uint256" },
          { internalType: "uint256", name: "flags", type: "uint256" },
        ],
        internalType: "struct GenericRouter.SwapDescription",
        name: "desc",
        type: "tuple",
      },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "swap",
    outputs: [
      { internalType: "uint256", name: "returnAmount", type: "uint256" },
      { internalType: "uint256", name: "spentAmount", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const BATTLE_CONTRACT_ADDRESS = "0xYourBattleContractAddress" as Address; // Replace with actual address
const ONE_INCH_ROUTER_ADDRESS =
  "0x111111125421cA6dc452d289314280a0f8842A65" as Address; // Base Chain

export default function BattleAdminPage() {

  const router = useRouter();

  const {battleAddress} = router.query;
  const { address, isConnected } = useAccount();

  // State variables
  const [tokenAPrice, setTokenAPrice] = useState("");
  const [tokenBPrice, setTokenBPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapParams, setSwapParams] = useState<any>(null);
  const [isLoadingSwapParams, setIsLoadingSwapParams] = useState(false);
  const [winningTokenSymbol, setWinningTokenSymbol] = useState("");
  const [losingTokenSymbol, setLosingTokenSymbol] = useState("");
  const [losingTokenAddress, setLosingTokenAddress] = useState<
    Address | undefined
  >();
  const [winningTokenAddress, setWinningTokenAddress] = useState<
    Address | undefined
  >();
  const [error, setError] = useState("");

  // Read contract data
  const { data: battleResolved } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "battleResolved",
  }) as { data: boolean | undefined };

  const { data: winningTokenId } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "winningToken",
    query: {
      enabled: Boolean(battleResolved),
    },
  }) as { data: bigint | undefined };

  const { data: tokenAAddress } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "tokenA",
  }) as { data: Address | undefined };

  const { data: tokenBAddress } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "tokenB",
  }) as { data: Address | undefined };

  const { data: totalTokenAStaked } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "totalTokenAStaked",
  }) as { data: bigint | undefined };

  const { data: totalTokenBStaked } = useReadContract({
    address: BATTLE_CONTRACT_ADDRESS,
    abi: battleAbi,
    functionName: "totalTokenBStaked",
  }) as { data: bigint | undefined };

  // Get token symbols
  const { data: tokenASymbol } = useReadContract({
    address: tokenAAddress as Address,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: Boolean(tokenAAddress),
    },
  }) as { data: string | undefined };

  const { data: tokenBSymbol } = useReadContract({
    address: tokenBAddress as Address,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: Boolean(tokenBAddress),
    },
  }) as { data: string | undefined };

  // Token balance
  const { data: losingTokenBalance } = useReadContract({
    address: losingTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(losingTokenAddress && address),
    },
  }) as { data: bigint | undefined };

  const { data: losingTokenDecimals } = useReadContract({
    address: losingTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: Boolean(losingTokenAddress),
    },
  }) as { data: number | undefined };

  const { data: winningTokenDecimals } = useReadContract({
    address: winningTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: Boolean(winningTokenAddress),
    },
  }) as { data: number | undefined };

  // Write contract hooks
  const {
    writeContract: resolveBattleWrite,
    data: resolveTxHash,
    isPending: isResolvingBattle,
    error: resolveError,
  } = useWriteContract();

  const {
    writeContract: forceResolveBattleWrite,
    data: forceResolveTxHash,
    isPending: isForceResolvingBattle,
    error: forceResolveError,
  } = useWriteContract();

  const {
    writeContract: depositWinningsWrite,
    data: depositTxHash,
    isPending: isDepositingWinnings,
    error: depositError,
  } = useWriteContract();

  const {
    writeContract: approveTokenWrite,
    data: approveTxHash,
    isPending: isApprovingToken,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: executeSwapWrite,
    data: swapTxHash,
    isPending: isSwapping,
    error: swapError,
  } = useWriteContract();

  // Wait for transaction results
  const { isSuccess: isResolveSuccess } = useWaitForTransactionReceipt({
    hash: resolveTxHash,
  });

  const { isSuccess: isForceResolveSuccess } = useWaitForTransactionReceipt({
    hash: forceResolveTxHash,
  });

  const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const { isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
    hash: swapTxHash,
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

  useEffect(() => {
    async function fetchTokenPrices(
      tokenAAddress: string,
      tokenBAddress: string,
      chainId = "8453",
    ) {
      try {
        const response = await axios.get("/api/get-token-prices", {
          params: {
            tokenAAddress,
            tokenBAddress,
            chainId,
          },
        });

        const { tokenAPrice, tokenBPrice} = response.data;

        console.log("Token A Price:", tokenAPrice);
        console.log("Token B Price:", tokenBPrice);
        setTokenAPrice(tokenAPrice)
        setTokenBPrice(tokenBPrice)

        return { tokenAPrice, tokenBPrice };
      } catch (error: any) {
        console.error(
          "Error fetching prices:",
          error?.response?.data?.error || error.message,
        );
        return null;
      }
    }

    fetchTokenPrices("0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4", "0x532f27101965dd16442E59d40670FaF5eBB142E4")
  }, []);

  // Handle transaction results
  useEffect(() => {
    if (isResolveSuccess) {
      toast.success("Battle successfully resolved");
    }
    if (isForceResolveSuccess) {
      toast.success("Battle forcefully resolved");
    }
    if (isDepositSuccess) {
      toast.success("Winnings successfully deposited");
      setDepositAmount("");
    }
    if (isApproveSuccess) {
      toast.success("Token approval successful");
      // If approval successful, proceed with swap
      if (swapParams && address) {
        executeSwapWrite({
          address: swapParams.tx.to as Address,
          abi: oneInchAbi,
          functionName: "swap",
          args: [
            swapParams.tx.data.executor ||
              "0x0000000000000000000000000000000000000000",
            swapParams.tx.data.desc || {
              srcToken: losingTokenAddress,
              dstToken: winningTokenAddress,
              srcReceiver: swapParams.tx.from,
              dstReceiver: address,
              amount: BigInt(swapParams.fromTokenAmount),
              minReturnAmount: BigInt(swapParams.toTokenAmount),
              flags: BigInt(0),
            },
            swapParams.tx.data.data || "0x",
          ],
          value: BigInt(swapParams.tx.value || 0),
        });
      }
    }
    if (isSwapSuccess) {
      toast.success("Swap executed successfully");
      setSwapAmount("");
      setSwapParams(null);
    }
  }, [
    isResolveSuccess,
    isForceResolveSuccess,
    isDepositSuccess,
    isApproveSuccess,
    isSwapSuccess,
    swapParams,
    address,
    losingTokenAddress,
    winningTokenAddress,
    executeSwapWrite,
  ]);

  // Handle errors
  useEffect(() => {
    if (resolveError) setError(resolveError.message);
    if (forceResolveError) setError(forceResolveError.message);
    if (depositError) setError(depositError.message);
    if (approveError) setError(approveError.message);
    if (swapError) setError(swapError.message);
  }, [resolveError, forceResolveError, depositError, approveError, swapError]);

  // Handlers
  const handleResolveBattle = async () => {
    if (!tokenAPrice || !tokenBPrice) {
      toast.error("Please provide both token prices");
      return;
    }

    try {
      resolveBattleWrite({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: battleAbi,
        functionName: "resolveBattle",
        args: [parseEther(tokenAPrice), parseEther(tokenBPrice)],
      });
    } catch (error: any) {
      console.error("Error resolving battle:", error);
      setError(error.message || "Failed to resolve battle");
    }
  };

  const handleForceResolveBattle = async () => {
    if (!tokenAPrice || !tokenBPrice) {
      toast.error("Please provide both token prices");
      return;
    }

    try {
      forceResolveBattleWrite({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: battleAbi,
        functionName: "forceResolveBattle",
        args: [parseEther(tokenAPrice), parseEther(tokenBPrice)],
      });
    } catch (error: any) {
      console.error("Error force resolving battle:", error);
      setError(error.message || "Failed to force resolve battle");
    }
  };

  const handleDepositWinnings = async () => {
    if (!depositAmount) {
      toast.error("Please provide a deposit amount");
      return;
    }

    try {
      depositWinningsWrite({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: battleAbi,
        functionName: "depositWinnings",
        args: [parseEther(depositAmount)],
      });
    } catch (error: any) {
      console.error("Error depositing winnings:", error);
      setError(error.message || "Failed to deposit winnings");
    }
  };

  const fetchSwapParams = async () => {
    if (!swapAmount || !losingTokenAddress || !winningTokenAddress) {
      toast.error("Please provide swap amount and ensure battle is resolved");
      return;
    }

    setIsLoadingSwapParams(true);
    setError("");

    try {
      const decimals = losingTokenDecimals || 18;
      const amount = parseUnits(swapAmount, Number(decimals)).toString();

      // Call your backend API to fetch swap parameters from 1inch
      const response = await axios.post("/api/get-1inch-swap", {
        fromTokenAddress: losingTokenAddress,
        toTokenAddress: winningTokenAddress,
        amount: amount,
        fromAddress: address,
      });

      if (response.status >= 200 && response.status < 300) {
        setSwapParams(response.data);
        toast.success("Swap parameters fetched successfully");
      } else {
        throw new Error("Failed to fetch swap parameters");
      }
    } catch (error: any) {
      console.error("Error fetching swap params:", error);
      setError(error.message || "Failed to fetch swap parameters");
      toast.error(error.message || "Failed to fetch swap parameters");
    } finally {
      setIsLoadingSwapParams(false);
    }
  };

  // Define executeSwap with useCallback to avoid dependency issues in useEffect
  const executeSwap = useCallback(async () => {
    if (!swapParams || !losingTokenAddress) {
      return;
    }

    try {
      // First approve tokens to be spent by the 1inch router
      approveTokenWrite({
        address: losingTokenAddress as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          ONE_INCH_ROUTER_ADDRESS,
          BigInt(swapParams.tx.value || swapParams.fromTokenAmount),
        ],
      });
    } catch (error: any) {
      console.error("Error approving tokens:", error);
      setError(error.message || "Failed to approve tokens");
    }
  }, [swapParams, losingTokenAddress, approveTokenWrite]);

  const handleSwap = async () => {
    if (!swapParams) {
      toast.error("Please fetch swap parameters first");
      return;
    }

    if (!isApproveSuccess && !approveTxHash) {
      // If not yet approved, start the approval process
      executeSwap();
    } else {
      // If already approved, execute the swap
      try {
        executeSwapWrite({
          address: swapParams.tx.to as Address,
          abi: oneInchAbi,
          functionName: "swap",
          args: [
            swapParams.tx.data.executor ||
              "0x0000000000000000000000000000000000000000",
            swapParams.tx.data.desc || {
              srcToken: losingTokenAddress,
              dstToken: winningTokenAddress,
              srcReceiver: swapParams.tx.from,
              dstReceiver: address,
              amount: BigInt(swapParams.fromTokenAmount),
              minReturnAmount: BigInt(swapParams.toTokenAmount),
              flags: BigInt(0),
            },
            swapParams.tx.data.data || "0x",
          ],
          value: BigInt(swapParams.tx.value || 0),
        });
      } catch (error: any) {
        console.error("Error executing swap:", error);
        setError(error.message || "Failed to execute swap");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
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
                  <p> <span className="font-semibold">Address: </span>{battleAddress} </p>
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
                  <Label htmlFor="tokenAPrice">Token A Price</Label>
                  <Input
                    id="tokenAPrice"
                    value={tokenAPrice}
                    onChange={(e) => setTokenAPrice(e.target.value)}
                    placeholder="Enter Token A Price"
                    disabled={!!battleResolved}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenBPrice">Token B Price</Label>
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
                      isResolvingBattle ||
                      !tokenAPrice ||
                      !tokenBPrice
                    }
                  >
                    {isResolvingBattle ? "Resolving..." : "Resolve Battle"}
                  </Button>
                  <Button
                    onClick={handleForceResolveBattle}
                    variant="outline"
                    disabled={
                      !!battleResolved ||
                      isForceResolvingBattle ||
                      !tokenAPrice ||
                      !tokenBPrice
                    }
                  >
                    {isForceResolvingBattle ? "Forcing..." : "Force Resolve"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    disabled={isDepositingWinnings || !depositAmount}
                  >
                    {isDepositingWinnings
                      ? "Depositing..."
                      : "Deposit Winnings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1inch Swap Card */}
          {battleResolved && (
            <Card>
              <CardHeader>
                <CardTitle>Swap Tokens (1inch)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p>Convert losing tokens to winning tokens using 1inch</p>
                    {losingTokenBalance && losingTokenDecimals && (
                      <p className="text-sm text-gray-500 mt-1">
                        You have:{" "}
                        {formatUnits(
                          losingTokenBalance,
                          Number(losingTokenDecimals),
                        )}{" "}
                        {losingTokenSymbol}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swapAmount">
                      Amount to Swap ({losingTokenSymbol})
                    </Label>
                    <Input
                      id="swapAmount"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="Enter Amount to Swap"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={fetchSwapParams}
                      disabled={isLoadingSwapParams || !swapAmount}
                      variant="outline"
                    >
                      {isLoadingSwapParams ? "Loading..." : "Get Swap Data"}
                    </Button>
                    <Button
                      onClick={handleSwap}
                      disabled={!swapParams || isApprovingToken || isSwapping}
                    >
                      {isApprovingToken
                        ? "Approving..."
                        : isSwapping
                          ? "Swapping..."
                          : "Swap"}
                    </Button>
                  </div>
                  {swapParams && winningTokenDecimals !== undefined && (
                    <div className="mt-4">
                      <p className="text-sm">
                        You will receive approximately:{" "}
                        {formatUnits(
                          BigInt(swapParams.toTokenAmount),
                          winningTokenDecimals,
                        )}{" "}
                        {winningTokenSymbol}
                      </p>
                    </div>
                  )}
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
