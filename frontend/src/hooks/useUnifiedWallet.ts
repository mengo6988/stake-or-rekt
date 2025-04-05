import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { type Abi, encodeFunctionData, type Address, TransactionReceipt } from "viem";
import { useState, useEffect, SetStateAction } from "react";
import {
  useWaitForTransactionReceipt,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { extendedERC20ABI } from "@/config/abi/ERC20";

interface TransactionConfig {
  to: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
  description?: string; // Optional for standard wallets
}

interface WalletHookResult {
  address: Address | undefined;
  sendTransaction: (config: TransactionConfig) => Promise<Address>;
  latestHash: Address | undefined;
  isConfirmed: boolean;
  walletType: "smart" | "standard" | undefined;
  isLoading: boolean;
  setWalletType: React.Dispatch<
    SetStateAction<"smart" | "standard" | undefined>
  >;
  receipt: TransactionReceipt | undefined;
  isConfirming: boolean;
  userBalance: bigint;
  refetchUserBalance: () => Promise<unknown>
  setLatestHash: React.Dispatch<React.SetStateAction<Address | undefined>>
}

export function useUnifiedWallet(): WalletHookResult {
  const { client: smartWalletClient } = useSmartWallets();
  const { address: standardAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [walletType, setWalletType] = useState<
    "smart" | "standard" | undefined
  >(undefined);
  const [address, setAddress] = useState<Address | undefined>();
  const [latestHash, setLatestHash] = useState<Address | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: userBalance = BigInt(0), refetch: refetchUserBalance } = useReadContract({
    address: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on network reconnection
      refetchOnReconnect: true,
    },
  }) as { data: bigint, refetch: ()=>Promise<unknown> };


  useEffect(() => {
    if (!walletType) {
      // Only try auto-detection if type isn't manually set
      const savedType = localStorage.getItem('selectedWalletType');
      if (savedType === "smart" || savedType === "standard") {
        setWalletType(savedType)
        return
      }
      if (smartWalletClient) {
        setWalletType("smart");
      }     
    }
  }, [smartWalletClient, standardAddress, walletType]);

  const { data: receipt, isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: latestHash,
  });

  // Update address based on wallet type
  useEffect(() => {
    if (walletType === "smart" && smartWalletClient) {
      setAddress(smartWalletClient.account.address);
    } else if (walletType === "standard" && standardAddress) {
      setAddress(standardAddress);
    } else {
      setAddress(undefined);
    }
  }, [walletType, smartWalletClient, standardAddress]);

  const sendTransaction = async (
    config: TransactionConfig,
  ): Promise<Address> => {
    if (!walletType || !address) {
      throw new Error("No wallet connected");
    }

    setIsLoading(true);
    try {
      let hash: Address;

      if (walletType === "smart") {
        if (!smartWalletClient) {
          throw new Error("Smart wallet client not initialized");
        }

        const data = encodeFunctionData({
          abi: config.abi,
          functionName: config.functionName,
          args: config.args,
        });

        hash = await smartWalletClient.sendTransaction(
          {
            to: config.to,
            data,
            value: BigInt(0),
            account: smartWalletClient.account,
            chain: smartWalletClient.chain,
          },
          {
            uiOptions: {
              description: config.description || config.functionName,
            },
          },
        );
      } else {
        // Standard wallet transaction
        hash = (await writeContractAsync({
          address: config.to,
          abi: config.abi,
          functionName: config.functionName,
          args: config.args,
        })) as Address;
      }

      setLatestHash(hash);
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setLatestHash,
    address,
    sendTransaction,
    latestHash,
    isConfirmed,
    walletType,
    setWalletType,
    isLoading,
    receipt,
    isConfirming,
    userBalance,
    refetchUserBalance,
  };
}
