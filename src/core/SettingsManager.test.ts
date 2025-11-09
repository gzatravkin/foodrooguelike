import { describe, it, expect, beforeEach } from 'vitest';
import { settingsManager } from './SettingsManager';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageMock as any;

describe('SettingsManager', () => {
  beforeEach(() => {
    // Clear localStorage and reset settings before each test
    localStorage.clear();
    settingsManager.resetSettings();
  });

  describe('Initialization', () => {
    it('should initialize with default settings', () => {
      const settings = settingsManager.getSettings();

      expect(settings.volume).toBe(50);
      expect(settings.animationsEnabled).toBe(true);
      expect(settings.soundEnabled).toBe(true);
    });

    it('should persist and load settings from localStorage', () => {
      // Set some custom settings
      settingsManager.setVolume(75);
      settingsManager.setAnimationsEnabled(false);
      settingsManager.setSoundEnabled(false);

      // Verify they were saved to localStorage
      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.volume).toBe(75);
      expect(stored.animationsEnabled).toBe(false);
      expect(stored.soundEnabled).toBe(false);
    });
  });

  describe('Volume Control', () => {
    it('should set volume within valid range', () => {
      settingsManager.setVolume(75);
      expect(settingsManager.getVolume()).toBe(75);
    });

    it('should clamp volume to 0 minimum', () => {
      settingsManager.setVolume(-10);
      expect(settingsManager.getVolume()).toBe(0);
    });

    it('should clamp volume to 100 maximum', () => {
      settingsManager.setVolume(150);
      expect(settingsManager.getVolume()).toBe(100);
    });

    it('should save volume to localStorage', () => {
      settingsManager.setVolume(80);

      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.volume).toBe(80);
    });
  });

  describe('Animation Toggle', () => {
    it('should enable animations', () => {
      settingsManager.setAnimationsEnabled(true);
      expect(settingsManager.areAnimationsEnabled()).toBe(true);
    });

    it('should disable animations', () => {
      settingsManager.setAnimationsEnabled(false);
      expect(settingsManager.areAnimationsEnabled()).toBe(false);
    });

    it('should save animation setting to localStorage', () => {
      settingsManager.setAnimationsEnabled(false);

      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.animationsEnabled).toBe(false);
    });
  });

  describe('Sound Toggle', () => {
    it('should enable sound', () => {
      settingsManager.setSoundEnabled(true);
      expect(settingsManager.isSoundEnabled()).toBe(true);
    });

    it('should disable sound', () => {
      settingsManager.setSoundEnabled(false);
      expect(settingsManager.isSoundEnabled()).toBe(false);
    });

    it('should save sound setting to localStorage', () => {
      settingsManager.setSoundEnabled(false);

      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.soundEnabled).toBe(false);
    });
  });

  describe('Reset Settings', () => {
    it('should reset all settings to defaults', () => {
      // Change all settings
      settingsManager.setVolume(25);
      settingsManager.setAnimationsEnabled(false);
      settingsManager.setSoundEnabled(false);

      // Reset
      settingsManager.resetSettings();

      const settings = settingsManager.getSettings();
      expect(settings.volume).toBe(50);
      expect(settings.animationsEnabled).toBe(true);
      expect(settings.soundEnabled).toBe(true);
    });

    it('should save reset settings to localStorage', () => {
      settingsManager.setVolume(0);
      settingsManager.resetSettings();

      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.volume).toBe(50);
    });
  });

  describe('Persistence', () => {
    it('should persist settings to localStorage', () => {
      settingsManager.setVolume(33);
      settingsManager.setAnimationsEnabled(false);

      const stored = JSON.parse(localStorage.getItem('foodrogue_settings') || '{}');
      expect(stored.volume).toBe(33);
      expect(stored.animationsEnabled).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupt localStorage gracefully', () => {
      // This test verifies the manager doesn't crash with bad data
      localStorage.setItem('foodrogue_settings', 'invalid json');

      // The manager should still work and use current values
      settingsManager.setVolume(80);
      expect(settingsManager.getVolume()).toBe(80);
    });
  });
});
