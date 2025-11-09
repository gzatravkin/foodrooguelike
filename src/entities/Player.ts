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
  }

  move(dx: number, dy: number, deltaTime: number): void {
    // Update facing direction
    if (dx !== 0 || dy !== 0) {
      this.facingAngle = Math.atan2(dy, dx);
    }

    // Move based on speed
    this.x += dx * this.stats.speed * deltaTime;
    this.y += dy * this.stats.speed * deltaTime;
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
