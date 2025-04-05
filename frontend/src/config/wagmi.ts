// config/wagmi.ts
import { http, createConfig } from "wagmi";
import { base, baseSepolia, localBase } from "./chains";
import { type Chain } from "viem";

type NetworkType = 'local' | 'testnet' | 'mainnet';
const currentNetwork = (process.env.NEXT_PUBLIC_NETWORK || 'local') as NetworkType;

// Get appropriate chain based on network type
const getActiveChain = (network: NetworkType): [Chain, ...Chain[]] => {
  switch (network) {
    case 'local':
      return [localBase];
    case 'testnet':
      return [baseSepolia];
    case 'mainnet':
      return [base];
    default:
      return [localBase];
  }
};

const activeChains = getActiveChain(currentNetwork);

// Create a Wagmi config using createConfig
export const readConfig = createConfig({
  chains: activeChains,
  transports: {
    [activeChains[0].id]: http(activeChains[0].rpcUrls.default.http[0])
  },
});

// Export the same config for read operations
export const config = readConfig;