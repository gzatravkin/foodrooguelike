/**
 * ShopPurchaseHandler - Handles all purchase, sell, and eat logic
 */

import { shopSystem } from '../../systems/ShopSystem';
import { gameState } from '../../core/GameState';
import type { Weapon, Equipment, Dish } from '../../entities/types';
import type { ShopStateManager } from './ShopStateManager';

export class ShopPurchaseHandler {
    constructor(private stateManager: ShopStateManager) {}

    buyWeapon(weapon: Weapon): void {
        const state = this.stateManager.getState();

        if (state.gold < weapon.cost) {
            this.stateManager.showMessage('Not enough gold!');
            return;
        }

        const success = shopSystem.buyWeapon(weapon.id);
        if (success) {
            this.stateManager.showMessage(`Purchased ${weapon.name}! Equipped automatically.`);
        } else {
            this.stateManager.showMessage('Purchase failed!');
        }
    }

    buyEquipment(item: Equipment): void {
        const state = this.stateManager.getState();

        if (state.gold < item.cost) {
            this.stateManager.showMessage('Not enough gold!');
            return;
        }

        const success = shopSystem.buyEquipment(item.id);
        if (success) {
            this.stateManager.showMessage(`Purchased ${item.name}!`);
        } else {
            this.stateManager.showMessage('Purchase failed!');
        }
    }

    sellDish(dish: Dish): void {
        shopSystem.sellDish(dish);
        gameState.removeDish(dish.id);
        this.stateManager.showMessage(`Sold ${dish.name} for ${dish.value}g!`);
    }

    eatDish(dish: Dish): void {
        shopSystem.eatDish(dish);
        gameState.removeDish(dish.id);

        let msg = `Ate ${dish.name}!`;
        const effects: string[] = [];

        if (dish.effects?.health) {
            effects.push(`+${dish.effects.health} HP`);
        }
        if (dish.effects?.attack) {
            const duration = dish.effects.duration ? `${Math.floor(dish.effects.duration)}s` : '';
            effects.push(`+${dish.effects.attack} Attack ${duration}`);
        }
        if (dish.effects?.defense) {
            const duration = dish.effects.duration ? `${Math.floor(dish.effects.duration)}s` : '';
            effects.push(`+${dish.effects.defense} Defense ${duration}`);
        }

        if (effects.length > 0) {
            msg += ` ${effects.join(', ')}`;
        }

        this.stateManager.showMessage(msg);
    }
}
