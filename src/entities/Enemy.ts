/**
 * Enemy - Enemy entity with AI
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Enemy as EnemyData, Weapon } from './types';

export class Enemy extends Entity {
  public enemyData: EnemyData;
  public weapon: Weapon | null = null;
  public aiState: 'idle' | 'chase' | 'attack' = 'idle';
  public attackCooldown: number = 0;
  public chaseRange: number = 200;
  public targetX: number = 0;
  public targetY: number = 0;
  public facingAngle: number = 0;

  constructor(x: number, y: number, enemyData: EnemyData, weapon: Weapon | null = null) {
    const stats: EntityStats = {
      maxHealth: enemyData.health,
      health: enemyData.health,
      attack: enemyData.attack,
      defense: enemyData.defense,
      speed: 80, // Slightly slower than player
    };

    super(EntityType.ENEMY, x, y, 20, stats, '#F44336');
    this.enemyData = enemyData;
    this.weapon = weapon;
  }

  update(deltaTime: number): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
  }

  updateAI(playerX: number, playerY: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    // Update facing angle towards player
    this.facingAngle = Math.atan2(dy, dx);

    // State machine
    const attackRange = this.getAttackRange();
    if (distanceToPlayer <= attackRange) {
      this.aiState = 'attack';
    } else if (distanceToPlayer <= this.chaseRange) {
      this.aiState = 'chase';
    } else {
      this.aiState = 'idle';
    }

    // Execute state behavior
    switch (this.aiState) {
      case 'chase':
        this.chasePlayer(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'attack':
        this.attackPlayer();
        break;
    }
  }

  private chasePlayer(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Try to move towards player
    const newX = this.x + dirX * this.stats.speed * deltaTime;
    const newY = this.y + dirY * this.stats.speed * deltaTime;

    if (canMoveTo(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      // Try moving in just X or Y if diagonal is blocked
      if (canMoveTo(newX, this.y)) {
        this.x = newX;
      } else if (canMoveTo(this.x, newY)) {
        this.y = newY;
      }
    }
  }

  private attackPlayer(): void {
    // This method is called when enemy is in attack range
    // The actual attack execution and cooldown setting happens in GameScreen
    // Just maintain attack state here
  }

  canAttack(): boolean {
    return this.attackCooldown <= 0 && this.aiState === 'attack';
  }

  getAttackDamage(): number {
    if (this.weapon) {
      return this.stats.attack + this.weapon.damage;
    }
    return this.stats.attack;
  }

  getAttackRange(): number {
    return this.weapon?.range || 30;
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

  // Get projectile spawn position
  getProjectileSpawn(): { x: number; y: number } {
    const offsetDistance = this.size / 2 + 5;
    return {
      x: this.x + Math.cos(this.facingAngle) * offsetDistance,
      y: this.y + Math.sin(this.facingAngle) * offsetDistance,
    };
  }

  // Get loot drops when defeated
  getLoot(): { gold: number; items: string[] } {
    const gold = this.enemyData.goldReward || 10;
    const items: string[] = [];

    // Drop ingredients based on drop table
    for (const drop of this.enemyData.lootTable) {
      if (Math.random() < drop.chance) {
        items.push(drop.itemId);
      }
    }

    return { gold, items };
  }
}
