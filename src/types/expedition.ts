/**
 * Type definitions for expeditions
 */

export interface ExpeditionLocation {
    id: string;
    name: string;
    description: string;
    cost: number;
    unlockCost: number;
    difficulty: number;
    enemyTypes: string[];
    enemyCount?: { min: number; max: number };
    lootMultiplier: number;
    theme?: string;
    level?: number;
}

/**
 * Helper function to check if a level is a boss level
 */
export function isBossLevel(level: number): boolean {
    return level === 3 || level === 5 || level === 7 || level === 10;
}

/**
 * Calculate enemy stat multipliers based on level
 */
export function getLevelMultipliers(level: number): {
    health: number;
    attack: number;
    defense: number;
    count: number;
    loot: number;
} {
    return {
        health: 1.0 + (level - 1) * 0.25,
        attack: 1.0 + (level - 1) * 0.20,
        defense: 1.0 + (level - 1) * 0.15,
        count: Math.floor((level - 1) / 2),
        loot: 1.0 + level * 0.15
    };
}
