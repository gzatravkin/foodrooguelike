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

export interface TrainingSkill {
    id: string;
    level: number;
}

export interface ExpeditionLocation {
    id: string;
    name: string;
    description: string;
    cost: number;
    difficulty: number;
    enemyTypes: string[];
    lootMultiplier: number;
}

export interface GameData {
    player: PlayerStats;
    gold: number;
    inventory: string[];
    dishes: string[]; // IDs of cooked dishes available to sell/eat
    discoveredRecipes: string[];
    currentScreen: 'base' | 'shop' | 'cooking' | 'settings' | 'restaurant' | 'upgrades' | 'recipebook' | 'game' | 'training' | 'expedition' | 'worldmap';
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
    trainingSkills: TrainingSkill[];
    expeditionState: {
        hungerTimer: number; // Time remaining in current expedition (seconds)
        maxHungerTime: number; // 60 seconds
        selectedFoodBuff?: string; // Dish ID for pre-expedition buff
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
            gold: 50, // Start with some gold for first expeditions
            inventory: [],
            dishes: [],
            discoveredRecipes: [],
            currentScreen: 'game',
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
            },
            trainingSkills: [],
            expeditionState: {
                hungerTimer: 60,
                maxHungerTime: 60,
                selectedFoodBuff: undefined
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

    setCurrentScreen(screen: GameData['currentScreen']): void {
        this.setScreen(screen);
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
                // Recalculate player stats from upgrades after loading
                this.recalculatePlayerStats();
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

    // Training system methods
    purchaseTrainingSkill(skillId: string): void {
        const existing = this.state.trainingSkills.find(s => s.id === skillId);
        if (existing) {
            existing.level++;
        } else {
            this.state.trainingSkills.push({ id: skillId, level: 1 });
        }
        eventBus.emit('training:purchased', { skillId });
    }

    getTrainingSkillLevel(skillId: string): number {
        const skill = this.state.trainingSkills.find(s => s.id === skillId);
        return skill?.level || 0;
    }

    // Expedition system methods
    setHungerTimer(time: number): void {
        this.state.expeditionState.hungerTimer = time;
    }

    tickHunger(deltaTime: number): void {
        this.state.expeditionState.hungerTimer = Math.max(0, this.state.expeditionState.hungerTimer - deltaTime);
    }

    resetHungerTimer(): void {
        this.state.expeditionState.hungerTimer = this.state.expeditionState.maxHungerTime;
    }

    setSelectedFoodBuff(dishId: string | undefined): void {
        this.state.expeditionState.selectedFoodBuff = dishId;
    }

    spendGold(amount: number): boolean {
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            eventBus.emit('gold:changed', this.state.gold);
            return true;
        }
        return false;
    }

    // Calculate total bonuses from character perk upgrades
    calculateCharacterPerkBonuses(): Partial<PlayerStats> {
        const bonuses: Partial<PlayerStats> = {
            maxHealth: 0,
            health: 0,
            attack: 0,
            defense: 0
        };

        const characterPerks = this.state.upgrades.characterPerks;

        // Load upgrade data to get effect values
        import('../data/upgrades.json').then((upgradesModule) => {
            const upgradesData = upgradesModule.default as Record<string, any>;

            characterPerks.forEach(perk => {
                const upgradeData = upgradesData[perk.id];
                if (!upgradeData || !upgradeData.effects) return;

                const effects = upgradeData.effects;

                // Apply bonuses based on level
                if (effects.maxHealthBonus) {
                    bonuses.maxHealth! += effects.maxHealthBonus * perk.level;
                    bonuses.health! += effects.maxHealthBonus * perk.level;
                }
                if (effects.attackBonus) {
                    bonuses.attack! += effects.attackBonus * perk.level;
                }
                if (effects.defenseBonus) {
                    bonuses.defense! += effects.defenseBonus * perk.level;
                }
            });
        });

        return bonuses;
    }

    // Recalculate and apply all character perk and training skill bonuses from base stats
    recalculatePlayerStats(): void {
        // Start with base stats
        const baseStats: PlayerStats = {
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5
        };

        // Get current health percentage to maintain it
        const healthPercent = this.state.player.maxHealth > 0
            ? this.state.player.health / this.state.player.maxHealth
            : 1;

        // Calculate total bonuses from character perks
        let totalMaxHealthBonus = 0;
        let totalAttackBonus = 0;
        let totalDefenseBonus = 0;

        const characterPerks = this.state.upgrades.characterPerks;

        // Calculate bonuses from character perk upgrades
        characterPerks.forEach(perk => {
            if (perk.id === 'health_boost') {
                totalMaxHealthBonus += 20 * perk.level; // 20 HP per level
            } else if (perk.id === 'attack_boost') {
                totalAttackBonus += 2 * perk.level; // 2 attack per level
            } else if (perk.id === 'defense_boost') {
                totalDefenseBonus += 1 * perk.level; // 1 defense per level
            }
        });

        // Calculate bonuses from training skills
        const trainingSkills = this.state.trainingSkills;
        trainingSkills.forEach(skill => {
            if (skill.id === 'vitality') {
                totalMaxHealthBonus += 10 * skill.level; // 10 HP per level
            } else if (skill.id === 'combat_training') {
                totalAttackBonus += 2 * skill.level; // 2 attack per level
            } else if (skill.id === 'defensive_stance') {
                totalDefenseBonus += 1 * skill.level; // 1 defense per level
            }
        });

        // Apply bonuses to base stats
        const newMaxHealth = baseStats.maxHealth + totalMaxHealthBonus;
        const newAttack = baseStats.attack + totalAttackBonus;
        const newDefense = baseStats.defense + totalDefenseBonus;

        // Maintain health percentage when max health changes
        const newHealth = Math.ceil(newMaxHealth * healthPercent);

        this.state.player = {
            health: newHealth,
            maxHealth: newMaxHealth,
            attack: newAttack,
            defense: newDefense
        };

        eventBus.emit('player:updated', this.state.player);
    }
}

export const gameState = new GameState();
