import { useState } from "react";
import { toast } from "react-hot-toast";
import { type Address, type Abi, TransactionReceipt } from "viem";
import { useUnifiedWallet } from "./useUnifiedWallet";
import { formatErrorMessage, isUserRejection } from "@/utils/errors";

export interface ContractInteractionConfig {
  to: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
  description?: string;
}

export interface ContractInteractionState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export interface ContractInteractionResult extends ContractInteractionState {
  execute: (overrideArgs? : {args: readonly unknown[]}) => Promise<boolean>;
  receipt: TransactionReceipt | undefined;
  latestHash: Address | undefined;
  isConfirmed: boolean;
  setLatestHash: React.Dispatch<React.SetStateAction<Address | undefined>>
}

/**
 * A hook for handling contract interactions with built-in error handling and toast notifications
 * @param config - The contract interaction configuration
 * @returns ContractInteractionResult object containing state and execute function
 */
export const useContractInteraction = (
  config: ContractInteractionConfig, useToast: boolean = true
): ContractInteractionResult => {
  const { sendTransaction, receipt, isConfirmed, latestHash, setLatestHash } = useUnifiedWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  };

  const execute = async (overrideArgs? : {args: readonly unknown[]}): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      if (overrideArgs?.args) {
        await sendTransaction({
          ...config,
          args: overrideArgs.args,
        })
      } else {
        await sendTransaction(config);
      }

      setIsSuccess(true);
      if (useToast) {
        toast.success(
          config.description
            ? `${config.description} transaction submitted`
            : "Transaction submitted",
        );
      }
      return true;
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);

      // Don't show toast for user rejections
      if (!isUserRejection(err)) {
        toast.error(errorMessage);
        throw err; // Re-throw for the caller to handle if needed
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setLatestHash,
    isConfirmed,
    latestHash,
    receipt,
    isLoading,
    error,
    isSuccess,
    reset,
    execute,
  };
};
