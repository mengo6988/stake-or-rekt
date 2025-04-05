import { type Chain } from "viem";

export const base = {
  id: 8453,
  name: "Base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.base.org"] },
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "Base Scan", url: "https://basescan.org" },
  },
} as const satisfies Chain;

export const baseSepolia = {
  id: 84531,
  name: "Base Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.base.org"] },
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "Base Scan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
} as const satisfies Chain;

export const localBase = {
  id: 1337,
  name: "Local Base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["http://localhost:8545"] },
    default: { http: ["http://localhost:8545"] },
  },
  blockExplorers: {
    default: { name: "Local", url: "" },
  },
} as const satisfies Chain;
