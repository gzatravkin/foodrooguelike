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

    const ctx = this.renderer.getContext();
    const camera = this.renderer.getCamera();
    const screenX = worldX - camera.x;
    const screenY = worldY - camera.y;
    const time = Date.now() / 1000;

    // Stove base (stone/brick)
    ctx.fillStyle = '#696969';
    ctx.fillRect(screenX + size * 0.2, screenY + size * 0.5, size * 0.6, size * 0.4);

    // Stove top (metal)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(screenX + size * 0.15, screenY + size * 0.45, size * 0.7, size * 0.1);

    // Cooking pot (centered)
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.ellipse(screenX + size / 2, screenY + size * 0.35, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pot rim (lighter metal)
    ctx.strokeStyle = '#5a5a5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(screenX + size / 2, screenY + size * 0.35, size * 0.2, size * 0.15, 0, 0, Math.PI);
    ctx.stroke();

    // Handles on pot
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.arc(screenX + size * 0.28, screenY + size * 0.35, size * 0.08, Math.PI * 0.7, Math.PI * 1.3);
    ctx.arc(screenX + size * 0.72, screenY + size * 0.35, size * 0.08, Math.PI * 1.7, Math.PI * 0.3);
    ctx.stroke();

    // Fire/heat (animated flames)
    const flame1 = Math.sin(time * 6) * 0.05 + 0.15;
    const flame2 = Math.sin(time * 5 + 1) * 0.05 + 0.15;
    const flame3 = Math.sin(time * 7 + 2) * 0.05 + 0.15;

    // Flame shapes
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.35, screenY + size * 0.55);
    ctx.quadraticCurveTo(screenX + size * 0.33, screenY + size * (0.55 - flame1), screenX + size * 0.35, screenY + size * (0.55 - flame1 * 1.5));
    ctx.quadraticCurveTo(screenX + size * 0.37, screenY + size * (0.55 - flame1), screenX + size * 0.35, screenY + size * 0.55);
    ctx.fill();

    ctx.fillStyle = '#ff9f5e';
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.5, screenY + size * 0.55);
    ctx.quadraticCurveTo(screenX + size * 0.48, screenY + size * (0.55 - flame2), screenX + size * 0.5, screenY + size * (0.55 - flame2 * 1.5));
    ctx.quadraticCurveTo(screenX + size * 0.52, screenY + size * (0.55 - flame2), screenX + size * 0.5, screenY + size * 0.55);
    ctx.fill();

    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.65, screenY + size * 0.55);
    ctx.quadraticCurveTo(screenX + size * 0.63, screenY + size * (0.55 - flame3), screenX + size * 0.65, screenY + size * (0.55 - flame3 * 1.5));
    ctx.quadraticCurveTo(screenX + size * 0.67, screenY + size * (0.55 - flame3), screenX + size * 0.65, screenY + size * 0.55);
    ctx.fill();

    // Steam from pot
    ctx.strokeStyle = `rgba(200, 200, 200, ${0.3 + Math.sin(time * 3) * 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.45, screenY + size * 0.28);
    ctx.quadraticCurveTo(screenX + size * 0.42, screenY + size * 0.2, screenX + size * 0.4, screenY + size * 0.15);
    ctx.moveTo(screenX + size * 0.55, screenY + size * 0.28);
    ctx.quadraticCurveTo(screenX + size * 0.58, screenY + size * 0.2, screenX + size * 0.6, screenY + size * 0.15);
    ctx.stroke();
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

    const ctx = this.renderer.getContext();
    const camera = this.renderer.getCamera();
    const screenX = worldX - camera.x;
    const screenY = worldY - camera.y;
    const time = Date.now() / 1000;

    // Stone archway (portal frame)
    ctx.fillStyle = '#5a5a5a';
    // Left pillar
    ctx.fillRect(screenX + size * 0.15, screenY + size * 0.3, size * 0.12, size * 0.6);
    // Right pillar
    ctx.fillRect(screenX + size * 0.73, screenY + size * 0.3, size * 0.12, size * 0.6);
    // Top arch
    ctx.beginPath();
    ctx.arc(screenX + size / 2, screenY + size * 0.5, size * 0.35, Math.PI, Math.PI * 2);
    ctx.lineWidth = size * 0.12;
    ctx.strokeStyle = '#5a5a5a';
    ctx.stroke();

    // Ancient runes on pillars
    ctx.fillStyle = '#9b59b6';
    ctx.font = `${size * 0.15}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡', screenX + size * 0.21, screenY + size * 0.5);
    ctx.fillText('⚡', screenX + size * 0.79, screenY + size * 0.7);

    // Portal energy (swirling vortex)
    const gradient = ctx.createRadialGradient(
      screenX + size / 2, screenY + size * 0.55, 0,
      screenX + size / 2, screenY + size * 0.55, size * 0.3
    );
    gradient.addColorStop(0, '#e0aaff');
    gradient.addColorStop(0.4, '#bb79d6');
    gradient.addColorStop(0.8, '#9b59b6');
    gradient.addColorStop(1, 'rgba(155, 89, 182, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX + size / 2, screenY + size * 0.55, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Spiraling energy particles
    for (let i = 0; i < 6; i++) {
      const angle = time * 2 + (i * Math.PI * 2) / 6;
      const radius = (Math.sin(time * 3 + i) * 0.5 + 0.5) * size * 0.25;
      const px = screenX + size / 2 + Math.cos(angle) * radius;
      const py = screenY + size * 0.55 + Math.sin(angle) * radius;

      ctx.fillStyle = `rgba(224, 170, 255, ${0.6 + Math.sin(time * 4 + i) * 0.4})`;
      ctx.fillRect(px - size * 0.03, py - size * 0.03, size * 0.06, size * 0.06);
    }

    // Dimensional distortion effect (wavy lines)
    ctx.strokeStyle = 'rgba(155, 89, 182, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yOffset = screenY + size * (0.4 + i * 0.15);
      for (let x = 0; x < size * 0.6; x += 2) {
        const wave = Math.sin(x * 0.3 + time * 4) * size * 0.02;
        const px = screenX + size * 0.2 + x;
        const py = yOffset + wave;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
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

    const ctx = this.renderer.getContext();
    const camera = this.renderer.getCamera();
    const screenX = worldX - camera.x;
    const screenY = worldY - camera.y;

    // Dining table (wooden)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(screenX + size * 0.15, screenY + size * 0.4, size * 0.7, size * 0.35);

    // Table legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(screenX + size * 0.18, screenY + size * 0.7, size * 0.08, size * 0.15);
    ctx.fillRect(screenX + size * 0.74, screenY + size * 0.7, size * 0.08, size * 0.15);

    // Plate (ceramic)
    ctx.fillStyle = '#f5f5dc';
    ctx.beginPath();
    ctx.ellipse(screenX + size * 0.35, screenY + size * 0.5, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Plate rim
    ctx.strokeStyle = '#d3d3d3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(screenX + size * 0.35, screenY + size * 0.5, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Fork (left side of plate)
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.22, screenY + size * 0.5);
    ctx.lineTo(screenX + size * 0.22, screenY + size * 0.62);
    ctx.stroke();

    // Fork prongs
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(screenX + size * (0.2 + i * 0.02), screenY + size * 0.5);
      ctx.lineTo(screenX + size * (0.2 + i * 0.02), screenY + size * 0.46);
      ctx.stroke();
    }

    // Knife (right side of plate)
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.48, screenY + size * 0.5);
    ctx.lineTo(screenX + size * 0.48, screenY + size * 0.62);
    ctx.stroke();

    // Knife blade
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.48, screenY + size * 0.46);
    ctx.lineTo(screenX + size * 0.485, screenY + size * 0.5);
    ctx.lineTo(screenX + size * 0.475, screenY + size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Wine glass
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.65, screenY + size * 0.45);
    ctx.lineTo(screenX + size * 0.65, screenY + size * 0.52);
    ctx.lineTo(screenX + size * 0.62, screenY + size * 0.56);
    ctx.lineTo(screenX + size * 0.68, screenY + size * 0.56);
    ctx.stroke();

    // Wine glass bowl
    ctx.beginPath();
    ctx.arc(screenX + size * 0.65, screenY + size * 0.4, size * 0.05, 0, Math.PI * 2);
    ctx.stroke();

    // Candle (centerpiece)
    ctx.fillStyle = '#FFE5B4';
    ctx.fillRect(screenX + size * 0.73, screenY + size * 0.48, size * 0.04, size * 0.12);

    // Candle flame
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.75, screenY + size * 0.48);
    ctx.lineTo(screenX + size * 0.73, screenY + size * 0.44);
    ctx.lineTo(screenX + size * 0.77, screenY + size * 0.44);
    ctx.closePath();
    ctx.fill();

    // Flame glow
    ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(screenX + size * 0.75, screenY + size * 0.44, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
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
