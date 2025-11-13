/**
 * StructureTileRenderer - Handles rendering of structure tiles
 * (floor, wall, door, cooking station, shop, expedition portal, stairs)
 */

import { CanvasRenderer } from './CanvasRenderer';
import { TileManager } from '../systems/TileManager';
import { TileType } from '../systems/TileTypes';

export class StructureTileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderFloor(worldX: number, worldY: number, size: number, x: number, y: number): void {
    // Get theme-based floor color
    const baseColor = TileManager.getTileColor(TileType.FLOOR);

    // Add subtle variation based on position
    const seed = x * 7 + y * 13;
    const variation = (seed % 3) * 2 - 2; // Varies between -2 and +2
    const floorColor = this.adjustBrightness(baseColor, variation);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);

    // Add varied decorative elements with more randomization
    const hash1 = (x * 127 + y * 311) % 100;
    const hash2 = (x * 197 + y * 419) % 100;
    const hash3 = (x * 263 + y * 509) % 100;

    // Stone cracks and weathering
    if (hash1 < 15) {
      const crackX = worldX + (hash2 / 100) * size;
      const crackY = worldY + (hash3 / 100) * size;
      this.renderer.drawLine(crackX, crackY, crackX + size * 0.3, crackY + size * 0.2, 'rgba(0, 0, 0, 0.2)', 0.5);
    }

    // Small pebbles and debris
    if (hash2 < 20) {
      const pebbleX = worldX + ((hash1 * 13) % 100 / 100) * size;
      const pebbleY = worldY + ((hash3 * 17) % 100 / 100) * size;
      const pebbleSize = 0.5 + (hash1 % 3) * 0.3;
      this.renderer.drawCircle(pebbleX, pebbleY, pebbleSize, 'rgba(60, 60, 60, 0.3)');
    }

    // Darker spots (wear marks)
    if (hash3 < 12) {
      const spotX = worldX + ((hash2 * 19) % 100 / 100) * size;
      const spotY = worldY + ((hash1 * 23) % 100 / 100) * size;
      this.renderer.drawCircle(spotX, spotY, 2 + (hash3 % 3), 'rgba(0, 0, 0, 0.15)');
    }

    // Lighter highlights
    if (hash1 % 8 === 0) {
      const highlightX = worldX + ((hash3 * 29) % 100 / 100) * size;
      const highlightY = worldY + ((hash2 * 31) % 100 / 100) * size;
      this.renderer.drawCircle(highlightX, highlightY, 1, 'rgba(255, 255, 255, 0.08)');
    }

    // Subtle grid pattern with variation
    const gridOpacity = 0.15 + (seed % 3) * 0.05;
    this.renderer.drawLine(worldX, worldY, worldX + size, worldY, `rgba(10, 10, 10, ${gridOpacity})`, 1);
    this.renderer.drawLine(worldX, worldY, worldX, worldY + size, `rgba(10, 10, 10, ${gridOpacity})`, 1);
  }

  renderWall(worldX: number, worldY: number, size: number, x: number, y: number): void {
    // Get theme-based wall color
    const baseColor = TileManager.getTileColor(TileType.WALL);

    // Add subtle variation based on position
    const seed = x * 11 + y * 17;
    const variation = (seed % 5) * 2 - 4; // Varies between -4 and +6
    const wallColor = this.adjustBrightness(baseColor, variation);
    this.renderer.drawRect(worldX, worldY, size, size, wallColor);

    // Enhanced lighting - top highlight and bottom shadow
    this.renderer.drawRect(worldX, worldY, size, size * 0.2, 'rgba(90, 90, 90, 0.7)');
    this.renderer.drawRect(worldX, worldY + size * 0.8, size, size * 0.2, 'rgba(20, 20, 20, 0.9)');

    // Brick pattern with offset
    const brickWidth = size / 2;
    const brickHeight = size / 3;
    const offsetX = y % 2 === 0 ? 0 : brickWidth / 2;

    for (let by = 0; by < 3; by++) {
      for (let bx = 0; bx < 2; bx++) {
        const brickX = worldX + bx * brickWidth + offsetX;
        const brickY = worldY + by * brickHeight;

        if (brickX >= worldX && brickX + brickWidth <= worldX + size) {
          // Mortar lines
          this.renderer.drawLine(brickX, brickY, brickX + brickWidth, brickY, '#2a2a2a', 1);
          this.renderer.drawLine(brickX, brickY, brickX, brickY + brickHeight, '#2a2a2a', 1);

          // Random brick damage/cracks
          const brickHash = (brickX * 13 + brickY * 19) % 100;
          if (brickHash < 8) {
            const crackStartX = brickX + brickWidth * 0.3;
            const crackStartY = brickY + brickHeight * 0.2;
            this.renderer.drawLine(crackStartX, crackStartY, crackStartX + brickWidth * 0.4, crackStartY + brickHeight * 0.6, 'rgba(0, 0, 0, 0.4)', 0.8);
          }

          // Brick texture variation
          if (brickHash % 7 === 0) {
            this.renderer.drawCircle(brickX + brickWidth * 0.5, brickY + brickHeight * 0.5, 1, 'rgba(0, 0, 0, 0.15)');
          }
        }
      }
    }

    // Stronger edge shadows for depth
    this.renderer.drawLine(worldX + size, worldY, worldX + size, worldY + size, '#1a1a1a', 2.5);
    this.renderer.drawLine(worldX, worldY + size, worldX + size, worldY + size, '#1a1a1a', 2.5);

    // Moss or weathering on some walls
    const wallHash = (x * 23 + y * 29) % 100;
    if (wallHash < 10) {
      const mossX = worldX + size * 0.7;
      const mossY = worldY + size * 0.6;
      this.renderer.drawCircle(mossX, mossY, 3, 'rgba(76, 175, 80, 0.15)');
    }
  }

  renderDoor(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#654321');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.1, size * 0.6, size * 0.8, '#8b6f47');
    this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.5, 2, '#FFD700');
  }

  renderCookingStation(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#ff6b35');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.2, '#ff9f5e');
  }

  renderShopTile(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#4ecdc4');
    this.renderer.drawText('$', worldX + size / 2, worldY + size / 2 + 5, '#FFD700', 16, 'center');
  }

  renderExpeditionPortal(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#9b59b6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bb79d6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#e0aaff');
  }

  renderStairsDown(worldX: number, worldY: number, size: number): void {
    // Render as a return portal (similar to expedition portal but different colors)
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#3498db');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#5dade2');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#aed6f1');
  }

  renderStairsUp(worldX: number, worldY: number, size: number): void {
    // Render as entrance stairs
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#ecf0f1');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bdc3c7');
  }

  renderTrainingHall(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#FFD700');
    this.renderer.drawText('⚔', worldX + size / 2, worldY + size / 2 + 5, '#000', 16, 'center');
  }

  renderUpgradesHall(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#b19cd9');
    this.renderer.drawText('⬆', worldX + size / 2, worldY + size / 2 + 5, '#FFF', 16, 'center');
  }

  renderDiningRoom(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#ff9999');
    this.renderer.drawText('🍽', worldX + size / 2, worldY + size / 2 + 5, '#FFF', 16, 'center');
  }

  // Helper method to adjust brightness of a hex color
  private adjustBrightness(hexColor: string, adjustment: number): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + adjustment));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + adjustment));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + adjustment));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
