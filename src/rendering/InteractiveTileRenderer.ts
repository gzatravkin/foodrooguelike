/**
 * InteractiveTileRenderer - Handles rendering of interactive tiles
 * (health fountain, treasure chest, teleporter, shrine)
 */

import { CanvasRenderer } from './CanvasRenderer';

export class InteractiveTileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderHealthFountain(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Base
    this.renderer.drawRect(worldX + size * 0.25, worldY + size * 0.6, size * 0.5, size * 0.3, '#8b7355');

    // Water
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 3) * 0.1 + 0.9;
    this.renderer.drawCircle(worldX + size / 2, worldY + size * 0.5, size * 0.25 * pulse, `rgba(255, 105, 180, ${pulse})`);

    // Sparkles
    for (let i = 0; i < 3; i++) {
      const angle = (time + i * Math.PI * 2 / 3) * 2;
      const sparkleX = worldX + size / 2 + Math.cos(angle) * size * 0.3;
      const sparkleY = worldY + size * 0.4 + Math.sin(angle) * size * 0.3;
      this.renderer.drawCircle(sparkleX, sparkleY, 2, 'rgba(255, 255, 255, 0.8)');
    }
  }

  renderTreasureChest(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Chest body
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.4, size * 0.6, size * 0.4, '#8b6914');

    // Chest lid
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.25, size * 0.6, size * 0.2, '#daa520');

    // Lock
    this.renderer.drawCircle(worldX + size / 2, worldY + size * 0.5, size * 0.08, '#ffd700');

    // Shine
    this.renderer.drawCircle(worldX + size * 0.3, worldY + size * 0.3, 2, 'rgba(255, 255, 255, 0.8)');
  }

  renderTeleporter(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    const time = Date.now() / 1000;

    // Spinning outer ring
    for (let i = 0; i < 8; i++) {
      const angle = (time * 2 + i * Math.PI / 4);
      const x = worldX + size / 2 + Math.cos(angle) * size * 0.35;
      const y = worldY + size / 2 + Math.sin(angle) * size * 0.35;
      this.renderer.drawCircle(x, y, 3, 'rgba(139, 0, 255, 0.6)');
    }

    // Pulsing center
    const pulse = Math.sin(time * 4) * 0.15 + 0.85;
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.2 * pulse, `rgba(139, 0, 255, ${pulse})`);
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1 * pulse, `rgba(200, 100, 255, ${pulse})`);
  }

  renderShrine(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Pedestal
    this.renderer.drawRect(worldX + size * 0.3, worldY + size * 0.6, size * 0.4, size * 0.3, '#696969');

    // Shrine top (pyramid)
    const centerX = worldX + size / 2;
    const topY = worldY + size * 0.2;
    const bottomY = worldY + size * 0.6;
    const leftX = worldX + size * 0.3;
    const rightX = worldX + size * 0.7;

    // Draw triangle for pyramid
    this.renderer.drawLine(leftX, bottomY, centerX, topY, '#daa520', 2);
    this.renderer.drawLine(rightX, bottomY, centerX, topY, '#daa520', 2);
    this.renderer.drawLine(leftX, bottomY, rightX, bottomY, '#daa520', 2);

    // Glow effect
    const time = Date.now() / 1000;
    const glow = Math.sin(time * 2) * 0.3 + 0.7;
    this.renderer.drawCircle(centerX, topY, 4, `rgba(218, 165, 32, ${glow})`);
  }
}
