/**
 * ScreenManager - Manages screen transitions and rendering
 */

import { eventBus } from '../core/EventBus';
import type { Screen } from './Screen';

export class ScreenManager {
    private currentScreen: Screen | null = null;
    private screens: Map<string, Screen> = new Map();

    registerScreen(name: string, screen: Screen): void {
        this.screens.set(name, screen);
    }

    switchTo(name: string): void {
        const screen = this.screens.get(name);
        if (!screen) {
            console.error(`Screen not found: ${name}`);
            return;
        }

        if (this.currentScreen) {
            this.currentScreen.cleanup();
        }

        this.currentScreen = screen;
        this.render();

        eventBus.emit('screen:switched', name);
    }

    render(): void {
        if (this.currentScreen) {
            this.currentScreen.render();
        }
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        if (this.currentScreen) {
            this.currentScreen.handleInput(event);
        }
    }

    getCurrentScreen(): Screen | null {
        return this.currentScreen;
    }
}
