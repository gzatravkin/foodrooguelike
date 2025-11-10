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
import { SVGRenderer } from './rendering/SVGRenderer';
import { ScreenManager } from './rendering/ScreenManager';
import { CookingScreen } from './screens/CookingScreen';
import { ShopScreen } from './screens/ShopScreen';
import { RecipeBookScreen } from './screens/RecipeBookScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TrainingScreen } from './screens/TrainingScreen';
import { ExpeditionSelectionScreen } from './screens/ExpeditionSelectionScreen';
import { GlobalMapScreen } from './screens/GlobalMapScreen';

class Game {
    private renderer: CanvasRenderer;
    private input: InputManager;
    private gameScreen!: GameScreen;
    private globalMapScreen!: GlobalMapScreen;
    private gameLoop: GameLoop;
    private lastTime: number = 0;
    private svgRenderer: SVGRenderer;
    private screenManager: ScreenManager;
    private svgElement: SVGSVGElement;
    private currentCanvasScreen: 'game' | 'worldmap' = 'game';

    constructor() {
        const canvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }

        const svgEl = document.getElementById('game-ui');
        if (!svgEl || !(svgEl instanceof SVGSVGElement)) {
            throw new Error('SVG UI element not found');
        }
        this.svgElement = svgEl;

        this.renderer = new CanvasRenderer(canvasElement);
        this.input = new InputManager();
        this.gameLoop = new GameLoop();
        this.svgRenderer = new SVGRenderer(this.svgElement);
        this.screenManager = new ScreenManager();

        this.setupScreens();
        this.setupEventListeners();
    }

    private setupScreens(): void {
        // Register all SVG-based UI overlay screens
        this.screenManager.registerScreen('cooking', new CookingScreen(this.svgRenderer));
        this.screenManager.registerScreen('shop', new ShopScreen(this.svgRenderer));
        this.screenManager.registerScreen('recipebook', new RecipeBookScreen(this.svgRenderer));
        this.screenManager.registerScreen('settings', new SettingsScreen(this.svgRenderer));
        this.screenManager.registerScreen('training', new TrainingScreen(this.svgRenderer));
        this.screenManager.registerScreen('expedition', new ExpeditionSelectionScreen(this.svgRenderer));

        // Listen to screen changes from gameState
        eventBus.on('screen:changed', (screenName: string) => {
            // Hide canvas and show SVG for UI overlay screens
            const uiScreens = ['cooking', 'shop', 'recipebook', 'settings', 'restaurant', 'upgrades', 'training', 'expedition'];
            if (uiScreens.includes(screenName)) {
                this.svgElement.classList.add('active');
                this.screenManager.switchTo(screenName);
            } else {
                this.svgElement.classList.remove('active');
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
