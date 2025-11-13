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
import { isBossLevel, getLevelMultipliers } from '../types/expedition';
import { gameState } from '../core/GameState';

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

    // Get restaurant location from game state for themed base camp
    const restaurantLocation = gameState.getRestaurantLocation();
    const baseCamp = MapSystem.createBaseCamp(restaurantLocation);
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
      console.log(`[EXPEDITION] Loading expedition: ${expeditionData?.name || 'Unknown'}, Theme: ${theme}, Level: ${level}, Difficulty: ${expeditionData?.difficulty}`);
    }

    // Use expedition difficulty for dungeon generation, NOT the level (1-50)
    // Difficulty determines map complexity, level determines enemy strength
    const difficulty = expeditionData?.difficulty || 1;
    const dungeon = MapSystem.createDungeon(difficulty, theme);
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
    const { enemyTypes, enemyCount, lootMultiplier, level = 1, name } = expeditionData;

    // Check if this is a boss level
    const isBoss = isBossLevel(level);

    // Get level multipliers
    const multipliers = getLevelMultipliers(level);

    console.log(`[ENEMY SPAWN] Spawning enemies for ${name}, Level: ${level}, IsBoss: ${isBoss}, Available types: [${enemyTypes.join(', ')}]`);

    // Determine enemy count
    let numEnemies: number;
    if (isBoss) {
      // Boss levels: 1-3 boss enemies based on level
      numEnemies = 1 + Math.floor(level / 20); // 1 at levels 5,15, 2 at 25,30, 3 at 50
      console.log(`[ENEMY SPAWN] Boss level - spawning ${numEnemies} boss enemies`);
    } else {
      // Normal levels: base count + level scaling
      const baseCount = enemyCount.min + Math.floor(Math.random() * (enemyCount.max - enemyCount.min + 1));
      numEnemies = baseCount + multipliers.count;
      console.log(`[ENEMY SPAWN] Normal level - base count: ${baseCount}, level scaling: ${multipliers.count}, total: ${numEnemies}`);
    }

    // Filter enemy types for boss levels
    let availableEnemyTypes = enemyTypes;
    if (isBoss) {
      // Only spawn boss-type enemies on boss levels
      const allEnemies = entityFactory.getAllOfType('enemy') as any[];
      const bossEnemies = allEnemies.filter((e: any) => e.health >= 90); // Boss threshold
      availableEnemyTypes = enemyTypes.filter((type: string) => {
        const template = entityFactory.getTemplate(type) as any;
        return template && template.health >= 90;
      });

      // If no boss enemies in the list, use all available boss enemies
      if (availableEnemyTypes.length === 0) {
        availableEnemyTypes = bossEnemies.map((e: any) => e.id);
      }
      console.log(`[ENEMY SPAWN] Boss enemies available: [${availableEnemyTypes.join(', ')}]`);
    }

    for (let i = 0; i < numEnemies; i++) {
      const enemyType = availableEnemyTypes[Math.floor(Math.random() * availableEnemyTypes.length)];
      const enemyData = entityFactory.getTemplate(enemyType) as any;

      if (enemyData) {
        const position = this.findValidEnemyPosition(player, mapSystem);
        if (position) {
          const weaponId = enemyData.weaponId;
          const weapon = weaponId ? entityFactory.createWeapon(weaponId) : null;
          const enemy = new Enemy(position.x, position.y, enemyData, weapon);

          // Apply level multipliers to enemy stats
          enemy.stats.maxHealth = Math.floor(enemy.stats.maxHealth * multipliers.health);
          enemy.stats.health = enemy.stats.maxHealth;
          enemy.stats.attack = Math.floor(enemy.stats.attack * multipliers.attack);
          enemy.stats.defense = Math.floor(enemy.stats.defense * multipliers.defense);

          // Apply loot multiplier (base + level scaling)
          const totalLootMultiplier = lootMultiplier * multipliers.loot;
          if (totalLootMultiplier > 1) {
            enemy.enemyData.lootTable = enemy.enemyData.lootTable.map((drop: any) => ({
              ...drop,
              chance: Math.min(1, drop.chance * totalLootMultiplier)
            }));
          }

          enemies.push(enemy);
          console.log(`[ENEMY SPAWN] Spawned ${enemyType} - HP: ${enemy.stats.maxHealth}, ATK: ${enemy.stats.attack}, DEF: ${enemy.stats.defense}`);
        } else {
          console.warn(`[ENEMY SPAWN] Failed to find valid position for enemy ${i + 1}/${numEnemies}`);
        }
      } else {
        console.error(`[ENEMY SPAWN] Failed to get enemy template for type: ${enemyType}`);
      }
    }

    console.log(`[ENEMY SPAWN] Successfully spawned ${enemies.length}/${numEnemies} enemies`);
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
