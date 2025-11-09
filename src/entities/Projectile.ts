/**
 * Projectile - Bullets, magic bolts, arrows, etc.
 */

export class Projectile {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public damage: number;
  public alive: boolean = true;
  public ownerId: string; // ID of the entity that fired it
  public ownerType: 'player' | 'enemy';
  public color: string;
  public size: number = 4;
  public maxDistance: number;
  public distanceTraveled: number = 0;

  constructor(
    x: number,
    y: number,
    angle: number,
    speed: number,
    damage: number,
    ownerId: string,
    ownerType: 'player' | 'enemy',
    maxDistance: number,
    color: string = '#FFD700'
  ) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.damage = damage;
    this.ownerId = ownerId;
    this.ownerType = ownerType;
    this.maxDistance = maxDistance;
    this.color = color;
  }

  update(deltaTime: number): void {
    const dx = this.vx * deltaTime;
    const dy = this.vy * deltaTime;

    this.x += dx;
    this.y += dy;

    const distance = Math.sqrt(dx * dx + dy * dy);
    this.distanceTraveled += distance;

    // Destroy projectile if it traveled too far
    if (this.distanceTraveled >= this.maxDistance) {
      this.alive = false;
    }
  }

  // Check if projectile hits a circular entity
  checkCollision(entityX: number, entityY: number, entitySize: number): boolean {
    const dx = this.x - entityX;
    const dy = this.y - entityY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= (this.size + entitySize / 2);
  }

  // Check if projectile hits a wall
  hitWall(): void {
    this.alive = false;
  }
}
