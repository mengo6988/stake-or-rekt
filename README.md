# Stake-or-Rekt

A PVP staking platform for memecoin communities built for ETHGlobal Taipei 2025. Users stake their tokens in battles, and the side with the highest TVL (amount staked × token price) wins. Losing tokens are swapped for winning tokens and distributed to winners proportionally to their stake.

## Project Structure

This repository is organized as a monorepo containing two main components:

```
stake-or-rekt/
├── dapp/             # Smart contracts (Solidity + Foundry)
│   ├── src/          # Contract source code
│   │   └── battle/   # Battle contracts
│   ├── test/         # Contract tests
│   └── script/       # Deployment scripts
│
└── frontend/         # Web application (Next.js)
    ├── src/          # Frontend source code
    │   ├── components/  # UI components
    │   ├── config/      # Configuration files
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Next.js pages
    │   ├── types/       # TypeScript type definitions
    │   └── utils/       # Utility functions
    └── public/       # Static assets
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- pnpm
- Foundry (Forge, Cast, Anvil)
- Git

### Smart Contracts (dapp)

```bash
# Navigate to the dapp directory
cd dapp

# Create .env file with required environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Start a local development chain (if forking for mainnet)
./script/forks/start-fork.sh

# Fund test accounts (in a separate terminal) (if forking for mainnet)
./script/fund_accounts.sh

# Deploy to local network
forge script script/DeployBattleFactory.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Create .env file with required environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Core Features

- **Create Battles**: Deploy battles between any two ERC20 tokens
- **Stake Tokens**: Users can stake tokens on either side of a battle
- **Battle Resolution**: Battles are resolved based on TVL (amount × price) after the duration ends
- **Winnings Distribution**: Winners receive their original stake plus a proportional share of the losing tokens

## Development

- Smart contract development is done in the `dapp` directory using Foundry
- Frontend development is done in the `frontend` directory using Next.js
- The application uses viem and wagmi for blockchain interactions
- Authentication is handled by Privy
- UI is built with Tailwind CSS and various components

## Team
Our team consist of 2 fairly new web3 developers from Malaysia who have experience in building gamefi and defi projects.
#### Socials
- X: @MadunProt0col @mengoo6988
- Telegram: @amadzai @mengo6988


## License

This project was built for a hackathon. License details to be added.