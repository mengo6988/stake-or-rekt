#!/bin/bash

USER1=0xb9ba12F90B2897405F9978b0729Df2b667146d64
USER2=0xb69970DA012569BE2E30B986C06877c97AD0ddC7


WHALE1=0x388E263cd180409701C6f34dD7bA45E33BABC997
WHALE2=0xD3E0341B361134014E0c89378b3e36Bc5020cd97

#send eth to respective wallets
cast send --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --value 100ether \
  $USER1


cast send --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --value 100ether \
  $USER2


cast send --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --value 100ether \
  $WHALE1

cast send --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --value 100ether \
  $WHALE2

# echo "checking meme2"
# cast call --rpc-url http://localhost:8545 \
#   0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4 \
#   "balanceOf(address)(uint256)" \
#  0xD3E0341B361134014E0c89378b3e36Bc5020cd97 

echo "funding toshi"
cast rpc --rpc-url http://localhost:8545 anvil_impersonateAccount $WHALE2 

cast send --rpc-url http://localhost:8545 --from $WHALE2 0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4 "transfer(address,uint256)" $USER1  10000000000000000000 --unlocked
cast send --rpc-url http://localhost:8545 --from $WHALE2 0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4 "transfer(address,uint256)" $USER2  10000000000000000000 --unlocked

cast rpc --rpc-url http://localhost:8545 anvil_stopImpersonatingAccount $WHALE2 

echo "funding brett"
cast rpc --rpc-url http://localhost:8545 anvil_impersonateAccount $WHALE1 

cast send --rpc-url http://localhost:8545 --from $WHALE1 0x532f27101965dd16442E59d40670FaF5eBB142E4 "transfer(address,uint256)" $USER1  100000000000000000000 --unlocked
cast send --rpc-url http://localhost:8545 --from $WHALE1 0x532f27101965dd16442E59d40670FaF5eBB142E4 "transfer(address,uint256)" $USER2  100000000000000000000 --unlocked

cast rpc --rpc-url http://localhost:8545 anvil_stopImpersonatingAccount $WHALE1 


