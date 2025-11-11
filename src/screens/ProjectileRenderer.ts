/**
 * ProjectileRenderer - Handles rendering of projectiles with different visual effects
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { Projectile } from '../entities/Projectile';

export class ProjectileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  renderProjectiles(projectiles: Projectile[]): void {
    for (const proj of projectiles) {
      const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
      const normalizedVx = proj.vx / speed;
      const normalizedVy = proj.vy / speed;

      // Render based on shape
      switch (proj.shape) {
        case 'beam':
          this.renderBeamProjectile(proj, normalizedVx, normalizedVy);
          break;

        case 'bolt':
          this.renderBoltProjectile(proj, normalizedVx, normalizedVy);
          break;

        case 'fire':
          this.renderFireProjectile(proj, normalizedVx, normalizedVy);
          break;

        case 'circle':
        default:
          this.renderCircleProjectile(proj, normalizedVx, normalizedVy);
          break;
      }
    }
  }

  private renderBeamProjectile(proj: Projectile, normalizedVx: number, normalizedVy: number): void {
    // Energy beam - elongated with trail
    const beamLength = proj.size * 4;
    const beamEndX = proj.x - normalizedVx * beamLength;
    const beamEndY = proj.y - normalizedVy * beamLength;

    // Outer glow
    this.renderer.drawLine(beamEndX, beamEndY, proj.x, proj.y, this.hexToRgba(proj.color, 0.3), proj.size * 2);
    // Inner beam
    this.renderer.drawLine(beamEndX, beamEndY, proj.x, proj.y, proj.color, proj.size);
    // Bright core
    this.renderer.drawCircle(proj.x, proj.y, proj.size * 0.6, '#FFFFFF');
  }

  private renderBoltProjectile(proj: Projectile, normalizedVx: number, normalizedVy: number): void {
    // Magic bolt - arrow-like with glow
    const boltLength = proj.size * 3;
    const boltEndX = proj.x - normalizedVx * boltLength;
    const boltEndY = proj.y - normalizedVy * boltLength;

    // Glow aura
    this.renderer.drawCircle(proj.x, proj.y, proj.size * 2, this.hexToRgba(proj.color, 0.3));
    // Bolt shaft
    this.renderer.drawLine(boltEndX, boltEndY, proj.x, proj.y, proj.color, proj.size * 0.8);
    // Bolt head
    this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);
    // Bright tip
    this.renderer.drawCircle(proj.x, proj.y, proj.size * 0.4, this.hexToRgba('#FFFFFF', 0.8));
  }

  private renderFireProjectile(proj: Projectile, normalizedVx: number, normalizedVy: number): void {
    // Fire projectile - irregular with embers
    const fireSize = proj.size * (0.8 + Math.random() * 0.4);

    // Outer fire glow
    this.renderer.drawCircle(proj.x, proj.y, fireSize * 1.8, this.hexToRgba('#FF9800', 0.4));
    // Main fire
    this.renderer.drawCircle(proj.x, proj.y, fireSize, proj.color);
    // Hot core
    this.renderer.drawCircle(proj.x, proj.y, fireSize * 0.5, '#FFEB3B');

    // Ember trail
    for (let i = 1; i <= 3; i++) {
      const emberX = proj.x - normalizedVx * i * 8 + (Math.random() - 0.5) * 4;
      const emberY = proj.y - normalizedVy * i * 8 + (Math.random() - 0.5) * 4;
      const emberSize = proj.size * 0.3 * (1 - i * 0.2);
      this.renderer.drawCircle(emberX, emberY, emberSize, this.hexToRgba('#FF5722', 0.6 - i * 0.15));
    }
  }

  private renderCircleProjectile(proj: Projectile, normalizedVx: number, normalizedVy: number): void {
    // Standard circular projectile with glow
    const glowSize = proj.size * 3;
    const trailColor = proj.trailColor || proj.color;

    // Outer glow
    this.renderer.drawCircle(proj.x, proj.y, glowSize, this.hexToRgba(trailColor, 0.3));
    // Main projectile
    this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);

    // Motion trail
    const trailLength = 15;
    const trailX = proj.x - normalizedVx * trailLength;
    const trailY = proj.y - normalizedVy * trailLength;
    this.renderer.drawLine(trailX, trailY, proj.x, proj.y, this.hexToRgba(trailColor, 0.5), proj.size * 0.6);
  }
}
