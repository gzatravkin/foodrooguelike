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
}
