/**
 * EnemyCombat - Combat and weapon-related properties for enemies
 */

import { Weapon } from './types';

export class EnemyCombat {
  private weapon: Weapon | null;
  private baseAttack: number;
  private facingAngle: number;
  private entitySize: number;

  constructor(weapon: Weapon | null, baseAttack: number, entitySize: number) {
    this.weapon = weapon;
    this.baseAttack = baseAttack;
    this.facingAngle = 0;
    this.entitySize = entitySize;
  }

  setWeapon(weapon: Weapon | null): void {
    this.weapon = weapon;
  }

  getWeapon(): Weapon | null {
    return this.weapon;
  }

  setFacingAngle(angle: number): void {
    this.facingAngle = angle;
  }

  getFacingAngle(): number {
    return this.facingAngle;
  }

  getAttackDamage(): number {
    if (this.weapon) {
      return this.baseAttack + this.weapon.damage;
    }
    return this.baseAttack;
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

  getProjectileSpawn(currentX: number, currentY: number): { x: number; y: number } {
    const offsetDistance = this.entitySize / 2 + 5;
    return {
      x: currentX + Math.cos(this.facingAngle) * offsetDistance,
      y: currentY + Math.sin(this.facingAngle) * offsetDistance,
    };
  }
}
