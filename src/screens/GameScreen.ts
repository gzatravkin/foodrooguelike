/**
 * GameScreen - Main gameplay screen with movement and combat
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { InputManager } from '../core/InputManager';
import { MapSystem, GameMap, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { Enemy as EnemyData } from '../entities/types';

export type GameMode = 'base' | 'expedition';

export class GameScreen {
  private renderer: CanvasRenderer;
  private input: InputManager;
  private mapSystem: MapSystem;
  private player: Player;
  private enemies: Enemy[] = [];
  private mode: GameMode = 'base';
  private showInteractionPrompt: boolean = false;
  private interactionPromptText: string = '';

  constructor(
    renderer: CanvasRenderer,
    input: InputManager
  ) {
    this.renderer = renderer;
    this.input = input;
    this.mapSystem = new MapSystem();

    // Create player at center of base
    this.player = new Player(320, 240);

    // Load base camp map
    this.loadBaseCamp();
  }

  loadBaseCamp(): void {
    this.mode = 'base';
    const baseCamp = MapSystem.createBaseCamp();
    this.mapSystem.loadMap(baseCamp);

    // Place player in center
    this.player.x = 320;
    this.player.y = 240;

    // Clear enemies
    this.enemies = [];
  }

  loadExpedition(level: number = 1): void {
    this.mode = 'expedition';
    const dungeon = MapSystem.createDungeon(level);
    this.mapSystem.loadMap(dungeon);

    // Place player at entrance (stairs up)
    this.player.x = 3 * 32 + 16;
    this.player.y = 3 * 32 + 16;

    // Spawn enemies
    this.spawnEnemies(level);
  }

  private spawnEnemies(level: number): void {
    this.enemies = [];

    // Get appropriate enemies for this level
    const allEnemies = entityFactory.getAllOfType('enemy') as EnemyData[];
    const levelEnemies = allEnemies.filter((e: EnemyData) => {
      // Simple tier system based on gold rewards
      if (level === 1) return e.goldReward <= 15;
      if (level === 2) return e.goldReward > 15 && e.goldReward <= 40;
      if (level === 3) return e.goldReward > 40 && e.goldReward <= 100;
      return e.goldReward > 100;
    });

    if (levelEnemies.length === 0) return;

    // Spawn 5-10 enemies in random valid locations
    const numEnemies = 5 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numEnemies; i++) {
      // Pick random enemy from level-appropriate enemies
      const enemyData = levelEnemies[Math.floor(Math.random() * levelEnemies.length)];

      // Find random valid position
      let attempts = 0;
      let validPosition = false;
      let x = 0, y = 0;

      while (!validPosition && attempts < 100) {
        const map = this.mapSystem.getCurrentMap();
        if (!map) break;

        x = (2 + Math.floor(Math.random() * (map.width - 4))) * map.tileSize + map.tileSize / 2;
        y = (2 + Math.floor(Math.random() * (map.height - 4))) * map.tileSize + map.tileSize / 2;

        // Check if position is walkable and far enough from player
        const distFromPlayer = Math.sqrt((x - this.player.x) ** 2 + (y - this.player.y) ** 2);
        if (this.mapSystem.canMoveTo(x, y) && distFromPlayer > 150) {
          validPosition = true;
        }

        attempts++;
      }

      if (validPosition) {
        this.enemies.push(new Enemy(x, y, enemyData));
      }
    }
  }

  update(deltaTime: number): void {
    // Update player
    this.handlePlayerMovement(deltaTime);
    this.handlePlayerAttack(deltaTime);
    this.player.update(deltaTime);

    // Update enemies
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      enemy.updateAI(
        this.player.x,
        this.player.y,
        deltaTime,
        (x, y) => this.mapSystem.canMoveTo(x, y, enemy.size)
      );
      enemy.update(deltaTime);

      // Enemy attack player
      if (enemy.canAttack()) {
        const distance = enemy.getDistanceTo(this.player);
        if (distance <= enemy.attackRange) {
          this.player.takeDamage(enemy.getAttackDamage());
          enemy.attackCooldown = 1.0;
        }
      }
    }

    // Remove dead enemies and give loot
    this.enemies = this.enemies.filter(enemy => {
      if (!enemy.alive) {
        const loot = enemy.getLoot();
        this.player.gold += loot.gold;

        // Add ingredients to inventory
        for (const ingredientId of loot.items) {
          gameState.addToInventory(ingredientId);
        }

        return false;
      }
      return true;
    });

    // Check for interactions
    this.checkInteractions();

    // Update camera to follow player
    this.updateCamera();

    // Check if player died
    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    // Update input manager
    this.input.update();
  }

  private handlePlayerMovement(deltaTime: number): void {
    const movement = this.input.getMovementVector();

    if (movement.x !== 0 || movement.y !== 0) {
      // Calculate new position
      const newX = this.player.x + movement.x * this.player.stats.speed * deltaTime;
      const newY = this.player.y + movement.y * this.player.stats.speed * deltaTime;

      // Check collision with map
      if (this.mapSystem.canMoveTo(newX, newY, this.player.size)) {
        this.player.move(movement.x, movement.y, deltaTime);
      } else {
        // Try moving in just X or Y
        if (this.mapSystem.canMoveTo(newX, this.player.y, this.player.size)) {
          this.player.move(movement.x, 0, deltaTime);
        } else if (this.mapSystem.canMoveTo(this.player.x, newY, this.player.size)) {
          this.player.move(0, movement.y, deltaTime);
        }
      }
    }
  }

  private handlePlayerAttack(deltaTime: number): void {
    // Attack with spacebar or left mouse
    if (this.input.isKeyPressed(' ') || this.input.isMouseButtonPressed(0)) {
      if (this.player.canAttack()) {
        this.player.attack();

        // Check if attack hits any enemies
        const hitbox = this.player.getAttackHitbox();

        for (const enemy of this.enemies) {
          if (!enemy.alive) continue;

          const dx = enemy.x - hitbox.x;
          const dy = enemy.y - hitbox.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= hitbox.radius + enemy.size / 2) {
            enemy.takeDamage(this.player.getAttackDamage());
          }
        }
      }
    }
  }

  private checkInteractions(): void {
    this.showInteractionPrompt = false;

    // Get tile player is on
    const tile = this.mapSystem.getTileAt(this.player.x, this.player.y);

    if (tile === TileType.COOKING_STATION) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Cook';

      if (this.input.isKeyJustPressed('e')) {
        // TODO: Open cooking menu
        console.log('Opening cooking menu...');
      }
    } else if (tile === TileType.SHOP) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Shop';

      if (this.input.isKeyJustPressed('e')) {
        // TODO: Open shop menu
        console.log('Opening shop menu...');
      }
    } else if (tile === TileType.EXPEDITION_PORTAL) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Start Expedition';

      if (this.input.isKeyJustPressed('e')) {
        this.loadExpedition(1);
      }
    } else if (tile === TileType.STAIRS_UP && this.mode === 'expedition') {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Return to Base';

      if (this.input.isKeyJustPressed('e')) {
        this.loadBaseCamp();
      }
    }
  }

  private updateCamera(): void {
    const canvas = this.renderer.getCanvas();

    // Center camera on player
    const cameraX = this.player.x - canvas.width / 2;
    const cameraY = this.player.y - canvas.height / 2;

    this.renderer.setCamera(cameraX, cameraY);
  }

  private handlePlayerDeath(): void {
    // Respawn at base with reduced gold
    this.player.alive = true;
    this.player.stats.health = this.player.stats.maxHealth;
    this.player.gold = Math.floor(this.player.gold * 0.5);
    this.loadBaseCamp();
  }

  render(): void {
    this.renderer.clear();

    // Render map
    this.renderMap();

    // Render enemies
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      this.renderer.drawCircleWithBorder(enemy.x, enemy.y, enemy.size / 2, enemy.color, '#000', 2);

      // Draw health bar
      this.drawHealthBar(enemy.x, enemy.y - enemy.size, enemy.stats.health, enemy.stats.maxHealth);
    }

    // Render player
    this.renderer.drawCircleWithBorder(this.player.x, this.player.y, this.player.size / 2, this.player.color, '#000', 2);

    // Draw player facing indicator
    const angle = this.player.facingAngle;
    const indicatorLength = this.player.size / 2 + 5;
    const endX = this.player.x + Math.cos(angle) * indicatorLength;
    const endY = this.player.y + Math.sin(angle) * indicatorLength;
    this.renderer.drawLine(this.player.x, this.player.y, endX, endY, '#fff', 2);

    // Draw player attack visualization
    if (this.player.attackCooldown > 0.3) {
      const hitbox = this.player.getAttackHitbox();
      this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius, 'rgba(255, 255, 255, 0.3)');
    }

    // Render UI
    this.renderUI();
  }

  private renderMap(): void {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tileType = map.tiles[y][x];
        const color = this.mapSystem.getTileColor(tileType);

        const worldX = x * map.tileSize;
        const worldY = y * map.tileSize;

        this.renderer.drawTileWithBorder(worldX, worldY, map.tileSize, color, '#111');
      }
    }
  }

  private renderUI(): void {
    const canvas = this.renderer.getCanvas();

    // Draw player stats (top-left)
    this.renderer.drawUIRectWithBorder(10, 10, 250, 100, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);

    this.renderer.drawUIText(`HP: ${this.player.stats.health}/${this.player.stats.maxHealth}`, 20, 35, '#fff', 18);
    this.renderer.drawUIText(`Gold: ${this.player.gold}`, 20, 60, '#FFD700', 18);
    this.renderer.drawUIText(`ATK: ${this.player.getAttackDamage()} | DEF: ${this.player.getTotalDefense()}`, 20, 85, '#fff', 16);

    // Draw mode indicator
    this.renderer.drawUIText(this.mode === 'base' ? 'BASE CAMP' : 'EXPEDITION', canvas.width / 2, 30, '#fff', 24, 'center');

    // Draw controls (bottom-left)
    this.renderer.drawUIRectWithBorder(10, canvas.height - 110, 300, 100, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
    this.renderer.drawUIText('WASD/Arrows: Move', 20, canvas.height - 85, '#fff', 14);
    this.renderer.drawUIText('Space/Click: Attack', 20, canvas.height - 65, '#fff', 14);
    this.renderer.drawUIText('E: Interact', 20, canvas.height - 45, '#fff', 14);
    this.renderer.drawUIText('ESC: Menu', 20, canvas.height - 25, '#fff', 14);

    // Draw interaction prompt
    if (this.showInteractionPrompt) {
      const promptWidth = 300;
      const promptX = canvas.width / 2 - promptWidth / 2;
      const promptY = canvas.height - 180;

      this.renderer.drawUIRectWithBorder(promptX, promptY, promptWidth, 50, 'rgba(0, 0, 0, 0.9)', '#FFD700', 3);
      this.renderer.drawUIText(this.interactionPromptText, canvas.width / 2, promptY + 32, '#FFD700', 20, 'center');
    }

    // Draw enemy count in expedition mode
    if (this.mode === 'expedition') {
      const aliveEnemies = this.enemies.filter(e => e.alive).length;
      this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, canvas.width - 150, 30, '#F44336', 18);
    }
  }

  private drawHealthBar(x: number, y: number, health: number, maxHealth: number): void {
    const barWidth = 40;
    const barHeight = 6;
    const healthPercent = health / maxHealth;

    // Background
    this.renderer.drawRect(x - barWidth / 2, y, barWidth, barHeight, '#333');

    // Health
    const healthWidth = barWidth * healthPercent;
    const healthColor = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
    this.renderer.drawRect(x - barWidth / 2, y, healthWidth, barHeight, healthColor);

    // Border
    this.renderer.drawLine(x - barWidth / 2, y, x + barWidth / 2, y, '#000', 1);
    this.renderer.drawLine(x - barWidth / 2, y + barHeight, x + barWidth / 2, y + barHeight, '#000', 1);
  }
}
