/**
 * TerrainTileRenderer - Handles rendering of terrain tiles (grass, water, lava, ice)
 */

import { CanvasRenderer } from './CanvasRenderer';

export class TerrainTileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderGrass(worldX: number, worldY: number, size: number, x: number, y: number): void {
    const seed = x * 7 + y * 13;
    const baseShade = 34 + (seed % 3) * 8;
    const grassColor = `rgb(${baseShade - 10}, ${baseShade + 139}, ${baseShade - 10})`;
    this.renderer.drawRect(worldX, worldY, size, size, grassColor);

    // Add grass blades
    const hash1 = (x * 127 + y * 311) % 100;
    const hash2 = (x * 197 + y * 419) % 100;

    for (let i = 0; i < 8; i++) {
      const bladeX = worldX + ((hash1 * (i + 1) * 17) % 100 / 100) * size;
      const bladeY = worldY + ((hash2 * (i + 1) * 23) % 100 / 100) * size;
      this.renderer.drawLine(bladeX, bladeY, bladeX, bladeY - 3, 'rgba(46, 125, 50, 0.4)', 1);
    }
  }

  renderWater(worldX: number, worldY: number, size: number, x: number, y: number): void {
    const seed = x * 7 + y * 13;
    const time = Date.now() / 1000;
    const wave = Math.sin(time + seed) * 0.1 + 0.9;
    const waterColor = `rgb(${Math.floor(30 * wave)}, ${Math.floor(144 * wave)}, ${Math.floor(255 * wave)})`;
    this.renderer.drawRect(worldX, worldY, size, size, waterColor);

    // Add wave lines
    const waveY1 = worldY + size * 0.3 + Math.sin(time + x * 0.5) * 2;
    const waveY2 = worldY + size * 0.6 + Math.sin(time + x * 0.5 + 1) * 2;
    this.renderer.drawLine(worldX, waveY1, worldX + size, waveY1, 'rgba(100, 180, 255, 0.3)', 1);
    this.renderer.drawLine(worldX, waveY2, worldX + size, waveY2, 'rgba(100, 180, 255, 0.3)', 1);
  }

  renderLava(worldX: number, worldY: number, size: number, x: number, y: number): void {
    const seed = x * 7 + y * 13;
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 2 + seed) * 0.2 + 0.8;
    const lavaColor = `rgb(${Math.floor(255 * pulse)}, ${Math.floor(69 * pulse)}, 0)`;
    this.renderer.drawRect(worldX, worldY, size, size, lavaColor);

    // Add bubbles
    const hash = (x * 127 + y * 311 + Math.floor(time * 10)) % 100;
    if (hash < 15) {
      const bubbleX = worldX + (hash / 100) * size;
      const bubbleY = worldY + size * 0.5;
      this.renderer.drawCircle(bubbleX, bubbleY, 2, 'rgba(255, 140, 0, 0.6)');
    }

    // Darker crust patches
    const hash2 = (x * 197 + y * 419) % 100;
    if (hash2 < 25) {
      const crustX = worldX + (hash2 / 100) * size;
      const crustY = worldY + ((hash2 * 7) % 100 / 100) * size;
      this.renderer.drawCircle(crustX, crustY, 3, 'rgba(139, 0, 0, 0.7)');
    }
  }

  renderIce(worldX: number, worldY: number, size: number, x: number, y: number): void {
    const seed = x * 7 + y * 13;
    const iceColor = `rgb(135, ${206 + (seed % 3) * 5}, ${235 + (seed % 2) * 10})`;
    this.renderer.drawRect(worldX, worldY, size, size, iceColor);

    // Add frost patterns
    const hash1 = (x * 127 + y * 311) % 100;
    const hash2 = (x * 197 + y * 419) % 100;

    // Diagonal frost lines
    if (hash1 < 40) {
      const x1 = worldX + (hash1 / 100) * size;
      const y1 = worldY + (hash2 / 100) * size;
      this.renderer.drawLine(x1, y1, x1 + size * 0.3, y1 + size * 0.3, 'rgba(255, 255, 255, 0.4)', 1);
    }

    // Ice crystals
    if (hash2 < 30) {
      const crystalX = worldX + ((hash1 * 13) % 100 / 100) * size;
      const crystalY = worldY + ((hash2 * 17) % 100 / 100) * size;
      this.renderer.drawCircle(crystalX, crystalY, 1.5, 'rgba(255, 255, 255, 0.6)');
    }
  }
}
