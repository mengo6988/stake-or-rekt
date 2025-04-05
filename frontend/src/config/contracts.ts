import { type Address } from 'viem'
import { fixedProductMarketMakerFactoryABI } from './abi/FixedProductMarketMakerFactory'
import { fixedProductMarketMakerABI } from './abi/FixedProductMarketMaker'

// Factory contract - the entry point for creating markets
export const MARKET_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_MARKET_FACTORY_ADDRESS as Address

// Since individual market addresses will be dynamic (created by factory), we don't store them here

// Config for factory
export const fixedProductMarketMakerFactoryConfig = {
  address: MARKET_FACTORY_ADDRESS,
  abi: fixedProductMarketMakerFactoryABI,
} as const

// Helper to verify factory is deployed
export const isFactoryConfigured = () => {
  return Boolean(
    MARKET_FACTORY_ADDRESS && 
    MARKET_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000'
  )
}

// For individual markets, create a utility function instead of static config
export const createMarketConfig = (marketAddress: Address) => ({
  address: marketAddress,
  abi: fixedProductMarketMakerABI,
}) as const
