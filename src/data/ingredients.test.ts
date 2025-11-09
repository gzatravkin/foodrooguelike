import { describe, it, expect } from 'vitest';
import ingredients from './ingredients.json';

describe('Ingredients Data', () => {
  const ingredientIds = Object.keys(ingredients);

  it('should have at least 28 ingredients', () => {
    expect(ingredientIds.length).toBeGreaterThanOrEqual(28);
  });

  it('should include all new ingredients', () => {
    const newIngredients = [
      'flour', 'salt', 'egg', 'onion', 'garlic', 'rice',
      'fish', 'cheese', 'honey', 'spice_blend', 'butter', 'tomato',
      'truffle', 'saffron', 'crystal_salt', 'phoenix_egg', 'mana_herb', 'ancient_grain',
      'void_essence', 'celestial_nectar'
    ];

    newIngredients.forEach(ingredientId => {
      expect(ingredients).toHaveProperty(ingredientId);
    });
  });

  describe('Ingredient Structure Validation', () => {
    ingredientIds.forEach(ingredientId => {
      describe(`Ingredient: ${ingredientId}`, () => {
        const ingredient = ingredients[ingredientId as keyof typeof ingredients];

        it('should have required fields', () => {
          expect(ingredient).toHaveProperty('id');
          expect(ingredient).toHaveProperty('type');
          expect(ingredient).toHaveProperty('name');
          expect(ingredient).toHaveProperty('description');
          expect(ingredient).toHaveProperty('rarity');
          expect(ingredient).toHaveProperty('baseValue');
        });

        it('should have correct type', () => {
          expect(ingredient.type).toBe('ingredient');
        });

        it('should have matching id', () => {
          expect(ingredient.id).toBe(ingredientId);
        });

        it('should have non-empty name and description', () => {
          expect(ingredient.name.length).toBeGreaterThan(0);
          expect(ingredient.description.length).toBeGreaterThan(0);
        });

        it('should have valid rarity', () => {
          const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
          expect(validRarities).toContain(ingredient.rarity);
        });

        it('should have positive base value', () => {
          expect(ingredient.baseValue).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Rarity Distribution', () => {
    it('should have ingredients of all rarity tiers', () => {
      const rarities = ingredientIds.map(id => ingredients[id as keyof typeof ingredients].rarity);
      const uniqueRarities = new Set(rarities);

      expect(uniqueRarities).toContain('common');
      expect(uniqueRarities).toContain('uncommon');
      expect(uniqueRarities).toContain('rare');
      expect(uniqueRarities).toContain('legendary');
    });

    it('should have at least 10 common ingredients', () => {
      const commonIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'common'
      );
      expect(commonIngredients.length).toBeGreaterThanOrEqual(10);
    });

    it('should have at least 7 uncommon ingredients', () => {
      const uncommonIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'uncommon'
      );
      expect(uncommonIngredients.length).toBeGreaterThanOrEqual(7);
    });

    it('should have at least 9 rare ingredients', () => {
      const rareIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'rare'
      );
      expect(rareIngredients.length).toBeGreaterThanOrEqual(9);
    });

    it('should have at least 2 legendary ingredients', () => {
      const legendaryIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'legendary'
      );
      expect(legendaryIngredients.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Value Scaling by Rarity', () => {
    it('common ingredients should have low values (3-10)', () => {
      const commonIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'common'
      );

      commonIngredients.forEach(id => {
        const ingredient = ingredients[id as keyof typeof ingredients];
        expect(ingredient.baseValue).toBeGreaterThanOrEqual(3);
        expect(ingredient.baseValue).toBeLessThanOrEqual(10);
      });
    });

    it('uncommon ingredients should have medium values (10-25)', () => {
      const uncommonIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'uncommon'
      );

      uncommonIngredients.forEach(id => {
        const ingredient = ingredients[id as keyof typeof ingredients];
        expect(ingredient.baseValue).toBeGreaterThanOrEqual(10);
        expect(ingredient.baseValue).toBeLessThanOrEqual(25);
      });
    });

    it('rare ingredients should have high values (35-70)', () => {
      const rareIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'rare'
      );

      rareIngredients.forEach(id => {
        const ingredient = ingredients[id as keyof typeof ingredients];
        expect(ingredient.baseValue).toBeGreaterThanOrEqual(35);
        expect(ingredient.baseValue).toBeLessThanOrEqual(70);
      });
    });

    it('legendary ingredients should have very high values (100+)', () => {
      const legendaryIngredients = ingredientIds.filter(
        id => ingredients[id as keyof typeof ingredients].rarity === 'legendary'
      );

      legendaryIngredients.forEach(id => {
        const ingredient = ingredients[id as keyof typeof ingredients];
        expect(ingredient.baseValue).toBeGreaterThanOrEqual(100);
      });
    });

    it('should have value progression across rarities', () => {
      const avgByRarity = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0
      };

      Object.keys(avgByRarity).forEach(rarity => {
        const items = ingredientIds.filter(
          id => ingredients[id as keyof typeof ingredients].rarity === rarity
        );
        const sum = items.reduce((acc, id) =>
          acc + ingredients[id as keyof typeof ingredients].baseValue, 0
        );
        avgByRarity[rarity as keyof typeof avgByRarity] = sum / items.length;
      });

      // Average values should increase with rarity
      expect(avgByRarity.uncommon).toBeGreaterThan(avgByRarity.common);
      expect(avgByRarity.rare).toBeGreaterThan(avgByRarity.uncommon);
      expect(avgByRarity.legendary).toBeGreaterThan(avgByRarity.rare);
    });
  });

  describe('New Ingredients Specific Tests', () => {
    describe('Common Tier', () => {
      it('Flour should be a basic baking ingredient', () => {
        const flour = ingredients.flour;
        expect(flour.name).toBe('Flour');
        expect(flour.rarity).toBe('common');
        expect(flour.baseValue).toBe(4);
        expect(flour.description).toContain('baking');
      });

      it('Salt should be cheap and essential', () => {
        const salt = ingredients.salt;
        expect(salt.rarity).toBe('common');
        expect(salt.baseValue).toBe(3);
        expect(salt.description).toContain('seasoning');
      });
    });

    describe('Uncommon Tier', () => {
      it('Honey should have moderate value', () => {
        const honey = ingredients.honey;
        expect(honey.rarity).toBe('uncommon');
        expect(honey.baseValue).toBe(20);
        expect(honey.description).toContain('nectar');
      });

      it('Fish should be a protein source', () => {
        const fish = ingredients.fish;
        expect(fish.rarity).toBe('uncommon');
        expect(fish.baseValue).toBe(15);
      });
    });

    describe('Rare Tier', () => {
      it('Truffle should be expensive delicacy', () => {
        const truffle = ingredients.truffle;
        expect(truffle.rarity).toBe('rare');
        expect(truffle.baseValue).toBe(55);
        expect(truffle.description).toContain('delicacy');
      });

      it('Phoenix Egg should be mythical', () => {
        const phoenixEgg = ingredients.phoenix_egg;
        expect(phoenixEgg.rarity).toBe('rare');
        expect(phoenixEgg.baseValue).toBe(65);
        expect(phoenixEgg.description).toContain('mythical');
      });

      it('Saffron should be worlds most expensive spice', () => {
        const saffron = ingredients.saffron;
        expect(saffron.rarity).toBe('rare');
        expect(saffron.description).toContain('expensive');
      });
    });

    describe('Legendary Tier', () => {
      it('Void Essence should be top-tier cosmic ingredient', () => {
        const voidEssence = ingredients.void_essence;
        expect(voidEssence.rarity).toBe('legendary');
        expect(voidEssence.baseValue).toBe(150);
        expect(voidEssence.description).toContain('void');
      });

      it('Celestial Nectar should be divine and most valuable', () => {
        const celestialNectar = ingredients.celestial_nectar;
        expect(celestialNectar.rarity).toBe('legendary');
        expect(celestialNectar.baseValue).toBe(200);
        expect(celestialNectar.description).toContain('Divine');
      });

      it('Celestial Nectar should be the most valuable ingredient', () => {
        const allValues = ingredientIds.map(
          id => ingredients[id as keyof typeof ingredients].baseValue
        );
        const maxValue = Math.max(...allValues);
        expect(ingredients.celestial_nectar.baseValue).toBe(maxValue);
      });
    });
  });

  describe('Balance Testing', () => {
    it('should have diverse value distribution', () => {
      const values = ingredientIds.map(id => ingredients[id as keyof typeof ingredients].baseValue);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBeGreaterThan(15); // At least 16 different values
    });

    it('should have reasonable value gaps between tiers', () => {
      // Common max should be less than uncommon min
      const commonValues = ingredientIds
        .filter(id => ingredients[id as keyof typeof ingredients].rarity === 'common')
        .map(id => ingredients[id as keyof typeof ingredients].baseValue);
      const uncommonValues = ingredientIds
        .filter(id => ingredients[id as keyof typeof ingredients].rarity === 'uncommon')
        .map(id => ingredients[id as keyof typeof ingredients].baseValue);

      const maxCommon = Math.max(...commonValues);
      const minUncommon = Math.min(...uncommonValues);

      // Allow some overlap but ensure progression
      expect(minUncommon).toBeGreaterThanOrEqual(maxCommon - 2);
    });
  });
});
