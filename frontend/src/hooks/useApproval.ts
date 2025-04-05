import { useState, useEffect } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import { conditionalTokensABI } from "@/config/abi/ConditionalTokens";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { useContractInteraction } from "./useContractInteraction";

interface ApprovalHookProps {
  tokenAddress: Address;
  spenderAddress: Address;
  type?: "erc20" | "conditionalTokens";
  useToast?: boolean;
}

interface ApprovalHookReturnType {
  isApproved: boolean;
  isCheckingApproval: boolean;
  isApproving: boolean;
  requestApproval: (amount?: bigint) => Promise<boolean>;
  refetchApproval: () => Promise<unknown>;
  lastApprovedAmount: bigint | undefined;
}

export function useApproval({
  tokenAddress,
  spenderAddress,
  type = "erc20",
  useToast = true,
}: ApprovalHookProps): ApprovalHookReturnType {
  const {
    address,
    //sendTransaction,
  } = useUnifiedWallet();
  const [isApproved, setIsApproved] = useState(false);
  const [isCheckingApproval, setIsCheckingApproval] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [lastApprovedAmount, setLastApprovedAmount] = useState<
    bigint | undefined
  >(undefined);

  const requestAllowance = useContractInteraction({
    to: tokenAddress,
    abi: extendedERC20ABI,
    functionName: "approve",
    args: [
      spenderAddress,
      BigInt(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    ],
    description: `Approve USDT`,
  }, useToast);

  const setApproval = useContractInteraction({
    to: tokenAddress,
    abi: conditionalTokensABI,
    functionName: "setApprovalForAll",
    args: [spenderAddress, true],
    description: `Approve USDT`,
  }, useToast);

  // ERC20 allowance check - returns bigint
  const { data: erc20Allowance, refetch: refetchErc20 } = useReadContract({
    address: tokenAddress,
    abi: extendedERC20ABI,
    functionName: "allowance",
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: Boolean(
        address && spenderAddress && tokenAddress && type === "erc20"
      ),
    },
  }) as { data: bigint | undefined; refetch: () => Promise<unknown> };

  // ConditionalTokens approval check - returns boolean
  const { data: isApprovedForAll, refetch: refetchConditionals } =
    useReadContract({
      address: tokenAddress,
      abi: conditionalTokensABI,
      functionName: "isApprovedForAll",
      args: address && spenderAddress ? [address, spenderAddress] : undefined,
      query: {
        enabled: Boolean(
          address &&
            spenderAddress &&
            tokenAddress &&
            type === "conditionalTokens"
        ),
      },
    }) as { data: boolean | undefined; refetch: () => Promise<unknown> };

  // Check if approved
  useEffect(() => {
    if (type === "erc20" && erc20Allowance) {
      // For ERC20, check if allowance is greater than 0 or last requested amount
      const allowance = erc20Allowance;
      setIsApproved((allowance || BigInt(0)) > 0);
    } else if (type === "conditionalTokens" && isApprovedForAll) {
      // For ConditionalTokens, it's a boolean
      setIsApproved(isApprovedForAll);
    }
    setIsCheckingApproval(false);
  }, [erc20Allowance, type, isApprovedForAll]);

  // Function to request approval
  const requestApproval = async (amount?: bigint): Promise<boolean> => {
    if (!address || !tokenAddress || !spenderAddress) {
      return false;
    }

    try {
      setIsApproving(true);

      if (type === "erc20") {
        // For ERC20, need to specify an amount
        const approvalAmount =
          amount ||
          BigInt(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        setLastApprovedAmount(approvalAmount);

        const success = await requestAllowance.execute({
          args: [spenderAddress, approvalAmount],
        });

        if (!success) {
          return false
        }

        await refetchErc20();
      } else {
        // For ConditionalTokens, it's setApprovalForAll
        const success = await setApproval.execute();
        
        if (!success) {
          return false
        }

        await refetchConditionals();
      }

      setIsApproved(true);
      return true;
    } catch (error) {
      console.error("Approval error:", error);
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  return {
    isApproved,
    isCheckingApproval,
    isApproving,
    requestApproval,
    refetchApproval: type === "erc20" ? refetchErc20 : refetchConditionals,
    lastApprovedAmount: type === "erc20" ? lastApprovedAmount : undefined,
  };
}
