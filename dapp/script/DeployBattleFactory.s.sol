// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/battle/BattleFactory.sol";

contract DeployBattleFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        BattleFactory battleFactory = new BattleFactory();
        
        vm.stopBroadcast();

        console.log("BattleFactory deployed at:", address(battleFactory));
    }
}
