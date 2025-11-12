/**
 * RecipeBookScreen - Preact component for recipe book
 */

import { useEffect } from 'preact/hooks';
import { useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { cookingSystem } from '../../systems/CookingSystem';
import { entityFactory } from '../../entities/EntityFactory';
import type { Recipe } from '../../entities/types';

interface RecipeCardProps {
    recipe: Recipe;
    discovered: boolean;
}

function RecipeCard({ recipe, discovered }: RecipeCardProps) {
    const rarityColors: Record<string, string> = {
        common: '#AAA',
        uncommon: '#90EE90',
        rare: '#4AA5FF',
        legendary: '#FFD700'
    };

    const color = rarityColors[recipe.rarity] || '#AAA';

    if (!discovered) {
        return (
            <div class="card" style="opacity: 0.5;">
                <h3 style={`color: ${color};`}>???</h3>
                <p>Rarity: {recipe.rarity}</p>
                <p style="font-style: italic;">Ingredients: ???</p>
            </div>
        );
    }

    const ingredients = recipe.ingredients
        .map(id => entityFactory.getTemplate(id)?.name || id)
        .join(', ');

    return (
        <div class="card">
            <h3 style={`color: ${color};`}>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <p style="color: #90EE90;">Ingredients: {ingredients}</p>
            <p style="color: #AAA;">Method: {recipe.cookingMethod}</p>
            <p style="color: #FFD700;">
                Buff Type: {recipe.buffType} | Rarity: {recipe.rarity}
            </p>
        </div>
    );
}

export function RecipeBookScreen() {
    const discoveredRecipeIds = cookingSystem.getDiscoveredRecipes();
    const allRecipes = entityFactory.getAllRecipes();

    const discovered: Recipe[] = [];
    const undiscovered: Recipe[] = [];

    for (const recipe of allRecipes) {
        if (discoveredRecipeIds.includes(recipe.id)) {
            discovered.push(recipe);
        } else {
            undiscovered.push(recipe);
        }
    }

    const rarityOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3 };
    discovered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
    undiscovered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

    // Handle escape key to close screen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                gameState.setScreen('game');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div class="screen">
            <h1>📖 RECIPE BOOK</h1>
            <p style="color: #90EE90;">
                Discovered: {discovered.length} / {allRecipes.length}
            </p>

            {discovered.length > 0 && (
                <>
                    <h2 style="color: #FFD700; margin-top: 30px;">DISCOVERED RECIPES</h2>
                    <div class="grid-2col">
                        {discovered.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} discovered={true} />
                        ))}
                    </div>
                </>
            )}

            {undiscovered.length > 0 && (
                <>
                    <h2 style="color: #888; margin-top: 30px;">UNDISCOVERED RECIPES</h2>
                    <div class="grid-2col">
                        {undiscovered.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} discovered={false} />
                        ))}
                    </div>
                </>
            )}

            <button
                class="button"
                onClick={() => gameState.setScreen('game')}
                style="margin-top: 30px;"
            >
                ✕ CLOSE
            </button>
        </div>
    );
}
