import { Address } from "viem";

export interface Battle {
  id: string;
  address: Address;
  name: string;
  creator: string;
  timeLeft: string;
  createdAt: string;
  difficulty: "low" | "medium" | "high" | "extreme";
  tokenA: {
    symbol: string;
    address: string;
    stakeAmount: number;
    totalStaked: number;
    participants: number;
    participants_list: {
      name: string;
      avatar: string;
      stake: number;
    }[];
  };
  tokenB: {
    symbol: string;
    address: string;
    stakeAmount: number;
    totalStaked: number;
    participants: number;
    participants_list: {
      name: string;
      avatar: string;
      stake: number;
    }[];
  };
  maxParticipantsPerSide: number;
}

