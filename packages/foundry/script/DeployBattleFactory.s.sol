// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/BattleFactory.sol";

/**
 * @notice Deploy script for BattleFactory contract
 * @dev This script deploys ONLY the factory contract
 *
 * Usage:
 * yarn deploy --file DeployBattleFactory.s.sol
 */
contract DeployBattleFactory is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // Deploy the BattleFactory contract
        BattleFactory battleFactory = new BattleFactory();

        console.log("BattleFactory deployed at:", address(battleFactory));

        // Register the deployment
        deployments.push(Deployment("BattleFactory", address(battleFactory)));
    }
}
