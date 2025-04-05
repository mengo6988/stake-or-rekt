//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Battle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title BattleFactory
 * @dev Factory contract for creating and tracking PVP battles between meme coins
 */
contract BattleFactory is Ownable {
    // Array to store all created battles
    address[] public battles;
    
    // Mapping from battle address to its index in the battles array
    mapping(address => uint256) public battleIndices;
    
    // Events
    event BattleCreated(
        address indexed battleAddress,
        address tokenA,
        address tokenB,
        uint256 battleDuration
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new battle between two tokens
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @param battleDuration Duration of the battle in seconds
     * @return Address of the newly created battle contract
     */
    function createBattle(
        address tokenA,
        address tokenB,
        uint256 battleDuration
    ) external returns (address) {
        require(tokenA != address(0), "Invalid tokenA address");
        require(tokenB != address(0), "Invalid tokenB address");
        require(tokenA != tokenB, "Tokens must be different");
        require(battleDuration > 0, "Battle duration must be greater than 0");
        
        // Create a new Battle contract
        Battle newBattle = new Battle(
            tokenA,
            tokenB,
            battleDuration
        );
        
        // Transfer ownership to the factory owner
        newBattle.transferOwnership(owner());
        
        // Store the new battle
        battleIndices[address(newBattle)] = battles.length;
        battles.push(address(newBattle));
        
        emit BattleCreated(address(newBattle), tokenA, tokenB, battleDuration);
        
        return address(newBattle);
    }
    
    /**
     * @dev Get the total number of battles created
     * @return Number of battles
     */
    function getBattleCount() external view returns (uint256) {
        return battles.length;
    }
    
    /**
     * @dev Get a batch of battles
     * @param startIndex Starting index
     * @param endIndex Ending index (exclusive)
     * @return Array of battle addresses
     */
    function getBattleBatch(uint256 startIndex, uint256 endIndex) 
        external 
        view 
        returns (address[] memory) 
    {
        require(startIndex < battles.length, "Start index out of bounds");
        require(endIndex <= battles.length, "End index out of bounds");
        require(startIndex < endIndex, "Invalid range");
        
        address[] memory batchBattles = new address[](endIndex - startIndex);
        
        for (uint256 i = startIndex; i < endIndex; i++) {
            batchBattles[i - startIndex] = battles[i];
        }
        
        return batchBattles;
    }
    
    /**
     * @dev Check if an address is a battle created by this factory
     * @param battleAddress Address to check
     * @return True if the address is a battle, false otherwise
     */
    function isBattle(address battleAddress) external view returns (bool) {
        return battleAddress != address(0) && 
               battles.length > 0 && 
               battles[battleIndices[battleAddress]] == battleAddress;
    }
    
    /**
     * @dev Get all battles
     * @return Array of all battle addresses
     */
    function getAllBattles() external view returns (address[] memory) {
        return battles;
    }
}
