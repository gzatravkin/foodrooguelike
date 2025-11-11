/**
 * EnemyAI - AI behavior logic for enemies
 */

import { AIBehaviorType } from './types';

export interface AIConfig {
  chaseRange: number;
  speedMultiplier: number;
  initialState: 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat' | 'ambush';
}

export class EnemyAI {
  public aiBehavior: AIBehaviorType;
  public aiState: 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat' | 'ambush' = 'idle';
  public chaseRange: number = 200;
  public ambushTriggered: boolean = false;
  public ambushRange: number = 150;

  constructor(behavior: AIBehaviorType) {
    this.aiBehavior = behavior;
  }

  configureBehavior(): AIConfig {
    switch (this.aiBehavior) {
      case 'aggressive':
        this.chaseRange = 300;
        return { chaseRange: 300, speedMultiplier: 1.3, initialState: 'idle' };

      case 'defensive':
        this.chaseRange = 150;
        return { chaseRange: 150, speedMultiplier: 0.8, initialState: 'idle' };

      case 'ranged':
        this.chaseRange = 250;
        return { chaseRange: 250, speedMultiplier: 1.1, initialState: 'idle' };

      case 'ambusher':
        this.chaseRange = 100;
        this.aiState = 'ambush';
        return { chaseRange: 100, speedMultiplier: 0.5, initialState: 'ambush' };

      case 'patrol':
        this.chaseRange = 200;
        this.aiState = 'patrol';
        return { chaseRange: 200, speedMultiplier: 1.0, initialState: 'patrol' };

      case 'standard':
      default:
        return { chaseRange: 200, speedMultiplier: 1.0, initialState: 'idle' };
    }
  }

  updateAIState(distanceToPlayer: number, attackRange: number, currentHealth: number, maxHealth: number, currentSpeed: number): number {
    // Special handling for ambusher
    if (this.aiBehavior === 'ambusher' && !this.ambushTriggered) {
      if (distanceToPlayer <= this.ambushRange) {
        this.ambushTriggered = true;
        this.aiState = 'chase';
        return currentSpeed * 3; // Triple speed when ambush triggers!
      } else {
        this.aiState = 'ambush';
        return currentSpeed;
      }
    }

    // Defensive behavior retreats when low health
    if (this.aiBehavior === 'defensive' && currentHealth < maxHealth * 0.3) {
      if (distanceToPlayer <= this.chaseRange) {
        this.aiState = 'retreat';
        return currentSpeed;
      }
    }

    // Standard state transitions
    if (distanceToPlayer <= attackRange) {
      this.aiState = 'attack';
    } else if (distanceToPlayer <= this.chaseRange) {
      this.aiState = 'chase';
    } else {
      // Return to patrol or idle based on behavior
      if (this.aiBehavior === 'patrol' || this.aiBehavior === 'aggressive') {
        this.aiState = 'patrol';
      } else if (this.aiBehavior === 'ambusher') {
        this.aiState = 'ambush';
      } else {
        this.aiState = 'idle';
      }
    }

    return currentSpeed;
  }

  getSpeedMultiplierForState(baseSpeedMultiplier: number): number {
    switch (this.aiState) {
      case 'chase':
        if (this.aiBehavior === 'aggressive') {
          return baseSpeedMultiplier * 1.2;
        }
        if (this.aiBehavior === 'defensive') {
          return baseSpeedMultiplier * 0.8;
        }
        return baseSpeedMultiplier;
      default:
        return baseSpeedMultiplier;
    }
  }
}
