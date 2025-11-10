/**
 * CookingSystem - Handles cooking and recipe discovery with advanced matching
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import type { Dish, Recipe } from '../entities/types';

export class CookingSystem {
    cook(ingredientIds: string[], cookingMethodId: string, cookingTime: number): Dish {
        // Find best matching recipe
        const matchResult = this.findBestRecipeMatch(ingredientIds, cookingMethodId, cookingTime);
        const recipe = matchResult.recipe;
        let quality = matchResult.quality;

        // Apply kitchen upgrade bonuses to quality
        quality = this.applyUpgradeBonus(quality, cookingMethodId);

        // Discover recipe if it's a good match and not yet discovered
        if (recipe && quality >= 0.7 && !gameState.getState().discoveredRecipes.includes(recipe.id)) {
            gameState.discoverRecipe(recipe.id);
        }

        // Create the dish
        const dish = this.createDishFromRecipe(
            recipe,
            ingredientIds,
            cookingMethodId,
            cookingTime,
            quality
        );

        // Remove ingredients from inventory (with chance to preserve from upgrades)
        const preserveChance = this.getIngredientPreserveChance();
        ingredientIds.forEach(id => {
            if (Math.random() > preserveChance) {
                gameState.removeFromInventory(id);
            }
        });

        eventBus.emit('cooking:completed', dish);
        return dish;
    }

    private applyUpgradeBonus(baseQuality: number, cookingMethodId: string): number {
        const upgrades = gameState.getState().upgrades.kitchen;
        let qualityBonus = 0;

        // Master Cookware - applies to all cooking methods
        const masterCookware = upgrades.find(u => u.id === 'master_cookware');
        if (masterCookware) {
            qualityBonus += masterCookware.level * 0.05;
        }

        // Method-specific upgrades
        if (cookingMethodId === 'bake') {
            const betterOven = upgrades.find(u => u.id === 'better_oven');
            if (betterOven) {
                qualityBonus += betterOven.level * 0.10;
            }
        } else if (cookingMethodId === 'grill') {
            const premiumGrill = upgrades.find(u => u.id === 'premium_grill');
            if (premiumGrill) {
                qualityBonus += premiumGrill.level * 0.10;
            }
        } else if (cookingMethodId === 'fry') {
            const professionalFryer = upgrades.find(u => u.id === 'professional_fryer');
            if (professionalFryer) {
                qualityBonus += professionalFryer.level * 0.10;
            }
        }

        return Math.min(1.0, baseQuality + qualityBonus);
    }

    private getIngredientPreserveChance(): number {
        const upgrades = gameState.getState().upgrades.kitchen;
        const ingredientPreserver = upgrades.find(u => u.id === 'ingredient_preserver');
        if (ingredientPreserver) {
            return ingredientPreserver.level * 0.05; // 5% per level
        }
        return 0;
    }

    private findBestRecipeMatch(
        ingredientIds: string[],
        cookingMethodId: string,
        cookingTime: number
    ): { recipe: Recipe | null; quality: number } {
        const allRecipes = entityFactory.getAllOfType('recipe') as Recipe[];
        let bestMatch: Recipe | null = null;
        let bestQuality = 0;

        for (const recipe of allRecipes) {
            const quality = this.calculateRecipeMatchQuality(
                ingredientIds,
                cookingMethodId,
                cookingTime,
                recipe
            );

            if (quality > bestQuality) {
                bestQuality = quality;
                bestMatch = recipe;
            }
        }

        // If no good match found, return null recipe with base quality
        if (bestQuality < 0.3) {
            return { recipe: null, quality: 0.5 + Math.random() * 0.2 };
        }

        return { recipe: bestMatch, quality: bestQuality };
    }

    private calculateRecipeMatchQuality(
        ingredientIds: string[],
        cookingMethodId: string,
        cookingTime: number,
        recipe: Recipe
    ): number {
        let score = 0;

        // 1. Ingredient matching (60% of score)
        const playerIngredients = new Set(ingredientIds);
        const recipeIngredients = new Set(recipe.ingredients);

        // Check how many recipe ingredients are present
        let matchedIngredients = 0;
        for (const ingredient of recipeIngredients) {
            if (playerIngredients.has(ingredient)) {
                matchedIngredients++;
            }
        }

        // Penalize for missing ingredients or extra ingredients
        const ingredientMatchRatio = matchedIngredients / recipeIngredients.size;
        const extraIngredientPenalty = Math.max(0, playerIngredients.size - recipeIngredients.size) * 0.1;
        const ingredientScore = Math.max(0, ingredientMatchRatio - extraIngredientPenalty);
        score += ingredientScore * 0.6;

        // 2. Cooking method matching (20% of score)
        if (cookingMethodId === recipe.cookingMethod) {
            score += 0.2;
        }

        // 3. Cooking time matching (20% of score)
        const { min, max } = recipe.cookingTimeRange;
        const optimal = recipe.cookingTime;

        if (cookingTime >= min && cookingTime <= max) {
            // Within acceptable range - calculate how close to optimal
            const deviation = Math.abs(cookingTime - optimal);
            const maxDeviation = Math.max(optimal - min, max - optimal);
            const timeScore = 1 - (deviation / maxDeviation) * 0.5; // 50-100% within range
            score += timeScore * 0.2;
        } else {
            // Outside range - small penalty score
            const deviation = cookingTime < min ? (min - cookingTime) : (cookingTime - max);
            const timeScore = Math.max(0, 0.3 - (deviation / 60)); // Rapid decrease
            score += timeScore * 0.2;
        }

        return Math.min(1, Math.max(0, score));
    }

    private createDishFromRecipe(
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

    private calculateDishEffects(
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

    canCook(ingredientIds: string[]): boolean {
        const inventory = gameState.getState().inventory;
        return ingredientIds.every(id => inventory.includes(id));
    }

    getAvailableIngredients(): string[] {
        return gameState.getState().inventory.filter(id => {
            const template = entityFactory.getTemplate(id);
            return template?.type === 'ingredient';
        });
    }

    getAvailableMethods(): string[] {
        return entityFactory.getAllOfType('cookingMethod')
            .filter(m => (m as any).unlocked)
            .map(m => m.id);
    }

    getDiscoveredRecipes(): Recipe[] {
        const discoveredIds = gameState.getState().discoveredRecipes;
        return discoveredIds
            .map(id => entityFactory.getTemplate(id) as Recipe)
            .filter(r => r !== null);
    }

    getAllRecipes(): Recipe[] {
        return entityFactory.getAllOfType('recipe') as Recipe[];
    }
}

export const cookingSystem = new CookingSystem();
