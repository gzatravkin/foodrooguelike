/**
 * TrapTileRenderer - Handles rendering of trap tiles
 * (spike trap, poison trap)
 */

import { CanvasRenderer } from './CanvasRenderer';

export class TrapTileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderSpikeTrap(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#2a2a2a');

    // Draw spikes
    for (let i = 0; i < 5; i++) {
      const spikeX = worldX + size * 0.15 + i * size * 0.18;
      const baseY = worldY + size * 0.7;
      const tipY = worldY + size * 0.3;

      // Spike triangle
      this.renderer.drawLine(spikeX, baseY, spikeX + size * 0.08, tipY, '#8b0000', 2);
      this.renderer.drawLine(spikeX + size * 0.16, baseY, spikeX + size * 0.08, tipY, '#8b0000', 2);
      this.renderer.drawLine(spikeX, baseY, spikeX + size * 0.16, baseY, '#8b0000', 2);
    }
  }

  renderPoisonTrap(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#2a2a2a');

    // Poison pool
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.35, 'rgba(50, 205, 50, 0.5)');

    // Poison bubbles
    const time = Date.now() / 1000;
    for (let i = 0; i < 4; i++) {
      const angle = time + i * Math.PI / 2;
      const bubbleX = worldX + size / 2 + Math.cos(angle) * size * 0.2;
      const bubbleY = worldY + size / 2 + Math.sin(angle) * size * 0.2;
      const bubbleSize = 2 + Math.sin(time * 3 + i) * 1;
      this.renderer.drawCircle(bubbleX, bubbleY, bubbleSize, 'rgba(144, 238, 144, 0.7)');
    }
  }
}
