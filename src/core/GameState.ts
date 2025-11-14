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

export interface SavedRecipeConfig {
    recipeId: string;
    recipeName: string;
    ingredientTemplates: string[]; // Template IDs, not instance IDs
    methodId: string;
    cookingTime: number;
}

export interface ExpeditionProgress {
    currentLevel: number; // Current level player can attempt (1-50)
    highestLevelCompleted: number; // Highest level successfully completed
}

export interface NPCClientData {
    id: string;
    name: string;
    color: string;
    goldReward: number;
    preferredBuffType?: 'health' | 'attack' | 'defense';
    locationTier: number;
    wantsFood: boolean;
    theme?: string; // Theme from last visited location for visual appearance
}

export interface GameData {
    player: PlayerStats;
    gold: number;
    inventory: string[];
    dishes: string[]; // IDs of cooked dishes available to sell/eat
    discoveredRecipes: string[];
    savedRecipeConfigs: SavedRecipeConfig[]; // Quick-select recipe configurations
    currentScreen: 'menu' | 'shop' | 'cooking' | 'settings' | 'restaurant' | 'upgrades' | 'recipebook' | 'game' | 'training' | 'expedition' | 'worldmap' | 'diningroom';
    combatWeapon?: string; // Combat weapon ID (rusty_sword, iron_sword, etc.)
    equipment: {
        weapon?: string; // Equipment with slot="weapon" (steel_sword, iron_sword equipment)
        armor?: string; // Equipment with slot="armor" (leather_armor, chain_mail)
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
        currentExpeditionId?: string; // Currently active expedition
        currentLevel?: number; // Current level being attempted
    };
    expeditionProgress: { [expeditionId: string]: ExpeditionProgress }; // Level progression per expedition
    unlockedExpeditions: string[]; // IDs of expeditions that have been unlocked
    lastVisitedLocation?: string; // Last expedition location visited
    diningRoomClients: NPCClientData[]; // NPCs waiting for food in the dining room
}

class GameState {
    private state: GameData;

    constructor() {
        this.state = this.getInitialState();
        this.initializeDefaultRecipes();
    }

