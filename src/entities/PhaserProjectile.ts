/**
 * PhaserProjectile - Phaser-based projectile sprite
 */

import Phaser from 'phaser';

export class PhaserProjectile extends Phaser.Physics.Arcade.Sprite {
  public damage: number;
  public owner: 'player' | 'enemy';
  public lifetime: number = 0;
  public maxLifetime: number = 2.0; // seconds

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    angle: number,
    speed: number,
    damage: number,
    owner: 'player' | 'enemy'
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.damage = damage;
    this.owner = owner;

    // Set velocity based on angle
    this.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );

    this.setRotation(angle);
  }

  update(deltaTime: number): boolean {
    this.lifetime += deltaTime;

    if (this.lifetime >= this.maxLifetime) {
      return true; // Projectile should be destroyed
    }

    return false;
  }
}
