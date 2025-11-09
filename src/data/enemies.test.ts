import { describe, it, expect } from 'vitest';
import enemies from './enemies.json';

describe('Enemies Data', () => {
  const enemyIds = Object.keys(enemies);

  it('should have at least 13 enemies', () => {
    expect(enemyIds.length).toBeGreaterThanOrEqual(13);
  });

  it('should include all new enemies', () => {
    const newEnemies = [
      'rat', 'bat', 'skeleton', 'orc', 'troll',
      'ice_golem', 'fire_elemental', 'spider',
      'wolf', 'giant_crab', 'demon_lord'
    ];

    newEnemies.forEach(enemyId => {
      expect(enemies).toHaveProperty(enemyId);
    });
  });

  describe('Enemy Structure Validation', () => {
    enemyIds.forEach(enemyId => {
      describe(`Enemy: ${enemyId}`, () => {
        const enemy = enemies[enemyId as keyof typeof enemies];

        it('should have required fields', () => {
          expect(enemy).toHaveProperty('id');
          expect(enemy).toHaveProperty('type');
          expect(enemy).toHaveProperty('name');
          expect(enemy).toHaveProperty('description');
          expect(enemy).toHaveProperty('health');
          expect(enemy).toHaveProperty('attack');
          expect(enemy).toHaveProperty('defense');
          expect(enemy).toHaveProperty('goldReward');
          expect(enemy).toHaveProperty('lootTable');
        });

        it('should have correct type', () => {
          expect(enemy.type).toBe('enemy');
        });

        it('should have matching id', () => {
          expect(enemy.id).toBe(enemyId);
        });

        it('should have non-empty name and description', () => {
          expect(enemy.name.length).toBeGreaterThan(0);
          expect(enemy.description.length).toBeGreaterThan(0);
        });

        it('should have positive stats', () => {
          expect(enemy.health).toBeGreaterThan(0);
          expect(enemy.attack).toBeGreaterThan(0);
          expect(enemy.defense).toBeGreaterThanOrEqual(0);
          expect(enemy.goldReward).toBeGreaterThan(0);
        });

        it('should have valid loot table', () => {
          expect(Array.isArray(enemy.lootTable)).toBe(true);
          expect(enemy.lootTable.length).toBeGreaterThan(0);

          enemy.lootTable.forEach(loot => {
            expect(loot).toHaveProperty('itemId');
            expect(loot).toHaveProperty('chance');
            expect(loot.itemId.length).toBeGreaterThan(0);
            expect(loot.chance).toBeGreaterThan(0);
            expect(loot.chance).toBeLessThanOrEqual(1);
          });
        });
      });
    });
  });

  describe('Balance Testing', () => {
    it('should have enemies with varying difficulty', () => {
      const healthValues = enemyIds.map(id => enemies[id as keyof typeof enemies].health);
      const uniqueHealth = new Set(healthValues);
      expect(uniqueHealth.size).toBeGreaterThan(5); // At least 6 different health values
    });

    it('should have appropriate gold scaling', () => {
      enemyIds.forEach(enemyId => {
        const enemy = enemies[enemyId as keyof typeof enemies];
        // Stronger enemies (more HP) should generally give more gold
        // This is a soft check - gold should be roughly proportional
        const goldPerHP = enemy.goldReward / enemy.health;
        expect(goldPerHP).toBeGreaterThan(0);
        expect(goldPerHP).toBeLessThan(5); // Reasonable upper bound
      });
    });

    it('should have boss enemies with high stats', () => {
      const bossEnemies = ['dragon', 'ice_golem', 'fire_elemental', 'demon_lord'];

      bossEnemies.forEach(bossId => {
        if (enemies[bossId as keyof typeof enemies]) {
          const boss = enemies[bossId as keyof typeof enemies];
          expect(boss.health).toBeGreaterThanOrEqual(90);
          expect(boss.goldReward).toBeGreaterThanOrEqual(80);
        }
      });
    });

    it('should have starter enemies with low stats', () => {
      const starterEnemies = ['slime', 'rat', 'bat'];

      starterEnemies.forEach(starterId => {
        if (enemies[starterId as keyof typeof enemies]) {
          const starter = enemies[starterId as keyof typeof enemies];
          expect(starter.health).toBeLessThanOrEqual(30);
          expect(starter.goldReward).toBeLessThanOrEqual(10);
        }
      });
    });
  });

  describe('New Enemies Specific Tests', () => {
    it('Giant Rat should be weakest enemy', () => {
      const rat = enemies.rat;
      expect(rat.health).toBe(20);
      expect(rat.attack).toBe(3);
      expect(rat.defense).toBe(1);
      expect(rat.goldReward).toBe(5);
    });

    it('Demon Lord should be ultimate boss', () => {
      const demonLord = enemies.demon_lord;
      expect(demonLord.health).toBe(150);
      expect(demonLord.attack).toBe(20);
      expect(demonLord.defense).toBe(10);
      expect(demonLord.goldReward).toBe(150);
      expect(demonLord.description).toContain('Ultimate Boss');
    });

    it('Ice Golem should be a defensive boss', () => {
      const iceGolem = enemies.ice_golem;
      expect(iceGolem.defense).toBeGreaterThanOrEqual(12);
      expect(iceGolem.description).toContain('Boss');
    });

    it('Fire Elemental should be an offensive boss', () => {
      const fireElemental = enemies.fire_elemental;
      expect(fireElemental.attack).toBeGreaterThanOrEqual(18);
      expect(fireElemental.description).toContain('Boss');
    });

    it('Forest Troll should be tanky', () => {
      const troll = enemies.troll;
      expect(troll.health).toBe(80);
      expect(troll.defense).toBe(10);
    });

    it('Boss enemies should have better loot', () => {
      const bossEnemies = ['ice_golem', 'fire_elemental', 'demon_lord'];

      bossEnemies.forEach(bossId => {
        const boss = enemies[bossId as keyof typeof enemies];
        const hasHighValueLoot = boss.lootTable.some(loot =>
          ['dragon_fruit', 'fire_pepper', 'premium_meat'].includes(loot.itemId)
        );
        expect(hasHighValueLoot).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should reference only valid ingredient IDs', () => {
      // These are the ingredients we know exist
      const validIngredients = [
        'jelly', 'sugar', 'mushroom', 'herb', 'meat',
        'dragon_fruit', 'fire_pepper', 'premium_meat',
        'flour', 'salt', 'egg', 'onion', 'garlic', 'rice',
        'fish', 'cheese', 'honey', 'spice_blend', 'butter', 'tomato',
        'truffle', 'saffron', 'crystal_salt', 'phoenix_egg', 'mana_herb', 'ancient_grain',
        'void_essence', 'celestial_nectar'
      ];

      enemyIds.forEach(enemyId => {
        const enemy = enemies[enemyId as keyof typeof enemies];
        enemy.lootTable.forEach(loot => {
          expect(validIngredients).toContain(loot.itemId);
        });
      });
    });

    it('should have appropriate loot distribution', () => {
      enemyIds.forEach(enemyId => {
        const enemy = enemies[enemyId as keyof typeof enemies];

        // Each enemy should have 1-5 different loot items
        expect(enemy.lootTable.length).toBeGreaterThanOrEqual(1);
        expect(enemy.lootTable.length).toBeLessThanOrEqual(5);

        // No duplicate items in loot table
        const itemIds = enemy.lootTable.map(l => l.itemId);
        const uniqueItemIds = new Set(itemIds);
        expect(uniqueItemIds.size).toBe(itemIds.length);
      });
    });
  });
});
