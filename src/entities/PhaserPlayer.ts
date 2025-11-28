/**
 * PhaserPlayer - Phaser-based player sprite
 */

import Phaser from 'phaser';
import { Equipment, Weapon } from './types';
import { getPlayerSize } from '../utils/MobileUtils';

export class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  public weapon: Weapon | null = null;
  public weaponEquipment: Equipment | null = null;
  public armor: Equipment | null = null;
  public gold: number = 100;
  public attackCooldown: number = 0;
  public facingAngle: number = 0;
  public dashCooldown: number = 0;
  public dashDuration: number = 0;
  public dashDirection: { x: number; y: number } = { x: 0, y: 0 };
  public isDashing: boolean = false;
  public slowedDuration: number = 0;
  public slowMultiplier: number = 0.3;

  // Stats
  public maxHealth: number = 100;
  public health: number = 100;
  public attack: number = 10;
  public defense: number = 5;
  public moveSpeed: number = 150;

  // Dash training bonuses
  public dashCooldownReduction: number = 0;
  public dashSlowdownReduction: number = 0;
  public dashDistanceBonus: number = 0;
  public dashDamageBonus: number = 0;
  public hasDoubleDash: boolean = false;
  public dashCharges: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, initialWeapon?: Weapon) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const playerSize = getPlayerSize();
    this.setDisplaySize(playerSize, playerSize);
    this.setCollideWorldBounds(true);

    this.weapon = initialWeapon || null;
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

      if (this.dashCooldown <= 0) {
        this.dashCharges = this.hasDoubleDash ? 2 : 1;
      }
    }

    // Update dash duration
    if (this.dashDuration > 0) {
      this.dashDuration -= deltaTime;
      this.isDashing = true;

      if (this.dashDuration <= 0) {
        this.isDashing = false;
        const baseSlowdown = 1.0;
        this.slowedDuration = baseSlowdown * (1 - this.dashSlowdownReduction);
      }
    } else {
      this.isDashing = false;
    }

    // Update slow duration
    if (this.slowedDuration > 0) {
      this.slowedDuration -= deltaTime;
    }
  }

  takeDamage(damage: number): void {
    const actualDamage = Math.max(1, damage - this.defense);
    this.health -= actualDamage;

    if (this.health <= 0) {
      this.health = 0;
      // Handle death
    }
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  equipWeaponEquipment(equipment: Equipment): void {
    this.weaponEquipment = equipment;
    this.applyEquipmentStats();
  }

  equipArmor(equipment: Equipment): void {
    this.armor = equipment;
    this.applyEquipmentStats();
  }

  private applyEquipmentStats(): void {
    // Reset to base stats
    this.attack = 10;
    this.defense = 5;
    this.maxHealth = 100;

    // Apply weapon equipment stats
    if (this.weaponEquipment?.stats) {
      this.attack += this.weaponEquipment.stats.attack || 0;
      this.defense += this.weaponEquipment.stats.defense || 0;
      this.maxHealth += this.weaponEquipment.stats.health || 0;
    }

    // Apply armor stats
    if (this.armor?.stats) {
      this.attack += this.armor.stats.attack || 0;
      this.defense += this.armor.stats.defense || 0;
      this.maxHealth += this.armor.stats.health || 0;
    }

    // Ensure health doesn't exceed max health
    this.health = Math.min(this.health, this.maxHealth);
  }
}
