import { describe, it, expect, beforeEach } from 'vitest';
import { CookingSystem } from './CookingSystem';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';

describe('CookingSystem Balance Tests', () => {
  let cookingSystem: CookingSystem;

  beforeEach(() => {
    cookingSystem = new CookingSystem();
    gameState.reset();

    // Register mock ingredients
    entityFactory.registerTemplates({
      jelly: {
        id: 'jelly',
        type: 'ingredient',
        name: 'Jelly',
        baseValue: 5
      },
      sugar: {
        id: 'sugar',
        type: 'ingredient',
        name: 'Sugar',
        baseValue: 3
      },
      mushroom: {
        id: 'mushroom',
        type: 'ingredient',
        name: 'Mushroom',
        baseValue: 8
      },
      dragon_fruit: {
        id: 'dragon_fruit',
        type: 'ingredient',
        name: 'Dragon Fruit',
        baseValue: 50
      },
      fire_pepper: {
        id: 'fire_pepper',
        type: 'ingredient',
        name: 'Fire Pepper',
        baseValue: 40
      },
      premium_meat: {
        id: 'premium_meat',
        type: 'ingredient',
        name: 'Premium Meat',
        baseValue: 60
      }
    });

    // Register cooking methods
    entityFactory.registerTemplates({
      boil: {
        id: 'boil',
        type: 'cookingMethod',
        name: 'Boil',
        qualityModifier: 1.0
      },
      fry: {
        id: 'fry',
        type: 'cookingMethod',
        name: 'Fry',
        qualityModifier: 1.1
      },
      grill: {
        id: 'grill',
        type: 'cookingMethod',
        name: 'Grill',
        qualityModifier: 1.2
      },
      bake: {
        id: 'bake',
        type: 'cookingMethod',
        name: 'Bake',
        qualityModifier: 1.3
      }
    });
  });

  describe('Quality Range', () => {
    it('should generate quality between 60% and 100%', () => {
      // Add ingredients to inventory
      for (let i = 0; i < 100; i++) {
        gameState.addToInventory('jelly');
        gameState.addToInventory('sugar');
      }

      const qualities: number[] = [];
      for (let i = 0; i < 100; i++) {
        const dish = cookingSystem.cook(['jelly', 'sugar'], 'boil');
        qualities.push(dish.quality);
      }

      // Check all qualities are in range
      qualities.forEach(quality => {
        expect(quality).toBeGreaterThanOrEqual(0.6);
        expect(quality).toBeLessThanOrEqual(1.0);
      });

      // Check we get variety (not all the same)
      const uniqueQualities = new Set(qualities);
      expect(uniqueQualities.size).toBeGreaterThan(10);
    });
  });

  describe('Dish Value Calculation', () => {
    beforeEach(() => {
      // Add ingredients for testing
      gameState.addToInventory('jelly');
      gameState.addToInventory('sugar');
      gameState.addToInventory('mushroom');
      gameState.addToInventory('dragon_fruit');
      gameState.addToInventory('fire_pepper');
      gameState.addToInventory('premium_meat');
    });

    it('should calculate value based on ingredient worth', () => {
      const dish = cookingSystem.cook(['jelly', 'sugar'], 'boil');

      // jelly (5) + sugar (3) = 8 base value
      // 8 * 2.5 * quality * 1.0 (boil modifier) = 20 * quality
      // Quality is 60-100%, so value should be 12-20
      expect(dish.value).toBeGreaterThanOrEqual(12);
      expect(dish.value).toBeLessThanOrEqual(20);
    });

    it('should make cooking profitable vs selling ingredients', () => {
      const dish = cookingSystem.cook(['jelly', 'mushroom'], 'boil');

      // jelly (5) + mushroom (8) = 13 base value
      // 13 * 2.5 * quality * 1.0 = 32.5 * quality
      // Quality is 60-100%, so value should be ~20-33
      // Raw ingredients worth 13, dish worth 20-33 = profitable!
      expect(dish.value).toBeGreaterThan(13);
    });

    it('should apply cooking method modifiers correctly', () => {
      // Add more ingredients
      gameState.addToInventory('jelly');
      gameState.addToInventory('jelly');
      gameState.addToInventory('jelly');

      // Test with different methods (we can't control quality, so we test relative differences)
      // Over many iterations, bake should average higher than fry
      const fryValues: number[] = [];
      const bakeValues: number[] = [];

      for (let i = 0; i < 20; i++) {
        gameState.addToInventory('jelly');
        const dishFry = cookingSystem.cook(['jelly'], 'fry');
        fryValues.push(dishFry.value);

        gameState.addToInventory('jelly');
        const dishBake = cookingSystem.cook(['jelly'], 'bake');
        bakeValues.push(dishBake.value);
      }

      const avgFry = fryValues.reduce((a, b) => a + b, 0) / fryValues.length;
      const avgBake = bakeValues.reduce((a, b) => a + b, 0) / bakeValues.length;

      // Bake (1.3x) should average ~18% higher than fry (1.1x)
      expect(avgBake).toBeGreaterThan(avgFry);
    });

    it('should create high value dishes with rare ingredients', () => {
      const dish = cookingSystem.cook(['dragon_fruit', 'fire_pepper', 'premium_meat'], 'bake');

      // dragon_fruit (50) + fire_pepper (40) + premium_meat (60) = 150
      // 150 * 2.5 * quality * 1.3 (bake) = 487.5 * quality
      // Quality is 60-100%, so value should be ~292-488
      expect(dish.value).toBeGreaterThan(290);
      expect(dish.value).toBeLessThan(490);

      // Much more valuable than selling raw (150g)
      expect(dish.value).toBeGreaterThan(150);
    });
  });

  describe('Cooking Profitability Scenarios', () => {
    it('common ingredients should be profitable to cook', () => {
      gameState.addToInventory('jelly');
      gameState.addToInventory('mushroom');
      gameState.addToInventory('sugar');

      const dish = cookingSystem.cook(['jelly', 'mushroom', 'sugar'], 'boil');

      // jelly (5) + mushroom (8) + sugar (3) = 16 base
      // 16 * 2.5 * 0.6-1.0 * 1.0 = 24-40 value
      const rawValue = 16;
      expect(dish.value).toBeGreaterThan(rawValue * 1.3); // At least 30% profit
    });

    it('rare ingredients with bake method should be highly profitable', () => {
      gameState.addToInventory('dragon_fruit');
      gameState.addToInventory('fire_pepper');

      const dish = cookingSystem.cook(['dragon_fruit', 'fire_pepper'], 'bake');

      // dragon_fruit (50) + fire_pepper (40) = 90 base
      // 90 * 2.5 * 0.6-1.0 * 1.3 = 175-292 value
      const rawValue = 90;
      expect(dish.value).toBeGreaterThan(rawValue * 1.5); // At least 50% profit
    });
  });
});
