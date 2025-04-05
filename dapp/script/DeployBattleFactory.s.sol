// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/battle/BattleFactory.sol";
import "../test/mocks/MockERC20.sol";

contract DeployBattleFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock ERC20 tokens and mint tokens to the deployer
        MockERC20 mockTokenA = new MockERC20("MockTokenA", "MOCKA", 18);
        MockERC20 mockTokenB = new MockERC20("MockTokenB", "MOCKB", 18);

        // Mint tokens to deployer
        mockTokenA.mint(deployer, 1_000_000 * 10 ** 18);
        mockTokenB.mint(deployer, 1_000_000 * 10 ** 18);

        // Deploy BattleFactory
        BattleFactory battleFactory = new BattleFactory();

        vm.stopBroadcast();

        console.log("BattleFactory deployed at:", address(battleFactory));
        console.log("MockTokenA deployed at:", address(mockTokenA));
        console.log("MockTokenB deployed at:", address(mockTokenB));
    }
}
