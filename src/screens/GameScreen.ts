/**
 * GameScreen - Main gameplay screen with 2D top-view roguelike combat
 * Now with projectiles, weapons, and corpse looting!
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { InputManager } from '../core/InputManager';
import { MapSystem, GameMap, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { Enemy as EnemyData, Weapon } from '../entities/types';

export type GameMode = 'base' | 'expedition';

export class GameScreen {
  private renderer: CanvasRenderer;
  private input: InputManager;
  private mapSystem: MapSystem;
  private player: Player;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private corpses: Corpse[] = [];
  private mode: GameMode = 'base';
  private showInteractionPrompt: boolean = false;
  private interactionPromptText: string = '';
  private nearbyCorpse: Corpse | null = null;

  constructor(
    renderer: CanvasRenderer,
    input: InputManager
  ) {
    this.renderer = renderer;
    this.input = input;
    this.mapSystem = new MapSystem();

    // Create player with starting weapon (pistol)
    const startingWeapon = entityFactory.createWeapon('pistol');
    this.player = new Player(320, 240, startingWeapon || undefined);

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

    // Clear everything
    this.enemies = [];
    this.projectiles = [];
    this.corpses = [];
  }

  loadExpedition(level: number = 1): void {
    this.mode = 'expedition';
    const dungeon = MapSystem.createDungeon(level);
    this.mapSystem.loadMap(dungeon);

    // Place player at entrance (stairs up)
    this.player.x = 3 * 32 + 16;
    this.player.y = 3 * 32 + 16;

    // Clear projectiles and corpses
    this.projectiles = [];
    this.corpses = [];

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
        // Get weapon for enemy
        const weaponId = enemyData.weaponId;
        const weapon = weaponId ? entityFactory.createWeapon(weaponId) : null;
        this.enemies.push(new Enemy(x, y, enemyData, weapon));
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
        if (enemy.isRangedWeapon()) {
          // Spawn projectile
          this.spawnEnemyProjectile(enemy);
          enemy.attackCooldown = enemy.weapon!.attackSpeed;
        } else {
          // Melee attack
          const distance = enemy.getDistanceTo(this.player);
          if (distance <= enemy.getAttackRange()) {
            this.player.takeDamage(enemy.getAttackDamage());
            enemy.attackCooldown = enemy.weapon?.attackSpeed || 1.0;
          }
        }
      }
    }

    // Update projectiles
    this.updateProjectiles(deltaTime);

    // Update corpses
    this.updateCorpses(deltaTime);

    // Remove dead enemies and create corpses
    this.enemies = this.enemies.filter(enemy => {
      if (!enemy.alive) {
        const loot = enemy.getLoot();
        // Create corpse instead of auto-looting
        this.corpses.push(new Corpse(
          enemy.x,
          enemy.y,
          enemy.enemyData.name,
          enemy.enemyData.id,
          {
            gold: loot.gold,
            ingredients: loot.items
          }
        ));
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

  private updateProjectiles(deltaTime: number): void {
    for (const proj of this.projectiles) {
      proj.update(deltaTime);

      // Check wall collisions
      const tile = this.mapSystem.getTileAt(proj.x, proj.y);
      if (tile === TileType.WALL) {
        proj.hitWall();
      }

      // Check entity collisions
      if (proj.ownerType === 'player') {
        // Player projectiles hit enemies
        for (const enemy of this.enemies) {
          if (!enemy.alive) continue;
          if (proj.checkCollision(enemy.x, enemy.y, enemy.size)) {
            enemy.takeDamage(proj.damage);
            proj.alive = false;
            break;
          }
        }
      } else {
        // Enemy projectiles hit player
        if (this.player.alive && proj.checkCollision(this.player.x, this.player.y, this.player.size)) {
          this.player.takeDamage(proj.damage);
          proj.alive = false;
        }
      }
    }

    // Remove dead projectiles
    this.projectiles = this.projectiles.filter(p => p.alive);
  }

  private updateCorpses(deltaTime: number): void {
    for (const corpse of this.corpses) {
      corpse.update(deltaTime);
    }

    // Remove expired corpses
    this.corpses = this.corpses.filter(c => !c.isExpired());
  }

  private spawnPlayerProjectile(angle: number, spread: number = 0): void {
    const spawn = this.player.getProjectileSpawn();
    const actualAngle = angle + spread;

    const projectile = new Projectile(
      spawn.x,
      spawn.y,
      actualAngle,
      this.player.getProjectileSpeed(),
      this.player.getAttackDamage(),
      this.player.id,
      'player',
      this.player.getAttackRange(),
      '#FFD700'
    );

    this.projectiles.push(projectile);
  }

  private spawnEnemyProjectile(enemy: Enemy): void {
    const spawn = enemy.getProjectileSpawn();
    const pelletCount = enemy.getPelletCount();
    const spreadAngle = enemy.getSpread();

    for (let i = 0; i < pelletCount; i++) {
      let angle = enemy.facingAngle;

      if (pelletCount > 1) {
        // Spread pellets in a cone
        const spreadRange = spreadAngle / 2;
        angle += (Math.random() - 0.5) * spreadAngle;
      }

      const projectile = new Projectile(
        spawn.x,
        spawn.y,
        angle,
        enemy.getProjectileSpeed(),
        enemy.getAttackDamage(),
        enemy.id,
        'enemy',
        enemy.getAttackRange(),
        '#FF4444'
      );

      this.projectiles.push(projectile);
    }
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

        if (this.player.isRangedWeapon()) {
          // Spawn projectile(s)
          const pelletCount = this.player.getPelletCount();
          const spreadAngle = this.player.getSpread();

          for (let i = 0; i < pelletCount; i++) {
            let spread = 0;
            if (pelletCount > 1) {
              // Spread pellets in a cone
              spread = (Math.random() - 0.5) * spreadAngle;
            }
            this.spawnPlayerProjectile(this.player.facingAngle, spread);
          }
        } else {
          // Melee attack - check if attack hits any enemies
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
  }

  private checkInteractions(): void {
    this.showInteractionPrompt = false;
    this.nearbyCorpse = null;

    // Check for nearby corpses
    for (const corpse of this.corpses) {
      if (corpse.canLoot() && corpse.isPlayerNear(this.player.x, this.player.y)) {
        this.showInteractionPrompt = true;
        this.interactionPromptText = `Press F to loot ${corpse.enemyName}`;
        this.nearbyCorpse = corpse;

        if (this.input.isKeyJustPressed('f')) {
          const loot = corpse.lootCorpse();
          if (loot) {
            this.player.gold += loot.gold;
            for (const ingredient of loot.ingredients) {
              gameState.addToInventory(ingredient);
            }
          }
        }
        return; // Only show one interaction at a time
      }
    }

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

    // Render corpses
    for (const corpse of this.corpses) {
      const opacity = corpse.looted ? 0.3 : 0.7;
      const size = corpse.size;
      this.renderer.drawCircle(corpse.x, corpse.y, size / 2, `rgba(60, 40, 30, ${opacity})`);
      // Draw a simple cross or skull indicator
      this.renderer.drawLine(
        corpse.x - size / 4, corpse.y,
        corpse.x + size / 4, corpse.y,
        '#888', 2
      );
      this.renderer.drawLine(
        corpse.x, corpse.y - size / 4,
        corpse.x, corpse.y + size / 4,
        '#888', 2
      );
    }

    // Render enemies
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      // Simple colored circle for now
      this.renderer.drawCircleWithBorder(enemy.x, enemy.y, enemy.size / 2, enemy.color, '#000', 2);

      // Draw weapon indicator
      if (enemy.isRangedWeapon()) {
        // Draw a small gun icon
        const gunLength = 8;
        const endX = enemy.x + Math.cos(enemy.facingAngle) * gunLength;
        const endY = enemy.y + Math.sin(enemy.facingAngle) * gunLength;
        this.renderer.drawLine(enemy.x, enemy.y, endX, endY, '#333', 3);
      }

      // Draw health bar
      this.drawHealthBar(enemy.x, enemy.y - enemy.size, enemy.stats.health, enemy.stats.maxHealth);
    }

    // Render projectiles
    for (const proj of this.projectiles) {
      this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);

      // Draw trail effect
      const trailLength = 10;
      const trailX = proj.x - (proj.vx / Math.abs(proj.vx + proj.vy)) * trailLength;
      const trailY = proj.y - (proj.vy / Math.abs(proj.vx + proj.vy)) * trailLength;
      this.renderer.drawLine(trailX, trailY, proj.x, proj.y, proj.color, 2);
    }

    // Render player
    this.renderer.drawCircleWithBorder(this.player.x, this.player.y, this.player.size / 2, this.player.color, '#000', 2);

    // Draw player facing indicator / weapon
    if (this.player.isRangedWeapon()) {
      // Draw gun
      const gunLength = 12;
      const endX = this.player.x + Math.cos(this.player.facingAngle) * gunLength;
      const endY = this.player.y + Math.sin(this.player.facingAngle) * gunLength;
      this.renderer.drawLine(this.player.x, this.player.y, endX, endY, '#FFD700', 3);
    } else {
      // Draw melee weapon indicator
      const angle = this.player.facingAngle;
      const indicatorLength = this.player.size / 2 + 5;
      const endX = this.player.x + Math.cos(angle) * indicatorLength;
      const endY = this.player.y + Math.sin(angle) * indicatorLength;
      this.renderer.drawLine(this.player.x, this.player.y, endX, endY, '#fff', 2);
    }

    // Draw player attack visualization
    if (this.player.attackCooldown > 0.3 && !this.player.isRangedWeapon()) {
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
    this.renderer.drawUIRectWithBorder(10, 10, 300, 120, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);

    this.renderer.drawUIText(`HP: ${this.player.stats.health}/${this.player.stats.maxHealth}`, 20, 35, '#fff', 18);
    this.renderer.drawUIText(`Gold: ${this.player.gold}`, 20, 60, '#FFD700', 18);
    this.renderer.drawUIText(`ATK: ${this.player.getAttackDamage()} | DEF: ${this.player.getTotalDefense()}`, 20, 85, '#fff', 16);

    const weaponName = this.player.weapon?.name || 'Fists';
    const weaponType = this.player.isRangedWeapon() ? '🔫' : '⚔️';
    this.renderer.drawUIText(`${weaponType} ${weaponName}`, 20, 110, '#FFD700', 16);

    // Draw mode indicator
    this.renderer.drawUIText(this.mode === 'base' ? 'BASE CAMP' : 'EXPEDITION', canvas.width / 2, 30, '#fff', 24, 'center');

    // Draw controls (bottom-left)
    this.renderer.drawUIRectWithBorder(10, canvas.height - 130, 320, 120, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
    this.renderer.drawUIText('WASD/Arrows: Move', 20, canvas.height - 105, '#fff', 14);
    this.renderer.drawUIText('Space/Click: Attack', 20, canvas.height - 85, '#fff', 14);
    this.renderer.drawUIText('E: Interact | F: Loot', 20, canvas.height - 65, '#fff', 14);
    this.renderer.drawUIText('ESC: Menu', 20, canvas.height - 45, '#fff', 14);
    this.renderer.drawUIText('🎯 Aim: Mouse/Movement', 20, canvas.height - 25, '#fff', 14);

    // Draw interaction prompt
    if (this.showInteractionPrompt) {
      const promptWidth = 350;
      const promptX = canvas.width / 2 - promptWidth / 2;
      const promptY = canvas.height - 180;

      this.renderer.drawUIRectWithBorder(promptX, promptY, promptWidth, 50, 'rgba(0, 0, 0, 0.9)', '#FFD700', 3);
      this.renderer.drawUIText(this.interactionPromptText, canvas.width / 2, promptY + 32, '#FFD700', 20, 'center');
    }

    // Draw enemy count and corpse count in expedition mode
    if (this.mode === 'expedition') {
      const aliveEnemies = this.enemies.filter(e => e.alive).length;
      const lootableCorpses = this.corpses.filter(c => c.canLoot()).length;

      this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, canvas.width - 150, 30, '#F44336', 18);
      if (lootableCorpses > 0) {
        this.renderer.drawUIText(`Corpses: ${lootableCorpses}`, canvas.width - 150, 55, '#999', 16);
      }
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
