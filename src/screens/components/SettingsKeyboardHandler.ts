/**
 * SettingsKeyboardHandler - Keyboard input handling for settings screen
 * Manages ESC key to close settings
 */

import { gameState } from '../../core/GameState';

export class SettingsKeyboardHandler {
    private keyListener: ((e: KeyboardEvent) => void) | null = null;

    setup(): void {
        this.keyListener = (e: KeyboardEvent) => {
            const currentScreen = gameState.getState().currentScreen;
            if (currentScreen !== 'settings') return;

            if (e.key === 'Escape') {
                e.preventDefault();
                // Close settings and return to game
                (gameState as any).state.currentScreen = 'game';
                import('../../core/EventBus').then(({ eventBus }) => {
                    eventBus.emit('screen:changed', 'game');
                });
            }
        };

        window.addEventListener('keydown', this.keyListener);
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
    }
}
