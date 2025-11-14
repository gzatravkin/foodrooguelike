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
  public shape: 'circle' | 'beam' | 'bolt' | 'fire' = 'circle';
  public trailColor?: string;
  public impactColor?: string;
  public angle: number; // Store angle for directional rendering
  public speed: number; // Cached speed to avoid recalculation
  public normalizedVx: number; // Cached normalized direction
  public normalizedVy: number; // Cached normalized direction

  constructor(
    x: number,
    y: number,
    angle: number,
    speed: number,
    damage: number,
    ownerId: string,
    ownerType: 'player' | 'enemy',
    maxDistance: number,
    color: string = '#FFD700',
    shape: 'circle' | 'beam' | 'bolt' | 'fire' = 'circle',
    trailColor?: string,
    impactColor?: string
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
    this.shape = shape;
    this.trailColor = trailColor;
    this.impactColor = impactColor;
    this.angle = angle;

    // Cache speed and normalized direction to avoid recalculation in renderer
    this.speed = speed;
    this.normalizedVx = Math.cos(angle);
    this.normalizedVy = Math.sin(angle);
  }

  update(deltaTime: number): void {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Use cached speed instead of recalculating from dx/dy
    this.distanceTraveled += this.speed * deltaTime;

    // Destroy projectile if it traveled too far
    if (this.distanceTraveled >= this.maxDistance) {
      this.alive = false;
    }
  }

  // Check if projectile hits a circular entity
  checkCollision(entityX: number, entityY: number, entitySize: number): boolean {
    const dx = this.x - entityX;
    const dy = this.y - entityY;
    const distanceSquared = dx * dx + dy * dy;

    // Use squared distance comparison to avoid expensive sqrt()
    const radiusSum = this.size + entitySize / 2;
    return distanceSquared <= (radiusSum * radiusSum);
  }

  // Check if projectile hits a wall
  hitWall(): void {
    this.alive = false;
  }
}
