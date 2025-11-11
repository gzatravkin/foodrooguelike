/**
 * InteractiveTileRenderer - Handles rendering of interactive tiles
 * (health fountain, treasure chest, teleporter, shrine)
 */

import { CanvasRenderer } from './CanvasRenderer';
import { TileManager } from '../systems/TileManager';
import { TileType } from '../systems/TileTypes';

export class InteractiveTileRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderHealthFountain(worldX: number, worldY: number, size: number): void {
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);

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
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);

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
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);

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
    const floorColor = TileManager.getTileColor(TileType.FLOOR);
    this.renderer.drawRect(worldX, worldY, size, size, floorColor);

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

  renderBerryBush(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Bush base (dark green)
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.6, size * 0.35, '#2d5016');

    // Bush highlights (lighter green)
    this.renderer.drawCircle(worldX + size * 0.35, worldY + size * 0.5, size * 0.2, '#4a7c2e');
    this.renderer.drawCircle(worldX + size * 0.65, worldY + size * 0.55, size * 0.18, '#4a7c2e');

    // Berries (red dots)
    this.renderer.drawCircle(worldX + size * 0.4, worldY + size * 0.5, size * 0.08, '#dc143c');
    this.renderer.drawCircle(worldX + size * 0.6, worldY + size * 0.55, size * 0.08, '#dc143c');
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.65, size * 0.08, '#dc143c');
  }

  renderHerbPlant(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Soil/ground
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.7, size * 0.6, size * 0.2, '#3d2817');

    // Herb stems (green lines)
    this.renderer.drawLine(worldX + size * 0.35, worldY + size * 0.7, worldX + size * 0.32, worldY + size * 0.4, '#32cd32', size * 0.05);
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.7, worldX + size * 0.5, worldY + size * 0.35, '#32cd32', size * 0.05);
    this.renderer.drawLine(worldX + size * 0.65, worldY + size * 0.7, worldX + size * 0.68, worldY + size * 0.45, '#32cd32', size * 0.05);

    // Leaves (darker green circles)
    this.renderer.drawCircle(worldX + size * 0.32, worldY + size * 0.4, size * 0.1, '#2e8b57');
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.35, size * 0.12, '#2e8b57');
    this.renderer.drawCircle(worldX + size * 0.68, worldY + size * 0.45, size * 0.1, '#2e8b57');
  }

  renderMushroomPatch(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Dark ground
    this.renderer.drawRect(worldX + size * 0.1, worldY + size * 0.6, size * 0.8, size * 0.3, '#2d2416');

    // Left mushroom (small) - stem and cap
    this.renderer.drawRect(worldX + size * 0.28, worldY + size * 0.5, size * 0.04, size * 0.1, '#d4a574');
    this.renderer.drawCircle(worldX + size * 0.3, worldY + size * 0.5, size * 0.1, '#cd853f');

    // Middle mushroom (large) - stem and cap
    this.renderer.drawRect(worldX + size * 0.48, worldY + size * 0.45, size * 0.04, size * 0.2, '#d4a574');
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.45, size * 0.15, '#8b4513');

    // Spots on large mushroom cap
    this.renderer.drawCircle(worldX + size * 0.45, worldY + size * 0.4, size * 0.03, '#d2b48c');
    this.renderer.drawCircle(worldX + size * 0.55, worldY + size * 0.38, size * 0.03, '#d2b48c');

    // Right mushroom (medium) - stem and cap
    this.renderer.drawRect(worldX + size * 0.68, worldY + size * 0.48, size * 0.04, size * 0.15, '#d4a574');
    this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.48, size * 0.12, '#a0522d');
  }

  renderCrystalFormation(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Base rock
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.65, size * 0.6, size * 0.25, '#696969');

    // Crystal shards (light blue) - using triangular shapes
    // Left crystal
    this.renderer.drawLine(worldX + size * 0.3, worldY + size * 0.65, worldX + size * 0.28, worldY + size * 0.4, '#87ceeb', size * 0.08);

    // Middle crystal (tallest)
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.65, worldX + size * 0.5, worldY + size * 0.3, '#87ceeb', size * 0.08);

    // Right crystal
    this.renderer.drawLine(worldX + size * 0.7, worldY + size * 0.65, worldX + size * 0.68, worldY + size * 0.45, '#87ceeb', size * 0.08);

    // Glow effect
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.5, size * 0.35, 'rgba(135, 206, 235, 0.3)');

    // Highlights
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.3, size * 0.05, 'rgba(255, 255, 255, 0.7)');
  }

  renderFirePlant(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Volcanic soil
    this.renderer.drawRect(worldX + size * 0.1, worldY + size * 0.7, size * 0.8, size * 0.2, '#3a1f1f');

    // Plant stem (dark red line)
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.7, worldX + size * 0.5, worldY + size * 0.4, '#8b0000', size * 0.06);

    // Fire pepper (bright red ellipse)
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.38, size * 0.1, '#dc143c');

    // Pepper highlight
    this.renderer.drawCircle(worldX + size * 0.48, worldY + size * 0.35, size * 0.03, '#ff6347');

    // Glow effect (fire aura)
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.45, size * 0.3, 'rgba(255, 69, 0, 0.2)');
  }

  renderVoidPlant(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Void energy base
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.7, size * 0.25, '#2f004f');

    // Plant tendrils (purple lines with curves)
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.7, worldX + size * 0.4, worldY + size * 0.35, '#6a0dad', size * 0.04);
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.7, worldX + size * 0.5, worldY + size * 0.25, '#6a0dad', size * 0.04);
    this.renderer.drawLine(worldX + size * 0.5, worldY + size * 0.7, worldX + size * 0.6, worldY + size * 0.35, '#6a0dad', size * 0.04);

    // Void essence orbs
    this.renderer.drawCircle(worldX + size * 0.4, worldY + size * 0.35, size * 0.08, '#9370db');
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.25, size * 0.1, '#9370db');
    this.renderer.drawCircle(worldX + size * 0.6, worldY + size * 0.35, size * 0.08, '#9370db');

    // Inner glow
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.25, size * 0.05, '#da70d6');

    // Outer void aura
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.5, size * 0.4, 'rgba(75, 0, 130, 0.3)');

    // Sparkling effect
    this.renderer.drawCircle(worldX + size * 0.42, worldY + size * 0.28, 1, 'rgba(255, 255, 255, 0.8)');
    this.renderer.drawCircle(worldX + size * 0.58, worldY + size * 0.38, 1, 'rgba(255, 255, 255, 0.8)');
  }

  renderAncientTree(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

    // Tree trunk
    this.renderer.drawRect(worldX + size * 0.42, worldY + size * 0.45, size * 0.16, size * 0.45, '#654321');

    // Bark texture
    this.renderer.drawLine(worldX + size * 0.44, worldY + size * 0.5, worldX + size * 0.44, worldY + size * 0.85, '#4a3219', size * 0.02);
    this.renderer.drawLine(worldX + size * 0.56, worldY + size * 0.55, worldX + size * 0.56, worldY + size * 0.9, '#4a3219', size * 0.02);

    // Canopy (dark green - ancient)
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.35, size * 0.3, '#2d5016');

    // Lighter green highlights
    this.renderer.drawCircle(worldX + size * 0.4, worldY + size * 0.3, size * 0.18, '#3d6626');
    this.renderer.drawCircle(worldX + size * 0.6, worldY + size * 0.32, size * 0.16, '#3d6626');

    // Dragon fruit (pink/magenta)
    this.renderer.drawCircle(worldX + size * 0.38, worldY + size * 0.35, size * 0.06, '#ff1493');
    this.renderer.drawCircle(worldX + size * 0.55, worldY + size * 0.3, size * 0.06, '#ff1493');

    // Fruit highlights
    this.renderer.drawCircle(worldX + size * 0.37, worldY + size * 0.33, size * 0.02, '#ff69b4');
    this.renderer.drawCircle(worldX + size * 0.54, worldY + size * 0.28, size * 0.02, '#ff69b4');

    // Ancient glow effect
    this.renderer.drawCircle(worldX + size * 0.5, worldY + size * 0.4, size * 0.38, 'rgba(255, 215, 0, 0.15)');
  }
}
