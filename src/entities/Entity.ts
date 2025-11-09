/**
 * Entity - Base class for all game entities (player, enemies, items)
 */

export enum EntityType {
  PLAYER,
  ENEMY,
  ITEM,
  NPC,
}

export type EntityStats = {
  maxHealth: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

export abstract class Entity {
  public id: string;
  public type: EntityType;
  public x: number;
  public y: number;
  public size: number;
  public stats: EntityStats;
  public alive: boolean = true;
  public color: string;

  constructor(
    type: EntityType,
    x: number,
    y: number,
    size: number = 16,
    stats: EntityStats,
    color: string = '#fff'
  ) {
    this.id = Math.random().toString(36).substring(7);
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
    this.stats = stats;
    this.color = color;
  }

  abstract update(deltaTime: number): void;

  takeDamage(damage: number): void {
    const actualDamage = Math.max(1, damage - this.stats.defense);
    this.stats.health -= actualDamage;

    if (this.stats.health <= 0) {
      this.stats.health = 0;
      this.alive = false;
    }
  }

  heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  getDistanceTo(other: Entity): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
    };
  }

  intersects(other: Entity): boolean {
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}
