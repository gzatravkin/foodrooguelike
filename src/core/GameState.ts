/**
 * GameState - Manages global game state
 * All game data is stored here and can be accessed/modified through this singleton
 */

import { eventBus } from './EventBus';

export interface PlayerStats {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
}

export interface GameData {
    player: PlayerStats;
    gold: number;
    inventory: string[];
    discoveredRecipes: string[];
    currentScreen: 'base' | 'expedition' | 'shop' | 'cooking';
    equipment: {
        weapon?: string;
        armor?: string;
    };
    activeBuffs: Array<{
        name: string;
        duration: number;
        effects: Partial<PlayerStats>;
    }>;
}

class GameState {
    private state: GameData;

    constructor() {
        this.state = this.getInitialState();
    }

    private getInitialState(): GameData {
        return {
            player: {
                health: 100,
                maxHealth: 100,
                attack: 10,
                defense: 5
            },
            gold: 100,
            inventory: [],
            discoveredRecipes: [],
            currentScreen: 'base',
            equipment: {},
            activeBuffs: []
        };
    }

    getState(): GameData {
        return { ...this.state };
    }

    updatePlayer(updates: Partial<PlayerStats>): void {
        this.state.player = { ...this.state.player, ...updates };
        eventBus.emit('player:updated', this.state.player);
    }

    addGold(amount: number): void {
        this.state.gold += amount;
        eventBus.emit('gold:changed', this.state.gold);
    }

    addToInventory(itemId: string): void {
        this.state.inventory.push(itemId);
        eventBus.emit('inventory:changed', this.state.inventory);
    }

    removeFromInventory(itemId: string): boolean {
        const index = this.state.inventory.indexOf(itemId);
        if (index > -1) {
            this.state.inventory.splice(index, 1);
            eventBus.emit('inventory:changed', this.state.inventory);
            return true;
        }
        return false;
    }

    discoverRecipe(recipeId: string): void {
        if (!this.state.discoveredRecipes.includes(recipeId)) {
            this.state.discoveredRecipes.push(recipeId);
            eventBus.emit('recipe:discovered', recipeId);
        }
    }

    setScreen(screen: GameData['currentScreen']): void {
        this.state.currentScreen = screen;
        eventBus.emit('screen:changed', screen);
    }

    addBuff(buff: GameData['activeBuffs'][0]): void {
        this.state.activeBuffs.push(buff);
        eventBus.emit('buff:added', buff);
    }

    tickBuffs(): void {
        this.state.activeBuffs = this.state.activeBuffs.filter(buff => {
            buff.duration--;
            return buff.duration > 0;
        });
    }

    reset(): void {
        this.state = this.getInitialState();
        eventBus.emit('game:reset');
    }
}

export const gameState = new GameState();
