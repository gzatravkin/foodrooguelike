/**
 * Main entry point - Initializes and starts the game (2D Top-View Roguelike)
 */

import { GameLoop } from './core/GameLoop';
import { gameState } from './core/GameState';
import { eventBus } from './core/EventBus';
import { dataLoader } from './core/DataLoader';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { InputManager } from './core/InputManager';
import { GameScreen } from './screens/GameScreen';

class Game {
    private renderer: CanvasRenderer;
    private input: InputManager;
    private gameScreen!: GameScreen;
    private gameLoop: GameLoop;
    private lastTime: number = 0;

    constructor() {
        const canvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }

        this.renderer = new CanvasRenderer(canvasElement);
        this.input = new InputManager();
        this.gameLoop = new GameLoop();

        this.setupEventListeners();
    }

    async init(): Promise<void> {
        console.log('Loading game data...');
        await dataLoader.loadAll();

        console.log('Initializing 2D top-view roguelike...');
        this.gameScreen = new GameScreen(this.renderer, this.input);
        await this.gameScreen.init();
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

        // Update game logic
        this.gameScreen.update(deltaTime);

        // Render
        this.gameScreen.render();
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
