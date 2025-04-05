//import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {  http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";
import { scroll, scrollSepolia, localScroll } from "./chains";
import { type Chain } from "viem";

type NetworkType = 'local' | 'testnet' | 'mainnet'
const currentNetwork = (process.env.NEXT_PUBLIC_NETWORK || 'local') as NetworkType

// Get appropriate chain based on network type
const getActiveChain = (network: NetworkType): [Chain, ...Chain[]] => {
  switch (network) {
    case 'local':
      return [ localScroll ]
    case 'testnet':
      return [ scrollSepolia ]
    case 'mainnet':
      return [ scroll ]
    default:
      return [ localScroll ]
  }
}

const activeChains = getActiveChain(currentNetwork)

//export const config = getDefaultConfig({
//  appName: "Prediction Markets",
//  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
//  chains: activeChains,
//  ssr: true,
//  transports: {
//    [activeChains[0].id]: http(activeChains[0].rpcUrls.default.http[0])
//  },
//});


export const readConfig = createConfig({
  chains: activeChains,
  transports: {
    [activeChains[0].id]: http(activeChains[0].rpcUrls.default.http[0])
  }
})

export const config = readConfig;
