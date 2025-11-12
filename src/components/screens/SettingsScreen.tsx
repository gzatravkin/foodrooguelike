/**
 * SettingsScreen - Preact component for game settings
 */

import { useState } from 'preact/hooks';
import { gameState } from '../../core/GameState';
import { settingsManager } from '../../core/SettingsManager';
import { ScreenContainer, ScreenHeader } from '../common/Layout';
import { CloseButton } from '../common/Button';
import { colors, fontSize } from '../../styles/theme';

export function SettingsScreen() {
    const [volume, setVolume] = useState(settingsManager.getVolume());
    const [animationsEnabled, setAnimationsEnabled] = useState(settingsManager.areAnimationsEnabled());
    const [soundEnabled, setSoundEnabled] = useState(settingsManager.isSoundEnabled());

    const handleVolumeChange = (e: Event) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        setVolume(value);
        settingsManager.setVolume(value);
    };

    const toggleAnimations = () => {
        const newValue = !animationsEnabled;
        setAnimationsEnabled(newValue);
        settingsManager.setAnimationsEnabled(newValue);
    };

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        settingsManager.setSoundEnabled(newValue);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
            gameState.reset();
            gameState.setScreen('game');
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="SETTINGS" />

            <div style="width: 600px; margin: 20px 0;">
                <div style="margin: 30px 0;">
                    <label style={`display: block; margin-bottom: 10px; font-size: ${fontSize.md};`}>
                        Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onInput={handleVolumeChange}
                        style="width: 100%;"
                    />
                </div>

                <div style="margin: 30px 0;">
                    <label style={`display: flex; align-items: center; font-size: ${fontSize.md}; cursor: pointer;`}>
                        <input
                            type="checkbox"
                            checked={animationsEnabled}
                            onChange={toggleAnimations}
                            style="margin-right: 10px; width: 20px; height: 20px; cursor: pointer;"
                        />
                        Enable Animations
                    </label>
                </div>

                <div style="margin: 30px 0;">
                    <label style={`display: flex; align-items: center; font-size: ${fontSize.md}; cursor: pointer;`}>
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={toggleSound}
                            style="margin-right: 10px; width: 20px; height: 20px; cursor: pointer;"
                        />
                        Enable Sound
                    </label>
                </div>

                <button
                    class="button"
                    onClick={handleReset}
                    style={`background: ${colors.danger}; margin-top: 40px;`}
                >
                    RESET GAME
                </button>
            </div>

            <p style={`color: ${colors.textMuted}; margin-top: 40px;`}>Press ESC to close</p>
        </ScreenContainer>
    );
}
