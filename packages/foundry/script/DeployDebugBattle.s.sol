// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/Battle.sol";
import "../contracts/MockERC20A.sol";
import "../contracts/MockERC20B.sol";

/**
 * @notice Debug deployment script for Battle contract
 * @dev Deploys Battle contract DIRECTLY (bypassing factory) for debugging
 * This allows easier debugging through Scaffold ETH UI
 *
 * Usage:
 * yarn deploy --file DeployDebugBattle.s.sol
 */
contract DeployDebugBattle is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // Deploy mock tokens for testing
        MockERC20A mockTokenA = new MockERC20A("DebugMemeA", "DMEMA", 18);
        MockERC20B mockTokenB = new MockERC20B("DebugMemeB", "DMEMB", 18);

        // Mint some tokens to the deployer for testing
        mockTokenA.mint(deployer, 1000000 * 10 ** 18);
        mockTokenB.mint(deployer, 1000000 * 10 ** 18);

        // Deploy a Battle contract directly (bypassing factory)
        uint256 battleDuration = 1 days; // 1 day in seconds
        Battle battle = new Battle(
            address(mockTokenA),
            address(mockTokenB),
            battleDuration
        );

        console.log("DebugBattle deployed at:", address(battle));
        console.log("DebugTokenA deployed at:", address(mockTokenA));
        console.log("DebugTokenB deployed at:", address(mockTokenB));

        // Register the deployments
        deployments.push(Deployment("DebugBattle", address(battle)));
        deployments.push(Deployment("DebugTokenA", address(mockTokenA)));
        deployments.push(Deployment("DebugTokenB", address(mockTokenB)));
    }
}
