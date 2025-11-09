/**
 * CombatSystem - Handles combat logic between player and enemies
 */

import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';
import type { Enemy } from '../entities/types';

export interface CombatResult {
    victory: boolean;
    damageDealt: number;
    damageTaken: number;
    rewards?: {
        gold: number;
        loot: string[];
    };
}

export class CombatSystem {
    fight(enemy: Enemy): CombatResult {
        const player = gameState.getState().player;

        // Calculate damage
        const damageToEnemy = Math.max(1, player.attack - enemy.defense);
        const damageToPlayer = Math.max(1, enemy.attack - player.defense);

        // Simulate combat
        let enemyHealth = enemy.health;
        let playerHealth = player.health;

        while (enemyHealth > 0 && playerHealth > 0) {
            enemyHealth -= damageToEnemy;
            if (enemyHealth <= 0) break;
            playerHealth -= damageToPlayer;
        }

        const victory = enemyHealth <= 0;
        const totalDamageTaken = player.health - playerHealth;

        // Update player health
        gameState.updatePlayer({ health: Math.max(0, playerHealth) });

        // Process rewards if victory
        let rewards;
        if (victory) {
            rewards = this.processRewards(enemy);
        }

        const result: CombatResult = {
            victory,
            damageDealt: enemy.health - Math.max(0, enemyHealth),
            damageTaken: totalDamageTaken,
            rewards
        };

        eventBus.emit('combat:finished', result);
        return result;
    }

    private processRewards(enemy: Enemy) {
        gameState.addGold(enemy.goldReward);

        const loot: string[] = [];
        enemy.lootTable.forEach(drop => {
            if (Math.random() < drop.chance) {
                loot.push(drop.itemId);
                gameState.addToInventory(drop.itemId);
            }
        });

        return {
            gold: enemy.goldReward,
            loot
        };
    }
}

export const combatSystem = new CombatSystem();
