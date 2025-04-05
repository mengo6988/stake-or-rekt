import { BaseError } from "viem";

export interface ContractError {
  code: string;
  message: string;
  metaMessages?: string[];
}

// Common error codes we want to handle specifically
export const CONTRACT_ERROR_CODES = {
  USER_REJECTED: "ACTION_REJECTED",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  UNPREDICTABLE_GAS_LIMIT: "UNPREDICTABLE_GAS_LIMIT",
  TRANSACTION_REPLACED: "TRANSACTION_REPLACED",
} as const;

// Error messages mapping for known error scenarios
export const ERROR_MESSAGES: Record<string, string> = {
  [CONTRACT_ERROR_CODES.USER_REJECTED]: "Transaction was rejected",
  [CONTRACT_ERROR_CODES.INSUFFICIENT_FUNDS]:
    "Insufficient funds for transaction",
  [CONTRACT_ERROR_CODES.UNPREDICTABLE_GAS_LIMIT]:
    "Unable to estimate gas limit",
  [CONTRACT_ERROR_CODES.TRANSACTION_REPLACED]: "Transaction was replaced",
  CALL_EXCEPTION: "Contract call failed",
  NONCE_EXPIRED: "Transaction nonce has expired",
  REPLACEMENT_UNDERPRICED: "Replacement transaction was underpriced",
} as const;

// Common contract error messages that we want to parse and make more user-friendly
const CONTRACT_ERROR_PATTERNS = [
  {
    pattern: /user rejected/i,
    code: CONTRACT_ERROR_CODES.USER_REJECTED,
  },
  {
    pattern: /insufficient funds/i,
    code: CONTRACT_ERROR_CODES.INSUFFICIENT_FUNDS,
  },
  {
    pattern: /cannot estimate gas/i,
    code: CONTRACT_ERROR_CODES.UNPREDICTABLE_GAS_LIMIT,
  },
  {
    pattern: /transaction was replaced/i,
    code: CONTRACT_ERROR_CODES.TRANSACTION_REPLACED,
  },
] as const;

/**
 * Parses a contract error and returns a structured error object
 * @param error - The error to parse
 * @returns ContractError object with code and message
 */
export const parseContractError = (error: unknown): ContractError => {
  // Handle viem BaseError
  if (error instanceof BaseError) {
    const code = error.name;
    const message = ERROR_MESSAGES[code] || error.message;
    return {
      code,
      message,
      metaMessages: error.details ? [error.details] : undefined,
    };
  }

  // Handle standard Error
  if (error instanceof Error) {
    // Check for known error patterns
    for (const { pattern, code } of CONTRACT_ERROR_PATTERNS) {
      if (pattern.test(error.message)) {
        return {
          code,
          message: ERROR_MESSAGES[code] || error.message,
        };
      }
    }

    // If no pattern matches, return generic error
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  // Handle unknown error types
  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
  };
};

/**
 * Formats an error message for display
 * @param error - The error to format
 * @returns A user-friendly error message
 */
export const formatErrorMessage = (error: unknown): string => {
  const parsedError = parseContractError(error);

  // If we have meta messages, append them to the main message
  if (parsedError.metaMessages?.length) {
    return `${parsedError.message}: ${parsedError.metaMessages.join(". ")}`;
  }

  return parsedError.message;
};

/**
 * Checks if an error is a user rejection
 * @param error - The error to check
 * @returns boolean indicating if the error is a user rejection
 */
export const isUserRejection = (error: unknown): boolean => {
  const parsedError = parseContractError(error);
  return parsedError.code === CONTRACT_ERROR_CODES.USER_REJECTED;
};

/**
 * Checks if an error is due to insufficient funds
 * @param error - The error to check
 * @returns boolean indicating if the error is due to insufficient funds
 */
export const isInsufficientFunds = (error: unknown): boolean => {
  const parsedError = parseContractError(error);
  return parsedError.code === CONTRACT_ERROR_CODES.INSUFFICIENT_FUNDS;
};

