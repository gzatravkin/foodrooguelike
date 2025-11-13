/**
 * InGameMenuScreen - Preact component for the in-game menu overlay
 * Accessible by pressing ESC during gameplay
 */

import { usePlayer, useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { ScreenContainer } from '../common/Layout';
import { StatDisplay, StatsGrid, StatsPanel } from '../common/Display';
import { CloseButton, NavButton } from '../common/Button';
import { colors, gradients, fontSize } from '../../styles/theme';

export function InGameMenuScreen() {
    const player = usePlayer();
    const gold = useGold();
    const discoveredRecipes = useGameState(state => state.discoveredRecipes);

    const navButtons = [
        { emoji: '🍳', label: 'COOKING', screen: 'cooking', gradient: gradients.purple, shadow: 'rgba(102, 126, 234, 0.4)' },
        { emoji: '🛒', label: 'SHOP', screen: 'shop', gradient: gradients.pink, shadow: 'rgba(245, 87, 108, 0.4)' },
        { emoji: '⚔️', label: 'TRAINING', screen: 'training', gradient: gradients.sunset, shadow: 'rgba(250, 112, 154, 0.4)' },
        { emoji: '⭐', label: 'UPGRADES', screen: 'upgrades', gradient: gradients.ocean, shadow: 'rgba(48, 207, 208, 0.4)' },
        { emoji: '📖', label: 'RECIPES', screen: 'recipebook', gradient: gradients.pastel, shadow: 'rgba(168, 237, 234, 0.4)' },
        { emoji: '🗺️', label: 'WORLD MAP', screen: 'worldmap', gradient: gradients.rose, shadow: 'rgba(255, 154, 158, 0.4)' },
    ];

    return (
        <ScreenContainer style="background: rgba(0, 0, 0, 0.9);">
            <CloseButton position="top-right" />

            <h1 style={`font-size: ${fontSize.xxxl}; margin-bottom: 30px;`}>MENU</h1>

            {/* Player Stats Panel */}
            <StatsPanel>
                <StatsGrid>
                    <StatDisplay
                        label="Health"
                        value={`${player.health}/${player.maxHealth}`}
                        color={colors.dangerLight}
                    />
                    <StatDisplay
                        label="Attack"
                        value={player.attack}
                        color={colors.warning}
                    />
                    <StatDisplay
                        label="Defense"
                        value={player.defense}
                        color={colors.info}
                    />
                    <StatDisplay
                        label="Gold"
                        value={gold}
                        color={colors.gold}
                    />
                </StatsGrid>
            </StatsPanel>

            {/* Navigation Buttons */}
            <div style="display: grid; grid-template-columns: repeat(3, 400px); gap: 30px; margin: 40px 0;">
                {navButtons.map(btn => (
                    <NavButton
                        key={btn.screen}
                        emoji={btn.emoji}
                        label={btn.label}
                        gradient={btn.gradient}
                        shadowColor={btn.shadow}
                        onClick={() => gameState.setScreen(btn.screen as any)}
                    />
                ))}
            </div>

            {/* Info Section */}
            <div style={`background: #222; border-radius: 8px; padding: 15px 30px; margin-top: 20px;`}>
                <p style={`color: ${colors.textDark}; font-size: ${fontSize.sm};`}>
                    📚 Discovered Recipes: <span style={`color: ${colors.gold}; font-weight: bold;`}>{discoveredRecipes.length}</span>
                </p>
            </div>

            {/* Settings Button */}
            <button
                class="button"
                onClick={() => gameState.setScreen('settings')}
                style={`margin-top: 30px; min-width: 200px; background: ${colors.borderDark}; border: 2px solid ${colors.textDarker};`}
            >
                ⚙️ SETTINGS
            </button>

            {/* Help Text */}
            <p style={`color: ${colors.textDarker}; font-size: ${fontSize.sm}; margin-top: 40px;`}>
                Press ESC to return to game
            </p>
        </ScreenContainer>
    );
}
