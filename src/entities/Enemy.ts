/**
 * Enemy - Enemy entity with AI
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Enemy as EnemyData } from './types';

export class Enemy extends Entity {
  public enemyData: EnemyData;
  public aiState: 'idle' | 'chase' | 'attack' = 'idle';
  public attackCooldown: number = 0;
  public attackRange: number = 30;
  public chaseRange: number = 200;
  public targetX: number = 0;
  public targetY: number = 0;

  constructor(x: number, y: number, enemyData: EnemyData) {
    const stats: EntityStats = {
      maxHealth: enemyData.health,
      health: enemyData.health,
      attack: enemyData.attack,
      defense: enemyData.defense,
      speed: 80, // Slightly slower than player
    };

    super(EntityType.ENEMY, x, y, 20, stats, '#F44336');
    this.enemyData = enemyData;
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

    // State machine
    if (distanceToPlayer <= this.attackRange) {
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
    if (this.attackCooldown > 0) return;

    this.attackCooldown = 1.0; // 1 attack per second
  }

  canAttack(): boolean {
    return this.attackCooldown <= 0 && this.aiState === 'attack';
  }

  getAttackDamage(): number {
    return this.stats.attack;
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
