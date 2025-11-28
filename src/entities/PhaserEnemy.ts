/**
 * PhaserEnemy - Phaser-based enemy sprite
 */

import Phaser from 'phaser';

export class PhaserEnemy extends Phaser.Physics.Arcade.Sprite {
  public enemyId: string;
  public maxHealth: number;
  public health: number;
  public attack: number;
  public defense: number;
  public moveSpeed: number;
  public aiState: 'idle' | 'chase' | 'attack' | 'flee' = 'idle';
  public attackCooldown: number = 0;
  public detectionRange: number = 200;
  public attackRange: number = 30;
  public gold: number = 0;
  public behavior: string = 'aggressive';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    enemyId: string,
    stats: {
      maxHealth: number;
      attack: number;
      defense: number;
      speed: number;
      gold?: number;
      behavior?: string;
    }
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemyId = enemyId;
    this.maxHealth = stats.maxHealth;
    this.health = stats.maxHealth;
    this.attack = stats.attack;
    this.defense = stats.defense;
    this.moveSpeed = stats.speed;
    this.gold = stats.gold || 0;
    this.behavior = stats.behavior || 'aggressive';

    this.setCollideWorldBounds(true);
  }

  update(deltaTime: number, playerX: number, playerY: number): void {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);

    // Simple AI
    if (this.behavior === 'aggressive') {
      if (distanceToPlayer < this.detectionRange) {
        if (distanceToPlayer > this.attackRange) {
          this.aiState = 'chase';
          this.moveTowardsPlayer(playerX, playerY);
        } else {
          this.aiState = 'attack';
          this.setVelocity(0, 0);
        }
      } else {
        this.aiState = 'idle';
        this.setVelocity(0, 0);
      }
    } else if (this.behavior === 'passive') {
      this.aiState = 'idle';
      this.setVelocity(0, 0);
    }
  }

  private moveTowardsPlayer(playerX: number, playerY: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
    this.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
  }

  takeDamage(damage: number): boolean {
    const actualDamage = Math.max(1, damage - this.defense);
    this.health -= actualDamage;

    if (this.health <= 0) {
      this.health = 0;
      return true; // Enemy died
    }

    return false;
  }
}
