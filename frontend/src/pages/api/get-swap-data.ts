// This file should be located at /pages/api/get-swap-data.js
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract query parameters
  const { fromTokenAddress, toTokenAddress, fromTokenAmount, fromAddress } = req.query;

  // Validate required parameters
  if (!fromTokenAddress || !toTokenAddress || !fromTokenAmount || !fromAddress) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Base URL for 1inch API (using Ethereum mainnet chain ID 1)
    const chainId = 8453; // Ethereum mainnet
    const apiBaseUrl = `https://api.1inch.dev/v6.0/${chainId}/swap`;

    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    // Construct the request to the 1inch API
    const apiUrl = `${apiBaseUrl}?src=${fromTokenAddress}&dest=${toTokenAddress}&amount=${fromTokenAmount}&from=${fromAddress}&origin=${fromAddress}&slippage=1`;

    // Make the request to 1inch API
    const response = await axios.get(apiUrl,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    console.log("swap data: ", response.data)
    
    // Return the swap data to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching swap data from 1inch:', error.response?.data || error.message);
    
    return res.status(500).json({
      error: 'Failed to fetch swap data',
      details: error.response?.data || error.message
    });
  }
}
