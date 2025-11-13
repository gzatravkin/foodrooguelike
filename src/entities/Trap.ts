/**
 * Trap - A barely visible hazard that damages players or activates when dashed through
 */

export class Trap {
  public x: number;
  public y: number;
  public size: number = 24;
  public active: boolean = false; // True when activated
  public destroyed: boolean = false; // True when trap has been used and should be removed
  public activationTimer: number = 0; // Timer for activation animation
  public damage: number = 15;
  public triggerRadius: number = 20; // Distance to trigger trap
  public activationDelay: number = 0.5; // Time trap stays visible after activation

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number): void {
    if (this.activationTimer > 0) {
      this.activationTimer -= deltaTime;
      if (this.activationTimer <= 0) {
        // Mark trap as destroyed instead of resetting
        this.destroyed = true;
      }
    }
  }

  activate(): void {
    this.active = true;
    this.activationTimer = this.activationDelay;
  }

  isPlayerNear(playerX: number, playerY: number): boolean {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.triggerRadius;
  }

  canDamage(): boolean {
    return !this.active && !this.destroyed && this.activationTimer <= 0;
  }
}
