/**
 * Player - The player character entity
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Equipment, Weapon } from './types';
import { getPlayerSize } from '../utils/MobileUtils';

export class Player extends Entity {
  public weapon: Weapon | null = null;
  public weaponEquipment: Equipment | null = null; // Equipment with slot="weapon"
  public armor: Equipment | null = null; // Equipment with slot="armor"
  public gold: number = 100;
  public attackCooldown: number = 0;
  public facingAngle: number = 0; // Direction player is facing
  public dashCooldown: number = 0;
  public dashDuration: number = 0;
  public dashDirection: { x: number; y: number } = { x: 0, y: 0 };
  public isDashing: boolean = false;
  public slowedDuration: number = 0; // Duration of slow effect after dash
  public slowMultiplier: number = 0.3; // Move at 30% speed when slowed

  // Dash training bonuses
  public dashCooldownReduction: number = 0; // Percentage reduction (0-1)
  public dashSlowdownReduction: number = 0; // Percentage reduction (0-1)
  public dashDistanceBonus: number = 0; // Percentage increase (0-1)
  public dashDamageBonus: number = 0; // Percentage increase (0-1)
  public hasDoubleDash: boolean = false; // Unlockable once
  public dashCharges: number = 0; // Number of dashes available (for double dash)

  constructor(x: number, y: number, initialWeapon?: Weapon) {
    const stats: EntityStats = {
      maxHealth: 100,
      health: 100,
      attack: 10,
      defense: 5,
      speed: 150, // pixels per second
    };

    // Use responsive player size based on tile size
    const playerSize = getPlayerSize();
    super(EntityType.PLAYER, x, y, playerSize, stats, '#4CAF50');
    this.weapon = initialWeapon || null;

    // Initialize with 1 dash charge
    this.dashCharges = 1;
  }

  update(deltaTime: number): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    // Update dash cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= deltaTime;

      // When cooldown is complete, restore dash charges
      if (this.dashCooldown <= 0) {
        this.dashCharges = this.hasDoubleDash ? 2 : 1;
      }
    }

    // Update dash duration
    if (this.dashDuration > 0) {
      this.dashDuration -= deltaTime;
      this.isDashing = true;

      // When dash ends, apply slow effect
      if (this.dashDuration <= 0) {
        this.isDashing = false;
        // Apply slowdown with training reduction
        const baseSlowdown = 1.0;
        this.slowedDuration = baseSlowdown * (1 - this.dashSlowdownReduction);
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
    return this.dashCharges > 0 && !this.isDashing;
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

    // Apply training bonuses
    const baseDuration = 0.1725; // Increased by 15% (was 0.15)
    const baseCooldown = 1.0;

    this.dashDuration = baseDuration * (1 + this.dashDistanceBonus);
    this.isDashing = true;

    // Reset weapon cooldown immediately
    this.attackCooldown = 0;

    // Consume a dash charge
    this.dashCharges--;

    // If we're out of charges, start cooldown
    if (this.dashCharges === 0) {
      this.dashCooldown = baseCooldown * (1 - this.dashCooldownReduction);
    }
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

  getProjectileColor(): string {
    return this.weapon?.projectileColor || '#FFD700';
  }

  getProjectileSize(): number {
    return this.weapon?.projectileSize || 4;
  }

  getProjectileShape(): 'circle' | 'beam' | 'bolt' | 'fire' {
    return this.weapon?.projectileShape || 'circle';
  }

  getTrailColor(): string | undefined {
    return this.weapon?.trailColor;
  }

  getImpactColor(): string | undefined {
    return this.weapon?.impactColor;
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

  equipWeaponEquipment(equipment: Equipment): void {
    // Remove old equipment bonuses
    if (this.weaponEquipment && this.weaponEquipment.stats.attack) {
      this.stats.attack -= this.weaponEquipment.stats.attack;
    }

    // Equip new equipment
    this.weaponEquipment = equipment;

    // Apply new equipment bonuses
    if (equipment.stats.attack) {
      this.stats.attack += equipment.stats.attack;
    }
  }

  equipArmor(armor: Equipment): void {
    // Remove old armor bonuses
    if (this.armor) {
      if (this.armor.stats.defense) {
        this.stats.defense -= this.armor.stats.defense;
      }
      if (this.armor.stats.health) {
        this.stats.maxHealth -= this.armor.stats.health;
        this.stats.health = Math.min(this.stats.health, this.stats.maxHealth);
      }
    }

    // Equip new armor
    this.armor = armor;

    // Apply new armor bonuses
    if (armor.stats.defense) {
      this.stats.defense += armor.stats.defense;
    }
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

  // Apply dash training bonuses from game state
  applyDashTrainingBonuses(trainingLevels: { [key: string]: number }): void {
    // Calculate dash training bonuses
    this.dashCooldownReduction = (trainingLevels['dash_recharge'] || 0) * 0.08;
    this.dashSlowdownReduction = (trainingLevels['dash_control'] || 0) * 0.15;
    this.dashDistanceBonus = (trainingLevels['dash_distance'] || 0) * 0.1;
    this.dashDamageBonus = (trainingLevels['dash_strike'] || 0) * 0.15;
    this.hasDoubleDash = (trainingLevels['double_dash'] || 0) >= 1;

    // Update dash charges based on double dash unlock
    if (this.dashCooldown <= 0) {
      this.dashCharges = this.hasDoubleDash ? 2 : 1;
    }
  }

  // Get total dash attack damage multiplier (base + training bonus)
  getDashDamageMultiplier(): number {
    // Base dash damage multiplier for ranged weapons is 2.5x
    const baseDashMultiplier = 2.5;
    return baseDashMultiplier * (1 + this.dashDamageBonus);
  }
}
