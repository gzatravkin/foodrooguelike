/**
 * DishCreationService - Handles dish creation, effects calculation, and naming
 */

import { entityFactory } from '../entities/EntityFactory';
import type { Dish, Recipe } from '../entities/types';

export class DishCreationService {
    createDishFromRecipe(
        recipe: Recipe | null,
        ingredientIds: string[],
        cookingMethodId: string,
        cookingTime: number,
        quality: number
    ): Dish {
        // Calculate base value from ingredients
        let baseValue = 0;
        for (const ingredientId of ingredientIds) {
            const ingredient = entityFactory.getTemplate(ingredientId);
            if (ingredient && 'baseValue' in ingredient) {
                baseValue += (ingredient as any).baseValue;
            }
        }

        // Apply cooking method modifier
        const method = entityFactory.getTemplate(cookingMethodId);
        const methodModifier = (method as any)?.qualityModifier || 1.0;

        // Calculate final value
        const value = Math.floor(baseValue * methodModifier * quality * 2.5);

        // Determine dish properties based on recipe or fallback
        const recipeId = recipe?.id || 'unknown_dish';
        const name = recipe?.name || this.generateDishName(ingredientIds, cookingMethodId);
        const description = recipe?.description || 'An improvised dish';
        const rarity = recipe?.rarity || 'common';
        const buffType = recipe?.buffType || this.inferBuffType(ingredientIds);

        // Calculate effects based on quality and buffType
        const effects = this.calculateDishEffects(quality, buffType, rarity);

        return {
            id: `dish_${Date.now()}`,
            type: 'dish',
            recipeId,
            name,
            description,
            ingredients: ingredientIds,
            cookingMethod: cookingMethodId,
            cookingTime,
            quality,
            value,
            rarity,
            buffType,
            effects
        };
    }

    calculateDishEffects(
        quality: number,
        buffType: 'health' | 'attack' | 'defense',
        rarity: string
    ): Dish['effects'] {
        // Base effect strength based on quality and rarity
        const rarityMultiplier = {
            common: 1.0,
            uncommon: 1.5,
            rare: 2.5,
            legendary: 4.0
        }[rarity] || 1.0;

        const baseEffect = Math.floor(quality * 20 * rarityMultiplier);
        const duration = Math.floor(60 + quality * 120); // 60-180 seconds

        switch (buffType) {
            case 'health':
                return {
                    health: baseEffect,
                    duration: 0 // Instant heal
                };
            case 'attack':
                return {
                    attack: Math.floor(baseEffect * 0.5),
                    duration
                };
            case 'defense':
                return {
                    defense: Math.floor(baseEffect * 0.3),
                    duration
                };
        }
    }

    private generateDishName(ingredientIds: string[], cookingMethodId: string): string {
        const method = entityFactory.getTemplate(cookingMethodId);
        const methodName = method?.name || 'Cooked';

        const firstIngredient = entityFactory.getTemplate(ingredientIds[0]);
        const ingredientName = firstIngredient?.name || 'Mystery';

        return `${methodName} ${ingredientName}`;
    }

    private inferBuffType(ingredientIds: string[]): 'health' | 'attack' | 'defense' {
        // Simple heuristic: check ingredient names for keywords
        const ingredientNames = ingredientIds.map(id => {
            const ingredient = entityFactory.getTemplate(id);
            return ingredient?.name?.toLowerCase() || '';
        }).join(' ');

        if (ingredientNames.includes('meat') || ingredientNames.includes('pepper') || ingredientNames.includes('dragon')) {
            return 'attack';
        } else if (ingredientNames.includes('mushroom') || ingredientNames.includes('herb') || ingredientNames.includes('mana')) {
            return 'defense';
        }
        return 'health';
    }
}

export const dishCreationService = new DishCreationService();
