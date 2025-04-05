// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Battle
 * @dev A contract for PVP battles between two meme coins.
 * Users stake either memecoin A or B, and after a certain duration,
 * the side with highest TVL (amount staked * price) wins.
 * Losing tokens are withdrawn by the owner and, after that,
 * the owner can deposit extra tokens to be shared among winners.
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

    // Extra winning tokens deposited by owner to be distributed to winners.
    uint256 public winningDeposit;
    bool public winningsDeposited;

    // User stakes tracking
    mapping(address => uint256) public tokenAStakes;
    mapping(address => uint256) public tokenBStakes;

    // Track redeemed tokens
    mapping(address => bool) public hasRedeemed;

    // Events
    event Staked(address indexed user, uint8 tokenType, uint256 amount);
    event BattleResolved(uint8 winner, uint256 tvlA, uint256 tvlB);
    event Redeemed(address indexed user, uint8 tokenType, uint256 amount);
    event WinningsDeposited(uint256 amount);

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _battleDuration
    ) Ownable(msg.sender) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        battleDuration = _battleDuration;
        battleStartTime = block.timestamp;
        battleResolved = false;
        winningToken = 0;
    }

    /**
     * @dev Stake tokenA in the battle.
     * @param amount Amount of tokenA to stake.
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
     * @dev Stake tokenB in the battle.
     * @param amount Amount of tokenB to stake.
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
     * @dev Resolve the battle (owner/dev acts as oracle).
     * Determines which token won based on TVL and withdraws the losing tokens.
     * @param tokenAPrice Price of tokenA.
     * @param tokenBPrice Price of tokenB.
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

        // Withdraw the losing tokens (if there is a winner)
        _withdrawLosingTokens();
    }

    /**
     * @dev Force resolve the battle for testing purposes, bypassing the duration check.
     * Also withdraws the losing tokens.
     */
    function forceResolveBattle(
        uint256 tokenAPrice,
        uint256 tokenBPrice
    ) external onlyOwner {
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

        // Withdraw the losing tokens (if there is a winner)
        _withdrawLosingTokens();
    }

    /**
     * @dev Internal function to withdraw the losing tokens.
     * If tokenA wins, withdraw all tokenB from the contract.
     * If tokenB wins, withdraw all tokenA from the contract.
     * In a tie, nothing is withdrawn.
     */
    function _withdrawLosingTokens() internal {
        if (winningToken == 1) {
            // TokenA wins, withdraw tokenB (losing tokens)
            uint256 balanceB = tokenB.balanceOf(address(this));
            if (balanceB > 0) {
                tokenB.transfer(owner(), balanceB);
            }
        } else if (winningToken == 2) {
            // TokenB wins, withdraw tokenA (losing tokens)
            uint256 balanceA = tokenA.balanceOf(address(this));
            if (balanceA > 0) {
                tokenA.transfer(owner(), balanceA);
            }
        }
        // In case of a tie (winningToken == 0), nothing is withdrawn.
    }

    /**
     * @dev Owner deposits the swapped losing tokens (winnings) to the winning token pool.
     * This extra deposit will be distributed to winners based on their stake proportion.
     * Requirements:
     * - Battle must be resolved with a clear winner (winningToken != 0).
     * - Winnings must not have been deposited already.
     * - The owner must approve the contract to transfer the tokens.
     * @param amount The amount of tokens to deposit.
     */
    function depositWinnings(uint256 amount) external onlyOwner {
        require(battleResolved, "Battle not resolved yet");
        require(winningToken != 0, "No winner; tie battle");
        require(!winningsDeposited, "Winnings already deposited");
        require(amount > 0, "Amount must be greater than 0");

        if (winningToken == 1) {
            // Deposit extra tokenA into the winning pool
            tokenA.transferFrom(owner(), address(this), amount);
        } else if (winningToken == 2) {
            // Deposit extra tokenB into the winning pool
            tokenB.transferFrom(owner(), address(this), amount);
        }
        winningDeposit = amount;
        winningsDeposited = true;
        emit WinningsDeposited(amount);
    }

    /**
     * @dev Redeem tokens after battle resolution.
     * Winners receive their stake plus a share of the winnings based on:
     * (user stake / total winning token staked) * (total staked + winning deposit).
     * Losers do not get their tokens back (only an event is emitted).
     */
    function redeem() external {
        require(battleResolved, "Battle not resolved yet");
        require(!hasRedeemed[msg.sender], "Already redeemed");

        uint256 stakeA = tokenAStakes[msg.sender];
        uint256 stakeB = tokenBStakes[msg.sender];

        require(stakeA > 0 || stakeB > 0, "No tokens staked");

        // Mark as redeemed to prevent double claims.
        tokenAStakes[msg.sender] = 0;
        tokenBStakes[msg.sender] = 0;
        hasRedeemed[msg.sender] = true;

        if (winningToken == 0) {
            // Tie: simply return the original staked tokens.
            if (stakeA > 0) {
                tokenA.transfer(msg.sender, stakeA);
                emit Redeemed(msg.sender, 1, stakeA);
            }
            if (stakeB > 0) {
                tokenB.transfer(msg.sender, stakeB);
                emit Redeemed(msg.sender, 2, stakeB);
            }
        } else if (winningToken == 1) {
            // TokenA wins.
            require(winningsDeposited, "Winnings not deposited yet");
            // Calculate reward based on proportion:
            // reward = stakeA / totalTokenAStaked * (totalTokenAStaked + winningDeposit)
            uint256 totalWinningPool = totalTokenAStaked + winningDeposit;
            uint256 reward = (stakeA * totalWinningPool) / totalTokenAStaked;
            tokenA.transfer(msg.sender, reward);
            emit Redeemed(msg.sender, 1, reward);
            if (stakeB > 0) {
                // Losers: only emit event.
                emit Redeemed(msg.sender, 2, stakeB);
            }
        } else if (winningToken == 2) {
            // TokenB wins.
            require(winningsDeposited, "Winnings not deposited yet");
            uint256 totalWinningPool = totalTokenBStaked + winningDeposit;
            uint256 reward = (stakeB * totalWinningPool) / totalTokenBStaked;
            tokenB.transfer(msg.sender, reward);
            emit Redeemed(msg.sender, 2, reward);
            if (stakeA > 0) {
                // Losers: only emit event.
                emit Redeemed(msg.sender, 1, stakeA);
            }
        }
    }
}
