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
    const weaponId = player.weapon?.id || 'fists';

    // Default values
    let damageMultiplier = isDashShot ? 2.0 : 1.0;
    let speedMultiplier = isDashShot ? 1.5 : 1.0;
    let rangeMultiplier = isDashShot ? 1.3 : 1.0;
    let color = player.getProjectileColor();
    let size = player.getProjectileSize();
    let shape = player.getProjectileShape();
    let trailColor = player.getTrailColor();
    let impactColor = player.getImpactColor();

    // Weapon-specific dash attack modifications
    if (isDashShot) {
      switch (weaponId) {
        case 'magic_staff':
          // Arcane Barrage - more damage, homing-like faster speed
          damageMultiplier = 2.5;
          speedMultiplier = 2.0;
          rangeMultiplier = 1.5;
          color = '#E040FB';
          size = 7;
          shape = 'bolt';
          trailColor = '#F3E5F5';
          impactColor = '#AA00FF';
          break;

        case 'crossbow':
          // Piercing Bolt - massive damage, very fast
          damageMultiplier = 3.5;
          speedMultiplier = 2.5;
          rangeMultiplier = 2.0;
          color = '#FFD700';
          size = 8;
          shape = 'bolt';
          trailColor = '#FFF9C4';
          impactColor = '#FFA000';
          break;

        case 'pistol':
          // Quick Draw - handled in InputHandler with triple shot
          damageMultiplier = 2.2;
          speedMultiplier = 2.0;
          rangeMultiplier = 1.4;
          color = '#FFC107';
          size = 5;
          shape = 'beam';
          trailColor = '#FFECB3';
          impactColor = '#FF6F00';
          break;

        case 'shotgun':
          // Explosive Scatter - more damage per pellet
          damageMultiplier = 2.8;
          speedMultiplier = 1.8;
          rangeMultiplier = 1.2;
          color = '#FF3D00';
          size = 5;
          shape = 'fire';
          trailColor = '#FF6E40';
          impactColor = '#DD2C00';
          break;

        case 'assault_rifle':
          // Armor Piercing - high damage, long range
          damageMultiplier = 3.0;
          speedMultiplier = 2.2;
          rangeMultiplier = 1.8;
          color = '#00E676';
          size = 4;
          shape = 'beam';
          trailColor = '#B9F6CA';
          impactColor = '#00C853';
          break;

        case 'plasma_cannon':
          // Plasma Wave - massive beam
          damageMultiplier = 3.5;
          speedMultiplier = 1.3;
          rangeMultiplier = 1.6;
          color = '#00E5FF';
          size = 12;
          shape = 'beam';
          trailColor = '#80DEEA';
          impactColor = '#00ACC1';
          break;

        case 'dragon_breath':
          // Inferno Blast - handled in InputHandler with more pellets
          damageMultiplier = 3.0;
          speedMultiplier = 1.4;
          rangeMultiplier = 1.4;
          color = '#FF6D00';
          size = 8;
          shape = 'fire';
          trailColor = '#FF9E80';
          impactColor = '#FF3D00';
          break;

        default:
          // Generic dash shot visuals
          color = '#00FFFF';
          size = 6;
          shape = 'beam';
          trailColor = '#80DEEA';
          impactColor = '#00ACC1';
          break;
      }

      // Apply dash training damage bonus
      damageMultiplier *= (1 + player.dashDamageBonus);
    }

    const projectile = new Projectile(
      spawn.x,
      spawn.y,
      actualAngle,
      player.getProjectileSpeed() * speedMultiplier,
      player.getAttackDamage() * damageMultiplier,
      player.id,
      'player',
      player.getAttackRange() * rangeMultiplier,
      color,
      shape,
      trailColor,
      impactColor
    );

    projectile.size = size;
    this.projectiles.push(projectile);

    // Create muzzle flash particles
    if (this.particleSystem && trailColor) {
      this.particleSystem.createImpact(spawn.x, spawn.y, trailColor, 3);
    }
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
      // Create trail particles for certain projectile types
      if (this.particleSystem && proj.trailColor && Math.random() < 0.3) {
        this.particleSystem.createImpact(proj.x, proj.y, proj.trailColor, 1);
      }

      proj.update(deltaTime);

      const tile = this.mapSystem.getTileAt(proj.x, proj.y);
      if (tile === TileType.WALL) {
        proj.hitWall();
        // Create wall impact particles
        if (this.particleSystem && !proj.alive) {
          const impactColor = proj.impactColor || '#888';
          this.particleSystem.createImpact(proj.x, proj.y, impactColor, 4);
        }
      }

      if (proj.ownerType === 'player') {
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          if (proj.checkCollision(enemy.x, enemy.y, enemy.size)) {
            const prevHealth = enemy.stats.health;
            enemy.takeDamage(proj.damage);

            // Create hit particles using weapon-specific colors
            if (this.particleSystem && enemy.stats.health < prevHealth) {
              const dx = enemy.x - proj.x;
              const dy = enemy.y - proj.y;
              const impactColor = proj.impactColor || proj.color;
              this.particleSystem.createImpact(proj.x, proj.y, impactColor, 8);
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
