/**
 * RecipeMatchingService - Handles recipe matching and quality calculation
 */

import { entityFactory } from '../entities/EntityFactory';
import type { Recipe } from '../entities/types';

export class RecipeMatchingService {
    findBestRecipeMatch(
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
}

export const recipeMatchingService = new RecipeMatchingService();
