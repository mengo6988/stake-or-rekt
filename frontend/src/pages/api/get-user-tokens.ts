// pages/api/get-user-tokens.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ResponseData = {
  tokens?: any[];
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { accountAddress } = req.body;
  
  if (!accountAddress) {
    return res.status(400).json({ error: 'Account address is required' });
  }
  
  // Get API key from environment variables
  const apiKey = process.env.NODIT_API_KEY;
  
  // If no API key is set, return mock data with a warning message
  // This allows development and testing without an actual API key
  if (!apiKey) {
    console.warn("No Nodit API key found in environment variables. Using mock data.");
    return res.status(200).json({ 
      tokens: getMockTokens(),
      message: "Using mock data. Set NODIT_API_KEY environment variable for production use."
    });
  }
  
  try {
    const options = {
      method: 'POST',
      url: 'https://web3.nodit.io/v1/base/sepolia/token/getTokensOwnedByAccount',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      data: { accountAddress, withCount: false }
    };
    
    const response = await axios.request(options);
    // Return the tokens from result directly for easier access
    return res.status(200).json({ tokens: response.data.result || [] });
  } catch (error: any) {
    console.error("Error fetching tokens:", error);
    
    // Check if this is an authentication error
    if (error.response?.status === 401) {
      return res.status(200).json({
        tokens: getMockTokens(),
        error: 'API authentication failed. Using mock data instead.',
        message: 'Please check your NODIT_API_KEY environment variable.'
      });
    }
    
    // Return mock data on error with a message for better UX
    return res.status(200).json({
      tokens: getMockTokens(),
      error: error.response?.data?.message || 'Failed to fetch tokens. Using mock data instead.'
    });
  }
}

/**
 * Returns mock token data for testing or as fallback
 */
function getMockTokens() {
  return [
    {
      tokenAddress: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      balance: '0.5'
    },
    {
      tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: '1000'
    },
    {
      tokenAddress: '0x4200000000000000000000000000000000000042',
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      balance: '250'
    },
    {
      tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      balance: '500'
    }
  ];
}