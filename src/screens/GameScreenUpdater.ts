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
import { BuildingRegistry } from '../plugins/BuildingRegistry';
import { TileTypeMapper } from '../plugins/TileTypeMapper';

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

  updateTraps(traps: Trap[], player: Player, enemies: Enemy[], deltaTime: number): void {
    for (const trap of traps) {
      trap.update(deltaTime);

      // Check if trap can damage and is not currently active
      if (trap.canDamage()) {
        // Check player collision (player can still avoid traps by dashing)
        if (!player.isDashing && trap.isPlayerNear(player.x, player.y)) {
          trap.activate();
          const trapDamage = trap.damage;
          player.takeDamage(trapDamage);

          const dx = player.x - trap.x;
          const dy = player.y - trap.y;
          this.particleSystem.createBlood(player.x, player.y, dx, dy);
        }

        // Check enemy collisions (enemies cannot avoid traps)
        for (const enemy of enemies) {
          if (enemy.alive) {
            // Use squared distance to avoid expensive sqrt()
            const dx = enemy.x - trap.x;
            const dy = enemy.y - trap.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared <= trap.triggerRadius * trap.triggerRadius) {
              trap.activate();
              const trapDamage = trap.damage;
              enemy.takeDamage(trapDamage);

              const dx = enemy.x - trap.x;
              const dy = enemy.y - trap.y;
              this.particleSystem.createBlood(enemy.x, enemy.y, dx, dy);

              // Only one entity per trap activation
              break;
            }
          }
        }
      }
    }
  }

  handleBaseHealing(player: Player, mode: 'base' | 'expedition', baseHealTimer: number, deltaTime: number): number {
    if (player.alive && player.stats.health < player.stats.maxHealth) {
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
    }

    return baseHealTimer;
  }

  handleDeadEnemies(enemies: Enemy[]): Enemy[] {
    // Use swap-remove pattern for better performance
    let writeIndex = 0;

    for (let readIndex = 0; readIndex < enemies.length; readIndex++) {
      const enemy = enemies[readIndex];
      if (enemy.alive) {
        if (writeIndex !== readIndex) {
          enemies[writeIndex] = enemies[readIndex];
        }
        writeIndex++;
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

    enemies.length = writeIndex;
    return enemies;
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

    if (mode === 'base' && tileType !== null) {
      // Check if it's a building (auto-registered via BuildingRegistry!)
      const tileId = this.getTileIdFromType(tileType);
      if (tileId) {
        const building = BuildingRegistry.getBuilding(tileId);
        if (building) {
          showPrompt = true;
          promptText = building.interaction.prompt;
          return { showPrompt, promptText };
        }
      }

      // Special handling for expedition portal (doesn't use BuildingRegistry yet)
      if (tileType === TileType.EXPEDITION_PORTAL) {
        showPrompt = true;
        promptText = 'Press E to open World Map';
      }
    } else if (mode === 'expedition') {
      // Check for stairs down on the exact tile
      if (tileType === TileType.STAIRS_DOWN) {
        showPrompt = true;
        promptText = 'Press E to return to Base Camp';
      }

      // Check nearby tiles for interactive elements (increased interaction range)
      const map = mapSystem.getCurrentMap();
      if (map) {
        const playerTileX = Math.floor(player.x / map.tileSize);
        const playerTileY = Math.floor(player.y / map.tileSize);
        const interactionRadius = 1; // Check 1 tile in each direction

        // Check tiles in a 3x3 grid around the player
        for (let dy = -interactionRadius; dy <= interactionRadius; dy++) {
          for (let dx = -interactionRadius; dx <= interactionRadius; dx++) {
            const checkX = playerTileX + dx;
            const checkY = playerTileY + dy;
            const checkTileType = mapSystem.getTileAt(checkX * map.tileSize + map.tileSize/2, checkY * map.tileSize + map.tileSize/2);

            if (checkTileType !== null) {
              const tileId = this.getTileIdFromType(checkTileType);
              if (tileId) {
                const tilePlugin = TileRegistry.getTileById(tileId);
                if (tilePlugin?.interaction) {
                  if (tilePlugin.interaction.canInteract(player, checkX, checkY, mapSystem)) {
                    showPrompt = true;
                    promptText = `Press E to interact with ${tilePlugin.name}`;
                    // Return first interactive tile found
                    return { showPrompt, promptText };
                  }
                }
              }
            }
          }
        }
      }
    }

    return { showPrompt, promptText };
  }

  private getTileIdFromType(tileType: TileType): string | null {
    // Use centralized TileTypeMapper for automatic mapping!
    // No need to maintain manual mapping tables anymore.
    return TileTypeMapper.getTileIdFromType(tileType);
  }

  updateCamera(player: Player, renderer: any): void {
    // Get actual canvas dimensions for proper centering
    const canvas = renderer.renderer?.getCanvas();
    const viewWidth = canvas ? canvas.width : 640;
    const viewHeight = canvas ? canvas.height : 480;
    const cameraX = player.x - viewWidth / 2;
    const cameraY = player.y - viewHeight / 2;
    renderer.setCamera(cameraX, cameraY);
  }
}
