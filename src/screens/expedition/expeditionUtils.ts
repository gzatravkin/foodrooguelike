/**
 * Utility functions for expedition management
 */

import { gameState } from '../../core/GameState';
import type { ExpeditionLocation } from './expeditionTypes';

/**
 * Calculate the actual cost of an expedition with training discounts applied
 */
export function getExpeditionCost(expedition: ExpeditionLocation): number {
    const discount = gameState.getTrainingSkillLevel('expedition_efficiency') * 0.1;
    return Math.floor(expedition.cost * (1 - discount));
}

/**
 * Check if the player can afford any expedition
 */
export function canAffordAnyExpedition(
    expeditions: Record<string, ExpeditionLocation>,
    gold: number
): boolean {
    return Object.values(expeditions).some(exp => {
        const cost = getExpeditionCost(exp);
        return gold >= cost;
    });
}
