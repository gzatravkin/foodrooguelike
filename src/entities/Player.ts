/**
 * Player - The player character entity
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Equipment, Weapon } from './types';

export class Player extends Entity {
  public weapon: Weapon | null = null;
  public armor: Equipment | null = null;
  public gold: number = 100;
  public attackCooldown: number = 0;
  public facingAngle: number = 0; // Direction player is facing
  public dashCooldown: number = 0;
  public dashDuration: number = 0;
  public dashDirection: { x: number; y: number } = { x: 0, y: 0 };
  public isDashing: boolean = false;
  public slowedDuration: number = 0; // Duration of slow effect after dash
  public slowMultiplier: number = 0.3; // Move at 30% speed when slowed

  constructor(x: number, y: number, initialWeapon?: Weapon) {
    const stats: EntityStats = {
      maxHealth: 100,
      health: 100,
      attack: 10,
      defense: 5,
      speed: 150, // pixels per second
    };

    super(EntityType.PLAYER, x, y, 24, stats, '#4CAF50');
    this.weapon = initialWeapon || null;
  }

  update(deltaTime: number): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    // Update dash cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= deltaTime;
    }

    // Update dash duration
    if (this.dashDuration > 0) {
      this.dashDuration -= deltaTime;
      this.isDashing = true;

      // When dash ends, apply slow effect
      if (this.dashDuration <= 0) {
        this.isDashing = false;
        this.slowedDuration = 2.0; // Slow for 2 seconds after dash
      }
    } else {
      this.isDashing = false;
    }

    // Update slow effect duration
    if (this.slowedDuration > 0) {
      this.slowedDuration -= deltaTime;
    }
  }

  move(dx: number, dy: number, deltaTime: number): void {
    // If dashing, use dash direction and speed
    if (this.isDashing) {
      const dashSpeed = this.stats.speed * 3; // 3x speed during dash
      this.x += this.dashDirection.x * dashSpeed * deltaTime;
      this.y += this.dashDirection.y * dashSpeed * deltaTime;
      return;
    }

    // Update facing direction
    if (dx !== 0 || dy !== 0) {
      this.facingAngle = Math.atan2(dy, dx);
    }

    // Apply slow effect if active
    let moveSpeed = this.stats.speed;
    if (this.slowedDuration > 0) {
      moveSpeed *= this.slowMultiplier;
    }

    // Move based on speed
    this.x += dx * moveSpeed * deltaTime;
    this.y += dy * moveSpeed * deltaTime;
  }

  canDash(): boolean {
    return this.dashCooldown <= 0 && !this.isDashing;
  }

  dash(dx: number, dy: number): void {
    if (!this.canDash()) return;

    // Normalize direction
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (magnitude === 0) return;

    this.dashDirection = {
      x: dx / magnitude,
      y: dy / magnitude,
    };

    this.dashDuration = 0.15; // Dash lasts 0.15 seconds
    this.dashCooldown = 1.0; // 1 second cooldown
    this.isDashing = true;
  }

  canAttack(): boolean {
    return this.attackCooldown <= 0;
  }

  attack(): void {
    if (!this.canAttack()) return;

    // Set attack cooldown based on weapon
    if (this.weapon) {
      this.attackCooldown = this.weapon.attackSpeed;
    } else {
      this.attackCooldown = 0.5; // Default cooldown
    }
  }

  getAttackDamage(): number {
    if (this.weapon) {
      return this.stats.attack + this.weapon.damage;
    }
    return this.stats.attack;
  }

  getAttackRange(): number {
    return this.weapon?.range || 40;
  }

  isRangedWeapon(): boolean {
    return this.weapon?.weaponType === 'ranged';
  }

  getProjectileSpeed(): number {
    return this.weapon?.projectileSpeed || 0;
  }

  getPelletCount(): number {
    return this.weapon?.pelletCount || 1;
  }

  getSpread(): number {
    return this.weapon?.spread || 0;
  }

  getTotalDefense(): number {
    let defense = this.stats.defense;
    if (this.armor && this.armor.stats.defense) {
      defense += this.armor.stats.defense;
    }
    return defense;
  }

  equipWeapon(weapon: Weapon): void {
    this.weapon = weapon;
  }

  equipArmor(armor: Equipment): void {
    this.armor = armor;
    // Add health bonus if any
    if (armor.stats.health) {
      this.stats.maxHealth += armor.stats.health;
      this.stats.health += armor.stats.health;
    }
  }

  // Get attack hitbox based on facing direction (for melee weapons)
  getAttackHitbox(): { x: number; y: number; radius: number } {
    const range = this.getAttackRange();
    const offsetX = Math.cos(this.facingAngle) * range;
    const offsetY = Math.sin(this.facingAngle) * range;

    return {
      x: this.x + offsetX,
      y: this.y + offsetY,
      radius: 20,
    };
  }

  // Get projectile spawn position
  getProjectileSpawn(): { x: number; y: number } {
    const offsetDistance = this.size / 2 + 10;
    return {
      x: this.x + Math.cos(this.facingAngle) * offsetDistance,
      y: this.y + Math.sin(this.facingAngle) * offsetDistance,
    };
  }
}
