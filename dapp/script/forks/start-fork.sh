#!/bin/bash

# Load environment variables
source .env

# Verify RPC URL is set
if [ -z "$RPC_URL" ]; then
  echo "Error: RPC_URL is not set in .env file"
  exit 1
fi

# Start Anvil with a fork of Base mainnet
echo "Forking Base Mainnet from: $RPC_URL"

anvil \
  --fork-url $RPC_URL \
  --chain-id 8453 \
  --timeout 300000 \
  --port 8545 \
