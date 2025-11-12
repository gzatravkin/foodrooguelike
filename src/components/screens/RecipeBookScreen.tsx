/**
 * RecipeBookScreen - Preact component for recipe book
 */

import { gameState } from '../../core/GameState';
import { cookingSystem } from '../../systems/CookingSystem';
import { entityFactory } from '../../entities/EntityFactory';
import type { Recipe } from '../../entities/types';
import { ScreenContainer, ScreenHeader, GridLayout } from '../common/Layout';
import { SectionTitle } from '../common/Display';
import { CloseButton } from '../common/Button';
import { Card, CardTitle } from '../common/Card';
import { colors } from '../../styles/theme';

interface RecipeCardProps {
    recipe: Recipe;
    discovered: boolean;
}

function RecipeCard({ recipe, discovered }: RecipeCardProps) {
    const rarityColors: Record<string, string> = {
        common: colors.textMuted,
        uncommon: colors.successLight,
        rare: '#4AA5FF',
        legendary: colors.gold
    };

    const color = rarityColors[recipe.rarity] || colors.textMuted;

    if (!discovered) {
        return (
            <Card style="opacity: 0.5;">
                <h3 style={`color: ${color};`}>???</h3>
                <p>Rarity: {recipe.rarity}</p>
                <p style="font-style: italic;">Ingredients: ???</p>
            </Card>
        );
    }

    const ingredients = recipe.ingredients
        .map(id => entityFactory.getTemplate(id)?.name || id)
        .join(', ');

    return (
        <Card>
            <h3 style={`color: ${color};`}>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <p style={`color: ${colors.successLight};`}>Ingredients: {ingredients}</p>
            <p style={`color: ${colors.textMuted};`}>Method: {recipe.cookingMethod}</p>
            <p style={`color: ${colors.gold};`}>
                Buff Type: {recipe.buffType} | Rarity: {recipe.rarity}
            </p>
        </Card>
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

    return (
        <ScreenContainer>
            <ScreenHeader title="RECIPE BOOK" emoji="📖" />
            <p style={`color: ${colors.successLight};`}>
                Discovered: {discovered.length} / {allRecipes.length}
            </p>

            {discovered.length > 0 && (
                <>
                    <SectionTitle>DISCOVERED RECIPES</SectionTitle>
                    <GridLayout>
                        {discovered.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} discovered={true} />
                        ))}
                    </GridLayout>
                </>
            )}

            {undiscovered.length > 0 && (
                <>
                    <SectionTitle style={`color: ${colors.textDark};`}>UNDISCOVERED RECIPES</SectionTitle>
                    <GridLayout>
                        {undiscovered.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} discovered={false} />
                        ))}
                    </GridLayout>
                </>
            )}

            <CloseButton />
        </ScreenContainer>
    );
}
