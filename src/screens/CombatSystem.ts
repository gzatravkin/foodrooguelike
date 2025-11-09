/**
 * CombatSystem - Manages projectiles, combat, and corpses
 */

import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { MapSystem, TileType } from '../systems/MapSystem';
import { ParticleSystem } from '../entities/Particle';

export class CombatSystem {
  private projectiles: Projectile[] = [];
  private corpses: Corpse[] = [];
  private particleSystem: ParticleSystem | null = null;

  constructor(private mapSystem: MapSystem) {}

  setParticleSystem(particleSystem: ParticleSystem): void {
    this.particleSystem = particleSystem;
  }

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
        // Create wall impact particles
        if (this.particleSystem && !proj.alive) {
          this.particleSystem.createImpact(proj.x, proj.y, '#888', 4);
        }
      }

      if (proj.ownerType === 'player') {
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          if (proj.checkCollision(enemy.x, enemy.y, enemy.size)) {
            const prevHealth = enemy.stats.health;
            enemy.takeDamage(proj.damage);

            // Create hit particles
            if (this.particleSystem && enemy.stats.health < prevHealth) {
              const dx = enemy.x - proj.x;
              const dy = enemy.y - proj.y;
              this.particleSystem.createImpact(proj.x, proj.y, proj.color, 8);
              this.particleSystem.createBlood(enemy.x, enemy.y, dx, dy);
            }

            proj.alive = false;
            break;
          }
        }
      } else {
        if (player.alive && !player.isDashing && proj.checkCollision(player.x, player.y, player.size)) {
          const prevHealth = player.stats.health;
          player.takeDamage(proj.damage);

          // Create hit particles when player is hit
          if (this.particleSystem && player.stats.health < prevHealth) {
            const dx = player.x - proj.x;
            const dy = player.y - proj.y;
            this.particleSystem.createImpact(proj.x, proj.y, '#FF4444', 8);
            this.particleSystem.createBlood(player.x, player.y, dx, dy);
          }

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
