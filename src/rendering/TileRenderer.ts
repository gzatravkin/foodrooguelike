/**
 * TileRenderer - Handles tile rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TileType } from '../systems/MapSystem';

export class TileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  public renderTile(tileType: TileType, worldX: number, worldY: number, size: number, x: number, y: number): void {
    if (tileType === TileType.GRASS) {
      this.renderGrass(worldX, worldY, size, x, y);
    } else if (tileType === TileType.WATER) {
      this.renderWater(worldX, worldY, size, x, y);
    } else if (tileType === TileType.LAVA) {
      this.renderLava(worldX, worldY, size, x, y);
    } else if (tileType === TileType.ICE) {
      this.renderIce(worldX, worldY, size, x, y);
    } else if (tileType === TileType.HEALTH_FOUNTAIN) {
      this.renderHealthFountain(worldX, worldY, size);
    } else if (tileType === TileType.TREASURE_CHEST) {
      this.renderTreasureChest(worldX, worldY, size);
    } else if (tileType === TileType.TELEPORTER) {
      this.renderTeleporter(worldX, worldY, size);
    } else if (tileType === TileType.SHRINE) {
      this.renderShrine(worldX, worldY, size);
    } else if (tileType === TileType.SPIKE_TRAP) {
      this.renderSpikeTrap(worldX, worldY, size);
    } else if (tileType === TileType.POISON_TRAP) {
      this.renderPoisonTrap(worldX, worldY, size);
    } else if (tileType === TileType.FLOOR) {
      // More varied floor colors based on position
      const seed = x * 7 + y * 13;
      const baseShade = 26 + (seed % 3) * 2; // Varies between #1a1a1a and #1e1e1e
      const floorColor = `rgb(${baseShade}, ${baseShade}, ${baseShade})`;
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

    } else if (tileType === TileType.WALL) {
      this.renderWall(worldX, worldY, size, x, y);
    } else if (tileType === TileType.DOOR) {
      this.renderDoor(worldX, worldY, size);
    } else if (tileType === TileType.COOKING_STATION) {
      this.renderCookingStation(worldX, worldY, size);
    } else if (tileType === TileType.SHOP) {
      this.renderShopTile(worldX, worldY, size);
    } else if (tileType === TileType.EXPEDITION_PORTAL) {
      this.renderExpeditionPortal(worldX, worldY, size);
    } else if (tileType === TileType.STAIRS_DOWN) {
      this.renderStairsDown(worldX, worldY, size);
    } else if (tileType === TileType.STAIRS_UP) {
      this.renderStairsUp(worldX, worldY, size);
    }
  }

  private renderWall(worldX: number, worldY: number, size: number, x: number, y: number): void {
    // Varied wall base colors for more interesting look
    const seed = x * 11 + y * 17;
    const baseShade = 58 + (seed % 5) * 2;
    const wallColor = `rgb(${baseShade}, ${baseShade}, ${baseShade})`;
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

  private renderDoor(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#654321');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.1, size * 0.6, size * 0.8, '#8b6f47');
    this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.5, 2, '#FFD700');
  }

  private renderCookingStation(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#ff6b35');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.2, '#ff9f5e');
  }

  private renderShopTile(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#4ecdc4');
    this.renderer.drawText('$', worldX + size / 2, worldY + size / 2 + 5, '#FFD700', 16, 'center');
  }

  private renderExpeditionPortal(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#9b59b6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bb79d6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#e0aaff');
  }

  private renderStairsDown(worldX: number, worldY: number, size: number): void {
    // Render as a return portal (similar to expedition portal but different colors)
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#3498db');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#5dade2');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#aed6f1');
  }

  private renderStairsUp(worldX: number, worldY: number, size: number): void {
    // Render as entrance stairs
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#ecf0f1');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bdc3c7');
  }

  private renderGrass(worldX: number, worldY: number, size: number, x: number, y: number): void {
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

  private renderWater(worldX: number, worldY: number, size: number, x: number, y: number): void {
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

  private renderLava(worldX: number, worldY: number, size: number, x: number, y: number): void {
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

  private renderIce(worldX: number, worldY: number, size: number, x: number, y: number): void {
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

  private renderHealthFountain(worldX: number, worldY: number, size: number): void {
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

  private renderTreasureChest(worldX: number, worldY: number, size: number): void {
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

  private renderTeleporter(worldX: number, worldY: number, size: number): void {
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

  private renderShrine(worldX: number, worldY: number, size: number): void {
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

  private renderSpikeTrap(worldX: number, worldY: number, size: number): void {
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

  private renderPoisonTrap(worldX: number, worldY: number, size: number): void {
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
