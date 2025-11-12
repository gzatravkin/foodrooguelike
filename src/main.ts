/**
 * Main entry point - Initializes and starts the game (2D Top-View Roguelike)
 */

import { render, h } from 'preact';
import { GameLoop } from './core/GameLoop';
import { gameState } from './core/GameState';
import { eventBus } from './core/EventBus';
import { dataLoader } from './core/DataLoader';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { InputManager } from './core/InputManager';
import { GameScreen } from './screens/GameScreen';
import { GlobalMapScreen } from './screens/GlobalMapScreen';
import { initializeAllPlugins } from './plugins';
import { App } from './components/App';

class Game {
    private renderer: CanvasRenderer;
    private input: InputManager;
    private gameScreen!: GameScreen;
    private globalMapScreen!: GlobalMapScreen;
    private gameLoop: GameLoop;
    private lastTime: number = 0;
    private uiElement: HTMLDivElement;
    private currentCanvasScreen: 'game' | 'worldmap' = 'game';

    constructor() {
        const canvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }

        const uiEl = document.getElementById('game-ui');
        if (!uiEl || !(uiEl instanceof HTMLDivElement)) {
            throw new Error('UI element not found');
        }
        this.uiElement = uiEl;

        this.renderer = new CanvasRenderer(canvasElement);
        this.input = new InputManager();
        this.gameLoop = new GameLoop();

        this.setupPreact();
        this.setupEventListeners();
    }

    private setupPreact(): void {
        // Render Preact app into UI container
        render(h(App, null), this.uiElement);

        // Listen to screen changes from gameState
        eventBus.on('screen:changed', (screenName: string) => {
            // Show/hide UI overlay for UI screens
            const uiScreens = ['cooking', 'shop', 'recipebook', 'settings', 'restaurant', 'upgrades', 'training', 'expedition'];
            if (uiScreens.includes(screenName)) {
                this.uiElement.classList.add('active');
            } else {
                this.uiElement.classList.remove('active');
            }

            // Switch canvas screen for game/worldmap
            if (screenName === 'worldmap') {
                this.currentCanvasScreen = 'worldmap';
            } else if (screenName === 'game' || screenName === 'base') {
                this.currentCanvasScreen = 'game';
            }
        });
    }

    async init(): Promise<void> {
        console.log('🎮 Initializing plugin system...');
        initializeAllPlugins();

        console.log('Loading game data...');
        await dataLoader.loadAll();

        console.log('Initializing 2D top-view roguelike...');
        this.gameScreen = new GameScreen(this.renderer, this.input);
        await this.gameScreen.init();

        console.log('Initializing global map...');
        this.globalMapScreen = new GlobalMapScreen(this.renderer, this.input);

        console.log('Game initialized successfully!');
    }

    start(): void {
        this.gameLoop.start();
        this.lastTime = performance.now();
        this.gameLoop.loop(this.update.bind(this));
        console.log('Game started!');
    }

    private update(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update and render based on current canvas screen
        if (this.currentCanvasScreen === 'worldmap') {
            this.globalMapScreen.update(deltaTime);
            this.globalMapScreen.render();
        } else {
            this.gameScreen.update(deltaTime);
            this.gameScreen.render();
        }
    }

    private setupEventListeners(): void {
        // Handle window focus/blur for pausing
        window.addEventListener('blur', () => {
            console.log('Game paused (window lost focus)');
        });

        window.addEventListener('focus', () => {
            console.log('Game resumed (window gained focus)');
            this.lastTime = performance.now();
        });
    }
}

// Start the game
const game = new Game();
game.init().then(() => {
    game.start();
}).catch((error) => {
    console.error('Failed to initialize game:', error);
});
