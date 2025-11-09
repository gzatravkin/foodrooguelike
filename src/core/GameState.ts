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

export interface Upgrade {
    id: string;
    level: number;
}

export interface RestaurantData {
    level: number;
    location: string;
    reputation: number;
}

export interface GameData {
    player: PlayerStats;
    gold: number;
    inventory: string[];
    dishes: string[]; // IDs of cooked dishes available to sell/eat
    discoveredRecipes: string[];
    currentScreen: 'base' | 'expedition' | 'shop' | 'cooking' | 'settings' | 'restaurant' | 'upgrades';
    equipment: {
        weapon?: string;
        armor?: string;
    };
    activeBuffs: Array<{
        name: string;
        duration: number;
        effects: Partial<PlayerStats>;
    }>;
    restaurant: RestaurantData;
    upgrades: {
        kitchen: Upgrade[];
        restaurantUpgrades: Upgrade[];
        characterPerks: Upgrade[];
    };
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
            gold: 0, // Start with no gold - must earn through cooking!
            inventory: [],
            dishes: [],
            discoveredRecipes: [],
            currentScreen: 'base',
            equipment: {},
            activeBuffs: [],
            restaurant: {
                level: 1,
                location: 'starter_kitchen',
                reputation: 0
            },
            upgrades: {
                kitchen: [],
                restaurantUpgrades: [],
                characterPerks: []
            }
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

    equipWeapon(weaponId: string): void {
        this.state.equipment.weapon = weaponId;
        eventBus.emit('weapon:equipped', weaponId);
    }

    equipArmor(armorId: string): void {
        this.state.equipment.armor = armorId;
        eventBus.emit('armor:equipped', armorId);
    }

    addBuff(buff: GameData['activeBuffs'][0]): void {
        // Only allow one active buff at a time (food buff system)
        // Remove any existing buffs before adding new one
        this.state.activeBuffs = [buff];
        eventBus.emit('buff:added', buff);
    }

    clearBuffs(): void {
        this.state.activeBuffs = [];
        eventBus.emit('buffs:cleared');
    }

    tickBuffs(): void {
        this.state.activeBuffs = this.state.activeBuffs.filter(buff => {
            buff.duration--;
            return buff.duration > 0;
        });
    }

    addDish(dishId: string): void {
        this.state.dishes.push(dishId);
        eventBus.emit('dish:added', dishId);
    }

    removeDish(dishId: string): boolean {
        const index = this.state.dishes.indexOf(dishId);
        if (index > -1) {
            this.state.dishes.splice(index, 1);
            eventBus.emit('dish:removed', dishId);
            return true;
        }
        return false;
    }

    upgradeRestaurant(newLevel: number, newLocation: string): void {
        this.state.restaurant.level = newLevel;
        this.state.restaurant.location = newLocation;
        eventBus.emit('restaurant:upgraded', this.state.restaurant);
    }

    addReputation(amount: number): void {
        this.state.restaurant.reputation += amount;
        eventBus.emit('reputation:changed', this.state.restaurant.reputation);
    }

    purchaseUpgrade(category: keyof GameData['upgrades'], upgradeId: string): void {
        const existing = this.state.upgrades[category].find(u => u.id === upgradeId);
        if (existing) {
            existing.level++;
        } else {
            this.state.upgrades[category].push({ id: upgradeId, level: 1 });
        }
        eventBus.emit('upgrade:purchased', { category, upgradeId });
    }

    getUpgradeLevel(category: keyof GameData['upgrades'], upgradeId: string): number {
        const upgrade = this.state.upgrades[category].find(u => u.id === upgradeId);
        return upgrade?.level || 0;
    }

    saveGame(): void {
        try {
            const saveData = JSON.stringify(this.state);
            localStorage.setItem('foodroguelike_save', saveData);
            eventBus.emit('game:saved');
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }

    loadGame(): boolean {
        try {
            const saveData = localStorage.getItem('foodroguelike_save');
            if (saveData) {
                this.state = JSON.parse(saveData);
                eventBus.emit('game:loaded');
                return true;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return false;
    }

    reset(): void {
        this.state = this.getInitialState();
        localStorage.removeItem('foodroguelike_save');
        eventBus.emit('game:reset');
    }
}

export const gameState = new GameState();