    private getInitialState(): GameData {
        return {
            player: {
                health: 100,
                maxHealth: 100,
                attack: 10,
                defense: 5
            },
            gold: 200, // Start with some gold for first expeditions
            inventory: ['fists'], // Start with fists so player can always switch back
            dishes: [],
            discoveredRecipes: [],
            savedRecipeConfigs: [],
            currentScreen: 'game',
            combatWeapon: 'fists', // Start with fists
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
                selectedFoodBuff: undefined,
                currentExpeditionId: undefined,
                currentLevel: undefined
            },
            expeditionProgress: {
                // All expeditions start at level 1
                'forest_outskirts': { currentLevel: 1, highestLevelCompleted: 0 },
                'dark_cave': { currentLevel: 1, highestLevelCompleted: 0 },
                'goblin_camp': { currentLevel: 1, highestLevelCompleted: 0 },
                'orc_stronghold': { currentLevel: 1, highestLevelCompleted: 0 },
                'frozen_wasteland': { currentLevel: 1, highestLevelCompleted: 0 },
                'volcano_depths': { currentLevel: 1, highestLevelCompleted: 0 },
                'demon_realm': { currentLevel: 1, highestLevelCompleted: 0 }
            },
            unlockedExpeditions: ['forest_outskirts'], // Start with first expedition unlocked
            lastVisitedLocation: undefined,
            diningRoomClients: []
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

    saveRecipeConfig(config: SavedRecipeConfig): void {
        // Check if this recipe config already exists
        const exists = this.state.savedRecipeConfigs.some(c => c.recipeId === config.recipeId);
        if (!exists) {
            this.state.savedRecipeConfigs.push(config);
            eventBus.emit('recipe:saved', config);
        }
    }

    getSavedRecipeConfigs(): SavedRecipeConfig[] {
        return this.state.savedRecipeConfigs;
    }

    private initializeDefaultRecipes(): void {
        // Add 5 default recipes for boil (the initially available cooking method)
        const defaultRecipes: SavedRecipeConfig[] = [
            {
                recipeId: 'slime_pudding',
                recipeName: 'Slime Pudding',
                ingredientTemplates: ['jelly', 'sugar'],
                methodId: 'boil',
                cookingTime: 30
            },
            {
                recipeId: 'mushroom_soup',
                recipeName: 'Mushroom Soup',
                ingredientTemplates: ['mushroom', 'herb', 'salt'],
                methodId: 'boil',
                cookingTime: 45
            },
            {
                recipeId: 'fried_rice',
                recipeName: 'Fried Rice',
                ingredientTemplates: ['rice', 'egg', 'onion', 'garlic'],
                methodId: 'fry',
                cookingTime: 40
            },
            {
                recipeId: 'grilled_meat',
                recipeName: 'Grilled Meat',
                ingredientTemplates: ['meat', 'salt', 'herb'],
                methodId: 'grill',
                cookingTime: 60
            },
            {
                recipeId: 'herb_bread',
                recipeName: 'Herb Bread',
                ingredientTemplates: ['flour', 'herb', 'salt'],
                methodId: 'bake',
                cookingTime: 90
            }
        ];

        // Only add if savedRecipeConfigs is empty (first time initialization)
        if (this.state.savedRecipeConfigs.length === 0) {
            this.state.savedRecipeConfigs = defaultRecipes;
        }
    }

    setScreen(screen: GameData['currentScreen']): void {
        this.state.currentScreen = screen;
        eventBus.emit('screen:changed', screen);
    }

    setCurrentScreen(screen: GameData['currentScreen']): void {
        this.setScreen(screen);
    }

    // Equip combat weapon (type="weapon")
    equipWeapon(weaponId: string): void {
        this.state.combatWeapon = weaponId;
        eventBus.emit('weapon:equipped', weaponId);
    }

    // Equip weapon equipment (type="equipment", slot="weapon")
    equipWeaponEquipment(equipmentId: string): void {
        this.state.equipment.weapon = equipmentId;
        eventBus.emit('weapon-equipment:equipped', equipmentId);
    }

    // Equip armor equipment (type="equipment", slot="armor")
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

    setCurrentExpedition(expeditionId: string, level: number): void {
        this.state.expeditionState.currentExpeditionId = expeditionId;
        this.state.expeditionState.currentLevel = level;
    }

    clearCurrentExpedition(): void {
        this.state.expeditionState.currentExpeditionId = undefined;
        this.state.expeditionState.currentLevel = undefined;
    }

    getExpeditionProgress(expeditionId: string): ExpeditionProgress {
        if (!this.state.expeditionProgress[expeditionId]) {
            this.state.expeditionProgress[expeditionId] = { currentLevel: 1, highestLevelCompleted: 0 };
        }
        return this.state.expeditionProgress[expeditionId];
    }

    isLocationUnlocked(expeditionId: string): boolean {
        return this.state.unlockedExpeditions.includes(expeditionId);
    }

    getUnlockedLocations(): string[] {
        return this.state.unlockedExpeditions;
    }

    unlockExpedition(expeditionId: string, unlockCost: number): boolean {
        // Check if already unlocked
        if (this.isLocationUnlocked(expeditionId)) {
            return true;
        }

        // Check if player has enough gold
        if (this.spendGold(unlockCost)) {
            this.state.unlockedExpeditions.push(expeditionId);
            eventBus.emit('expedition:unlocked', expeditionId);
            return true;
        }

        return false;
    }

    completeExpeditionLevel(expeditionId: string, level: number): void {
        const progress = this.getExpeditionProgress(expeditionId);
        const wasFirstCompletion = progress.highestLevelCompleted === 0;

        // Update highest level completed
        if (level > progress.highestLevelCompleted) {
            progress.highestLevelCompleted = level;
        }

        // Unlock next level if not at max (50)
        if (level < 50 && level >= progress.currentLevel) {
            progress.currentLevel = level + 1;
        }

        // Move restaurant to this location on first completion
        if (wasFirstCompletion) {
            this.updateRestaurantLocation(expeditionId);
        }

        eventBus.emit('expedition:levelCompleted', { expeditionId, level });
    }

    updateRestaurantLocation(expeditionId: string): void {
        this.state.restaurant.location = expeditionId;
        eventBus.emit('restaurant:relocated', { location: expeditionId });
    }

    getRestaurantLocation(): string {
        return this.state.restaurant.location;
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

    // Dining room management methods
    setLastVisitedLocation(locationId: string): void {
        this.state.lastVisitedLocation = locationId;
    }

    getLastVisitedLocation(): string | undefined {
        return this.state.lastVisitedLocation;
    }

    spawnDiningRoomClients(count: number = 3): void {
        const locationData: { [key: string]: { tier: number; theme: string } } = {
            'starter_kitchen': { tier: 1, theme: 'forest' },
            'forest_outskirts': { tier: 1, theme: 'forest' },
            'dark_cave': { tier: 2, theme: 'cave' },
            'goblin_camp': { tier: 3, theme: 'ruins' },
            'orc_stronghold': { tier: 4, theme: 'dungeon' },
            'frozen_wasteland': { tier: 5, theme: 'ice' },
            'volcano_depths': { tier: 6, theme: 'lava' },
            'demon_realm': { tier: 7, theme: 'void' }
        };

        const lastLocation = this.state.lastVisitedLocation || 'forest_outskirts';
        const locationInfo = locationData[lastLocation] || { tier: 1, theme: 'forest' };

        const clientNames = [
            'Adventurer Bob', 'Merchant Sarah', 'Knight John', 'Wizard Alice',
            'Ranger Tom', 'Cleric Emma', 'Bard Jack', 'Rogue Lily',
            'Paladin Mike', 'Druid Anna', 'Monk Chen', 'Barbarian Grog'
        ];

        const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
        const buffTypes: ('health' | 'attack' | 'defense')[] = ['health', 'attack', 'defense'];

        // Clear existing clients
        this.state.diningRoomClients = [];

        for (let i = 0; i < count; i++) {
            const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
            const client: NPCClientData = {
                id: `client_${Date.now()}_${i}`,
                name: clientName,
                color: colors[Math.floor(Math.random() * colors.length)],
                goldReward: 50 * locationInfo.tier + Math.floor(Math.random() * 20 * locationInfo.tier),
                preferredBuffType: buffTypes[Math.floor(Math.random() * buffTypes.length)],
                locationTier: locationInfo.tier,
                wantsFood: true,
                theme: locationInfo.theme
            };
            this.state.diningRoomClients.push(client);
        }

        eventBus.emit('diningroom:clientsSpawned', this.state.diningRoomClients);
    }

    serveDishToClient(clientIndex: number): void {
        if (clientIndex >= 0 && clientIndex < this.state.diningRoomClients.length) {
            this.state.diningRoomClients[clientIndex].wantsFood = false;
            eventBus.emit('diningroom:clientServed', clientIndex);
        }
    }

    getDiningRoomClients(): NPCClientData[] {
        return this.state.diningRoomClients;
    }
}

export const gameState = new GameState();
