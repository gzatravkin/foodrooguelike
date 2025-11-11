/**
 * EnemyLoot - Loot generation logic for enemies
 */

import { Enemy as EnemyData } from './types';

export class EnemyLoot {
  private lootTable: EnemyData['lootTable'];

  constructor(lootTable: EnemyData['lootTable']) {
    this.lootTable = lootTable;
  }

  getLoot(): { gold: number; items: string[] } {
    const items: string[] = [];

    for (const drop of this.lootTable) {
      if (Math.random() < drop.chance) {
        items.push(drop.itemId);
      }
    }

    return { gold: 0, items };
  }
}
