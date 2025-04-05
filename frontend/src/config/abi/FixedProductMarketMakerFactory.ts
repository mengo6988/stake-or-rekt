import { Abi } from "viem";

export const fixedProductMarketMakerFactoryABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_treasuryAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MAX_FEE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "conditionalTokens",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ConditionalTokens",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createMarket",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct FixedProductMarketMakerFactory.MarketParams",
        components: [
          {
            name: "collateralToken",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "oracle",
            type: "address",
            internalType: "address",
          },
          {
            name: "questionId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "outcomeSlotCount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "redemptionFee",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "market",
        type: "address",
        internalType: "contract FixedProductMarketMaker",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isValidMarket",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rewardsManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract RewardsManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setRewardsManager",
    inputs: [
      {
        name: "_rewardsManagerAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "treasuryAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "market",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "conditionId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "questionId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "oracle",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "fee",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "redemptionFee",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as Abi;
