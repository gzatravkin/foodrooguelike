/**
 * Player - The player character entity
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Equipment } from './types';

export class Player extends Entity {
  public weapon: Equipment | null = null;
  public armor: Equipment | null = null;
  public gold: number = 100;
  public attackCooldown: number = 0;
  public attackRange: number = 40;
  public facingAngle: number = 0; // Direction player is facing

  constructor(x: number, y: number) {
    const stats: EntityStats = {
      maxHealth: 100,
      health: 100,
      attack: 10,
      defense: 5,
      speed: 150, // pixels per second
    };

    super(EntityType.PLAYER, x, y, 24, stats, '#4CAF50');
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

    // Set attack cooldown (attacks per second based on weapon)
    this.attackCooldown = 0.5; // 2 attacks per second
  }

  getAttackDamage(): number {
    let damage = this.stats.attack;
    if (this.weapon && this.weapon.stats.attack) {
      damage += this.weapon.stats.attack;
    }
    return damage;
  }

  getTotalDefense(): number {
    let defense = this.stats.defense;
    if (this.armor && this.armor.stats.defense) {
      defense += this.armor.stats.defense;
    }
    return defense;
  }

  equipWeapon(weapon: Equipment): void {
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

  // Get attack hitbox based on facing direction
  getAttackHitbox(): { x: number; y: number; radius: number } {
    const offsetX = Math.cos(this.facingAngle) * this.attackRange;
    const offsetY = Math.sin(this.facingAngle) * this.attackRange;

    return {
      x: this.x + offsetX,
      y: this.y + offsetY,
      radius: 20,
    };
  }
}
