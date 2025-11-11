/**
 * GameModeManager - Handles game mode transitions (base camp vs expeditions)
 */
import { MapSystem, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Trap } from '../entities/Trap';
import { entityFactory } from '../entities/EntityFactory';
import { SpawnManager } from './SpawnManager';
import { TileManager } from '../systems/TileManager';
import { Theme } from '../systems/ThemeConfig';

export type GameMode = 'base' | 'expedition';

export class GameModeManager {
  private mode: GameMode = 'base';
  private spawnManager: SpawnManager;

  constructor(spawnManager: SpawnManager) {
    this.spawnManager = spawnManager;
  }

  getMode(): GameMode {
    return this.mode;
  }

  loadBaseCamp(mapSystem: MapSystem, player: Player): { enemies: Enemy[]; traps: Trap[] } {
    this.mode = 'base';

    // Reset theme for base camp
    TileManager.setTheme(null);

    const baseCamp = MapSystem.createBaseCamp();
    mapSystem.loadMap(baseCamp);

    player.x = 320;
    player.y = 240;

    return { enemies: [], traps: [] };
  }

  loadExpedition(
    mapSystem: MapSystem,
    player: Player,
    level: number = 1
  ): { enemies: Enemy[]; traps: Trap[]; expeditionData: any } {
    this.mode = 'expedition';

    // Try to load selected expedition from localStorage
    let expeditionData = null;
    try {
      const storedData = localStorage.getItem('selectedExpedition');
      if (storedData) {
        expeditionData = JSON.parse(storedData);
        localStorage.removeItem('selectedExpedition');
      }
    } catch (error) {
      console.error('Failed to load expedition data:', error);
    }

    // Set theme based on expedition data
    const theme = expeditionData?.theme as Theme | undefined;
    if (theme) {
      TileManager.setTheme(theme);
    }

    const dungeon = MapSystem.createDungeon(expeditionData?.difficulty || level, theme);
    mapSystem.loadMap(dungeon);

    player.x = dungeon.spawnX || 3 * 32 + 16;
    player.y = dungeon.spawnY || 3 * 32 + 16;

    // Spawn enemies based on expedition data
    const enemies = expeditionData
      ? this.spawnExpeditionEnemies(expeditionData, player, mapSystem)
      : this.spawnManager.spawnEnemies(level, player);

    const traps = this.spawnManager.spawnTraps(player);

    return { enemies, traps, expeditionData };
  }

  private spawnExpeditionEnemies(expeditionData: any, player: Player, mapSystem: MapSystem): Enemy[] {
    const enemies: Enemy[] = [];
    const { enemyTypes, enemyCount, lootMultiplier } = expeditionData;

    const numEnemies = enemyCount.min + Math.floor(Math.random() * (enemyCount.max - enemyCount.min + 1));

    for (let i = 0; i < numEnemies; i++) {
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemyData = entityFactory.getTemplate(enemyType) as any;

      if (enemyData) {
        const position = this.findValidEnemyPosition(player, mapSystem);
        if (position) {
          const weaponId = enemyData.weaponId;
          const weapon = weaponId ? entityFactory.createWeapon(weaponId) : null;
          const enemy = new Enemy(position.x, position.y, enemyData, weapon);

          // Apply loot multiplier
          if (lootMultiplier > 1) {
            enemy.enemyData.lootTable = enemy.enemyData.lootTable.map((drop: any) => ({
              ...drop,
              chance: Math.min(1, drop.chance * lootMultiplier)
            }));
          }

          enemies.push(enemy);
        }
      }
    }

    return enemies;
  }

  private findValidEnemyPosition(player: Player, mapSystem: MapSystem): { x: number; y: number } | null {
    const map = mapSystem.getCurrentMap();
    if (!map) return null;

    // Increased minimum distance to give player more breathing room
    const minDistance = 350;

    for (let attempts = 0; attempts < 100; attempts++) {
      const x = (2 + Math.floor(Math.random() * (map.width - 4))) * map.tileSize + map.tileSize / 2;
      const y = (2 + Math.floor(Math.random() * (map.height - 4))) * map.tileSize + map.tileSize / 2;

      const distFromPlayer = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
      if (mapSystem.canMoveTo(x, y) && distFromPlayer > minDistance) {
        return { x, y };
      }
    }

    return null;
  }
}
