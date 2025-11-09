/**
 * Screen - Base class for all game screens
 * Extend this class to create new screens
 */

import type { SVGRenderer } from './SVGRenderer';

export abstract class Screen {
    protected renderer: SVGRenderer;

    constructor(renderer: SVGRenderer) {
        this.renderer = renderer;
    }

    abstract render(): void;

    abstract handleInput(event: MouseEvent | TouchEvent): void;

    cleanup(): void {
        // Override if cleanup is needed
    }
}
