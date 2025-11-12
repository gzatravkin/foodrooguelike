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
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [cookingTime, setCookingTime] = useState(30);
    const [lastDish, setLastDish] = useState<Dish | null>(null);

    const ingredients = inventory
        .map(id => entityFactory.getTemplate(id))
        .filter(item => item?.type === 'ingredient') as Ingredient[];

    const methods = (entityFactory.getAllOfType('cookingMethod') as CookingMethod[])
        .filter(method => method.unlocked !== false);

    const toggleIngredient = (ingredientId: string) => {
        if (selectedIngredients.includes(ingredientId)) {
            setSelectedIngredients(selectedIngredients.filter(id => id !== ingredientId));
        } else if (selectedIngredients.length < 5) {
            setSelectedIngredients([...selectedIngredients, ingredientId]);
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
        setSelectedMethod('');
        setCookingTime(30);
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="COOKING" emoji="🍳" />

            {lastDish && (
                <Card style={`background: #2E7D32; border-color: ${colors.success}; margin-bottom: 20px;`}>
                    <CardTitle>✓ Cooked: {lastDish.name}</CardTitle>
                    <p>{lastDish.description}</p>
                    <CardEffect>
                        Quality: {lastDish.quality} | HP: +{lastDish.effects?.health || 0}, ATK: +{lastDish.effects?.attack || 0}, DEF: +{lastDish.effects?.defense || 0}
                    </CardEffect>
                </Card>
            )}

            <ContentWrapper>
                {/* Ingredients Selection */}
                <SectionTitle>Select Ingredients (Max 5)</SectionTitle>
                <p style={`color: ${colors.textMuted}; margin-bottom: 10px;`}>
                    Selected: {selectedIngredients.length}/5
                </p>
                <GridLayout>
                    {ingredients.map(ingredient => {
                        const isSelected = selectedIngredients.includes(ingredient.id);
                        return (
                            <Card
                                key={ingredient.id}
                                isSelected={isSelected}
                                onClick={() => toggleIngredient(ingredient.id)}
                            >
                                <CardTitle>{ingredient.name}</CardTitle>
                                <p>{ingredient.description}</p>
                                <CardEffect>
                                    Rarity: {ingredient.rarity} | Value: {ingredient.baseValue}
                                </CardEffect>
                            </Card>
                        );
                    })}
                </GridLayout>

                {ingredients.length === 0 && (
                    <p style={`color: ${colors.textMuted}; text-align: center; padding: 40px;`}>
                        No ingredients available. Go on expeditions to gather ingredients!
                    </p>
                )}

                {/* Cooking Method Selection */}
                <SectionTitle>Select Cooking Method</SectionTitle>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    {methods.map(method => (
                        <ActionButton
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={selectedMethod === method.id ? commonStyles.activeTab : ''}
                        >
                            {method.name}
                        </ActionButton>
                    ))}
                </div>

                {/* Cooking Time */}
                <SectionTitle>Cooking Time</SectionTitle>
                <input
                    type="range"
                    min="10"
                    max="120"
                    value={cookingTime}
                    onInput={(e) => setCookingTime(parseInt((e.target as HTMLInputElement).value))}
                    style="width: 100%; max-width: 600px;"
                />
                <p>{cookingTime} seconds</p>

                {/* Cook Button */}
                <button
                    class="button"
                    onClick={cook}
                    disabled={selectedIngredients.length === 0 || !selectedMethod}
                    style="margin-top: 30px; background: #FF6B35;"
                >
                    🍳 COOK! 🍳
                </button>
            </ContentWrapper>

            <CloseButton />

            <p style={`color: ${colors.textMuted}; margin-top: 20px;`}>Press ESC to close</p>
        </ScreenContainer>
    );
}
