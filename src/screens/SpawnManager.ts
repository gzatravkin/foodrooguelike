/**
 * SpawnManager - Handles enemy and trap spawning logic
 */

import { MapSystem } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Trap } from '../entities/Trap';
import { entityFactory } from '../entities/EntityFactory';
import { Enemy as EnemyData } from '../entities/types';

export class SpawnManager {
  constructor(
    private mapSystem: MapSystem
  ) {}

  spawnEnemies(level: number, player: Player): Enemy[] {
    const enemies: Enemy[] = [];

    const allEnemies = entityFactory.getAllOfType('enemy') as EnemyData[];
    const levelEnemies = allEnemies.filter((e: EnemyData) => {
      if (level === 1) return e.goldReward <= 15;
      if (level === 2) return e.goldReward > 15 && e.goldReward <= 40;
      if (level === 3) return e.goldReward > 40 && e.goldReward <= 100;
      return e.goldReward > 100;
    });

    if (levelEnemies.length === 0) return enemies;

    const numEnemies = 5 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numEnemies; i++) {
      const enemyData = levelEnemies[Math.floor(Math.random() * levelEnemies.length)];
      const position = this.findValidEnemyPosition(player);

      if (position) {
        const weaponId = enemyData.weaponId;
        const weapon = weaponId ? entityFactory.createWeapon(weaponId) : null;
        enemies.push(new Enemy(position.x, position.y, enemyData, weapon));
      }
    }

    return enemies;
  }

  private findValidEnemyPosition(player: Player): { x: number; y: number } | null {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return null;

    for (let attempts = 0; attempts < 100; attempts++) {
      const x = (2 + Math.floor(Math.random() * (map.width - 4))) * map.tileSize + map.tileSize / 2;
      const y = (2 + Math.floor(Math.random() * (map.height - 4))) * map.tileSize + map.tileSize / 2;

      const distFromPlayer = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
      if (this.mapSystem.canMoveTo(x, y) && distFromPlayer > 150) {
        return { x, y };
      }
    }

    return null;
  }

  spawnTraps(player: Player): Trap[] {
    const traps: Trap[] = [];
    const map = this.mapSystem.getCurrentMap();
    if (!map) return traps;

    // Spawn 8-15 traps randomly on the map
    const numTraps = 8 + Math.floor(Math.random() * 8);

    for (let i = 0; i < numTraps; i++) {
      const position = this.findValidTrapPosition(player, traps);
      if (position) {
        traps.push(new Trap(position.x, position.y));
      }
    }

    return traps;
  }

  private findValidTrapPosition(player: Player, existingTraps: Trap[]): { x: number; y: number } | null {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return null;

    for (let attempts = 0; attempts < 100; attempts++) {
      const x = (2 + Math.floor(Math.random() * (map.width - 4))) * map.tileSize + map.tileSize / 2;
      const y = (2 + Math.floor(Math.random() * (map.height - 4))) * map.tileSize + map.tileSize / 2;

      const distFromPlayer = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);

      // Make sure trap is not too close to player or other traps
      if (this.mapSystem.canMoveTo(x, y) && distFromPlayer > 100) {
        let tooClose = false;
        for (const trap of existingTraps) {
          const distToTrap = Math.sqrt((x - trap.x) ** 2 + (y - trap.y) ** 2);
          if (distToTrap < 64) { // Minimum 64 pixels apart
            tooClose = true;
            break;
          }
        }
        if (!tooClose) {
          return { x, y };
        }
      }
    }

    return null;
  }
}
