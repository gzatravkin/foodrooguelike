/**
 * GlobalMapScreen - Interactive world map where players can explore and select expeditions
 * Features camera following, unlockable locations, and immersive exploration
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { InputManager } from '../core/InputManager';
import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import expeditionsData from '../data/expeditions.json';

interface MapLocation {
  id: string;
  name: string;
  x: number; // World coordinates
  y: number;
  expeditionId: string;
  unlockCost: number;
  isUnlocked: boolean;
  radius: number;
  color: string;
  icon: string;
}

interface Camera {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  smoothing: number; // 0-1, lower = smoother
}

export class GlobalMapScreen {
  private renderer: CanvasRenderer;
  private input: InputManager;
  private playerX: number = 400; // Player position in world space
  private playerY: number = 300;
  private playerSpeed: number = 200; // pixels per second
  private camera: Camera;
  private locations: MapLocation[] = [];
  private selectedLocation: MapLocation | null = null;
  private hoveredLocation: MapLocation | null = null;
  private showLocationPanel: boolean = false;

  // Map bounds
  private readonly MAP_WIDTH = 1600;
  private readonly MAP_HEIGHT = 1200;

  // Player visuals
  private readonly PLAYER_RADIUS = 16;
  private playerAngle: number = 0;

  constructor(renderer: CanvasRenderer, input: InputManager) {
    this.renderer = renderer;
    this.input = input;

    // Initialize camera at player position
    this.camera = {
      x: this.playerX,
      y: this.playerY,
      targetX: this.playerX,
      targetY: this.playerY,
      smoothing: 0.1
    };

    this.initializeLocations();
    this.loadUnlockedState();
  }

  private initializeLocations(): void {
    // Create map locations based on expeditions
    this.locations = [
      {
        id: 'forest_outskirts',
        name: 'Forest Outskirts',
        x: 400,
        y: 300,
        expeditionId: 'forest_outskirts',
        unlockCost: 0, // Starting location, free
        isUnlocked: true,
        radius: 50,
        color: '#4CAF50',
        icon: '🌲'
      },
      {
        id: 'dark_cave',
        name: 'Dark Cave',
        x: 650,
        y: 250,
        expeditionId: 'dark_cave',
        unlockCost: 50,
        isUnlocked: false,
        radius: 50,
        color: '#5D4037',
        icon: '🕳️'
      },
      {
        id: 'goblin_camp',
        name: 'Goblin Camp',
        x: 300,
        y: 500,
        expeditionId: 'goblin_camp',
        unlockCost: 100,
        isUnlocked: false,
        radius: 55,
        color: '#8B4513',
        icon: '⛺'
      },
      {
        id: 'orc_stronghold',
        name: 'Orc Stronghold',
        x: 850,
        y: 400,
        expeditionId: 'orc_stronghold',
        unlockCost: 200,
        isUnlocked: false,
        radius: 60,
        color: '#424242',
        icon: '🏰'
      },
      {
        id: 'frozen_wasteland',
        name: 'Frozen Wasteland',
        x: 600,
        y: 650,
        expeditionId: 'frozen_wasteland',
        unlockCost: 350,
        isUnlocked: false,
        radius: 60,
        color: '#81D4FA',
        icon: '❄️'
      },
      {
        id: 'volcano_depths',
        name: 'Volcano Depths',
        x: 1100,
        y: 500,
        expeditionId: 'volcano_depths',
        unlockCost: 500,
        isUnlocked: false,
        radius: 65,
        color: '#FF5722',
        icon: '🌋'
      },
      {
        id: 'demon_realm',
        name: 'Demon Realm',
        x: 950,
        y: 800,
        expeditionId: 'demon_realm',
        unlockCost: 800,
        isUnlocked: false,
        radius: 70,
        color: '#9C27B0',
        icon: '👹'
      }
    ];
  }

  private loadUnlockedState(): void {
    const saved = localStorage.getItem('unlockedLocations');
    if (saved) {
      const unlocked = JSON.parse(saved) as string[];
      unlocked.forEach(id => {
        const location = this.locations.find(loc => loc.id === id);
        if (location) {
          location.isUnlocked = true;
        }
      });
    }
  }

  private saveUnlockedState(): void {
    const unlocked = this.locations
      .filter(loc => loc.isUnlocked)
      .map(loc => loc.id);
    localStorage.setItem('unlockedLocations', JSON.stringify(unlocked));
  }

  update(deltaTime: number): void {
    this.handleInput(deltaTime);
    this.updateCamera(deltaTime);
    this.checkLocationProximity();
  }

  private handleInput(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    // WASD or Arrow keys for movement
    if (this.input.isKeyPressed('w') || this.input.isKeyPressed('ArrowUp')) dy -= 1;
    if (this.input.isKeyPressed('s') || this.input.isKeyPressed('ArrowDown')) dy += 1;
    if (this.input.isKeyPressed('a') || this.input.isKeyPressed('ArrowLeft')) dx -= 1;
    if (this.input.isKeyPressed('d') || this.input.isKeyPressed('ArrowRight')) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    // Update player angle for visual
    if (dx !== 0 || dy !== 0) {
      this.playerAngle = Math.atan2(dy, dx);
    }

    // Move player
    const newX = this.playerX + dx * this.playerSpeed * deltaTime;
    const newY = this.playerY + dy * this.playerSpeed * deltaTime;

    // Keep player within map bounds
    this.playerX = Math.max(100, Math.min(this.MAP_WIDTH - 100, newX));
    this.playerY = Math.max(100, Math.min(this.MAP_HEIGHT - 100, newY));

    // Update camera target
    this.camera.targetX = this.playerX;
    this.camera.targetY = this.playerY;

    // Handle interaction (E key or Space)
    if (this.input.isKeyJustPressed('e') || this.input.isKeyJustPressed(' ')) {
      if (this.selectedLocation) {
        this.interactWithLocation(this.selectedLocation);
      }
    }

    // ESC to return to base (sets screen to 'game' which loads base camp)
    if (this.input.isKeyJustPressed('Escape')) {
      gameState.setScreen('game');
    }
  }

  private updateCamera(deltaTime: number): void {
    // Smooth camera following
    this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
    this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
  }

  private checkLocationProximity(): void {
    this.selectedLocation = null;
    this.hoveredLocation = null;

    for (const location of this.locations) {
      const dx = this.playerX - location.x;
      const dy = this.playerY - location.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if player is close enough to interact
      if (distance < location.radius + this.PLAYER_RADIUS + 20) {
        this.selectedLocation = location;
        this.hoveredLocation = location;
        break;
      }
    }
  }

  private interactWithLocation(location: MapLocation): void {
    if (!location.isUnlocked) {
      // Try to unlock with gold
      const currentGold = gameState.getState().gold;
      if (currentGold >= location.unlockCost) {
        if (confirm(`Unlock ${location.name} for ${location.unlockCost} gold?`)) {
          gameState.spendGold(location.unlockCost);
          location.isUnlocked = true;
          this.saveUnlockedState();
          eventBus.emit('location:unlocked', location.name);
        }
      } else {
        alert(`Not enough gold! Need ${location.unlockCost} gold to unlock ${location.name}.`);
      }
    } else {
      // Start expedition
      this.startExpedition(location.expeditionId);
    }
  }

  private startExpedition(expeditionId: string): void {
    const expedition = expeditionsData[expeditionId as keyof typeof expeditionsData];

    if (expedition) {
      // Check if player has enough gold for expedition cost
      const currentGold = gameState.getState().gold;
      if (currentGold >= expedition.cost) {
        // Store expedition data and switch to expedition selection screen
        // (which will show food buffs, then start the expedition)
        localStorage.setItem('preselectedExpedition', JSON.stringify(expedition));
        gameState.setScreen('expedition');
      } else {
        alert(`Not enough gold! This expedition costs ${expedition.cost} gold.`);
      }
    } else {
      console.error('Expedition not found:', expeditionId);
      alert('Expedition not found. Please try again.');
    }
  }

  render(): void {
    const canvas = this.renderer.getCanvas();
    const ctx = this.renderer.getContext();
    const width = canvas.width;
    const height = canvas.height;

    // Clear screen
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Calculate screen offset from camera
    const offsetX = width / 2 - this.camera.x;
    const offsetY = height / 2 - this.camera.y;

    // Draw background (grass/terrain)
    this.drawBackground(ctx, offsetX, offsetY, width, height);

    // Draw paths between locations
    this.drawPaths(ctx, offsetX, offsetY);

    // Draw locations
    this.drawLocations(ctx, offsetX, offsetY);

    // Draw player
    this.drawPlayer(ctx, offsetX, offsetY);

    // Draw UI
    this.drawUI(ctx, width, height);
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

  private drawPaths(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
    // Draw connections between unlocked locations
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);

    for (let i = 0; i < this.locations.length - 1; i++) {
      const loc1 = this.locations[i];
      const loc2 = this.locations[i + 1];

      if (loc1.isUnlocked) {
        ctx.beginPath();
        ctx.moveTo(loc1.x + offsetX, loc1.y + offsetY);
        ctx.lineTo(loc2.x + offsetX, loc2.y + offsetY);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  }

  private drawLocations(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
    for (const location of this.locations) {
      const screenX = location.x + offsetX;
      const screenY = location.y + offsetY;

      // Skip if off-screen
      if (screenX < -100 || screenX > this.renderer.getCanvas().width + 100 ||
          screenY < -100 || screenY > this.renderer.getCanvas().height + 100) {
        continue;
      }

      // Draw glow for selected location
      if (location === this.selectedLocation) {
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
      ctx.strokeStyle = location === this.selectedLocation ? '#FFD700' : '#666';
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

  private drawPlayer(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
    const screenX = this.playerX + offsetX;
    const screenY = this.playerY + offsetY;

    // Player shadow
    ctx.beginPath();
    ctx.arc(screenX, screenY + 5, this.PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Player body
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Player direction indicator
    const dirX = Math.cos(this.playerAngle) * this.PLAYER_RADIUS;
    const dirY = Math.sin(this.playerAngle) * this.PLAYER_RADIUS;

    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + dirX, screenY + dirY);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  private drawUI(ctx: CanvasRenderingContext2D, width: number, height: number): void {
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
    if (this.selectedLocation) {
      const panelWidth = 350;
      const panelHeight = 180;
      const panelX = width - panelWidth - 20;
      const panelY = 20;

      // Panel background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeStyle = this.selectedLocation.isUnlocked ? '#FFD700' : '#FF4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      // Location info
      ctx.font = 'bold 22px Arial';
      ctx.fillStyle = '#FFF';
      ctx.textAlign = 'center';
      ctx.fillText(this.selectedLocation.name, panelX + panelWidth / 2, panelY + 35);

      ctx.font = '16px Arial';
      ctx.textAlign = 'left';

      if (!this.selectedLocation.isUnlocked) {
        ctx.fillStyle = '#FF4444';
        ctx.fillText('🔒 LOCKED', panelX + 20, panelY + 70);
        ctx.fillStyle = '#FFF';
        ctx.fillText(`Unlock Cost: ${this.selectedLocation.unlockCost} gold`, panelX + 20, panelY + 100);

        const currentGold = gameState.getState().gold;
        const canAfford = currentGold >= this.selectedLocation.unlockCost;
        ctx.fillStyle = canAfford ? '#4CAF50' : '#F44336';
        ctx.fillText(canAfford ? 'Press E to unlock!' : 'Not enough gold!', panelX + 20, panelY + 130);
      } else {
        ctx.fillStyle = '#4CAF50';
        ctx.fillText('✓ UNLOCKED', panelX + 20, panelY + 70);
        ctx.fillStyle = '#FFF';
        ctx.fillText('Press E to start expedition!', panelX + 20, panelY + 100);

        // Show expedition cost
        const expedition = expeditionsData[this.selectedLocation.expeditionId as keyof typeof expeditionsData];
        if (expedition) {
          ctx.fillStyle = '#FFD700';
          ctx.fillText(`Expedition cost: ${expedition.cost} gold`, panelX + 20, panelY + 130);
        }
      }
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
  }

  destroy(): void {
    // Cleanup if needed
  }
}
