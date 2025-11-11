/**
 * Enemy - Enemy entity with enhanced AI behaviors
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Enemy as EnemyData, Weapon } from './types';
import { EnemyAI } from './EnemyAI';
import { EnemyMovement } from './EnemyMovement';
import { EnemyAttack } from './EnemyAttack';
import { EnemyCombat } from './EnemyCombat';
import { EnemyLoot } from './EnemyLoot';

export class Enemy extends Entity {
  public enemyData: EnemyData;
  public targetX: number = 0;
  public targetY: number = 0;
  public facingAngle: number = 0;
  public loggedDeath: boolean = false;

  // Component modules
  private ai: EnemyAI;
  private movement: EnemyMovement;
  private attack: EnemyAttack;
  private combat: EnemyCombat;
  private loot: EnemyLoot;

  // Movement state
  private lastPlayerX: number = 0;
  private lastPlayerY: number = 0;

  constructor(x: number, y: number, enemyData: EnemyData, weapon: Weapon | null = null) {
    const baseSpeed = enemyData.speed || 80;

    const stats: EntityStats = {
      maxHealth: enemyData.health,
      health: enemyData.health,
      attack: enemyData.attack,
      defense: enemyData.defense,
      speed: baseSpeed,
    };

    super(EntityType.ENEMY, x, y, 20, stats, '#F44336');
    this.enemyData = enemyData;

    // Initialize component modules
    this.ai = new EnemyAI(enemyData.aiBehavior || 'standard');
    this.movement = new EnemyMovement();
    this.attack = new EnemyAttack(enemyData.attackPattern || 'standard');
    this.combat = new EnemyCombat(weapon, stats.attack, 20);
    this.loot = new EnemyLoot(enemyData.lootTable);

    // Configure behavior and apply speed multipliers
    const config = this.ai.configureBehavior();
    this.stats.speed *= config.speedMultiplier;

    // Initialize patrol waypoints
    this.movement.initializePatrolWaypoints(x, y);
  }

  get aiState() { return this.ai.aiState; }
  get aiBehavior() { return this.ai.aiBehavior; }
  get attackPattern() { return this.attack.attackPattern; }
  get weapon() { return this.combat.getWeapon(); }
  set weapon(weapon: Weapon | null) { this.combat.setWeapon(weapon); }
  get chaseRange() { return this.ai.chaseRange; }
  get attackCooldown() { return this.attack.attackCooldown; }
  set attackCooldown(value: number) { this.attack.attackCooldown = value; }

  update(deltaTime: number): void {
    this.attack.updateTimers(deltaTime);
    this.movement.updatePatrolTimer(deltaTime);
  }

  updateAI(playerX: number, playerY: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    this.lastPlayerX = playerX;
    this.lastPlayerY = playerY;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    this.facingAngle = Math.atan2(dy, dx);
    this.combat.setFacingAngle(this.facingAngle);

    const attackRange = this.combat.getAttackRange();
    this.stats.speed = this.ai.updateAIState(distanceToPlayer, attackRange, this.stats.health, this.stats.maxHealth, this.stats.speed);

    switch (this.aiBehavior) {
      case 'aggressive': this.updateAggressiveBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
      case 'defensive': this.updateDefensiveBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
      case 'ranged': this.updateRangedBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
      case 'ambusher': this.updateAmbusherBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
      case 'patrol': this.updatePatrolBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
      default: this.updateStandardBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo); break;
    }
  }

  private updateStandardBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.aiState === 'chase') this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
    else if (this.aiState === 'attack') this.attack.executeAttackPattern();
  }

  private updateAggressiveBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.aiState === 'patrol') this.patrolArea(deltaTime, canMoveTo);
    else if (this.aiState === 'chase') this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo, 1.2);
    else if (this.aiState === 'attack') this.attack.executeAttackPattern();
  }

  private updateDefensiveBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.aiState === 'retreat') this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
    else if (this.aiState === 'chase') this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo, 0.8);
    else if (this.aiState === 'attack') this.attack.executeAttackPattern();
  }

  private updateRangedBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const optimalRange = this.combat.getAttackRange() * 0.7;
    if (this.aiState === 'chase') {
      if (distance > optimalRange + 50) this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
      else if (distance < optimalRange - 50) this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
      else this.strafeAroundTarget(dx, dy, distance, deltaTime, canMoveTo);
    } else if (this.aiState === 'attack') {
      if (distance < optimalRange - 50) this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
      this.attack.executeAttackPattern();
    }
  }

  private updateAmbusherBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.aiState === 'chase') this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
    else if (this.aiState === 'attack') this.attack.executeAttackPattern();
  }

  private updatePatrolBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.aiState === 'patrol') this.patrolArea(deltaTime, canMoveTo);
    else if (this.aiState === 'chase') this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
    else if (this.aiState === 'attack') this.attack.executeAttackPattern();
  }

  private moveTowardsTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean, speedMultiplier: number = 1.0): void {
    const pos = this.movement.moveTowardsTarget(this.x, this.y, dx, dy, distance, this.stats.speed, deltaTime, canMoveTo, speedMultiplier);
    this.x = pos.x; this.y = pos.y;
  }

  private moveAwayFromTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const pos = this.movement.moveAwayFromTarget(this.x, this.y, dx, dy, distance, this.stats.speed, deltaTime, canMoveTo);
    this.x = pos.x; this.y = pos.y;
  }

  private strafeAroundTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const pos = this.movement.strafeAroundTarget(this.x, this.y, dx, dy, this.stats.speed, deltaTime, canMoveTo);
    this.x = pos.x; this.y = pos.y;
  }

  private patrolArea(deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const result = this.movement.patrolArea(this.x, this.y, this.stats.speed, deltaTime, canMoveTo);
    this.x = result.x; this.y = result.y; this.facingAngle = result.facingAngle;
  }

  canAttack(): boolean { return this.attack.canAttack(this.aiState); }
  onAttackExecuted(): void { this.attack.onAttackExecuted(this.weapon); }
  shouldRetreat(): boolean { return this.attack.shouldRetreat(); }
  getAttackDamage(): number { return this.combat.getAttackDamage(); }
  getAttackRange(): number { return this.combat.getAttackRange(); }
  isRangedWeapon(): boolean { return this.combat.isRangedWeapon(); }
  getProjectileSpeed(): number { return this.combat.getProjectileSpeed(); }
  getPelletCount(): number { return this.combat.getPelletCount(); }
  getSpread(): number { return this.combat.getSpread(); }
  getProjectileSpawn(): { x: number; y: number } { return this.combat.getProjectileSpawn(this.x, this.y); }
  getLoot(): { gold: number; items: string[] } { return this.loot.getLoot(); }
}
