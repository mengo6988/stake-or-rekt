// pages/api/get-token-prices.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type TokenPriceResponse = {
  tokenAPrice?: number;
  tokenBPrice?: number;
  error?: string;
  isFallback?: boolean; // Indicate if we're using fallback prices
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
    
    // Set a flag to track if we're using fallback random prices
    let usingFallback = false;
    let tokenAPrice: number | null = null;
    let tokenBPrice: number | null = null;
    
    // Only attempt the API call if we have an API key
    if (apiKey) {
      try {
        // Convert addresses to lowercase strings
        const tokenAAddressLower = String(tokenAAddress).toLowerCase();
        const tokenBAddressLower = String(tokenBAddress).toLowerCase();
        
        // Get token A price
        const tokenAResponse = await axios.get(
          `https://api.1inch.dev/price/v1.1/${chainId}/${tokenAAddressLower}?currency=USD`, 
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );
        
        // Get token B price
        const tokenBResponse = await axios.get(
          `https://api.1inch.dev/price/v1.1/${chainId}/${tokenBAddressLower}?currency=USD`, 
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );
        
        // Log the full response for debugging
        console.log("Token A response:", JSON.stringify(tokenAResponse.data));
        console.log("Token B response:", JSON.stringify(tokenBResponse.data));
        
        // Access the price based on the actual response structure
        tokenAPrice = tokenAResponse.data[tokenAAddressLower];
        tokenBPrice = tokenBResponse.data[tokenBAddressLower];
        
        // Check if we got valid prices
        if (!tokenAPrice || !tokenBPrice) {
          throw new Error('Could not retrieve prices from API');
        }
      } catch (apiError) {
        console.warn('Error fetching from 1inch API, falling back to random generator:', apiError);
        usingFallback = true;
      }
    } else {
      console.warn('No API key configured, using fallback random price generator');
      usingFallback = true;
    }
    
    // Fallback to random number generation if needed
    if (usingFallback || !tokenAPrice || !tokenBPrice) {
      // Generate random price between 0.0002 and 5
      const generateRandomPrice = () => {
        return (Math.random() * (5 - 0.0002) + 0.0002).toFixed(6);
      };
      
      tokenAPrice = parseFloat(generateRandomPrice());
      tokenBPrice = parseFloat(generateRandomPrice());
      
      console.log("Using fallback random prices:", { tokenAPrice, tokenBPrice });
    }
    
    return res.status(200).json({ 
      tokenAPrice, 
      tokenBPrice,
      isFallback: usingFallback
    });
    
  } catch (error) {
    console.error('Error in get-token-prices API:', error);
    
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
    }
    
    // Generate fallback random prices as a last resort
    const generateRandomPrice = () => {
      return (Math.random() * (5 - 0.0002) + 0.0002).toFixed(6);
    };
    
    const tokenAPrice = parseFloat(generateRandomPrice());
    const tokenBPrice = parseFloat(generateRandomPrice());
    
    console.log("Using fallback random prices after error:", { tokenAPrice, tokenBPrice });
    
    return res.status(200).json({ 
      tokenAPrice,
      tokenBPrice,
      isFallback: true
    });
  }
}
