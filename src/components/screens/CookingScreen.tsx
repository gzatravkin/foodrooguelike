/**
 * CookingScreen - Preact component for cooking
 */

import { useState, useEffect } from 'preact/hooks';
import { useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { cookingSystem } from '../../systems/CookingSystem';
import { entityFactory } from '../../entities/EntityFactory';
import type { Ingredient, CookingMethod, Dish } from '../../entities/types';

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
        <div class="screen">
            <h1>🍳 COOKING</h1>

            {lastDish && (
                <div class="card" style="background: #2E7D32; border-color: #4CAF50; margin-bottom: 20px;">
                    <h3>✓ Cooked: {lastDish.name}</h3>
                    <p>{lastDish.description}</p>
                    <p class="effect">
                        Quality: {lastDish.quality} | HP: +{lastDish.effects?.health || 0}, ATK: +{lastDish.effects?.attack || 0}, DEF: +{lastDish.effects?.defense || 0}
                    </p>
                </div>
            )}

            <div style="width: 100%; max-width: 1200px;">
                {/* Ingredients Selection */}
                <h2 style="color: #FFD700;">Select Ingredients (Max 5)</h2>
                <p style="color: #AAA; margin-bottom: 10px;">
                    Selected: {selectedIngredients.length}/5
                </p>
                <div class="grid-2col">
                    {ingredients.map(ingredient => {
                        const isSelected = selectedIngredients.includes(ingredient.id);
                        return (
                            <div
                                key={ingredient.id}
                                class="card"
                                onClick={() => toggleIngredient(ingredient.id)}
                                style={`cursor: pointer; ${isSelected ? 'border-color: #4CAF50; background: #1a3a1a;' : ''}`}
                            >
                                <h3>{ingredient.name}</h3>
                                <p>{ingredient.description}</p>
                                <p class="effect">
                                    Rarity: {ingredient.rarity} | Value: {ingredient.baseValue}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {ingredients.length === 0 && (
                    <p style="color: #AAA; text-align: center; padding: 40px;">
                        No ingredients available. Go on expeditions to gather ingredients!
                    </p>
                )}

                {/* Cooking Method Selection */}
                <h2 style="color: #FFD700; margin-top: 30px;">Select Cooking Method</h2>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    {methods.map(method => (
                        <button
                            key={method.id}
                            class="button"
                            onClick={() => setSelectedMethod(method.id)}
                            style={selectedMethod === method.id
                                ? 'background: #FFD700; color: #000;'
                                : ''}
                        >
                            {method.name}
                        </button>
                    ))}
                </div>

                {/* Cooking Time */}
                <h2 style="color: #FFD700; margin-top: 30px;">Cooking Time</h2>
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
            </div>

            <button
                class="button"
                onClick={() => gameState.setScreen('game')}
                style="margin-top: 30px;"
            >
                ✕ CLOSE
            </button>

            <p style="color: #AAA; margin-top: 20px;">Press ESC to close</p>
        </div>
    );
}
