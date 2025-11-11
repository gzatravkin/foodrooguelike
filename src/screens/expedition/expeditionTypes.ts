/**
 * Type definitions for expeditions
 */

export interface ExpeditionLocation {
    id: string;
    name: string;
    description: string;
    cost: number;
    difficulty: number;
    enemyTypes: string[];
    enemyCount: { min: number; max: number };
    lootMultiplier: number;
    theme: string;
    level?: number; // Current level being attempted (1-50)
}

/**
 * Helper function to check if a level is a boss level
 */
export function isBossLevel(level: number): boolean {
    return level === 5 || level === 15 || level === 25 || level === 30 || level === 50;
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
        health: 1.0 + (level - 1) * 0.05, // +5% per level, max 3.45x at level 50
        attack: 1.0 + (level - 1) * 0.04, // +4% per level, max 2.96x at level 50
        defense: 1.0 + (level - 1) * 0.03, // +3% per level, max 2.47x at level 50
        count: Math.floor((level - 1) / 5), // +1 enemy every 5 levels
        loot: 1.0 + level * 0.02 // +2% per level, max 2.0x at level 50
    };
}
