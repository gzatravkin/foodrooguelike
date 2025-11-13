/**
 * NPCClient - Background NPC that walks around the dining room for atmosphere
 */

import { Entity, EntityType, EntityStats } from './Entity';

export interface NPCClientData {
  id: string;
  name: string;
  color: string;
  goldReward: number;
  preferredBuffType?: 'health' | 'attack' | 'defense';
  locationTier: number;
  wantsFood?: boolean;
}

export class NPCClient extends Entity {
  public clientData: NPCClientData | null = null;
  public targetX: number = 0;
  public targetY: number = 0;
  public moveTimer: number = 0;
  public facingAngle: number = 0;

  constructor(x: number, y: number, colorOrData: string | NPCClientData) {
    const stats: EntityStats = {
      maxHealth: 100,
      health: 100,
      attack: 0,
      defense: 0,
      speed: 30, // Slower than player, they just walk around casually
    };

    const color = typeof colorOrData === 'string' ? colorOrData : colorOrData.color;
    super(EntityType.NPC, x, y, 16, stats, color);

    if (typeof colorOrData !== 'string') {
      this.clientData = colorOrData;
    }

    // Set initial target
    this.setNewTarget(x, y);
  }

  private setNewTarget(currentX: number, currentY: number): void {
    // Move within a small area (dining room bounds)
    const moveRange = 60;
    this.targetX = currentX + (Math.random() - 0.5) * moveRange * 2;
    this.targetY = currentY + (Math.random() - 0.5) * moveRange * 2;
    this.moveTimer = 3 + Math.random() * 4; // Move for 3-7 seconds
  }

  update(deltaTime: number): void {
    // Update movement
    this.moveTimer -= deltaTime;

    if (this.moveTimer <= 0) {
      this.setNewTarget(this.x, this.y);
    }

    // Move towards target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const moveSpeed = this.stats.speed * deltaTime;
      this.x += (dx / distance) * moveSpeed;
      this.y += (dy / distance) * moveSpeed;
      this.facingAngle = Math.atan2(dy, dx);
    }
  }
}
