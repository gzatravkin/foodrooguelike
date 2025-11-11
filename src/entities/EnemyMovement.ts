/**
 * EnemyMovement - Movement and patrol logic for enemies
 */

export class EnemyMovement {
  private patrolWaypoints: Array<{x: number, y: number}> = [];
  private currentWaypointIndex: number = 0;
  private patrolTimer: number = 0;
  private readonly patrolWaitTime: number = 2;
  private strafeAngle: number = 0;

  initializePatrolWaypoints(centerX: number, centerY: number): void {
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
    this.currentWaypointIndex = Math.floor(Math.random() * this.patrolWaypoints.length);
  }

  updatePatrolTimer(deltaTime: number): void {
    if (this.patrolTimer > 0) {
      this.patrolTimer -= deltaTime;
    }
  }

  moveTowardsTarget(
    currentX: number,
    currentY: number,
    dx: number,
    dy: number,
    distance: number,
    speed: number,
    deltaTime: number,
    canMoveTo: (x: number, y: number) => boolean,
    speedMultiplier: number = 1.0
  ): { x: number, y: number } {
    const dirX = dx / distance;
    const dirY = dy / distance;

    const newX = currentX + dirX * speed * deltaTime * speedMultiplier;
    const newY = currentY + dirY * speed * deltaTime * speedMultiplier;

    if (canMoveTo(newX, newY)) {
      return { x: newX, y: newY };
    } else if (canMoveTo(newX, currentY)) {
      return { x: newX, y: currentY };
    } else if (canMoveTo(currentX, newY)) {
      return { x: currentX, y: newY };
    }
    return { x: currentX, y: currentY };
  }

  moveAwayFromTarget(
    currentX: number,
    currentY: number,
    dx: number,
    dy: number,
    distance: number,
    speed: number,
    deltaTime: number,
    canMoveTo: (x: number, y: number) => boolean
  ): { x: number, y: number } {
    const dirX = -dx / distance;
    const dirY = -dy / distance;

    const newX = currentX + dirX * speed * deltaTime;
    const newY = currentY + dirY * speed * deltaTime;

    if (canMoveTo(newX, newY)) {
      return { x: newX, y: newY };
    } else if (canMoveTo(newX, currentY)) {
      return { x: newX, y: currentY };
    } else if (canMoveTo(currentX, newY)) {
      return { x: currentX, y: newY };
    }
    return { x: currentX, y: currentY };
  }

  strafeAroundTarget(
    currentX: number,
    currentY: number,
    dx: number,
    dy: number,
    speed: number,
    deltaTime: number,
    canMoveTo: (x: number, y: number) => boolean
  ): { x: number, y: number } {
    this.strafeAngle += deltaTime;
    const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
    const dirX = Math.cos(perpAngle + this.strafeAngle);
    const dirY = Math.sin(perpAngle + this.strafeAngle);

    const newX = currentX + dirX * speed * deltaTime;
    const newY = currentY + dirY * speed * deltaTime;

    if (canMoveTo(newX, newY)) {
      return { x: newX, y: newY };
    }
    return { x: currentX, y: currentY };
  }

  patrolArea(
    currentX: number,
    currentY: number,
    speed: number,
    deltaTime: number,
    canMoveTo: (x: number, y: number) => boolean
  ): { x: number, y: number, facingAngle: number } {
    if (this.patrolWaypoints.length === 0 || this.patrolTimer > 0) {
      return { x: currentX, y: currentY, facingAngle: 0 };
    }

    const targetWaypoint = this.patrolWaypoints[this.currentWaypointIndex];
    const dx = targetWaypoint.x - currentX;
    const dy = targetWaypoint.y - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const facingAngle = Math.atan2(dy, dx);

    if (distance < 10) {
      this.patrolTimer = this.patrolWaitTime;
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
      return { x: currentX, y: currentY, facingAngle };
    }

    const dirX = dx / distance;
    const dirY = dy / distance;
    const newX = currentX + dirX * speed * deltaTime * 0.7;
    const newY = currentY + dirY * speed * deltaTime * 0.7;

    if (canMoveTo(newX, newY)) {
      return { x: newX, y: newY, facingAngle };
    } else {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
      return { x: currentX, y: currentY, facingAngle };
    }
  }
}
