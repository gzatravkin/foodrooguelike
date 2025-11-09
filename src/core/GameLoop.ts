/**
 * GameLoop - Main game loop handling updates and rendering
 */

import { eventBus } from './EventBus';

export class GameLoop {
    private running: boolean = false;
    private animationId: number | null = null;
    private callback: ((currentTime: number) => void) | null = null;

    start(): void {
        if (this.running) return;
        this.running = true;
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

    loop(callback: (currentTime: number) => void): void {
        this.callback = callback;
        this.runLoop(performance.now());
    }

    private runLoop = (currentTime: number): void => {
        if (!this.running) return;

        if (this.callback) {
            this.callback(currentTime);
        }

        this.animationId = requestAnimationFrame(this.runLoop);
    };
}
