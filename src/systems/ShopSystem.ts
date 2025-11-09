/**
 * ShopSystem - Handles buying/selling items
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import type { Dish, Equipment } from '../entities/types';

export class ShopSystem {
    buyEquipment(equipmentId: string): boolean {
        const equipment = entityFactory.create(equipmentId) as Equipment;
        if (!equipment) return false;

        const state = gameState.getState();
        if (state.gold < equipment.cost) {
            eventBus.emit('shop:insufficient_funds');
            return false;
        }

        gameState.addGold(-equipment.cost);
        gameState.addToInventory(equipmentId);

        eventBus.emit('shop:purchase', equipment);
        return true;
    }

    sellDish(dish: Dish): void {
        const value = Math.floor(dish.value);
        gameState.addGold(value);

        eventBus.emit('shop:sold', { dish, value });
    }

    eatDish(dish: Dish): void {
        if (dish.effects) {
            const duration = dish.effects.duration || 0;

            if (dish.effects.health) {
                const state = gameState.getState();
                const newHealth = Math.min(
                    state.player.maxHealth,
                    state.player.health + dish.effects.health
                );
                gameState.updatePlayer({ health: newHealth });
            }

            if (dish.effects.attack || dish.effects.defense) {
                gameState.addBuff({
                    name: dish.name,
                    duration,
                    effects: {
                        attack: dish.effects.attack,
                        defense: dish.effects.defense
                    }
                });
            }
        }

        eventBus.emit('shop:eaten', dish);
    }

    getShopInventory(): Equipment[] {
        return entityFactory.getAllOfType('equipment') as Equipment[];
    }
}

export const shopSystem = new ShopSystem();
