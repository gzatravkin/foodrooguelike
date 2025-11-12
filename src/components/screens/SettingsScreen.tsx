/**
 * SettingsScreen - Preact component for game settings
 */

import { useState, useEffect } from 'preact/hooks';
import { gameState } from '../../core/GameState';
import { settingsManager } from '../../core/SettingsManager';

export function SettingsScreen() {
    const [volume, setVolume] = useState(settingsManager.getVolume());
    const [animationsEnabled, setAnimationsEnabled] = useState(settingsManager.areAnimationsEnabled());
    const [soundEnabled, setSoundEnabled] = useState(settingsManager.isSoundEnabled());

    // Handle ESC key to close
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
        <div class="screen">
            <h1>SETTINGS</h1>

            <div style="width: 600px; margin: 20px 0;">
                <div style="margin: 30px 0;">
                    <label style="display: block; margin-bottom: 10px; font-size: 18px;">
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
                    <label style="display: flex; align-items: center; font-size: 18px; cursor: pointer;">
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
                    <label style="display: flex; align-items: center; font-size: 18px; cursor: pointer;">
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
                    style="background: #D32F2F; margin-top: 40px;"
                >
                    RESET GAME
                </button>
            </div>

            <p style="color: #AAA; margin-top: 40px;">Press ESC to close</p>
        </div>
    );
}
