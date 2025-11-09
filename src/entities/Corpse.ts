/**
 * Corpse - Lootable corpse left by defeated enemies
 */

export interface CorpseLoot {
  gold: number;
  ingredients: string[];
}

export class Corpse {
  public x: number;
  public y: number;
  public size: number = 30;
  public loot: CorpseLoot;
  public enemyName: string;
  public enemyId: string;
  public looted: boolean = false;
  public lifetime: number = 0; // How long corpse has existed
  public maxLifetime: number = 60; // Corpses disappear after 60 seconds

  constructor(
    x: number,
    y: number,
    enemyName: string,
    enemyId: string,
    loot: CorpseLoot
  ) {
    this.x = x;
    this.y = y;
    this.enemyName = enemyName;
    this.enemyId = enemyId;
    this.loot = loot;
  }

  update(deltaTime: number): void {
    this.lifetime += deltaTime;
  }

  isExpired(): boolean {
    return this.lifetime >= this.maxLifetime;
  }

  canLoot(): boolean {
    return !this.looted && !this.isExpired();
  }

  // Check if player is close enough to loot
  isPlayerNear(playerX: number, playerY: number, interactDistance: number = 50): boolean {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= interactDistance;
  }

  lootCorpse(): CorpseLoot | null {
    if (!this.canLoot()) return null;

    this.looted = true;
    return this.loot;
  }
}
