/**
 * CookingSystem - Handles cooking and recipe discovery with advanced matching
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import type { Dish, Recipe } from '../entities/types';
import { recipeMatchingService } from './RecipeMatchingService';
import { dishCreationService } from './DishCreationService';
import { upgradeBonusService } from './UpgradeBonusService';

export class CookingSystem {
    cook(ingredientIds: string[], cookingMethodId: string, cookingTime: number): Dish {
        // Find best matching recipe
        const matchResult = recipeMatchingService.findBestRecipeMatch(ingredientIds, cookingMethodId, cookingTime);
        const recipe = matchResult.recipe;
        let quality = matchResult.quality;

        // Apply kitchen upgrade bonuses to quality
        quality = upgradeBonusService.applyUpgradeBonus(quality, cookingMethodId);

        // Discover recipe if it's a good match and not yet discovered
        if (recipe && quality >= 0.7 && !gameState.getState().discoveredRecipes.includes(recipe.id)) {
            gameState.discoverRecipe(recipe.id);
        }

        // Create the dish
        const dish = dishCreationService.createDishFromRecipe(
            recipe,
            ingredientIds,
            cookingMethodId,
            cookingTime,
            quality
        );

        // Remove ingredients from inventory (with chance to preserve from upgrades)
        const preserveChance = upgradeBonusService.getIngredientPreserveChance();
        ingredientIds.forEach(id => {
            if (Math.random() > preserveChance) {
                gameState.removeFromInventory(id);
            }
        });

        eventBus.emit('cooking:completed', dish);
        return dish;
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
