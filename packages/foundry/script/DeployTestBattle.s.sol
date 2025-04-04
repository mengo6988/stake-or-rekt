// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/BattleFactory.sol";
import "../contracts/Battle.sol";
import "../contracts/MockERC20.sol";

/**
 * @notice Deployment script that demonstrates the COMPLETE flow:
 * Deploys factory → mock tokens → creates battle through factory
 *
 * Usage:
 * yarn deploy --file DeployTestBattle.s.sol
 */
contract DeployTestBattle is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // Step 1: Deploy the BattleFactory
        BattleFactory battleFactory = new BattleFactory();

        // Step 2: Deploy mock tokens for testing
        MockERC20 mockTokenA = new MockERC20("TestMemeA", "TMEMA", 18);
        MockERC20 mockTokenB = new MockERC20("TestMemeB", "TMEMB", 18);

        // Mint some tokens to the deployer for testing
        mockTokenA.mint(deployer, 1000000 * 10 ** 18);
        mockTokenB.mint(deployer, 1000000 * 10 ** 18);

        // Step 3: Create a Battle through the factory
        uint256 battleDuration = 1 days; // 1 day in seconds
        address battleAddress = battleFactory.createBattle(
            address(mockTokenA),
            address(mockTokenB),
            battleDuration
        );

        console.log("BattleFactory deployed at:", address(battleFactory));
        console.log("TestTokenA deployed at:", address(mockTokenA));
        console.log("TestTokenB deployed at:", address(mockTokenB));
        console.log("TestBattle created at:", battleAddress);

        // Register the deployments
        deployments.push(
            Deployment("TestBattleFactory", address(battleFactory))
        );
        deployments.push(Deployment("TestTokenA", address(mockTokenA)));
        deployments.push(Deployment("TestTokenB", address(mockTokenB)));
        deployments.push(Deployment("TestBattle", battleAddress));
    }
}
