// pages/api/get-1inch-swap.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type SwapParams = {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fromTokenAddress, toTokenAddress, amount, fromAddress }: SwapParams = req.body;

    if (!fromTokenAddress || !toTokenAddress || !amount || !fromAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 1inch API URL (Base Chain - 8453)
    const chainId = 8453;
    const apiUrl = `https://api.1inch.dev/swap/v6.0/${chainId}/quote`;

    // Your 1inch API key - store in environment variables in production
    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build parameters for 1inch API
    const params = new URLSearchParams({
      src: fromTokenAddress,
      dst: toTokenAddress,
      amount: amount,
      from: fromAddress,
      slippage: '1', // 1% slippage
      disableEstimate: 'false',
      allowPartialFill: 'false',
    });
    console.log("PARAMS: ", params)

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
    });

    console.log("Response: ", response);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'Error from 1inch API', 
        details: errorData 
      });
    }

    const swapData = await response.json();
    return res.status(200).json(swapData);
  } catch (error) {
    console.error('Error fetching swap data:', error);
    return res.status(500).json({ error: 'Failed to fetch swap data' });
  }
}
