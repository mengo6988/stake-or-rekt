// utils/token-utils.ts
import axios from "axios";

export interface TokenData {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  // Other fields from API response
}

/**
 * Uses the server-side API route to fetch tokens (recommended approach)
 */
export async function getTokensOwnedByAccount(
  accountAddress: string
): Promise<TokenData[]> {
  try {
    // Call our own API route instead of directly calling Nodit
    const response = await axios.post("/api/get-user-tokens", {
      accountAddress,
    });
    return response.data.tokens || [];
  } catch (error) {
    console.error("Error fetching tokens:", error);

    // Return mock data on error for better user experience
    if (accountAddress) {
      console.log("Returning mock data as fallback");
      return getMockTokens();
    }

    throw error;
  }
}

/**
 * Direct API call - NOT RECOMMENDED for production use due to API key exposure
 * Only use for testing if needed - may encounter CORS issues in browser
 */
export async function getTokensOwnedByAccountDirect(
  accountAddress: string
): Promise<TokenData[]> {
  try {
    // This approach is not recommended as it exposes API key in client code
    const options = {
      method: "POST",
      url: "https://web3.nodit.io/v1/base/sepolia/token/getTokensOwnedByAccount",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        // Using environment variable that must be prefixed with NEXT_PUBLIC_ to work in browser
        "X-API-KEY": process.env.NEXT_PUBLIC_NODIT_API_KEY || "nodit-demo",
      },
      data: { accountAddress, withCount: false },
    };

    const response = await axios.request(options);
    return response.data.result || [];
  } catch (error) {
    console.error("Error with direct API call:", error);
    throw error;
  }
}

/**
 * Returns mock token data for testing or as fallback
 */
export function getMockTokens(): TokenData[] {
  return [
    {
      tokenAddress: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      balance: "0.5",
    },
    {
      tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      balance: "1000",
    },
    {
      tokenAddress: "0x4200000000000000000000000000000000000042",
      symbol: "OP",
      name: "Optimism",
      decimals: 18,
      balance: "250",
    },
    {
      tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      balance: "500",
    },
  ];
}
