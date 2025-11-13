/**
 * Entity type definitions
 * These interfaces define the structure of all game entities
 */

export interface BaseEntity {
    id: string;
    name: string;
    description: string;
}

export type AIBehaviorType = 'patrol' | 'aggressive' | 'defensive' | 'ranged' | 'ambusher' | 'standard';
export type AttackPattern = 'standard' | 'burst' | 'charge' | 'strafe' | 'retreat';

export interface Enemy extends BaseEntity {
    type: 'enemy';
    health: number;
    attack: number;
    defense: number;
    weaponId?: string; // Optional weapon ID
    lootTable: Array<{
        itemId: string;
        chance: number;
    }>;
    goldReward?: number; // Deprecated - enemies no longer drop gold
    aiBehavior?: AIBehaviorType; // AI personality type
    attackPattern?: AttackPattern; // Attack pattern type
    speed?: number; // Movement speed multiplier
}

export interface Ingredient extends BaseEntity {
    type: 'ingredient';
    icon?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    baseValue: number;
}

export interface CookingMethod extends BaseEntity {
    type: 'cookingMethod';
    unlocked: boolean;
    cost: number;
    qualityModifier: number;
}

export interface Recipe extends BaseEntity {
    type: 'recipe';
    ingredients: string[];
    cookingMethod: string;
    cookingTime: number;
    cookingTimeRange: {
        min: number;
        max: number;
    };
    buffType: 'health' | 'attack' | 'defense';
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface Dish extends BaseEntity {
    type: 'dish';
    recipeId: string;
    ingredients: string[];
    cookingMethod: string;
    cookingTime: number;
    quality: number;
    value: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    buffType: 'health' | 'attack' | 'defense';
    effects?: {
        health?: number;
        attack?: number;
        defense?: number;
        duration?: number;
    };
}

export interface Equipment extends BaseEntity {
    type: 'equipment';
    slot: 'weapon' | 'armor';
    stats: {
        attack?: number;
        defense?: number;
        health?: number;
    };
    cost: number;
}

export interface Weapon extends BaseEntity {
    type: 'weapon';
    weaponType: 'melee' | 'ranged';
    damage: number;
    attackSpeed: number; // Cooldown in seconds
    range: number;
    projectileSpeed: number; // 0 for melee
    pelletCount?: number; // For shotgun-style weapons
    spread?: number; // Angle spread for multi-projectile weapons
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    cost: number;
    requiredLocation?: string; // Location that must be unlocked to see this weapon
    // Visual properties
    projectileColor?: string; // Color of projectiles
    projectileSize?: number; // Size of projectiles
    projectileShape?: 'circle' | 'beam' | 'bolt' | 'fire'; // Shape of projectiles
    trailColor?: string; // Trail particle color
    impactColor?: string; // Impact particle color
}

export type GameEntity = Enemy | Ingredient | CookingMethod | Dish | Equipment | Weapon | Recipe;
