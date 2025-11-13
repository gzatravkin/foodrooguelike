/**
 * CookingScreen - Preact component for cooking
 */

import { useState } from 'preact/hooks';
import { useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { cookingSystem } from '../../systems/CookingSystem';
import { entityFactory } from '../../entities/EntityFactory';
import type { Ingredient, CookingMethod, Dish } from '../../entities/types';
import { ScreenContainer, ContentWrapper, GridLayout, ScreenHeader } from '../common/Layout';
import { SectionTitle } from '../common/Display';
import { CloseButton, ActionButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { colors, commonStyles } from '../../styles/theme';

export function CookingScreen() {
    const inventory = useGameState(state => state.inventory);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('boil');
    const [cookingTime, setCookingTime] = useState(30);
    const [lastDish, setLastDish] = useState<Dish | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<string>('');

    // Group ingredients by ID and count them
    const ingredientCounts = inventory.reduce((acc, id) => {
        const template = entityFactory.getTemplate(id);
        if (template?.type === 'ingredient') {
            acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const ingredients = Object.keys(ingredientCounts)
        .map(id => ({
            ...entityFactory.getTemplate(id) as Ingredient,
            count: ingredientCounts[id]
        }))
        .filter(item => item) as (Ingredient & { count: number })[];

    const methods = (entityFactory.getAllOfType('cookingMethod') as CookingMethod[])
        .filter(method => method.unlocked !== false);

    const savedRecipes = gameState.getSavedRecipeConfigs();

    const toggleIngredient = (ingredientId: string) => {
        if (selectedIngredients.includes(ingredientId)) {
            setSelectedIngredients(selectedIngredients.filter(id => id !== ingredientId));
        } else if (selectedIngredients.length < 5) {
            setSelectedIngredients([...selectedIngredients, ingredientId]);
        }
    };

    const loadRecipe = (recipeId: string) => {
        const recipe = savedRecipes.find(r => r.recipeId === recipeId);
        if (recipe) {
            setSelectedRecipe(recipeId);
            // Find ingredients in inventory that match recipe
            const availableIngredients = recipe.ingredientTemplates.filter(templateId =>
                inventory.includes(templateId)
            );
            setSelectedIngredients(availableIngredients);
            setSelectedMethod(recipe.methodId);
            setCookingTime(recipe.cookingTime);
        }
    };

    const cook = () => {
        if (selectedIngredients.length === 0 || !selectedMethod) {
            return;
        }

        // Remove ingredients from inventory
        selectedIngredients.forEach(id => {
            gameState.removeFromInventory(id);
        });

        const dish = cookingSystem.cook(selectedIngredients, selectedMethod, cookingTime);
        gameState.addDish(dish.id);
        entityFactory.registerTemplate(dish.id, dish);

        setLastDish(dish);
        setSelectedIngredients([]);
        // Keep selectedMethod and cookingTime so user doesn't have to reselect
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="COOKING" emoji="🍳" />

            {lastDish && (
                <Card style={`background: #2E7D32; border-color: ${colors.success}; margin-bottom: 8px; padding: 12px; max-width: 600px;`}>
                    <CardTitle style="font-size: 16px;">✓ Cooked: {lastDish.name}</CardTitle>
                    <p style="font-size: 14px; margin: 6px 0;">{lastDish.description}</p>
                    <CardEffect style="font-size: 12px;">
                        Quality: {lastDish.quality.toFixed(2)} | HP: +{lastDish.effects?.health || 0}, ATK: +{lastDish.effects?.attack || 0}, DEF: +{lastDish.effects?.defense || 0}
                    </CardEffect>
                </Card>
            )}

            <ContentWrapper style="max-width: 700px;">
                {/* Saved Recipes */}
                {savedRecipes.length > 0 && (
                    <>
                        <SectionTitle style="font-size: 16px; margin-bottom: 8px;">Known Recipes</SectionTitle>
                        <select
                            value={selectedRecipe}
                            onChange={(e) => loadRecipe((e.target as HTMLSelectElement).value)}
                            style={`width: 100%; max-width: 500px; padding: 8px; margin-bottom: 16px; font-size: 14px; background: ${colors.bgMedium}; color: white; border: 1px solid ${colors.borderDark}; border-radius: 6px;`}
                        >
                            <option value="">Select a recipe...</option>
                            {savedRecipes.map(recipe => (
                                <option key={recipe.recipeId} value={recipe.recipeId}>
                                    {recipe.recipeName} ({recipe.methodId})
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Ingredients Selection */}
                <SectionTitle style="font-size: 16px; margin-bottom: 8px;">Select Ingredients (Max 5)</SectionTitle>
                <p style={`color: ${colors.textMuted}; margin-bottom: 10px; font-size: 14px;`}>
                    Selected: {selectedIngredients.length}/5
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
                    {ingredients.map(ingredient => {
                        const isSelected = selectedIngredients.includes(ingredient.id);
                        return (
                            <Card
                                key={ingredient.id}
                                isSelected={isSelected}
                                onClick={() => toggleIngredient(ingredient.id)}
                                style="padding: 10px; cursor: pointer; min-width: 0; position: relative;"
                            >
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    {ingredient.icon && <span style="font-size: 20px;">{ingredient.icon}</span>}
                                    <CardTitle style="font-size: 14px; margin: 0;">{ingredient.name}</CardTitle>
                                    {ingredient.count > 1 && (
                                        <span style="font-size: 14px; color: #FFD700; font-weight: bold; margin-left: auto;">
                                            x{ingredient.count}
                                        </span>
                                    )}
                                </div>
                                <p style="font-size: 12px; margin: 6px 0; line-height: 1.3;">{ingredient.description}</p>
                                <CardEffect style="font-size: 12px;">
                                    {ingredient.rarity} | {ingredient.baseValue}g
                                </CardEffect>
                            </Card>
                        );
                    })}
                </div>

                {ingredients.length === 0 && (
                    <p style={`color: ${colors.textMuted}; text-align: center; padding: 20px; font-size: 14px;`}>
                        No ingredients available. Go on expeditions to gather ingredients!
                    </p>
                )}

                {/* Cooking Method Selection */}
                <SectionTitle style="font-size: 16px; margin-bottom: 8px;">Select Cooking Method</SectionTitle>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                    {methods.map(method => (
                        <ActionButton
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={`padding: 8px 16px; font-size: 14px; min-width: 80px; ${selectedMethod === method.id ? commonStyles.activeTab : ''}`}
                        >
                            {method.name}
                        </ActionButton>
                    ))}
                </div>

                {/* Cooking Time */}
                <SectionTitle style="font-size: 16px; margin-bottom: 8px;">Cooking Time</SectionTitle>
                <input
                    type="range"
                    min="10"
                    max="120"
                    value={cookingTime}
                    onInput={(e) => setCookingTime(parseInt((e.target as HTMLInputElement).value))}
                    style="width: 100%; max-width: 500px; margin-bottom: 6px;"
                />
                <p style="font-size: 14px; margin-bottom: 20px;">{cookingTime} seconds</p>

                {/* Cook Button */}
                <button
                    class="button"
                    onClick={cook}
                    disabled={selectedIngredients.length === 0 || !selectedMethod}
                    style="margin-top: 10px; padding: 12px 30px; font-size: 16px; background: #FF6B35;"
                >
                    🍳 COOK! 🍳
                </button>
            </ContentWrapper>

            <CloseButton />

            <p style={`color: ${colors.textMuted}; margin-top: 16px; font-size: 12px;`}>Press ESC to close</p>
        </ScreenContainer>
    );
}
