/**
 * NPCClient - Customer NPC that walks around the dining room and orders food
 */

import { Entity, EntityType, EntityStats } from './Entity';

export interface NPCClientData {
  id: string;
  name: string;
  color: string;
  goldReward: number; // How much they pay for a dish
  preferredBuffType?: 'health' | 'attack' | 'defense'; // What type of dish they prefer
  locationTier: number; // 1-7, based on the location they came from
}

export class NPCClient extends Entity {
  public clientData: NPCClientData;
  public targetX: number = 0;
  public targetY: number = 0;
  public moveTimer: number = 0;
  public facingAngle: number = 0;
  public hasOrdered: boolean = false;
  public wantsFood: boolean = true;
  public satisfiedTimer: number = 0;

  constructor(x: number, y: number, clientData: NPCClientData) {
    const stats: EntityStats = {
      maxHealth: 100,
      health: 100,
      attack: 0,
      defense: 0,
      speed: 40, // Slower than player, they just walk around
    };

    super(EntityType.NPC, x, y, 16, stats, clientData.color);
    this.clientData = clientData;

    // Set initial target
    this.setNewTarget(x, y);
  }

  private setNewTarget(currentX: number, currentY: number): void {
    // Move within a small area (dining room bounds)
    const moveRange = 50;
    this.targetX = currentX + (Math.random() - 0.5) * moveRange * 2;
    this.targetY = currentY + (Math.random() - 0.5) * moveRange * 2;
    this.moveTimer = 2 + Math.random() * 3; // Move for 2-5 seconds
  }

  update(deltaTime: number): void {
    // Update satisfied timer
    if (this.satisfiedTimer > 0) {
      this.satisfiedTimer -= deltaTime;
      if (this.satisfiedTimer <= 0) {
        this.wantsFood = true;
      }
    }

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

  serveDish(dishBuffType: 'health' | 'attack' | 'defense', dishValue: number): number {
    this.hasOrdered = true;
    this.wantsFood = false;
    this.satisfiedTimer = 10; // Satisfied for 10 seconds

    // Calculate payment based on dish value and if it matches preference
    let payment = this.clientData.goldReward;

    if (this.clientData.preferredBuffType && this.clientData.preferredBuffType === dishBuffType) {
      // Bonus for matching preference
      payment = Math.floor(payment * 1.5);
    }

    return payment;
  }
}
