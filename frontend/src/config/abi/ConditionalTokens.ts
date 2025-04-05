import { Abi } from "viem";

export const conditionalTokensABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "balanceOfBatch",
    inputs: [
      {
        name: "accounts",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "ids",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCollectionId",
    inputs: [
      {
        name: "parentCollectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "indexSet",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getConditionId",
    inputs: [
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
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getOutcomeSlotCount",
    inputs: [
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
    name: "getPositionId",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "collectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "isApprovedForAll",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "operator",
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
    name: "mergePositions",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "partition",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "payoutDenominator",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
    name: "payoutNumerators",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "prepareCondition",
    inputs: [
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
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeemPositions",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "indexSets",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeemPositionsForUser",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "indexSets",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "donationPercentages",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "reportPayouts",
    inputs: [
      {
        name: "questionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "payouts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeBatchTransferFrom",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "ids",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setApprovalForAll",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "approved",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "splitPosition",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "partition",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
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
    name: "uri",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ApprovalForAll",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "approved",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ConditionPreparation",
    inputs: [
      {
        name: "conditionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "oracle",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "questionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "outcomeSlotCount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ConditionResolution",
    inputs: [
      {
        name: "conditionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "oracle",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "questionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "outcomeSlotCount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "payoutNumerators",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PayoutRedemption",
    inputs: [
      {
        name: "redeemer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralToken",
        type: "address",
        indexed: true,
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "indexSets",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "payout",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PositionSplit",
    inputs: [
      {
        name: "stakeholder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralToken",
        type: "address",
        indexed: false,
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "partition",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PositionsMerge",
    inputs: [
      {
        name: "stakeholder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralToken",
        type: "address",
        indexed: false,
        internalType: "contract IERC20",
      },
      {
        name: "parentCollectionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "conditionId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "partition",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransferBatch",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "ids",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "values",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransferSingle",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "URI",
    inputs: [
      {
        name: "value",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ERC1155InsufficientBalance",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "needed",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155InvalidApprover",
    inputs: [
      {
        name: "approver",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155InvalidArrayLength",
    inputs: [
      {
        name: "idsLength",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "valuesLength",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155InvalidOperator",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155InvalidReceiver",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155InvalidSender",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1155MissingApprovalForAll",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as Abi;
