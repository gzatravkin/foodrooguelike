/**
 * BaseScreen - Preact component for the base camp hub
 */

import { usePlayer, useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';

export function BaseScreen() {
    const player = usePlayer();
    const gold = useGold();
    const discoveredRecipes = useGameState(state => state.discoveredRecipes);

    return (
        <div class="screen">
            <h1>BASE CAMP</h1>

            {/* Player Stats Panel */}
            <div style="background: #2a2a2a; border-radius: 10px; padding: 30px; margin: 20px 0; max-width: 900px; width: 100%;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                    <div>
                        <p style="color: #AAA; font-size: 14px; margin-bottom: 5px;">Health</p>
                        <p style="color: #FFF; font-size: 20px; font-weight: bold;">
                            {player.health}/{player.maxHealth}
                        </p>
                    </div>
                    <div>
                        <p style="color: #AAA; font-size: 14px; margin-bottom: 5px;">Attack</p>
                        <p style="color: #FFF; font-size: 20px; font-weight: bold;">{player.attack}</p>
                    </div>
                    <div>
                        <p style="color: #AAA; font-size: 14px; margin-bottom: 5px;">Defense</p>
                        <p style="color: #FFF; font-size: 20px; font-weight: bold;">{player.defense}</p>
                    </div>
                    <div>
                        <p style="color: #AAA; font-size: 14px; margin-bottom: 5px;">Gold</p>
                        <p style="color: #FFD700; font-size: 20px; font-weight: bold;">{gold}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style="display: grid; grid-template-columns: repeat(2, 240px); gap: 20px; margin: 40px 0;">
                <button
                    class="button"
                    onClick={() => gameState.setScreen('cooking')}
                    style="height: 60px; font-size: 20px;"
                >
                    🍳 COOKING
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('shop')}
                    style="height: 60px; font-size: 20px;"
                >
                    🛒 SHOP
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('training')}
                    style="height: 60px; font-size: 20px;"
                >
                    ⚔️ TRAINING
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('upgrades')}
                    style="height: 60px; font-size: 20px;"
                >
                    ⭐ UPGRADES
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('recipebook')}
                    style="height: 60px; font-size: 20px;"
                >
                    📖 RECIPES
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('worldmap')}
                    style="height: 60px; font-size: 20px;"
                >
                    🗺️ WORLD MAP
                </button>
            </div>

            {/* Restaurant Info */}
            <p style="color: #AAA; margin-top: 40px;">
                Discovered Recipes: {discoveredRecipes.length}
            </p>

            {/* Settings Button */}
            <button
                class="button"
                onClick={() => gameState.setScreen('settings')}
                style="margin-top: 30px; min-width: 150px;"
            >
                SETTINGS
            </button>
        </div>
    );
}
