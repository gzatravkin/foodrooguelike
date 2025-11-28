/**
 * Main entry point - Initializes Phaser 3 game
 */

import { render, h } from 'preact';
import Phaser from 'phaser';
import { phaserConfig } from './core/PhaserConfig';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { GlobalMapScene } from './scenes/GlobalMapScene';
import { gameState } from './core/GameState';
import { eventBus } from './core/EventBus';
import { dataLoader } from './core/DataLoader';
import { initializeAllPlugins } from './plugins';
import { App } from './components/App';
import { InputManager } from './core/InputManager';

class Game {
  private phaserGame: Phaser.Game | null = null;
  private uiElement: HTMLDivElement;
  private input: InputManager;

  constructor() {
    const uiEl = document.getElementById('game-ui');
    if (!uiEl || !(uiEl instanceof HTMLDivElement)) {
      throw new Error('UI element not found');
    }
    this.uiElement = uiEl;

    this.input = new InputManager();
    this.setupPreact();
    this.setupEventListeners();
    this.setupMobileEscButton();
  }

  private setupPreact(): void {
    // Render Preact app into UI container
    render(h(App, null), this.uiElement);

    // Listen to screen changes from gameState
    eventBus.on('screen:changed', (screenName: string) => {
      // Show/hide UI overlay for UI screens
      const uiScreens = [
        'base',
        'cooking',
        'shop',
        'recipebook',
        'settings',
        'restaurant',
        'upgrades',
        'training',
        'expedition',
        'diningroom',
        'customization',
        'menu',
      ];

      if (uiScreens.includes(screenName)) {
        this.uiElement.classList.add('active');
      } else {
        this.uiElement.classList.remove('active');
      }

      // Switch Phaser scenes for game/worldmap
      if (this.phaserGame) {
        if (screenName === 'worldmap') {
          this.phaserGame.scene.pause('GameScene');
          this.phaserGame.scene.start('GlobalMapScene');
        } else if (screenName === 'game') {
          this.phaserGame.scene.pause('GlobalMapScene');
          this.phaserGame.scene.start('GameScene');
        }
      }
    });
  }

  async init(): Promise<void> {
    console.log('🎮 Initializing plugin system...');
    initializeAllPlugins();

    console.log('Loading game data...');
    await dataLoader.loadAll();

    // Load saved game state if it exists
    console.log('Loading saved game...');
    const saveLoaded = gameState.loadGame();
    if (saveLoaded) {
      console.log('✓ Save game loaded successfully');
    } else {
      console.log('No save found, starting new game');
    }

    console.log('Initializing Phaser 3...');

    // Add scenes to config
    const config = {
      ...phaserConfig,
      scene: [PreloadScene, GameScene, GlobalMapScene],
    };

    // Create Phaser game
    this.phaserGame = new Phaser.Game(config);

    console.log('Game initialized successfully!');
  }

  private setupEventListeners(): void {
    // Handle window focus/blur for pausing
    window.addEventListener('blur', () => {
      console.log('Game paused (window lost focus)');
      if (this.phaserGame) {
        this.phaserGame.scene.pause('GameScene');
      }
    });

    window.addEventListener('focus', () => {
      console.log('Game resumed (window gained focus)');
      if (this.phaserGame) {
        const currentScreen = gameState.getState().currentScreen;
        if (currentScreen === 'game') {
          this.phaserGame.scene.resume('GameScene');
        }
      }
    });
  }

  private setupMobileEscButton(): void {
    const mobileEscButton = document.getElementById('mobile-esc-button');
    if (!mobileEscButton) {
      console.warn('Mobile ESC button not found');
      return;
    }

    // Show button only on mobile devices
    if (this.input.isMobileDevice()) {
      mobileEscButton.classList.remove('hidden');
    }

    // Handle ESC button click
    mobileEscButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentScreen = gameState.getState().currentScreen;

      // If in game or worldmap, open menu
      if (currentScreen === 'game' || currentScreen === 'worldmap') {
        gameState.setScreen('menu');
      }
      // If in any UI screen, close it and return to game
      else {
        const uiScreens = [
          'menu',
          'cooking',
          'shop',
          'recipebook',
          'settings',
          'restaurant',
          'upgrades',
          'training',
          'expedition',
          'diningroom',
          'customization',
        ];
        if (uiScreens.includes(currentScreen)) {
          gameState.setScreen('game');
        }
      }
    });
  }
}

// Start the game
const game = new Game();
game
  .init()
  .then(() => {
    console.log('🎮 Game started!');
  })
  .catch((error) => {
    console.error('Failed to initialize game:', error);
  });
