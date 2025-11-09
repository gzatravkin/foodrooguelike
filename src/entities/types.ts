/**
 * Entity type definitions
 * These interfaces define the structure of all game entities
 */

export interface BaseEntity {
    id: string;
    name: string;
    description: string;
}

export interface Enemy extends BaseEntity {
    type: 'enemy';
    health: number;
    attack: number;
    defense: number;
    lootTable: Array<{
        itemId: string;
        chance: number;
    }>;
    goldReward: number;
}

export interface Ingredient extends BaseEntity {
    type: 'ingredient';
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    baseValue: number;
}

export interface CookingMethod extends BaseEntity {
    type: 'cookingMethod';
    unlocked: boolean;
    cost: number;
    qualityModifier: number;
}

export interface Recipe {
    id: string;
    ingredients: string[];
    cookingMethod: string;
    result: Dish;
    discoveryHint?: string;
}

export interface Dish extends BaseEntity {
    type: 'dish';
    ingredients: string[];
    cookingMethod: string;
    quality: number;
    value: number;
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

export type GameEntity = Enemy | Ingredient | CookingMethod | Dish | Equipment;
