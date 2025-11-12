/**
 * ShopStateManager - Manages shop state, events, and keyboard controls
 */

import { gameState } from '../../core/GameState';
import { eventBus } from '../../core/EventBus';
import { entityFactory } from '../../entities/EntityFactory';
import type { Dish } from '../../entities/types';

export interface ShopState {
    gold: number;
    inventory: string[];
    weaponPage: number;
    equipmentPage: number;
    dishPage: number;
}

export class ShopStateManager {
    private state: ShopState;
    private keyListener: ((e: KeyboardEvent) => void) | null = null;
    private messageText: string = '';
    private messageTimer: number = 0;
    private onRender: () => void;

    constructor(onRender: () => void) {
        this.onRender = onRender;

        const gameData = gameState.getState();
        this.state = {
            gold: gameData.gold,
            inventory: [...gameData.inventory],
            weaponPage: 0,
            equipmentPage: 0,
            dishPage: 0
        };

        this.setupEventListeners();
        this.setupKeyboardControls();
    }

    getState(): ShopState {
        return this.state;
    }

    getMessage(): { text: string; timer: number } {
        return { text: this.messageText, timer: this.messageTimer };
    }

    showMessage(msg: string): void {
        this.messageText = msg;
        this.messageTimer = 3000;
        this.onRender();
    }

    updateMessageTimer(deltaTime: number): void {
        if (this.messageTimer > 0) {
            this.messageTimer -= deltaTime * 1000;
            if (this.messageTimer <= 0) {
                this.messageText = '';
                const msgElement = document.getElementById('shop-message');
                if (msgElement) {
                    msgElement.remove();
                }
            }
        }
    }

    getDishes(): Dish[] {
        // Get dishes from gameState.dishes array, not inventory
        const gameData = gameState.getState();
        return gameData.dishes
            .map(id => entityFactory.getTemplate(id))
            .filter(item => item != null) as Dish[]; // Filters both null and undefined
    }

    updateGoldDisplay(): void {
        const goldElement = document.getElementById('shop-gold');
        if (goldElement && goldElement instanceof SVGTextElement) {
            goldElement.textContent = `Gold: ${this.state.gold}`;
        }
    }

    resetPagination(): void {
        this.state.weaponPage = 0;
        this.state.equipmentPage = 0;
        this.state.dishPage = 0;
    }

    private setupEventListeners(): void {
        eventBus.on('gold:changed', (gold: number) => {
            this.state.gold = gold;
            this.updateGoldDisplay();
        });

        eventBus.on('inventory:changed', () => {
            this.state.inventory = [...gameState.getState().inventory];
            this.onRender();
        });

        eventBus.on('dish:added', () => {
            this.onRender();
        });

        eventBus.on('dish:removed', () => {
            this.onRender();
        });
    }

    setupKeyboardControls(): void {
        this.keyListener = (e: KeyboardEvent) => {
            if (gameState.getState().currentScreen !== 'shop') return;

            if (e.key === 'Escape') {
                e.preventDefault();
                const currentState = gameState.getState();
                if (currentState.currentScreen === 'shop') {
                    (gameState as any).state.currentScreen = 'game';
                    eventBus.emit('screen:changed', 'game');
                }
                return;
            }
        };

        window.addEventListener('keydown', this.keyListener);
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        this.messageText = '';
        this.messageTimer = 0;
        this.resetPagination();
    }
}
