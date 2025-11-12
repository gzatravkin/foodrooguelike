/**
 * GameScreenUpdater - Handles game update logic
 */

import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Trap } from '../entities/Trap';
import { Corpse } from '../entities/Corpse';
import { MapSystem, TileType } from '../systems/MapSystem';
import { CombatSystem } from './CombatSystem';
import { ParticleSystem } from '../entities/Particle';
import { TileRegistry } from '../plugins/tiles/TileRegistry';

export class GameScreenUpdater {
  private deadEnemiesSet = new Set<Enemy>();

  constructor(
    private mapSystem: MapSystem,
    private combatSystem: CombatSystem,
    private particleSystem: ParticleSystem
  ) {}

  updateEnemies(enemies: Enemy[], player: Player, deltaTime: number): void {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      enemy.updateAI(
        player.x,
        player.y,
        deltaTime,
        (x, y) => this.mapSystem.canMoveTo(x, y, enemy.size)
      );
      enemy.update(deltaTime);

      if (enemy.canAttack() && !player.isDashing) {
        if (enemy.isRangedWeapon()) {
          this.combatSystem.spawnEnemyProjectile(enemy);
          enemy.attackCooldown = enemy.weapon!.attackSpeed;
          enemy.onAttackExecuted(); // Handle attack patterns like burst
          const spawn = enemy.getProjectileSpawn();
          this.particleSystem.createMuzzleFlash(spawn.x, spawn.y, enemy.facingAngle);
        } else {
          const distance = enemy.getDistanceTo(player);
          if (distance <= enemy.getAttackRange()) {
            const prevHealth = player.stats.health;
            player.takeDamage(enemy.getAttackDamage());

            if (player.stats.health < prevHealth) {
              const dx = player.x - enemy.x;
              const dy = player.y - enemy.y;
              this.particleSystem.createBlood(player.x, player.y, dx, dy);
            }

            enemy.attackCooldown = enemy.weapon ? enemy.weapon.attackSpeed : 1.0;
            enemy.onAttackExecuted(); // Handle attack patterns like burst
          }
        }
      }
    }
  }

  updateTraps(traps: Trap[], player: Player, deltaTime: number): void {
    for (const trap of traps) {
      trap.update(deltaTime);

      if (trap.canDamage() && !player.isDashing && trap.isPlayerNear(player.x, player.y)) {
        trap.activate();
        const trapDamage = trap.damage;
        player.takeDamage(trapDamage);

        const dx = player.x - trap.x;
        const dy = player.y - trap.y;
        this.particleSystem.createBlood(player.x, player.y, dx, dy);
      }
    }
  }

  handleBaseHealing(player: Player, mode: 'base' | 'expedition', baseHealTimer: number, deltaTime: number): number {
    if (mode === 'base' && player.alive && player.stats.health < player.stats.maxHealth) {
      baseHealTimer += deltaTime;
      const healInterval = 0.5;
      const healAmount = 1;

      if (baseHealTimer >= healInterval) {
        player.stats.health = Math.min(
          player.stats.health + healAmount,
          player.stats.maxHealth
        );
        baseHealTimer = 0;
      }
    } else if (mode !== 'base') {
      baseHealTimer = 0;
    }

    return baseHealTimer;
  }

  handleDeadEnemies(enemies: Enemy[]): Enemy[] {
    const aliveEnemies: Enemy[] = [];

    for (const enemy of enemies) {
      if (enemy.alive) {
        aliveEnemies.push(enemy);
      } else if (!this.deadEnemiesSet.has(enemy)) {
        // Create corpse with loot
        const enemyLoot = enemy.getLoot();
        const loot = {
          gold: 0, // Enemies no longer drop gold
          ingredients: enemyLoot.items
        };
        const corpse = new Corpse(
          enemy.x,
          enemy.y,
          enemy.enemyData.name,
          enemy.enemyData.id,
          loot
        );
        this.combatSystem.addCorpse(corpse);
        this.deadEnemiesSet.add(enemy);
      }
    }

    return aliveEnemies;
  }

  checkInteractions(
    player: Player,
    mode: 'base' | 'expedition',
    corpses: Corpse[]
  ): { showPrompt: boolean; promptText: string; nearbyCorpse: Corpse | null } {
    let showPrompt = false;
    let promptText = '';
    let nearbyCorpse: Corpse | null = null;

    if (mode === 'expedition') {
      for (const corpse of corpses) {
        if (corpse.isPlayerNear(player.x, player.y, 40) && corpse.canLoot()) {
          showPrompt = true;
          const count = corpse.loot.ingredients.length;
          promptText = count > 0 ? `Press F to loot (${count} ingredient${count !== 1 ? 's' : ''})` : 'Press F to loot';
          nearbyCorpse = corpse;
          break;
        }
      }
    }

    return { showPrompt, promptText, nearbyCorpse };
  }

  checkTileInteractions(
    player: Player,
    mode: 'base' | 'expedition',
    mapSystem: MapSystem,
    onEnterShop: () => void,
    onStartExpedition: () => void,
    onReturnToBase?: () => void
  ): { showPrompt: boolean; promptText: string } {
    let showPrompt = false;
    let promptText = '';

    const tileType = mapSystem.getTileAt(player.x, player.y);

    if (mode === 'base' && tileType) {
      if (tileType === TileType.SHOP) {
        showPrompt = true;
        promptText = 'Press E to enter Shop';
      } else if (tileType === TileType.EXPEDITION_PORTAL) {
        showPrompt = true;
        promptText = 'Press E to open World Map';
      } else if (tileType === TileType.COOKING_STATION) {
        showPrompt = true;
        promptText = 'Press E to Cook';
      } else if (tileType === TileType.TRAINING_HALL) {
        showPrompt = true;
        promptText = 'Press E to enter Training Hall';
      } else if (tileType === TileType.UPGRADES_HALL) {
        showPrompt = true;
        promptText = 'Press E to enter Upgrades Hall';
      }
    } else if (mode === 'expedition' && tileType !== null) {
      if (tileType === TileType.STAIRS_DOWN) {
        showPrompt = true;
        promptText = 'Press E to return to Base Camp';
      } else {
        // Check if the tile has interactive capabilities via TileRegistry
        const tileId = this.getTileIdFromType(tileType);
        if (tileId) {
          const tilePlugin = TileRegistry.getTileById(tileId);
          if (tilePlugin?.interaction) {
            const map = mapSystem.getCurrentMap();
            if (map) {
              const tileX = Math.floor(player.x / map.tileSize);
              const tileY = Math.floor(player.y / map.tileSize);

              if (tilePlugin.interaction.canInteract(player, tileX, tileY, mapSystem)) {
                showPrompt = true;
                promptText = `Press E to interact with ${tilePlugin.name}`;
              }
            }
          }
        }
      }
    }

    return { showPrompt, promptText };
  }

  private getTileIdFromType(tileType: TileType): string | null {
    // Map TileType enum to tile plugin IDs
    const tileTypeMap: Record<number, string> = {
      [TileType.HEALTH_FOUNTAIN]: 'health_fountain',
      [TileType.TREASURE_CHEST]: 'treasure_chest',
      [TileType.SHRINE]: 'shrine',
      [TileType.TELEPORTER]: 'teleporter',
      [TileType.BERRY_BUSH]: 'berry_bush',
      [TileType.HERB_PLANT]: 'herb_plant',
      [TileType.MUSHROOM_PATCH]: 'mushroom_patch',
      [TileType.CRYSTAL_FORMATION]: 'crystal_formation',
      [TileType.FIRE_PLANT]: 'fire_plant',
      [TileType.VOID_PLANT]: 'void_plant',
      [TileType.ANCIENT_TREE]: 'ancient_tree',
    };
    return tileTypeMap[tileType] || null;
  }

  updateCamera(player: Player, renderer: any): void {
    const viewWidth = 640;
    const viewHeight = 480;
    const cameraX = player.x - viewWidth / 2;
    const cameraY = player.y - viewHeight / 2;
    renderer.setCamera(cameraX, cameraY);
  }
}
