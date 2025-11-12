/**
 * Common hooks for UI components
 */

import { useState, useEffect } from 'preact/hooks';
import { gameState } from '../core/GameState';

/**
 * Hook to handle ESC key to close screen and return to game
 */
export function useEscapeToClose() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                gameState.setScreen('game');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}

/**
 * Hook to handle temporary messages/toasts
 */
export function useMessage(duration: number = 3000) {
    const [message, setMessage] = useState('');

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), duration);
    };

    return { message, showMessage };
}
