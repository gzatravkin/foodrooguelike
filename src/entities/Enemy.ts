/**
 * Enemy - Enemy entity with enhanced AI behaviors
 */

import { Entity, EntityType, EntityStats } from './Entity';
import { Enemy as EnemyData, Weapon, AIBehaviorType, AttackPattern } from './types';

export class Enemy extends Entity {
  public enemyData: EnemyData;
  public weapon: Weapon | null = null;
  public aiState: 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat' | 'ambush' = 'idle';
  public attackCooldown: number = 0;
  public chaseRange: number = 200;
  public targetX: number = 0;
  public targetY: number = 0;
  public facingAngle: number = 0;
  public loggedDeath: boolean = false;

  // AI Behavior properties
  public aiBehavior: AIBehaviorType;
  public attackPattern: AttackPattern;

  // Patrol system
  private patrolWaypoints: Array<{x: number, y: number}> = [];
  private currentWaypointIndex: number = 0;
  private patrolTimer: number = 0;
  private patrolWaitTime: number = 2; // Wait 2 seconds at each waypoint

  // Ambush behavior
  private ambushTriggered: boolean = false;
  private ambushRange: number = 150;

  // Attack pattern state
  private burstCount: number = 0;
  private burstMax: number = 3;
  private chargeTimer: number = 0;
  private strafeAngle: number = 0;
  private retreatTimer: number = 0;

  // Movement state
  private lastPlayerX: number = 0;
  private lastPlayerY: number = 0;

  constructor(x: number, y: number, enemyData: EnemyData, weapon: Weapon | null = null) {
    // Use enemy-specific speed if provided, otherwise use behavior-based defaults
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
    this.weapon = weapon;

    // Set AI behavior and attack pattern
    this.aiBehavior = enemyData.aiBehavior || 'standard';
    this.attackPattern = enemyData.attackPattern || 'standard';

    // Configure behavior-specific properties
    this.configureBehavior();

    // Initialize patrol waypoints around spawn position
    this.initializePatrolWaypoints(x, y);
  }

  private configureBehavior(): void {
    switch (this.aiBehavior) {
      case 'aggressive':
        this.chaseRange = 300; // Larger detection range
        this.stats.speed *= 1.3; // 30% faster
        break;
      case 'defensive':
        this.chaseRange = 150; // Smaller detection range
        this.stats.speed *= 0.8; // 20% slower
        break;
      case 'ranged':
        this.chaseRange = 250;
        this.stats.speed *= 1.1; // Slightly faster for kiting
        break;
      case 'ambusher':
        this.chaseRange = 100; // Small detection, but will rush when triggered
        this.stats.speed *= 0.5; // Very slow when not triggered
        this.aiState = 'ambush'; // Start in ambush state
        break;
      case 'patrol':
        this.chaseRange = 200;
        this.aiState = 'patrol'; // Start in patrol state
        break;
      case 'standard':
      default:
        // Use default values
        break;
    }
  }

  private initializePatrolWaypoints(centerX: number, centerY: number): void {
    // Create a square patrol pattern around spawn point
    const patrolRadius = 100;
    this.patrolWaypoints = [
      { x: centerX + patrolRadius, y: centerY },
      { x: centerX + patrolRadius, y: centerY + patrolRadius },
      { x: centerX, y: centerY + patrolRadius },
      { x: centerX - patrolRadius, y: centerY + patrolRadius },
      { x: centerX - patrolRadius, y: centerY },
      { x: centerX - patrolRadius, y: centerY - patrolRadius },
      { x: centerX, y: centerY - patrolRadius },
      { x: centerX + patrolRadius, y: centerY - patrolRadius },
    ];

    // Randomize starting waypoint
    this.currentWaypointIndex = Math.floor(Math.random() * this.patrolWaypoints.length);
  }

