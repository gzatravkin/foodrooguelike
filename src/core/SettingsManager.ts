/**
 * SettingsManager - Manages game settings
 * Handles volume controls, animation preferences, and game reset
 */

import { eventBus } from './EventBus';

export interface GameSettings {
    volume: number; // 0-100
    animationsEnabled: boolean;
    soundEnabled: boolean;
}

class SettingsManager {
    private settings: GameSettings;
    private readonly STORAGE_KEY = 'foodrogue_settings';

    constructor() {
        this.settings = this.loadSettings();
    }

    private getDefaultSettings(): GameSettings {
        return {
            volume: 50,
            animationsEnabled: true,
            soundEnabled: true
        };
    }

    private loadSettings(): GameSettings {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
        return this.getDefaultSettings();
    }

    private saveSettings(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
            eventBus.emit('settings:changed', this.settings);
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    getSettings(): GameSettings {
        return { ...this.settings };
    }

    setVolume(volume: number): void {
        this.settings.volume = Math.max(0, Math.min(100, volume));
        this.saveSettings();
    }

    getVolume(): number {
        return this.settings.volume;
    }

    setAnimationsEnabled(enabled: boolean): void {
        this.settings.animationsEnabled = enabled;
        this.saveSettings();
    }

    areAnimationsEnabled(): boolean {
        return this.settings.animationsEnabled;
    }

    setSoundEnabled(enabled: boolean): void {
        this.settings.soundEnabled = enabled;
        this.saveSettings();
    }

    isSoundEnabled(): boolean {
        return this.settings.soundEnabled;
    }

    resetSettings(): void {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
    }
}

export const settingsManager = new SettingsManager();
