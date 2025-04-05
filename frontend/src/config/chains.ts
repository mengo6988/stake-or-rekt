import { type Chain } from "viem";

export const scroll = {
 id: 534352,
 name: "Scroll",
 nativeCurrency: {
   decimals: 18,
   name: "Ethereum",
   symbol: "ETH",
 },
 rpcUrls: {
   public: { http: ["https://rpc.scroll.io"] },
   default: { http: ["https://rpc.scroll.io"] },
 },
 blockExplorers: {
   default: { name: "ScrollScan", url: "https://scrollscan.com" },
 },
} as const satisfies Chain;

export const scrollSepolia = {
 id: 534351,
 name: "Scroll Sepolia", 
 nativeCurrency: {
   decimals: 18,
   name: "Ethereum",
   symbol: "ETH",
 },
 rpcUrls: {
   public: { http: ["https://sepolia-rpc.scroll.io"] },
   default: { http: ["https://sepolia-rpc.scroll.io"] },
 },
 blockExplorers: {
   default: { name: "ScrollScan", url: "https://sepolia.scrollscan.com" },
 },
 testnet: true,
} as const satisfies Chain;

export const localScroll = {
 id: 534352,
 name: "Local Scroll Fork",
 nativeCurrency: {
   decimals: 18,
   name: "Ethereum",
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
