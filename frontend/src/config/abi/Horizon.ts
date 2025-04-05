import { Abi } from "viem";

export const horizonABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_conditionalTokens",
        type: "address",
        internalType: "address",
      },
      {
        name: "_usdt",
        type: "address",
        internalType: "address",
      },
      {
        name: "_treasury",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "LIQUIDATION_FEE",
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
    name: "LIQUIDATION_THRESHOLD",
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
    name: "MAX_AUCTION_DURATION",
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
    name: "MAX_INTEREST",
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
    name: "MIN_AUCTION_DURATION",
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
    name: "PAYBACK_BUFFER",
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
    name: "TREASURY",
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
    name: "amountTaken",
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
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "borrow",
    inputs: [
      {
        name: "_offerId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "borrowerRefinance",
    inputs: [
      {
        name: "_loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_newOfferId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_newCollateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "newLoanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "calculateHealthFactor",
    inputs: [
      {
        name: "loanId",
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
    name: "cancelOffer",
    inputs: [
      {
        name: "_offerId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "conditionalTokens",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IConditionalTokens",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "flashRepay",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
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
    name: "getAmountOwed",
    inputs: [
      {
        name: "_loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_paybackTime",
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
    name: "getTokenPriceAndOutcomeIndex",
    inputs: [
      {
        name: "marketAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "price",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "outcomeIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "liquidate",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "loanOffers",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "lender",
        type: "address",
        internalType: "address",
      },
      {
        name: "marketAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "nftId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "totalLoanAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "rate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "immunityEndTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "auctionDuration",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "isCancelled",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "loans",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "offerId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "startTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "interestPaid",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountPaid",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "auctionCallTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "isDefaulted",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextLoanId",
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
    name: "nextLoanOfferId",
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
    name: "offer",
    inputs: [
      {
        name: "_marketAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "_nftId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_totalLoanAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_rate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_immunityEndTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_auctionDuration",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "offerId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC1155BatchReceived",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC1155Received",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "refinanceAuction",
    inputs: [
      {
        name: "_loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_newRate",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "repay",
    inputs: [
      {
        name: "_loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_repaymentAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_paybackTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "collateralReturned",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "seizeDefaultedLoans",
    inputs: [
      {
        name: "_loanIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setZapper",
    inputs: [
      {
        name: "_zapper",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startAuction",
    inputs: [
      {
        name: "_offerId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_loanIds",
        type: "uint256[]",
        internalType: "uint256[]",
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
    name: "usdt",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "zapper",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IHorizonZapper",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "zapperRepay",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AuctionCalled",
    inputs: [
      {
        name: "offerId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "loanIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AuctionDefaulted",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "lender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AuctionRefinanced",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newLender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOfferId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newRate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newimmunityEndTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerRefinance",
    inputs: [
      {
        name: "oldLoanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newLoanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "oldDebt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newLoanAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FullRepayment",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "interestPaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalPaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralReturned",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanCreated",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "offerId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "loanAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "startTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanLiquidated",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "liquidator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "debtAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "liquidationFee",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanOfferCancelled",
    inputs: [
      {
        name: "offerId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "lender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "remainingAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "hasActiveLoans",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanOfferCreated",
    inputs: [
      {
        name: "offerId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "lender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "marketAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "nftId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalLoanAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "rate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "immunityEndTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "auctionDuration",
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
    type: "event",
    name: "PartialRepayment",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "interestPaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "principalPaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AuctionAlreadyStarted",
    inputs: [],
  },
  {
    type: "error",
    name: "AuctionExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "AuctionNotExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "AuctionNotStarted",
    inputs: [],
  },
  {
    type: "error",
    name: "AuctionRateTooHigh",
    inputs: [],
  },
  {
    type: "error",
    name: "CollateralAmountIsZero",
    inputs: [],
  },
  {
    type: "error",
    name: "CollateralIsNotApproved",
    inputs: [],
  },
  {
    type: "error",
    name: "HealthFactorOk",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientAllowance",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientCollateralBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientFunds",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientOffer",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAuctionCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAuctionDuration",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLiquidation",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLoan",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMarketAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMarketPrice",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidOffer",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidPositionId",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRate",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRepayTimestamp",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRepayment",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRequest",
    inputs: [],
  },
  {
    type: "error",
    name: "LoanIsDefaulted",
    inputs: [],
  },
  {
    type: "error",
    name: "LoanLiquidatable",
    inputs: [],
  },
  {
    type: "error",
    name: "NotAllLoansProcessed",
    inputs: [],
  },
  {
    type: "error",
    name: "OfferCancelled",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyBorrower",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyLender",
    inputs: [],
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
  {
    type: "error",
    name: "UnauthorizedZapper",
    inputs: [],
  },
  {
    type: "error",
    name: "ZapperAlreadySet",
    inputs: [],
  },
  {
    type: "error",
    name: "ZapperNotSet",
    inputs: [],
  },
] as Abi;
