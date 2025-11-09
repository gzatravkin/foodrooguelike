/**
 * Main entry point - Initializes and starts the game
 */

import { GameLoop } from './core/GameLoop';
import { gameState } from './core/GameState';
import { eventBus } from './core/EventBus';
import { dataLoader } from './core/DataLoader';
import { SVGRenderer } from './rendering/SVGRenderer';
import { ScreenManager } from './rendering/ScreenManager';
import { BaseScreen } from './screens/BaseScreen';
import { ExpeditionScreen } from './screens/ExpeditionScreen';
import { CookingScreen } from './screens/CookingScreen';
import { ShopScreen } from './screens/ShopScreen';
import { SettingsScreen } from './screens/SettingsScreen';

class Game {
    private renderer: SVGRenderer;
    private screenManager: ScreenManager;
    private gameLoop: GameLoop;

    constructor() {
        const svgElement = document.getElementById('game-svg') as unknown as SVGSVGElement;
        if (!svgElement) {
            throw new Error('SVG element not found');
        }

        this.renderer = new SVGRenderer(svgElement);
        this.screenManager = new ScreenManager();
        this.gameLoop = new GameLoop();

        this.setupEventListeners();
    }

    async init(): Promise<void> {
        console.log('Loading game data...');
        await dataLoader.loadAll();

        console.log('Initializing screens...');
        this.screenManager.registerScreen('base', new BaseScreen(this.renderer));
        this.screenManager.registerScreen('expedition', new ExpeditionScreen(this.renderer));
        this.screenManager.registerScreen('cooking', new CookingScreen(this.renderer));
        this.screenManager.registerScreen('shop', new ShopScreen(this.renderer));
        this.screenManager.registerScreen('settings', new SettingsScreen(this.renderer));

        console.log('Game initialized successfully!');
    }

    start(): void {
        this.screenManager.switchTo('base');
        this.gameLoop.start();
        console.log('Game started!');
    }

    private setupEventListeners(): void {
        // Screen change listener
        eventBus.on('screen:changed', (screen) => {
            this.screenManager.switchTo(screen);
        });

        // Render listener
        eventBus.on('game:render', () => {
            this.screenManager.render();
        });

        // Handle input events
        const svg = document.getElementById('game-svg');
        if (svg) {
            svg.addEventListener('click', (e) => {
                this.screenManager.handleInput(e);
            });

            svg.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.screenManager.handleInput(e);
            });
        }
    }
}

// Start the game
const game = new Game();
game.init().then(() => {
    game.start();
}).catch((error) => {
    console.error('Failed to initialize game:', error);
});
