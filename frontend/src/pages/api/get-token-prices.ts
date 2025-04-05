// pages/api/get-token-prices.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type TokenPriceResponse = {
  tokenAPrice?: string;
  tokenBPrice?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenPriceResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenAAddress, tokenBAddress, chainId = '8453' } = req.query;

    if (!tokenAAddress || !tokenBAddress) {
      return res.status(400).json({ error: 'Token addresses are required' });
    }

    // 1inch API Key - store in environment variables in production
    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Get token A price
    const tokenAResponse = await axios.get(
      `https://api.1inch.dev/price/v1.1/${chainId}/${tokenAAddress}?currency=USD`, 
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Get token B price
    const tokenBResponse = await axios.get(
      `https://api.1inch.dev/price/v1.1/${chainId}/${tokenBAddress}?currency=USD`, 
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const tokenAPrice = tokenAResponse.data[tokenAAddress.toString().toLowerCase()];
    const tokenBPrice = tokenBResponse.data[tokenBAddress.toString().toLowerCase()];

    console.log(tokenAPrice)
    console.log(tokenBPrice)

    if (!tokenAPrice || !tokenBPrice) {
      return res.status(404).json({ error: 'Could not retrieve prices for one or both tokens' });
    }

    return res.status(200).json({ 
      tokenAPrice: tokenAPrice.toString(), 
      tokenBPrice: tokenBPrice.toString() 
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return res.status(500).json({ error: 'Failed to fetch token prices' });
  }
}
