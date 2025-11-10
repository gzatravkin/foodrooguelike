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
        const loot = {
          gold: enemy.enemyData.goldReward || 0,
          ingredients: [] // Ingredients from loot table not yet implemented
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
          const ingredientText = corpse.loot.ingredients.length > 0 ? ', ingredients' : '';
          promptText = `Press F to loot (${corpse.loot.gold} gold${ingredientText})`;
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
    onStartExpedition: () => void
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
        promptText = 'Press E to start Expedition';
      } else if (tileType === TileType.COOKING_STATION) {
        showPrompt = true;
        promptText = 'Press E to Cook';
      }
    }

    return { showPrompt, promptText };
  }

  updateCamera(player: Player, renderer: any): void {
    const viewWidth = 640;
    const viewHeight = 480;
    const cameraX = player.x - viewWidth / 2;
    const cameraY = player.y - viewHeight / 2;
    renderer.setCamera(cameraX, cameraY);
  }
}
