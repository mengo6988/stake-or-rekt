// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    // Mint function for testing purposes
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // Burn function for testing purposes
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }

    // Function to mint tokens to multiple addresses at once
    function batchMint(
        address[] calldata tos,
        uint256[] calldata amounts
    ) external {
        require(tos.length == amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < tos.length; i++) {
            _mint(tos[i], amounts[i]);
        }
    }

    // Function to check if address has enough balance and allowance
    function checkBalanceAndAllowance(
        address owner,
        address spender,
        uint256 amount
    ) external view returns (bool) {
        return
            balanceOf(owner) >= amount && allowance(owner, spender) >= amount;
    }

    // Function to get tokens
    function faucet(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}
