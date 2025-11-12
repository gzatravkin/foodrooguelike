/**
 * InGameMenuScreen - Preact component for the in-game menu overlay
 * Accessible by pressing ESC during gameplay
 */

import { useEffect } from 'preact/hooks';
import { usePlayer, useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';

export function InGameMenuScreen() {
    const player = usePlayer();
    const gold = useGold();
    const discoveredRecipes = useGameState(state => state.discoveredRecipes);

    const closeMenu = () => gameState.setScreen('game');

    // Handle escape key to close menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeMenu();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div class="screen" style="background: rgba(0, 0, 0, 0.9);">
            {/* Close button */}
            <div style="position: absolute; top: 20px; right: 20px;">
                <button
                    class="button"
                    onClick={closeMenu}
                    style="min-width: 100px; background: #666; padding: 10px 20px;"
                >
                    ✕ CLOSE
                </button>
            </div>

            <h1 style="font-size: 48px; margin-bottom: 30px;">MENU</h1>

            {/* Player Stats Panel */}
            <div style="background: #2a2a2a; border: 2px solid #444; border-radius: 12px; padding: 25px; margin: 20px 0; max-width: 800px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                    <div>
                        <p style="color: #888; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Health</p>
                        <p style="color: #FF6B6B; font-size: 24px; font-weight: bold;">
                            {player.health}/{player.maxHealth}
                        </p>
                    </div>
                    <div>
                        <p style="color: #888; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Attack</p>
                        <p style="color: #FF8C42; font-size: 24px; font-weight: bold;">{player.attack}</p>
                    </div>
                    <div>
                        <p style="color: #888; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Defense</p>
                        <p style="color: #4ECDC4; font-size: 24px; font-weight: bold;">{player.defense}</p>
                    </div>
                    <div>
                        <p style="color: #888; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Gold</p>
                        <p style="color: #FFD700; font-size: 24px; font-weight: bold;">{gold}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style="display: grid; grid-template-columns: repeat(3, 200px); gap: 15px; margin: 40px 0;">
                <button
                    class="button"
                    onClick={() => gameState.setScreen('cooking')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);"
                >
                    🍳<br/>COOKING
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('shop')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);"
                >
                    🛒<br/>SHOP
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('training')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border: none; box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);"
                >
                    ⚔️<br/>TRAINING
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('upgrades')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); border: none; box-shadow: 0 4px 15px rgba(48, 207, 208, 0.4);"
                >
                    ⭐<br/>UPGRADES
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('recipebook')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border: none; box-shadow: 0 4px 15px rgba(168, 237, 234, 0.4);"
                >
                    📖<br/>RECIPES
                </button>

                <button
                    class="button"
                    onClick={() => gameState.setScreen('worldmap')}
                    style="height: 70px; font-size: 16px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); border: none; box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);"
                >
                    🗺️<br/>WORLD MAP
                </button>
            </div>

            {/* Info Section */}
            <div style="background: #222; border-radius: 8px; padding: 15px 30px; margin-top: 20px;">
                <p style="color: #888; font-size: 14px;">
                    📚 Discovered Recipes: <span style="color: #FFD700; font-weight: bold;">{discoveredRecipes.length}</span>
                </p>
            </div>

            {/* Settings Button */}
            <button
                class="button"
                onClick={() => gameState.setScreen('settings')}
                style="margin-top: 30px; min-width: 200px; background: #444; border: 2px solid #666;"
            >
                ⚙️ SETTINGS
            </button>

            {/* Help Text */}
            <p style="color: #666; font-size: 14px; margin-top: 40px;">
                Press ESC to return to game
            </p>
        </div>
    );
}
