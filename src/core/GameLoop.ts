/**
 * GameLoop - Main game loop handling updates and rendering
 */

import { eventBus } from './EventBus';
import { gameState } from './GameState';

export class GameLoop {
    private lastTime: number = 0;
    private running: boolean = false;
    private animationId: number | null = null;

    start(): void {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
        eventBus.emit('game:started');
    }

    stop(): void {
        this.running = false;
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        eventBus.emit('game:stopped');
    }

    private loop = (currentTime: number): void => {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(this.loop);
    };

    private update(deltaTime: number): void {
        // Update game systems
        eventBus.emit('game:update', deltaTime);

        // Tick buffs every second
        if (Math.floor(this.lastTime / 1000) !== Math.floor((this.lastTime - deltaTime) / 1000)) {
            gameState.tickBuffs();
        }
    }

    private render(): void {
        eventBus.emit('game:render');
    }
}
