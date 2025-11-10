/**
 * ShopSystem - Handles buying/selling items with improved error handling
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import type { Dish, Equipment, Weapon } from '../entities/types';

export class ShopSystem {
    /**
     * Buy equipment and add it to inventory
     */
    buyEquipment(equipmentId: string): boolean {
        const equipment = entityFactory.create(equipmentId) as Equipment;

        if (!equipment) {
            console.error(`ShopSystem: Equipment ${equipmentId} not found`);
            eventBus.emit('shop:error', { message: 'Equipment not found' });
            return false;
        }

        if (equipment.type !== 'equipment') {
            console.error(`ShopSystem: ${equipmentId} is not equipment`);
            eventBus.emit('shop:error', { message: 'Invalid item type' });
            return false;
        }

        const state = gameState.getState();
        if (state.gold < equipment.cost) {
            eventBus.emit('shop:insufficient_funds', {
                required: equipment.cost,
                available: state.gold
            });
            return false;
        }

        // Process purchase
        gameState.addGold(-equipment.cost);
        gameState.addToInventory(equipmentId);

        eventBus.emit('shop:purchase', { item: equipment, type: 'equipment' });
        return true;
    }

    /**
     * Buy weapon, add to inventory, and auto-equip
     */
    buyWeapon(weaponId: string): boolean {
        const weapon = entityFactory.createWeapon(weaponId);

        if (!weapon) {
            console.error(`ShopSystem: Weapon ${weaponId} not found`);
            eventBus.emit('shop:error', { message: 'Weapon not found' });
            return false;
        }

        const state = gameState.getState();
        if (state.gold < weapon.cost) {
            eventBus.emit('shop:insufficient_funds', {
                required: weapon.cost,
                available: state.gold
            });
            return false;
        }

        // Process purchase
        gameState.addGold(-weapon.cost);
        gameState.addToInventory(weaponId);

        // Auto-equip the purchased weapon
        gameState.equipWeapon(weaponId);

        eventBus.emit('shop:weapon_purchase', { weapon });
        return true;
    }

    /**
     * Sell a dish for gold
     */
    sellDish(dish: Dish): void {
        if (!dish) {
            console.error('ShopSystem: Cannot sell null dish');
            return;
        }

        if (dish.type !== 'dish') {
            console.error('ShopSystem: Item is not a dish');
            return;
        }

        const value = Math.floor(dish.value);
        if (value <= 0) {
            console.warn(`ShopSystem: Dish ${dish.name} has no value`);
            return;
        }

        gameState.addGold(value);
        eventBus.emit('shop:sold', { dish, value });
    }

    /**
     * Consume a dish for its effects
     */
    eatDish(dish: Dish): void {
        if (!dish) {
            console.error('ShopSystem: Cannot eat null dish');
            return;
        }

        if (dish.type !== 'dish') {
            console.error('ShopSystem: Item is not a dish');
            return;
        }

        if (!dish.effects) {
            console.warn(`ShopSystem: Dish ${dish.name} has no effects`);
            eventBus.emit('shop:eaten', { dish });
            return;
        }

        const duration = dish.effects.duration || 0;

        // Apply health restoration
        if (dish.effects.health && dish.effects.health > 0) {
            const state = gameState.getState();
            const newHealth = Math.min(
                state.player.maxHealth,
                state.player.health + dish.effects.health
            );
            gameState.updatePlayer({ health: newHealth });
        }

        // Apply buffs
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

        eventBus.emit('shop:eaten', { dish });
    }

    /**
     * Get all available equipment in the shop
     */
    getShopInventory(): Equipment[] {
        const items = entityFactory.getAllOfType('equipment') as Equipment[];

        // Filter out invalid items and sort by cost
        return items
            .filter(item => item && item.cost > 0)
            .sort((a, b) => a.cost - b.cost);
    }

    /**
     * Get all available weapons in the shop
     */
    getWeaponInventory(): Weapon[] {
        const weapons = entityFactory.getAllOfType('weapon') as Weapon[];

        // Filter out invalid weapons and sort by cost
        return weapons
            .filter(weapon => weapon && weapon.cost > 0)
            .sort((a, b) => {
                // Sort by rarity first, then cost
                const rarityOrder: Record<string, number> = {
                    common: 0,
                    uncommon: 1,
                    rare: 2,
                    legendary: 3
                };

                const rarityA = rarityOrder[a.rarity] || 0;
                const rarityB = rarityOrder[b.rarity] || 0;

                if (rarityA !== rarityB) {
                    return rarityA - rarityB;
                }

                return a.cost - b.cost;
            });
    }

    /**
     * Check if player can afford an item
     */
    canAfford(cost: number): boolean {
        const state = gameState.getState();
        return state.gold >= cost;
    }

    /**
     * Get current gold amount
     */
    getCurrentGold(): number {
        return gameState.getState().gold;
    }
}

export const shopSystem = new ShopSystem();
