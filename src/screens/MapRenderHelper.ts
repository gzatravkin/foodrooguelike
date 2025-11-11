/**
 * MapRenderHelper - Handles all rendering operations for the global map
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { gameState } from '../core/GameState';
import { MapLocation } from './MapLocationManager';
import expeditionsData from '../data/expeditions.json';

export class MapRenderHelper {
  private renderer: CanvasRenderer;

  constructor(renderer: CanvasRenderer) {
    this.renderer = renderer;
  }

  renderAll(
    offsetX: number,
    offsetY: number,
    locations: MapLocation[],
    playerX: number,
    playerY: number,
    playerAngle: number,
    playerRadius: number,
    selectedLocation: MapLocation | null,
    messageText: string
  ): void {
    const canvas = this.renderer.getCanvas();
    const ctx = this.renderer.getContext();
    const width = canvas.width;
    const height = canvas.height;

    // Clear screen
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw all layers
    this.drawBackground(ctx, offsetX, offsetY, width, height);
    this.drawPaths(ctx, offsetX, offsetY, locations);
    this.drawLocations(ctx, offsetX, offsetY, locations, selectedLocation);
    this.drawPlayer(ctx, offsetX, offsetY, playerX, playerY, playerAngle, playerRadius);
    this.drawUI(ctx, width, height, selectedLocation, messageText);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, width: number, height: number): void {
    // Draw a simple grid or pattern
    ctx.fillStyle = '#2d4a3e';

    const gridSize = 80;
    const startX = Math.floor(-offsetX / gridSize) * gridSize;
    const startY = Math.floor(-offsetY / gridSize) * gridSize;

    for (let x = startX; x < width - offsetX; x += gridSize) {
      for (let y = startY; y < height - offsetY; y += gridSize) {
        if ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2 === 0) {
          ctx.fillStyle = '#2d4a3e';
        } else {
          ctx.fillStyle = '#3a5a4e';
        }
        ctx.fillRect(x + offsetX, y + offsetY, gridSize, gridSize);
      }
    }
  }

  private drawPaths(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, locations: MapLocation[]): void {
    // Draw connections between unlocked locations
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);

    for (let i = 0; i < locations.length - 1; i++) {
      const loc1 = locations[i];
      const loc2 = locations[i + 1];

      if (loc1.isUnlocked) {
        ctx.beginPath();
        ctx.moveTo(loc1.x + offsetX, loc1.y + offsetY);
        ctx.lineTo(loc2.x + offsetX, loc2.y + offsetY);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  }

  private drawLocations(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    locations: MapLocation[],
    selectedLocation: MapLocation | null
  ): void {
    const canvas = this.renderer.getCanvas();

    for (const location of locations) {
      const screenX = location.x + offsetX;
      const screenY = location.y + offsetY;

      // Skip if off-screen
      if (screenX < -100 || screenX > canvas.width + 100 ||
          screenY < -100 || screenY > canvas.height + 100) {
        continue;
      }

      // Draw glow for selected location
      if (location === selectedLocation) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = location.isUnlocked ? '#FFD700' : '#FF4444';
      }

      // Draw location circle
      ctx.beginPath();
      ctx.arc(screenX, screenY, location.radius, 0, Math.PI * 2);

      if (location.isUnlocked) {
        ctx.fillStyle = location.color;
      } else {
        ctx.fillStyle = '#444';
      }

      ctx.fill();

      // Border
      ctx.strokeStyle = location === selectedLocation ? '#FFD700' : '#666';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Lock icon for locked locations
      if (!location.isUnlocked) {
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#999';
        ctx.fillText('🔒', screenX, screenY);
      } else {
        // Icon for unlocked locations
        ctx.font = '35px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(location.icon, screenX, screenY);
      }

      // Location name
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(location.name, screenX, screenY + location.radius + 10);
      ctx.fillText(location.name, screenX, screenY + location.radius + 10);
    }
  }

  private drawPlayer(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    playerX: number,
    playerY: number,
    playerAngle: number,
    playerRadius: number
  ): void {
    const screenX = playerX + offsetX;
    const screenY = playerY + offsetY;

    // Player shadow
    ctx.beginPath();
    ctx.arc(screenX, screenY + 5, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Player body
    ctx.beginPath();
    ctx.arc(screenX, screenY, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Player direction indicator
    const dirX = Math.cos(playerAngle) * playerRadius;
    const dirY = Math.sin(playerAngle) * playerRadius;

    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + dirX, screenY + dirY);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  private drawUI(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    selectedLocation: MapLocation | null,
    messageText: string
  ): void {
    // Gold display
    const currentGold = gameState.getState().gold;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`💰 ${currentGold} Gold`, 20, 40);

    // Instructions
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('WASD/Arrows: Move', 20, height - 80);
    ctx.fillText('E: Interact with location', 20, height - 50);
    ctx.fillText('ESC: Return to base', 20, height - 20);

    // Location info panel
    if (selectedLocation) {
      this.drawLocationPanel(ctx, width, selectedLocation);
    }

    // Title
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    const title = 'World Map';
    ctx.strokeText(title, width / 2, 40);
    ctx.fillText(title, width / 2, 40);

    // Message notification
    if (messageText) {
      this.drawMessage(ctx, width, height, messageText);
    }
  }

  private drawLocationPanel(ctx: CanvasRenderingContext2D, width: number, selectedLocation: MapLocation): void {
    const panelWidth = 350;
    const panelHeight = 180;
    const panelX = width - panelWidth - 20;
    const panelY = 20;

    // Panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = selectedLocation.isUnlocked ? '#FFD700' : '#FF4444';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Location info
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.fillText(selectedLocation.name, panelX + panelWidth / 2, panelY + 35);

    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    if (!selectedLocation.isUnlocked) {
      ctx.fillStyle = '#FF4444';
      ctx.fillText('🔒 LOCKED', panelX + 20, panelY + 70);
      ctx.fillStyle = '#FFF';
      ctx.fillText(`Unlock Cost: ${selectedLocation.unlockCost} gold`, panelX + 20, panelY + 100);

      const currentGold = gameState.getState().gold;
      const canAfford = currentGold >= selectedLocation.unlockCost;
      ctx.fillStyle = canAfford ? '#4CAF50' : '#F44336';
      ctx.fillText(canAfford ? 'Press E to unlock!' : 'Not enough gold!', panelX + 20, panelY + 130);
    } else {
      ctx.fillStyle = '#4CAF50';
      ctx.fillText('✓ UNLOCKED', panelX + 20, panelY + 70);
      ctx.fillStyle = '#FFF';
      ctx.fillText('Press E to start expedition!', panelX + 20, panelY + 100);

      // Show expedition cost
      const expedition = expeditionsData[selectedLocation.expeditionId as keyof typeof expeditionsData];
      if (expedition) {
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`Expedition cost: ${expedition.cost} gold`, panelX + 20, panelY + 130);
      }
    }
  }

  private drawMessage(ctx: CanvasRenderingContext2D, width: number, height: number, messageText: string): void {
    const msgWidth = 600;
    const msgHeight = 80;
    const msgX = (width - msgWidth) / 2;
    const msgY = height - 150;

    // Message background with slight transparency
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(msgX, msgY, msgWidth, msgHeight);

    // Border
    ctx.strokeStyle = '#FF4444';
    ctx.lineWidth = 3;
    ctx.strokeRect(msgX, msgY, msgWidth, msgHeight);

    // Message text
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFF';

    // Word wrap the message if needed
    const words = messageText.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > msgWidth - 40) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Draw lines centered
    const lineHeight = 24;
    const startY = msgY + (msgHeight - lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, msgX + msgWidth / 2, startY + i * lineHeight);
    });
  }
}