  update(deltaTime: number): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    // Update timers
    if (this.patrolTimer > 0) {
      this.patrolTimer -= deltaTime;
    }
    if (this.chargeTimer > 0) {
      this.chargeTimer -= deltaTime;
    }
    if (this.retreatTimer > 0) {
      this.retreatTimer -= deltaTime;
    }
  }

  updateAI(playerX: number, playerY: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    this.lastPlayerX = playerX;
    this.lastPlayerY = playerY;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    // Update facing angle towards player
    this.facingAngle = Math.atan2(dy, dx);

    // Determine AI state based on behavior type
    this.updateAIState(distanceToPlayer);

    // Execute behavior-specific logic
    switch (this.aiBehavior) {
      case 'aggressive':
        this.updateAggressiveBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'defensive':
        this.updateDefensiveBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'ranged':
        this.updateRangedBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'ambusher':
        this.updateAmbusherBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'patrol':
        this.updatePatrolBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
      case 'standard':
      default:
        this.updateStandardBehavior(dx, dy, distanceToPlayer, deltaTime, canMoveTo);
        break;
    }
  }

  private updateAIState(distanceToPlayer: number): void {
    const attackRange = this.getAttackRange();

    // Special handling for ambusher
    if (this.aiBehavior === 'ambusher' && !this.ambushTriggered) {
      if (distanceToPlayer <= this.ambushRange) {
        this.ambushTriggered = true;
        this.stats.speed *= 3; // Triple speed when ambush triggers!
        this.aiState = 'chase';
      } else {
        this.aiState = 'ambush';
      }
      return;
    }

    // Defensive behavior retreats when low health
    if (this.aiBehavior === 'defensive' && this.stats.health < this.stats.maxHealth * 0.3) {
      if (distanceToPlayer <= this.chaseRange) {
        this.aiState = 'retreat';
        return;
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
  }

  // ============= BEHAVIOR IMPLEMENTATIONS =============

  private updateStandardBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    switch (this.aiState) {
      case 'chase':
        this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
        break;
      case 'attack':
        this.executeAttackPattern();
        break;
    }
  }

  private updateAggressiveBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    switch (this.aiState) {
      case 'patrol':
        this.patrolArea(deltaTime, canMoveTo);
        break;
      case 'chase':
        // Aggressive enemies charge directly at player
        this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo, 1.2); // Extra speed boost
        break;
      case 'attack':
        this.executeAttackPattern();
        break;
    }
  }

  private updateDefensiveBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    switch (this.aiState) {
      case 'retreat':
        // Move away from player
        this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
        break;
      case 'chase':
        this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo, 0.8); // Cautious approach
        break;
      case 'attack':
        this.executeAttackPattern();
        break;
    }
  }

  private updateRangedBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    const optimalRange = this.getAttackRange() * 0.7; // Stay at 70% of max range

    switch (this.aiState) {
      case 'chase':
        if (distance > optimalRange + 50) {
          // Too far, move closer
          this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
        } else if (distance < optimalRange - 50) {
          // Too close, back away (kiting)
          this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
        } else {
          // At optimal range, strafe around player
          this.strafeAroundTarget(dx, dy, distance, deltaTime, canMoveTo);
        }
        break;
      case 'attack':
        // Continue kiting while attacking
        if (distance < optimalRange - 50) {
          this.moveAwayFromTarget(dx, dy, distance, deltaTime, canMoveTo);
        }
        this.executeAttackPattern();
        break;
    }
  }

  private updateAmbusherBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    switch (this.aiState) {
      case 'ambush':
        // Stay perfectly still, waiting...
        break;
      case 'chase':
        // Rush at player with high speed
        this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
        break;
      case 'attack':
        this.executeAttackPattern();
        break;
    }
  }

  private updatePatrolBehavior(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    switch (this.aiState) {
      case 'patrol':
        this.patrolArea(deltaTime, canMoveTo);
        break;
      case 'chase':
        this.moveTowardsTarget(dx, dy, distance, deltaTime, canMoveTo);
        break;
      case 'attack':
        this.executeAttackPattern();
        break;
    }
  }

  // ============= MOVEMENT METHODS =============

  private moveTowardsTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean, speedMultiplier: number = 1.0): void {
    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Try to move towards target
    const newX = this.x + dirX * this.stats.speed * deltaTime * speedMultiplier;
    const newY = this.y + dirY * this.stats.speed * deltaTime * speedMultiplier;

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

  private moveAwayFromTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    // Normalize direction and reverse it
    const dirX = -dx / distance;
    const dirY = -dy / distance;

    // Try to move away from target
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

  private strafeAroundTarget(dx: number, dy: number, distance: number, deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    // Calculate perpendicular direction for strafing
    this.strafeAngle += deltaTime; // Rotate strafe direction over time
    const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;

    const dirX = Math.cos(perpAngle + this.strafeAngle);
    const dirY = Math.sin(perpAngle + this.strafeAngle);

    const newX = this.x + dirX * this.stats.speed * deltaTime;
    const newY = this.y + dirY * this.stats.speed * deltaTime;

    if (canMoveTo(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  private patrolArea(deltaTime: number, canMoveTo: (x: number, y: number) => boolean): void {
    if (this.patrolWaypoints.length === 0) return;

    // Wait at waypoint if timer is active
    if (this.patrolTimer > 0) return;

    const targetWaypoint = this.patrolWaypoints[this.currentWaypointIndex];
    const dx = targetWaypoint.x - this.x;
    const dy = targetWaypoint.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Update facing angle towards waypoint
    this.facingAngle = Math.atan2(dy, dx);

    // Check if reached waypoint
    if (distance < 10) {
      // Start wait timer and move to next waypoint
      this.patrolTimer = this.patrolWaitTime;
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
      return;
    }

    // Move towards waypoint
    const dirX = dx / distance;
    const dirY = dy / distance;

    const newX = this.x + dirX * this.stats.speed * deltaTime * 0.7; // Patrol at 70% speed
    const newY = this.y + dirY * this.stats.speed * deltaTime * 0.7;

    if (canMoveTo(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      // If blocked, skip to next waypoint
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
    }
  }

  // ============= ATTACK PATTERN METHODS =============

  private executeAttackPattern(): void {
    // Attack patterns are executed, but actual damage is handled in GameScreenUpdater
    // These methods set up the behavior during attack state

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
        // Standard attack - just maintain position
        break;
    }
  }

  private executeChargePattern(): void {
    // Charge pattern: Rush forward briefly before attacking
    if (this.chargeTimer <= 0 && this.attackCooldown <= 0) {
      this.chargeTimer = 0.3; // 0.3 second charge
    }
  }

  private executeBurstPattern(): void {
    // Burst pattern handled by reduced cooldown in canAttack()
    // This is checked in the game loop
  }

  private executeStrafePattern(): void {
    // Strafe pattern: Circle around player while attacking
    // Movement is handled, this just maintains the state
  }

  private executeRetreatPattern(): void {
    // Retreat pattern: Back away after attacking
    if (this.attackCooldown > 0 && this.retreatTimer <= 0) {
      this.retreatTimer = 0.5; // Retreat for 0.5 seconds after attack
    }
  }

  canAttack(): boolean {
    // Burst pattern allows multiple quick attacks
    if (this.attackPattern === 'burst' && this.burstCount < this.burstMax) {
      if (this.attackCooldown <= 0 && this.aiState === 'attack') {
        return true;
      }
    }

    return this.attackCooldown <= 0 && this.aiState === 'attack';
  }

  // Called after enemy successfully attacks
  onAttackExecuted(): void {
    if (this.attackPattern === 'burst') {
      this.burstCount++;
      if (this.burstCount >= this.burstMax) {
        // Reset burst and apply longer cooldown
        this.burstCount = 0;
        this.attackCooldown = (this.weapon?.attackSpeed || 1.0) * 2; // Double cooldown after burst
      } else {
        // Quick follow-up attacks
        this.attackCooldown = (this.weapon?.attackSpeed || 1.0) * 0.3; // 30% cooldown between burst shots
      }
    }
  }

  // Check if enemy should retreat (for retreat attack pattern)
  shouldRetreat(): boolean {
    return this.retreatTimer > 0;
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

  // Get loot drops when defeated (ingredients only, no direct gold)
  getLoot(): { gold: number; items: string[] } {
    const items: string[] = [];

    // Drop ingredients based on drop table
    for (const drop of this.enemyData.lootTable) {
      if (Math.random() < drop.chance) {
        items.push(drop.itemId);
      }
    }

    return { gold: 0, items };
  }
}
