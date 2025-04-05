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
        MockERC20 mockTokenA = new MockERC20("Shiba", "SHIB", 18);
        MockERC20 mockTokenB = new MockERC20("Doge", "DOGE", 18);
        MockERC20 mockTokenC = new MockERC20("Trump", "TRUMP", 18);
        MockERC20 mockTokenD = new MockERC20("Melania", "MELANIA", 18);
        
        // Mint tokens to deployer
        // mockTokenA.mint(deployer, 1_000_000 * 10 ** 18);
        // mockTokenB.mint(deployer, 1_000_000 * 10 ** 18);
        // mockTokenC.mint(deployer, 1_000_000 * 10 ** 18);
        // mockTokenD.mint(deployer, 1_000_000 * 10 ** 18);
        
        // Deploy BattleFactory
        BattleFactory battleFactory = new BattleFactory();
        
        vm.stopBroadcast();
        
        console.log("BattleFactory deployed at:", address(battleFactory));
        console.log("MockTokenA (SHIB) deployed at:", address(mockTokenA));
        console.log("MockTokenB (DOGE) deployed at:", address(mockTokenB));
        console.log("MockTokenC (TRUMP) deployed at:", address(mockTokenC));
        console.log("MockTokenD (MELANIA) deployed at:", address(mockTokenD));
    }
}
