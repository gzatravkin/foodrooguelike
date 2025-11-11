/**
 * UpgradeBonusService - Handles upgrade-related bonuses for cooking
 */

import { gameState } from '../core/GameState';

export class UpgradeBonusService {
    applyUpgradeBonus(baseQuality: number, cookingMethodId: string): number {
        const upgrades = gameState.getState().upgrades.kitchen;
        let qualityBonus = 0;

        // Master Cookware - applies to all cooking methods
        const masterCookware = upgrades.find(u => u.id === 'master_cookware');
        if (masterCookware) {
            qualityBonus += masterCookware.level * 0.05;
        }

        // Method-specific upgrades
        if (cookingMethodId === 'bake') {
            const betterOven = upgrades.find(u => u.id === 'better_oven');
            if (betterOven) {
                qualityBonus += betterOven.level * 0.10;
            }
        } else if (cookingMethodId === 'grill') {
            const premiumGrill = upgrades.find(u => u.id === 'premium_grill');
            if (premiumGrill) {
                qualityBonus += premiumGrill.level * 0.10;
            }
        } else if (cookingMethodId === 'fry') {
            const professionalFryer = upgrades.find(u => u.id === 'professional_fryer');
            if (professionalFryer) {
                qualityBonus += professionalFryer.level * 0.10;
            }
        }

        return Math.min(1.0, baseQuality + qualityBonus);
    }

    getIngredientPreserveChance(): number {
        const upgrades = gameState.getState().upgrades.kitchen;
        const ingredientPreserver = upgrades.find(u => u.id === 'ingredient_preserver');
        if (ingredientPreserver) {
            return ingredientPreserver.level * 0.05; // 5% per level
        }
        return 0;
    }
}

export const upgradeBonusService = new UpgradeBonusService();
