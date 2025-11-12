/**
 * useGameState - Hook to subscribe to GameState changes
 * Provides reactive access to game state in Preact components
 */

import { useState, useEffect } from 'preact/hooks';
import { gameState, type GameData } from '../core/GameState';
import { eventBus } from '../core/EventBus';

type Selector<T> = (state: GameData) => T;

/**
 * Subscribe to gameState with optional selector
 * Re-renders component when selected state changes
 */
export function useGameState<T = GameData>(selector?: Selector<T>): T {
    const [state, setState] = useState<T>(() => {
        const fullState = gameState.getState();
        return selector ? selector(fullState) : (fullState as unknown as T);
    });

    useEffect(() => {
        // Subscribe to all game state changes
        const handleChange = () => {
            const fullState = gameState.getState();
            const newState = selector ? selector(fullState) : (fullState as unknown as T);
            setState(newState);
        };

        // Listen to all relevant events
        const events = [
            'player:updated',
            'gold:changed',
            'inventory:changed',
            'dish:added',
            'dish:removed',
            'recipe:discovered',
            'recipe:saved',
            'screen:changed',
            'upgrade:purchased',
            'training:purchased',
            'restaurant:upgraded',
            'reputation:changed'
        ];

        events.forEach(event => {
            eventBus.on(event, handleChange);
        });

        return () => {
            events.forEach(event => {
                eventBus.off(event, handleChange);
            });
        };
    }, [selector]);

    return state;
}

/**
 * Hook to get current screen
 */
export function useCurrentScreen() {
    return useGameState(state => state.currentScreen);
}

/**
 * Hook to get player stats
 */
export function usePlayer() {
    return useGameState(state => state.player);
}

/**
 * Hook to get gold
 */
export function useGold() {
    return useGameState(state => state.gold);
}

/**
 * Hook to get inventory
 */
export function useInventory() {
    return useGameState(state => state.inventory);
}

/**
 * Hook to get dishes
 */
export function useDishes() {
    return useGameState(state => state.dishes);
}
