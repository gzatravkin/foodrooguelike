import { describe, it, expect } from 'vitest';
import enemies from '../data/enemies.json';
import equipment from '../data/equipment.json';

describe('Game Balance Tests', () => {
  describe('Gold Rewards Balance', () => {
    it('should have balanced gold rewards for starter enemies', () => {
      expect(enemies.rat.goldReward).toBe(8);
      expect(enemies.bat.goldReward).toBe(10);
      expect(enemies.slime.goldReward).toBe(10);
    });

    it('should have smooth gold progression', () => {
      const goldRewards = [
        { name: 'rat', gold: enemies.rat.goldReward },
        { name: 'bat', gold: enemies.bat.goldReward },
        { name: 'slime', gold: enemies.slime.goldReward },
        { name: 'skeleton', gold: enemies.skeleton.goldReward },
        { name: 'goblin', gold: enemies.goblin.goldReward },
        { name: 'spider', gold: enemies.spider.goldReward },
        { name: 'wolf', gold: enemies.wolf.goldReward },
        { name: 'orc', gold: enemies.orc.goldReward },
        { name: 'giant_crab', gold: enemies.giant_crab.goldReward }
      ];

      // Check each tier doesn't have huge jumps
      for (let i = 1; i < goldRewards.length; i++) {
        const current = goldRewards[i].gold;
        const previous = goldRewards[i - 1].gold;
        const increase = current - previous;

        // No increase should be more than 15 gold in non-boss enemies
        expect(increase).toBeLessThanOrEqual(15);
      }
    });

    it('should have adjusted gold for balance', () => {
      // Verify the specific balance changes
      expect(enemies.spider.goldReward).toBe(22); // Reduced from 25
      expect(enemies.giant_crab.goldReward).toBe(32); // Reduced from 35
    });
  });

  describe('Early Game Progression', () => {
    it('should allow purchasing basic equipment within reasonable time', () => {
      const startingGold = 100;
      const ironSwordCost = equipment.iron_sword.cost;
      const leatherArmorCost = equipment.leather_armor.cost;

      // Player should be able to buy first item within 1-2 rat kills
      const goldNeededForSword = Math.max(0, ironSwordCost - startingGold);
      const ratsNeededForSword = Math.ceil(goldNeededForSword / enemies.rat.goldReward);

      expect(ratsNeededForSword).toBeLessThanOrEqual(2);

      // Should be able to get both items within ~10 starter enemy kills
      const totalCost = ironSwordCost + leatherArmorCost;
      const killsNeeded = Math.ceil((totalCost - startingGold) / enemies.rat.goldReward);

      expect(killsNeeded).toBeLessThanOrEqual(10);
    });
  });

  describe('Mid-Game Equipment Affordability', () => {
    it('should make steel equipment achievable through progression', () => {
      const steelSwordCost = equipment.steel_sword.cost;
      const chainMailCost = equipment.chain_mail.cost;
      const totalCost = steelSwordCost + chainMailCost;

      // With tier 2 enemies averaging ~20g, should take 15-20 kills
      const avgTier2Gold = (enemies.goblin.goldReward + enemies.skeleton.goldReward + enemies.spider.goldReward) / 3;
      const killsNeeded = Math.ceil(totalCost / avgTier2Gold);

      expect(killsNeeded).toBeLessThanOrEqual(25);
      expect(killsNeeded).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Combat Difficulty Curve', () => {
    const playerBaseAttack = 10;
    const playerBaseDefense = 5;

    it('should allow player to defeat starter enemies with base stats', () => {
      const enemies_to_test = [enemies.rat, enemies.bat, enemies.slime];

      enemies_to_test.forEach(enemy => {
        const damagePerTurn = Math.max(1, playerBaseAttack - enemy.defense);
        const turnsToKill = Math.ceil(enemy.health / damagePerTurn);

        const damageTaken = Math.max(1, enemy.attack - playerBaseDefense);
        const playerHealth = 100;
        const maxTurnsPlayerSurvives = Math.floor(playerHealth / damageTaken);

        // Player should win comfortably
        expect(turnsToKill).toBeLessThan(maxTurnsPlayerSurvives);
      });
    });

    it('should require equipment for mid-tier enemies', () => {
      const midTierEnemies = [enemies.wolf, enemies.orc, enemies.giant_crab];

      midTierEnemies.forEach(enemy => {
        const damagePerTurn = Math.max(1, playerBaseAttack - enemy.defense);
        const turnsToKill = Math.ceil(enemy.health / damagePerTurn);

        const damageTaken = Math.max(1, enemy.attack - playerBaseDefense);
        const playerHealth = 100;

        const totalDamage = turnsToKill * damageTaken;

        // Should be challenging (takes 50%+ damage) or require equipment
        // Wolf: 55 HP, 11 ATK, 4 DEF -> 6 dmg/turn, takes 6 dmg/turn, 10 turns = 60 damage (doable but risky)
        // Orc: 60 HP, 12 ATK, 5 DEF -> 5 dmg/turn, takes 7 dmg/turn, 12 turns = 84 damage (very risky)
        // Crab: 70 HP, 10 ATK, 9 DEF -> 1 dmg/turn, takes 5 dmg/turn, 70 turns = 350 damage (impossible)
        expect(totalDamage).toBeGreaterThan(playerHealth * 0.5); // Takes significant damage
      });
    });

    it('should make bosses unbeatable without good equipment', () => {
      const dragon = enemies.dragon;

      const damagePerTurn = Math.max(1, playerBaseAttack - dragon.defense);
      const turnsToKill = Math.ceil(dragon.health / damagePerTurn);

      const damageTaken = Math.max(1, dragon.attack - playerBaseDefense);
      const playerHealth = 100;
      const totalDamageTaken = turnsToKill * damageTaken;

      // Player should die trying without equipment
      expect(totalDamageTaken).toBeGreaterThan(playerHealth);
    });

    it('should make demon lord beatable with full equipment', () => {
      const demonLord = enemies.demon_lord;

      // With Steel Sword (+10 ATK) + Chain Mail (+10 DEF, +20 HP)
      const fullAttack = playerBaseAttack + equipment.steel_sword.stats.attack;
      const fullDefense = playerBaseDefense + equipment.chain_mail.stats.defense;
      const fullHealth = 100 + (equipment.chain_mail.stats.health || 0);

      const damagePerTurn = Math.max(1, fullAttack - demonLord.defense);
      const turnsToKill = Math.ceil(demonLord.health / damagePerTurn);

      const damageTaken = Math.max(1, demonLord.attack - fullDefense);
      const totalDamageTaken = turnsToKill * damageTaken;

      // Should be challenging but winnable
      expect(totalDamageTaken).toBeLessThan(fullHealth);
      expect(totalDamageTaken).toBeGreaterThan(fullHealth * 0.5); // Still takes good damage
    });
  });

  describe('Enemy Tier Balance', () => {
    it('should have distinct tiers of enemies', () => {
      const tiers = {
        tier1: [enemies.rat, enemies.bat, enemies.slime],
        tier2: [enemies.skeleton, enemies.goblin, enemies.spider],
        tier3: [enemies.wolf, enemies.orc, enemies.giant_crab, enemies.troll],
        tier4: [enemies.ice_golem, enemies.fire_elemental, enemies.dragon],
        tier5: [enemies.demon_lord]
      };

      // Check that average stats increase per tier
      const avgStats = Object.entries(tiers).map(([tier, tierEnemies]) => ({
        tier,
        avgHealth: tierEnemies.reduce((sum, e) => sum + e.health, 0) / tierEnemies.length,
        avgGold: tierEnemies.reduce((sum, e) => sum + e.goldReward, 0) / tierEnemies.length
      }));

      for (let i = 1; i < avgStats.length; i++) {
        expect(avgStats[i].avgHealth).toBeGreaterThan(avgStats[i - 1].avgHealth);
        expect(avgStats[i].avgGold).toBeGreaterThan(avgStats[i - 1].avgGold);
      }
    });
  });
});
