/**
 * EnemyAttack - Attack pattern logic for enemies
 */

import { AttackPattern, Weapon } from './types';

export class EnemyAttack {
  public attackPattern: AttackPattern;
  public attackCooldown: number = 0;

  private burstCount: number = 0;
  private burstMax: number = 3;
  private chargeTimer: number = 0;
  private retreatTimer: number = 0;

  constructor(pattern: AttackPattern) {
    this.attackPattern = pattern;
  }

  updateTimers(deltaTime: number): void {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    if (this.chargeTimer > 0) {
      this.chargeTimer -= deltaTime;
    }
    if (this.retreatTimer > 0) {
      this.retreatTimer -= deltaTime;
    }
  }

  executeAttackPattern(): void {
    switch (this.attackPattern) {
      case 'charge':
        this.executeChargePattern();
        break;
      case 'burst':
        this.executeBurstPattern();
        break;
      case 'strafe':
        this.executeStrafePattern();
        break;
      case 'retreat':
        this.executeRetreatPattern();
        break;
      case 'standard':
      default:
        break;
    }
  }

  private executeChargePattern(): void {
    if (this.chargeTimer <= 0 && this.attackCooldown <= 0) {
      this.chargeTimer = 0.3;
    }
  }

  private executeBurstPattern(): void {
    // Burst pattern handled by reduced cooldown in canAttack()
  }

  private executeStrafePattern(): void {
    // Strafe pattern: Circle around player while attacking
  }

  private executeRetreatPattern(): void {
    if (this.attackCooldown > 0 && this.retreatTimer <= 0) {
      this.retreatTimer = 0.5;
    }
  }

  canAttack(aiState: string): boolean {
    if (this.attackPattern === 'burst' && this.burstCount < this.burstMax) {
      if (this.attackCooldown <= 0 && aiState === 'attack') {
        return true;
      }
    }
    return this.attackCooldown <= 0 && aiState === 'attack';
  }

  onAttackExecuted(weapon: Weapon | null): void {
    if (this.attackPattern === 'burst') {
      this.burstCount++;
      if (this.burstCount >= this.burstMax) {
        this.burstCount = 0;
        this.attackCooldown = (weapon?.attackSpeed || 1.0) * 2;
      } else {
        this.attackCooldown = (weapon?.attackSpeed || 1.0) * 0.3;
      }
    }
  }

  shouldRetreat(): boolean {
    return this.retreatTimer > 0;
  }

  getChargeTimer(): number {
    return this.chargeTimer;
  }
}
