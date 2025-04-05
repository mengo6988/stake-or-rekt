// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/battle/Battle.sol";
import "../src/battle/BattleFactory.sol";
import "./mocks/MockERC20.sol";

contract BattleTest is Test {
    BattleFactory public battleFactory;
    MockERC20 public tokenA;
    MockERC20 public tokenB;
    address public owner;
    address public user1;
    address public user2;
    Battle public battle;

    uint256 public constant BATTLE_DURATION = 7 days;
    uint256 public constant ONE_ETHER = 1 ether;

    function setUp() public {
        // Set up accounts
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy mock tokens
        tokenA = new MockERC20("Token A", "TKNA", 1_000_000 ether);
        tokenB = new MockERC20("Token B", "TKNB", 1_000_000 ether);

        // Distribute tokens to users
        tokenA.mint(user1, 10_000 ether);
        tokenA.mint(user2, 10_000 ether);
        tokenB.mint(user1, 10_000 ether);
        tokenB.mint(user2, 10_000 ether);

        // Also ensure the owner has tokens for depositing winnings
        tokenA.mint(owner, 10_000 ether);
        tokenB.mint(owner, 10_000 ether);

        // Deploy BattleFactory
        battleFactory = new BattleFactory();

        // Create a battle for testing
        address battleAddress = battleFactory.createBattle(
            address(tokenA),
            address(tokenB),
            BATTLE_DURATION
        );

        // Get battle instance
        battle = Battle(battleAddress);
    }

    // BattleFactory tests
    function testCreateBattle() public view {
        assertEq(battleFactory.getBattleCount(), 1);
        assertTrue(battleFactory.isBattle(address(battle)));

        assertEq(address(battle.tokenA()), address(tokenA));
        assertEq(address(battle.tokenB()), address(tokenB));
        assertEq(battle.battleDuration(), BATTLE_DURATION);
        assertEq(battle.battleResolved(), false);
    }

    function testGetBattleBatch() public {
        // Create another battle
        address battle2Address = battleFactory.createBattle(
            address(tokenA),
            address(tokenB),
            BATTLE_DURATION
        );

        // Get the first two battles
        address[] memory battles = battleFactory.getBattleBatch(0, 2);

        assertEq(battles.length, 2);
        assertEq(address(battles[0]), address(battle));
        assertEq(address(battles[1]), battle2Address);
    }

    function testGetAllBattles() public {
        // Create another battle
        address battle2Address = battleFactory.createBattle(
            address(tokenA),
            address(tokenB),
            BATTLE_DURATION
        );

        // Get all battles
        address[] memory battles = battleFactory.getAllBattles();

        assertEq(battles.length, 2);
        assertEq(battles[0], address(battle));
        assertEq(battles[1], battle2Address);
    }

    // Battle tests
    function testStakeTokens() public {
        // User1 stakes tokenA
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Check staking balances
        assertEq(battle.tokenAStakes(user1), ONE_ETHER);
        assertEq(battle.tokenBStakes(user2), ONE_ETHER);
        assertEq(battle.totalTokenAStaked(), ONE_ETHER);
        assertEq(battle.totalTokenBStaked(), ONE_ETHER);
    }

    function testPreventStakingAfterBattleEnds() public {
        // Move time forward past the battle duration
        vm.warp(block.timestamp + BATTLE_DURATION + 1);

        // Try to stake after the battle has ended
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        vm.expectRevert("Battle has ended");
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();
    }

    function testResolveTokenAWinner() public {
        // User1 stakes tokenA
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Skip time to end the battle
        vm.warp(block.timestamp + BATTLE_DURATION + 1);

        // Resolve battle with tokenA as winner (price: A=2, B=1)
        battle.resolveBattle(2, 1);

        assertTrue(battle.battleResolved());
        assertEq(battle.winningToken(), 1); // TokenA wins
    }

    function testResolveTokenBWinner() public {
        // User1 stakes tokenA
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Skip time to end the battle
        vm.warp(block.timestamp + BATTLE_DURATION + 1);

        // Resolve battle with tokenB as winner (price: A=1, B=2)
        battle.resolveBattle(1, 2);

        assertTrue(battle.battleResolved());
        assertEq(battle.winningToken(), 2); // TokenB wins
    }

    function testResolveTie() public {
        // User1 stakes tokenA
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB (half as much but twice the price for equal TVL)
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER / 2);
        battle.stakeTokenB(ONE_ETHER / 2);
        vm.stopPrank();

        // Skip time to end the battle
        vm.warp(block.timestamp + BATTLE_DURATION + 1);

        // Resolve battle as a tie (TVL: A=1*1=1, B=0.5*2=1)
        battle.resolveBattle(1, 2);

        assertTrue(battle.battleResolved());
        assertEq(battle.winningToken(), 0); // Tie
    }

    function testDepositWinnings() public {
        // User1 stakes tokenA, user2 stakes tokenB.
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Force resolve battle with tokenA as winner (price: A=2, B=1)
        battle.forceResolveBattle(2, 1);
        assertEq(battle.winningToken(), 1);

        // Owner deposits extra winnings (extra tokenA)
        uint256 extraWinnings = ONE_ETHER; // for example
        tokenA.approve(address(battle), extraWinnings);
        battle.depositWinnings(extraWinnings);

        // Check that winnings were deposited
        assertEq(battle.winningDeposit(), extraWinnings);
    }

    function testWinnerRedeemTokens() public {
        // User1 stakes tokenA (winner side)
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB (loser side)
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Force resolve battle with tokenA as winner (price: A=2, B=1)
        battle.forceResolveBattle(2, 1);
        assertEq(battle.winningToken(), 1);

        // Owner deposits extra winnings (tokenA) into the winning pool
        uint256 extraWinnings = ONE_ETHER;
        tokenA.approve(address(battle), extraWinnings);
        battle.depositWinnings(extraWinnings);

        // Calculate expected reward:
        // reward = stakeA / totalTokenAStaked * (totalTokenAStaked + winningDeposit)
        // In this test, stakeA == totalTokenAStaked == ONE_ETHER, so reward = 1 ether + 1 ether = 2 ether.
        uint256 expectedReward = 2 * ONE_ETHER;

        // Record user1's tokenA balance before redeeming
        uint256 user1BalanceBefore = tokenA.balanceOf(user1);

        // Winner redeems
        vm.prank(user1);
        battle.redeem();

        // Check user1's tokenA balance after redeeming
        uint256 user1BalanceAfter = tokenA.balanceOf(user1);
        assertEq(user1BalanceAfter, user1BalanceBefore + expectedReward);

        // Also, the winner's redemption should mark them as redeemed
        assertTrue(battle.hasRedeemed(user1));
    }

    function testLoserRedeemTokens() public {
        // User1 stakes tokenA (loser side)
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // User2 stakes tokenB (winner side)
        vm.startPrank(user2);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Force resolve battle with tokenB as winner (price: A=1, B=2)
        battle.forceResolveBattle(1, 2);
        assertEq(battle.winningToken(), 2);

        // Owner deposits extra winnings (tokenB) into the winning pool
        uint256 extraWinnings = ONE_ETHER;
        tokenB.approve(address(battle), extraWinnings);
        battle.depositWinnings(extraWinnings);

        // Record user1's tokenA balance before redeeming
        uint256 user1BalanceBefore = tokenA.balanceOf(user1);

        // Loser redeems (should only emit event, not transfer tokens)
        vm.prank(user1);
        battle.redeem();

        // User1's tokenA balance should remain unchanged
        uint256 user1BalanceAfter = tokenA.balanceOf(user1);
        assertEq(user1BalanceAfter, user1BalanceBefore);
        assertTrue(battle.hasRedeemed(user1));
    }

    // Updated test to avoid "Winnings not deposited yet" revert by forcing a tie.
    function testPreventDoubleRedemption() public {
        // User1 stakes both tokenA and tokenB to force a tie.
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        tokenB.approve(address(battle), ONE_ETHER);
        battle.stakeTokenB(ONE_ETHER);
        vm.stopPrank();

        // Force resolve battle as a tie (prices equal)
        battle.forceResolveBattle(1, 1);
        assertEq(battle.winningToken(), 0);

        // First redemption should succeed.
        vm.prank(user1);
        battle.redeem();

        // Second redemption should revert with "Already redeemed".
        vm.expectRevert("Already redeemed");
        vm.prank(user1);
        battle.redeem();
    }

    function testPreventResolvingBeforeBattleEnds() public {
        // Attempt to resolve before battle duration has elapsed.
        vm.expectRevert("Battle not yet ended");
        battle.resolveBattle(1, 1);
    }

    function testPreventRedeemingBeforeBattleResolved() public {
        // Stake tokens for user1.
        vm.startPrank(user1);
        tokenA.approve(address(battle), ONE_ETHER);
        battle.stakeTokenA(ONE_ETHER);
        vm.stopPrank();

        // Attempt to redeem before the battle has been resolved.
        vm.expectRevert("Battle not resolved yet");
        vm.prank(user1);
        battle.redeem();
    }
}
