/**
 * CombatSystem - Manages projectiles, combat, and corpses
 */

import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { MapSystem, TileType } from '../systems/MapSystem';

export class CombatSystem {
  private projectiles: Projectile[] = [];
  private corpses: Corpse[] = [];

  constructor(private mapSystem: MapSystem) {}

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  getCorpses(): Corpse[] {
    return this.corpses;
  }

  clearProjectiles(): void {
    this.projectiles = [];
  }

  clearCorpses(): void {
    this.corpses = [];
  }

  addCorpse(corpse: Corpse): void {
    this.corpses.push(corpse);
  }

  spawnPlayerProjectile(player: Player, angle: number, spread: number = 0, isDashShot: boolean = false): void {
    const spawn = player.getProjectileSpawn();
    const actualAngle = angle + spread;

    const damageMultiplier = isDashShot ? 2.0 : 1.0;
    const speedMultiplier = isDashShot ? 1.5 : 1.0;
    const color = isDashShot ? '#00FFFF' : '#FFD700';
    const size = isDashShot ? 6 : 4;

    const projectile = new Projectile(
      spawn.x,
      spawn.y,
      actualAngle,
      player.getProjectileSpeed() * speedMultiplier,
      player.getAttackDamage() * damageMultiplier,
      player.id,
      'player',
      player.getAttackRange() * (isDashShot ? 1.3 : 1.0),
      color
    );

    projectile.size = size;
    this.projectiles.push(projectile);
  }

  spawnEnemyProjectile(enemy: Enemy): void {
    const spawn = enemy.getProjectileSpawn();
    const pelletCount = enemy.getPelletCount();
    const spreadAngle = enemy.getSpread();

    for (let i = 0; i < pelletCount; i++) {
      let angle = enemy.facingAngle;

      if (pelletCount > 1) {
        angle += (Math.random() - 0.5) * spreadAngle;
      }

      const projectile = new Projectile(
        spawn.x,
        spawn.y,
        angle,
        enemy.getProjectileSpeed(),
        enemy.getAttackDamage(),
        enemy.id,
        'enemy',
        enemy.getAttackRange(),
        '#FF4444'
      );

      this.projectiles.push(projectile);
    }
  }

  updateProjectiles(deltaTime: number, enemies: Enemy[], player: Player): void {
    for (const proj of this.projectiles) {
      proj.update(deltaTime);

      const tile = this.mapSystem.getTileAt(proj.x, proj.y);
      if (tile === TileType.WALL) {
        proj.hitWall();
      }

      if (proj.ownerType === 'player') {
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          if (proj.checkCollision(enemy.x, enemy.y, enemy.size)) {
            enemy.takeDamage(proj.damage);
            proj.alive = false;
            break;
          }
        }
      } else {
        if (player.alive && !player.isDashing && proj.checkCollision(player.x, player.y, player.size)) {
          player.takeDamage(proj.damage);
          proj.alive = false;
        }
      }
    }

    this.projectiles = this.projectiles.filter(p => p.alive);
  }

  updateCorpses(deltaTime: number): void {
    for (const corpse of this.corpses) {
      corpse.update(deltaTime);
    }

    this.corpses = this.corpses.filter(c => !c.isExpired());
  }

  findNearbyCorpse(playerX: number, playerY: number): Corpse | null {
    for (const corpse of this.corpses) {
      if (corpse.canLoot() && corpse.isPlayerNear(playerX, playerY)) {
        return corpse;
      }
    }
    return null;
  }
}
