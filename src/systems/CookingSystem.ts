/**
 * CookingSystem - Handles cooking and recipe discovery
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import type { Dish } from '../entities/types';

export class CookingSystem {
    cook(ingredientIds: string[], cookingMethodId: string): Dish {
        // Calculate quality based on randomness and method
        const method = entityFactory.getTemplate(cookingMethodId);
        const baseQuality = 0.5 + Math.random() * 0.5; // 50-100%
        const quality = Math.min(1, baseQuality * (method?.qualityModifier || 1));

        // Check if this is a known recipe
        const recipeId = this.getRecipeId(ingredientIds, cookingMethodId);
        if (recipeId && !gameState.getState().discoveredRecipes.includes(recipeId)) {
            gameState.discoverRecipe(recipeId);
        }

        // Create the dish
        const dish = entityFactory.createDish(
            recipeId || 'unknown',
            ingredientIds,
            cookingMethodId,
            quality
        );

        // Remove ingredients from inventory
        ingredientIds.forEach(id => gameState.removeFromInventory(id));

        eventBus.emit('cooking:completed', dish);
        return dish;
    }

    private getRecipeId(ingredientIds: string[], cookingMethodId: string): string {
        // Simple recipe matching: sorted ingredients + method
        const sorted = [...ingredientIds].sort();
        return `recipe_${sorted.join('_')}_${cookingMethodId}`;
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
}

export const cookingSystem = new CookingSystem();
