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
              const angle = Math.atan2(dy, dx);
              this.particleSystem.createBloodSplatter(player.x, player.y, angle);
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

      if (!trap.triggered && !player.isDashing) {
        const dx = player.x - trap.x;
        const dy = player.y - trap.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          trap.triggered = true;
          trap.isVisible = true;
          const trapDamage = 15;
          player.takeDamage(trapDamage);

          const angle = Math.atan2(dy, dx);
          this.particleSystem.createBloodSplatter(player.x, player.y, angle);
        }
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
      } else if (!enemy.corpseCreated) {
        const corpse = new Corpse(enemy.x, enemy.y, enemy.lootGold, enemy.lootIngredient, enemy.enemyType);
        this.combatSystem.addCorpse(corpse);
        enemy.corpseCreated = true;
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
        const distance = corpse.getDistanceTo(player);
        if (distance < 40 && !corpse.looted) {
          showPrompt = true;
          promptText = `Press E to loot (${corpse.gold} gold${corpse.ingredient ? ', ingredient' : ''})`;
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
    const map = mapSystem.getCurrentMap();

    if (!map) return { showPrompt, promptText };

    const tileX = Math.floor(player.x / map.tileSize);
    const tileY = Math.floor(player.y / map.tileSize);
    const tileType = map.getTile(tileX, tileY);

    if (mode === 'base') {
      if (tileType === TileType.Shop) {
        showPrompt = true;
        promptText = 'Press E to enter Shop';
      } else if (tileType === TileType.Portal) {
        showPrompt = true;
        promptText = 'Press E to start Expedition';
      } else if (tileType === TileType.Cooking) {
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
