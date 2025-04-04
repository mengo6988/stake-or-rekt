//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Battle
 * @dev A contract for PVP battles between two meme coins
 * Users stake either memecoin A or B, and after a certain duration,
 * the side with highest TVL (amount staked * price) wins
 */
contract Battle is Ownable {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public battleStartTime;
    uint256 public battleDuration;
    bool public battleResolved;

    // Total values staked
    uint256 public totalTokenAStaked;
    uint256 public totalTokenBStaked;

    // Winning token (0 = not determined, 1 = tokenA, 2 = tokenB)
    uint8 public winningToken;

    // User stakes tracking
    mapping(address => uint256) public tokenAStakes;
    mapping(address => uint256) public tokenBStakes;

    // Track redeemed tokens
    mapping(address => bool) public hasRedeemed;

    // Events
    event Staked(address indexed user, uint8 tokenType, uint256 amount);
    event BattleResolved(uint8 winner, uint256 tvlA, uint256 tvlB);
    event Redeemed(address indexed user, uint8 tokenType, uint256 amount);

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _battleDuration
    )
        // uint256 _tokenAPrice,
        // uint256 _tokenBPrice
        Ownable(msg.sender)
    {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        battleDuration = _battleDuration;
        battleStartTime = block.timestamp;
        // tokenAPrice = _tokenAPrice;
        // tokenBPrice = _tokenBPrice;
        battleResolved = false;
        winningToken = 0;
    }

    /**
     * @dev Stake tokenA in the battle
     * @param amount Amount of tokenA to stake
     */
    function stakeTokenA(uint256 amount) external {
        require(
            block.timestamp < battleStartTime + battleDuration,
            "Battle has ended"
        );
        require(!battleResolved, "Battle already resolved");
        require(amount > 0, "Amount must be greater than 0");

        tokenA.transferFrom(msg.sender, address(this), amount);
        tokenAStakes[msg.sender] += amount;
        totalTokenAStaked += amount;

        emit Staked(msg.sender, 1, amount);
    }

    /**
     * @dev Stake tokenB in the battle
     * @param amount Amount of tokenB to stake
     */
    function stakeTokenB(uint256 amount) external {
        require(
            block.timestamp < battleStartTime + battleDuration,
            "Battle has ended"
        );
        require(!battleResolved, "Battle already resolved");
        require(amount > 0, "Amount must be greater than 0");

        tokenB.transferFrom(msg.sender, address(this), amount);
        tokenBStakes[msg.sender] += amount;
        totalTokenBStaked += amount;

        emit Staked(msg.sender, 2, amount);
    }

    /**
     * @dev Resolve the battle (owner/dev acts as oracle)
     * Determines which token won based on TVL
     */
    function resolveBattle(
        uint256 tokenAPrice,
        uint256 tokenBPrice
    ) external onlyOwner {
        require(
            block.timestamp >= battleStartTime + battleDuration,
            "Battle not yet ended"
        );
        require(!battleResolved, "Battle already resolved");

        uint256 tvlA = totalTokenAStaked * tokenAPrice;
        uint256 tvlB = totalTokenBStaked * tokenBPrice;

        if (tvlA > tvlB) {
            winningToken = 1; // tokenA wins
        } else if (tvlB > tvlA) {
            winningToken = 2; // tokenB wins
        } else {
            winningToken = 0; // It's a tie
        }

        battleResolved = true;
        emit BattleResolved(winningToken, tvlA, tvlB);
    }

    /**
     * @dev Redeem tokens after battle resolution
     * Winners get their tokens back, losers' tokens are kept for manual swap
     */
    function redeem() external {
        require(battleResolved, "Battle not resolved yet");
        require(!hasRedeemed[msg.sender], "Already redeemed");

        uint256 tokenAAmount = tokenAStakes[msg.sender];
        uint256 tokenBAmount = tokenBStakes[msg.sender];

        require(tokenAAmount > 0 || tokenBAmount > 0, "No tokens staked");

        // Mark as redeemed
        tokenAStakes[msg.sender] = 0;
        tokenBStakes[msg.sender] = 0;
        hasRedeemed[msg.sender] = true;

        if (winningToken == 0) {
            // Tie
            // Return original tokens in case of a tie
            if (tokenAAmount > 0) {
                tokenA.transfer(msg.sender, tokenAAmount);
                emit Redeemed(msg.sender, 1, tokenAAmount);
            }
            if (tokenBAmount > 0) {
                tokenB.transfer(msg.sender, tokenBAmount);
                emit Redeemed(msg.sender, 2, tokenBAmount);
            }
        } else if (winningToken == 1) {
            // TokenA won
            if (tokenAAmount > 0) {
                // Winner gets their original tokens back
                tokenA.transfer(msg.sender, tokenAAmount);
                emit Redeemed(msg.sender, 1, tokenAAmount);
            }
            // For losers, we only emit an event (swaps handled manually for POC)
            if (tokenBAmount > 0) {
                emit Redeemed(msg.sender, 2, tokenBAmount);
            }
        } else if (winningToken == 2) {
            // TokenB won
            if (tokenBAmount > 0) {
                // Winner gets their original tokens back
                tokenB.transfer(msg.sender, tokenBAmount);
                emit Redeemed(msg.sender, 2, tokenBAmount);
            }
            // For losers, we only emit an event (swaps handled manually for POC)
            if (tokenAAmount > 0) {
                emit Redeemed(msg.sender, 1, tokenAAmount);
            }
        }
    }

    /**
     * @dev Manual swap function for POC
     * To be called by owner to handle swapping losers' tokens to winners
     */
    function manualSwap(
        address user,
        address token,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).transfer(user, amount);
    }
}
