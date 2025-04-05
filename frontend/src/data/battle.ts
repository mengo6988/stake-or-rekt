import { Battle } from "@/types/battle";

// Mock data for active battles with token A vs token B structure
export const battles: Battle[] = [
  {
    id: "B1001",
    name: "ETH vs USDC Showdown",
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    creator: "Player1",
    timeLeft: "18h 45m",
    createdAt: "2 hours ago",
    difficulty: "medium",
    tokenA: {
      symbol: "ETH",
      stakeAmount: 0.5,
      totalStaked: 1.5,
      participants: 3,
      participants_list: [
        {
          name: "Player1",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.5,
        },
        {
          name: "Player7",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.5,
        },
        {
          name: "Player3",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.5,
        },
      ],
    },
    tokenB: {
      symbol: "USDC",
      stakeAmount: 1000,
      totalStaked: 2000,
      participants: 2,
      participants_list: [
        {
          name: "Player5",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
        {
          name: "Player9",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
  {
    id: "B1002",
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    name: "TKNS vs BTC Battle",
    creator: "Player5",
    timeLeft: "6h 20m",
    createdAt: "5 hours ago",
    difficulty: "high",
    tokenA: {
      symbol: "TKNS",
      stakeAmount: 1000,
      totalStaked: 4000,
      participants: 4,
      participants_list: [
        {
          name: "Player5",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
        {
          name: "Player2",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
        {
          name: "Player9",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
        {
          name: "Player4",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 1000,
        },
      ],
    },
    tokenB: {
      symbol: "BTC",
      stakeAmount: 0.05,
      totalStaked: 0.15,
      participants: 3,
      participants_list: [
        {
          name: "Player6",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.05,
        },
        {
          name: "Player8",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.05,
        },
        {
          name: "Player10",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.05,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
  {
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    id: "B1003",
    name: "Stablecoin War",
    creator: "Player8",
    timeLeft: "23h 10m",
    createdAt: "1 hour ago",
    difficulty: "low",
    tokenA: {
      symbol: "USDC",
      stakeAmount: 500,
      totalStaked: 2500,
      participants: 5,
      participants_list: [
        {
          name: "Player8",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player12",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player15",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player3",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player7",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
      ],
    },
    tokenB: {
      symbol: "DAI",
      stakeAmount: 500,
      totalStaked: 2000,
      participants: 4,
      participants_list: [
        {
          name: "Player1",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player4",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player6",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player11",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
  {
    id: "B1004",
    name: "Meme Coin Battle",
    creator: "Player2",
    timeLeft: "12h 35m",
    createdAt: "8 hours ago",
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    difficulty: "extreme",
    tokenA: {
      symbol: "DOGE",
      stakeAmount: 10000,
      totalStaked: 30000,
      participants: 3,
      participants_list: [
        {
          name: "Player2",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 10000,
        },
        {
          name: "Player5",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 10000,
        },
        {
          name: "Player9",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 10000,
        },
      ],
    },
    tokenB: {
      symbol: "SHIB",
      stakeAmount: 50000000,
      totalStaked: 100000000,
      participants: 2,
      participants_list: [
        {
          name: "Player3",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 50000000,
        },
        {
          name: "Player7",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 50000000,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
  {
    id: "B1005",
    name: "TKNS vs ETH Duel",
    creator: "Player7",
    timeLeft: "36h 15m",
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    createdAt: "3 hours ago",
    difficulty: "medium",
    tokenA: {
      symbol: "TKNS",
      stakeAmount: 500,
      totalStaked: 1500,
      participants: 3,
      participants_list: [
        {
          name: "Player7",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player3",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
        {
          name: "Player11",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 500,
        },
      ],
    },
    tokenB: {
      symbol: "ETH",
      stakeAmount: 0.25,
      totalStaked: 0.75,
      participants: 3,
      participants_list: [
        {
          name: "Player2",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.25,
        },
        {
          name: "Player5",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.25,
        },
        {
          name: "Player9",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.25,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
  {
    id: "B1006",
    name: "Layer 1 Showdown",
    creator: "Player4",
    timeLeft: "2h 50m",
    address: "0x7A86C0b064171007716bB3D4c5242D37E53873E4",
    createdAt: "10 hours ago",
    difficulty: "high",
    tokenA: {
      symbol: "ETH",
      stakeAmount: 0.2,
      totalStaked: 0.8,
      participants: 4,
      participants_list: [
        {
          name: "Player4",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.2,
        },
        {
          name: "Player6",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.2,
        },
        {
          name: "Player8",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.2,
        },
        {
          name: "Player10",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 0.2,
        },
      ],
    },
    tokenB: {
      symbol: "SOL",
      stakeAmount: 5,
      totalStaked: 25,
      participants: 5,
      participants_list: [
        {
          name: "Player1",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 5,
        },
        {
          name: "Player3",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 5,
        },
        {
          name: "Player5",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 5,
        },
        {
          name: "Player7",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 5,
        },
        {
          name: "Player9",
          avatar: "/placeholder.svg?height=32&width=32",
          stake: 5,
        },
      ],
    },
    maxParticipantsPerSide: 5,
  },
];
