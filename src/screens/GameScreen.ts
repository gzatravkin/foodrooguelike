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
import * as SVGArt from '../rendering/SVGArt';

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
  private svgsLoaded: boolean = false;
  private shopOpen: boolean = false;
  private availableWeapons: Weapon[] = [];

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

    // Preload SVG assets
    this.preloadSVGAssets();

    // Listen for weapon equip events
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    import('../core/EventBus').then(({ eventBus }) => {
      eventBus.on('weapon:equipped', (weaponId: string) => {
        const weapon = entityFactory.createWeapon(weaponId);
        if (weapon) {
          this.player.equipWeapon(weapon);
        }
      });

      eventBus.on('gold:changed', (gold: number) => {
        this.player.gold = gold;
      });
    });
  }

  private handleWeaponSwitching(): void {
    // Switch weapons with number keys 1-9
    for (let i = 1; i <= 9; i++) {
      if (this.input.isKeyJustPressed(i.toString())) {
        const weapons = gameState.getState().inventory
          .map(id => entityFactory.getTemplate(id))
          .filter(item => item?.type === 'weapon') as Weapon[];

        if (weapons[i - 1]) {
          const weapon = weapons[i - 1];
          this.player.equipWeapon(weapon);
          gameState.equipWeapon(weapon.id);
        }
        break;
      }
    }
  }

  private openShop(): void {
    this.shopOpen = true;
    this.availableWeapons = entityFactory.getAllOfType('weapon') as Weapon[];
  }

  private closeShop(): void {
    this.shopOpen = false;
  }

  private handleShopInput(): void {
    // Close shop with ESC or E
    if (this.input.isKeyJustPressed('escape') || this.input.isKeyJustPressed('e')) {
      this.closeShop();
      return;
    }

    // Buy weapon with number keys
    for (let i = 1; i <= 9; i++) {
      if (this.input.isKeyJustPressed(i.toString())) {
        const weapon = this.availableWeapons[i - 1];
        if (weapon && this.player.gold >= weapon.cost) {
          import('../systems/ShopSystem').then(({ shopSystem }) => {
            shopSystem.buyWeapon(weapon.id);
          });
        }
        break;
      }
    }
  }

  private async preloadSVGAssets(): Promise<void> {
    // Wrap SVG content in proper SVG tags
    const wrapSVG = (content: string, viewBox: string = "0 0 24 30") =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`;

    try {
      // Preload player
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createPlayerSVG()), 'player');

      // Preload all enemy types
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'slime');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createGoblinSVG()), 'goblin');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'skeleton');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'orc');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'dragon');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createWolfSVG()), 'wolf');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'rat');

      // Preload projectiles
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createBulletSVG(), "0 0 6 6"), 'bullet');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createMagicBoltSVG(), "0 0 8 8"), 'magic-bolt');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createFireBallSVG(), "0 0 10 10"), 'fireball');
      await this.renderer.preloadSVG(wrapSVG(SVGArt.createPlasmaBoltSVG(), "0 0 10 10"), 'plasma');

      this.svgsLoaded = true;
    } catch (error) {
      console.error('Failed to preload SVG assets:', error);
      throw error; // No fallbacks - game must have SVG assets
    }
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
    // Handle shop input
    if (this.shopOpen) {
      this.handleShopInput();
      return; // Don't update game when shop is open
    }

    // Handle weapon switching with number keys
    this.handleWeaponSwitching();

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

      // Enemy attack player (but not if player is dashing)
      if (enemy.canAttack() && !this.player.isDashing) {
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
        // Enemy projectiles hit player (but not if dashing)
        if (this.player.alive && !this.player.isDashing && proj.checkCollision(this.player.x, this.player.y, this.player.size)) {
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

  private spawnPlayerProjectile(angle: number, spread: number = 0, isDashShot: boolean = false): void {
    const spawn = this.player.getProjectileSpawn();
    const actualAngle = angle + spread;

    // Dash shot bonuses
    const damageMultiplier = isDashShot ? 2.0 : 1.0;
    const speedMultiplier = isDashShot ? 1.5 : 1.0;
    const color = isDashShot ? '#00FFFF' : '#FFD700'; // Cyan for dash shots
    const size = isDashShot ? 6 : 4;

    const projectile = new Projectile(
      spawn.x,
      spawn.y,
      actualAngle,
      this.player.getProjectileSpeed() * speedMultiplier,
      this.player.getAttackDamage() * damageMultiplier,
      this.player.id,
      'player',
      this.player.getAttackRange() * (isDashShot ? 1.3 : 1.0),
      color
    );

    projectile.size = size;

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

    // Handle dash input (Shift key)
    if ((this.input.isKeyPressed('shift') || this.input.isKeyPressed('shiftleft') || this.input.isKeyPressed('shiftright')) &&
        (movement.x !== 0 || movement.y !== 0)) {
      if (this.player.canDash()) {
        this.player.dash(movement.x, movement.y);
      }
    }

    if (movement.x !== 0 || movement.y !== 0) {
      // Calculate new position (considering dash speed)
      const speed = this.player.isDashing ? this.player.stats.speed * 3 : this.player.stats.speed;
      const dx = this.player.isDashing ? this.player.dashDirection.x : movement.x;
      const dy = this.player.isDashing ? this.player.dashDirection.y : movement.y;

      const newX = this.player.x + dx * speed * deltaTime;
      const newY = this.player.y + dy * speed * deltaTime;

      // Check collision with map (dashing can go through slightly)
      if (this.mapSystem.canMoveTo(newX, newY, this.player.size)) {
        this.player.move(dx, dy, deltaTime);
      } else if (!this.player.isDashing) {
        // Try moving in just X or Y (only if not dashing)
        if (this.mapSystem.canMoveTo(newX, this.player.y, this.player.size)) {
          this.player.move(movement.x, 0, deltaTime);
        } else if (this.mapSystem.canMoveTo(this.player.x, newY, this.player.size)) {
          this.player.move(0, movement.y, deltaTime);
        }
      }
    } else if (this.player.isDashing) {
      // Continue dashing even if no input
      const dashSpeed = this.player.stats.speed * 3;
      const newX = this.player.x + this.player.dashDirection.x * dashSpeed * deltaTime;
      const newY = this.player.y + this.player.dashDirection.y * dashSpeed * deltaTime;

      if (this.mapSystem.canMoveTo(newX, newY, this.player.size)) {
        this.player.move(this.player.dashDirection.x, this.player.dashDirection.y, deltaTime);
      }
    }
  }

  private handlePlayerAttack(deltaTime: number): void {
    // Attack with spacebar or left mouse
    if (this.input.isKeyPressed(' ') || this.input.isMouseButtonPressed(0)) {
      if (this.player.canAttack()) {
        this.player.attack();

        const isDashShot = this.player.isDashing;

        if (this.player.isRangedWeapon()) {
          // Spawn projectile(s)
          let pelletCount = this.player.getPelletCount();
          const spreadAngle = this.player.getSpread();

          // Dash shot bonus: +2 extra pellets for shotguns, or triple shot for single-shot weapons
          if (isDashShot) {
            if (pelletCount > 1) {
              pelletCount += 2; // Shotguns get 2 more pellets
            } else {
              pelletCount = 3; // Single-shot weapons fire 3 projectiles
            }
          }

          for (let i = 0; i < pelletCount; i++) {
            let spread = 0;
            if (pelletCount > 1) {
              // Spread pellets in a cone
              spread = (Math.random() - 0.5) * spreadAngle;
            }
            this.spawnPlayerProjectile(this.player.facingAngle, spread, isDashShot);
          }
        } else {
          // Melee attack - check if attack hits any enemies
          const hitbox = this.player.getAttackHitbox();
          const damageMultiplier = isDashShot ? 2.5 : 1.0; // Dash melee bonus

          for (const enemy of this.enemies) {
            if (!enemy.alive) continue;

            const dx = enemy.x - hitbox.x;
            const dy = enemy.y - hitbox.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= hitbox.radius + enemy.size / 2) {
              enemy.takeDamage(this.player.getAttackDamage() * damageMultiplier);
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
        this.openShop();
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

    // Render shop if open
    if (this.shopOpen) {
      this.renderShop();
      return;
    }

    // Render corpses
    for (const corpse of this.corpses) {
      const opacity = corpse.looted ? 0.3 : 0.6;
      const size = corpse.size;

      // Draw dark puddle
      this.renderer.drawCircle(corpse.x, corpse.y, size / 2, `rgba(60, 40, 30, ${opacity})`);

      // Draw skull symbol
      const skullColor = corpse.looted ? '#555' : '#999';
      this.renderer.drawText('💀', corpse.x, corpse.y + 4, skullColor, 16, 'center');
    }

    // Render enemies
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      // Render enemy sprite without rotation
      const spriteKey = enemy.enemyData.id;
      const spriteSize = enemy.size * 1.5;
      this.renderer.drawCachedSVG(spriteKey, enemy.x, enemy.y, spriteSize, spriteSize, 0);

      // Draw weapon indicator for ranged enemies
      if (enemy.isRangedWeapon()) {
        const gunLength = 15;
        const endX = enemy.x + Math.cos(enemy.facingAngle) * gunLength;
        const endY = enemy.y + Math.sin(enemy.facingAngle) * gunLength;
        this.renderer.drawLine(enemy.x, enemy.y, endX, endY, '#FF5722', 3);
        // Draw muzzle
        this.renderer.drawCircle(endX, endY, 2, '#FFD700');
      }

      // Draw health bar
      this.drawHealthBar(enemy.x, enemy.y - enemy.size, enemy.stats.health, enemy.stats.maxHealth);
    }

    // Render projectiles
    for (const proj of this.projectiles) {
      // Render projectile with glowing effect
      const projSize = proj.size * 3;
      const angle = Math.atan2(proj.vy, proj.vx);

      // Draw glow
      this.renderer.drawCircle(proj.x, proj.y, projSize, 'rgba(255, 215, 0, 0.3)');
      // Draw bullet
      this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);

      // Draw trail
      const trailLength = 15;
      const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
      const normalizedVx = proj.vx / speed;
      const normalizedVy = proj.vy / speed;
      const trailX = proj.x - normalizedVx * trailLength;
      const trailY = proj.y - normalizedVy * trailLength;
      this.renderer.drawLine(trailX, trailY, proj.x, proj.y, proj.color, 3);
    }

    // Draw dash trail effect
    if (this.player.isDashing) {
      for (let i = 1; i <= 5; i++) {
        const trailX = this.player.x - this.player.dashDirection.x * i * 10;
        const trailY = this.player.y - this.player.dashDirection.y * i * 10;
        const opacity = (6 - i) * 0.15;
        this.renderer.drawCircle(trailX, trailY, this.player.size / 2, `rgba(76, 175, 80, ${opacity})`);
      }
    }

    // Render player without rotation
    const playerSize = this.player.size * 1.5;
    this.renderer.drawCachedSVG('player', this.player.x, this.player.y, playerSize, playerSize, 0);

    // Draw glow effect when dashing
    if (this.player.isDashing) {
      this.renderer.drawCircle(this.player.x, this.player.y, playerSize * 0.8, 'rgba(76, 175, 80, 0.4)');
    }

    // Draw weapon indicator
    if (this.player.isRangedWeapon()) {
      const gunLength = 18;
      const endX = this.player.x + Math.cos(this.player.facingAngle) * gunLength;
      const endY = this.player.y + Math.sin(this.player.facingAngle) * gunLength;
      this.renderer.drawLine(this.player.x, this.player.y, endX, endY, '#FFD700', 4);
      // Draw muzzle
      this.renderer.drawCircle(endX, endY, 2.5, '#FF5722');
    } else {
      // Draw melee weapon indicator
      const angle = this.player.facingAngle;
      const indicatorLength = this.player.size / 2 + 10;
      const endX = this.player.x + Math.cos(angle) * indicatorLength;
      const endY = this.player.y + Math.sin(angle) * indicatorLength;
      this.renderer.drawLine(this.player.x, this.player.y, endX, endY, '#E0E0E0', 4);
      this.renderer.drawCircle(endX, endY, 3, '#FFF');
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
        const worldX = x * map.tileSize;
        const worldY = y * map.tileSize;
        const size = map.tileSize;

        // Render tiles with enhanced graphics
        if (tileType === 0) { // FLOOR
          // Base floor
          this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

          // Add stone texture pattern
          const seed = x * 7 + y * 13; // Pseudo-random based on position
          if (seed % 5 === 0) {
            this.renderer.drawCircle(worldX + size * 0.3, worldY + size * 0.3, 1, 'rgba(255, 255, 255, 0.05)');
          }
          if (seed % 7 === 0) {
            this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.6, 1.5, 'rgba(0, 0, 0, 0.1)');
          }

          // Tile lines
          this.renderer.drawLine(worldX, worldY, worldX + size, worldY, '#0a0a0a', 1);
          this.renderer.drawLine(worldX, worldY, worldX, worldY + size, '#0a0a0a', 1);

        } else if (tileType === 1) { // WALL
          // Base wall with gradient effect
          this.renderer.drawRect(worldX, worldY, size, size, '#3a3a3a');

          // Top highlight (3D effect)
          this.renderer.drawRect(worldX, worldY, size, size * 0.2, 'rgba(70, 70, 70, 0.8)');

          // Bottom shadow
          this.renderer.drawRect(worldX, worldY + size * 0.8, size, size * 0.2, 'rgba(20, 20, 20, 0.8)');

          // Brick pattern
          const brickWidth = size / 2;
          const brickHeight = size / 3;
          const offsetX = y % 2 === 0 ? 0 : brickWidth / 2;

          for (let by = 0; by < 3; by++) {
            for (let bx = 0; bx < 2; bx++) {
              const brickX = worldX + bx * brickWidth + offsetX;
              const brickY = worldY + by * brickHeight;

              // Only draw if brick is within tile
              if (brickX >= worldX && brickX + brickWidth <= worldX + size) {
                this.renderer.drawLine(brickX, brickY, brickX + brickWidth, brickY, '#2a2a2a', 0.5);
                this.renderer.drawLine(brickX, brickY, brickX, brickY + brickHeight, '#2a2a2a', 0.5);
              }
            }
          }

          // Border
          this.renderer.drawLine(worldX + size, worldY, worldX + size, worldY + size, '#1a1a1a', 2);
          this.renderer.drawLine(worldX, worldY + size, worldX + size, worldY + size, '#1a1a1a', 2);

        } else if (tileType === 2) { // DOOR
          this.renderer.drawRect(worldX, worldY, size, size, '#654321');
          this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.1, size * 0.6, size * 0.8, '#8b6f47');
          this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.5, 2, '#FFD700');

        } else if (tileType === 3) { // COOKING_STATION
          this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
          this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#ff6b35');
          this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.2, '#ff9f5e');

        } else if (tileType === 4) { // SHOP
          this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
          this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#4ecdc4');
          this.renderer.drawText('$', worldX + size / 2, worldY + size / 2 + 5, '#FFD700', 16, 'center');

        } else if (tileType === 5) { // EXPEDITION_PORTAL
          this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
          this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#9b59b6');
          this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bb79d6');
          this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#e0aaff');

        } else {
          // Default
          const color = this.mapSystem.getTileColor(tileType);
          this.renderer.drawRect(worldX, worldY, size, size, color);
        }
      }
    }
  }

  private renderUI(): void {
    const canvas = this.renderer.getCanvas();

    // Draw player stats (top-left)
    this.renderer.drawUIRectWithBorder(10, 10, 300, 150, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);

    this.renderer.drawUIText(`HP: ${this.player.stats.health}/${this.player.stats.maxHealth}`, 20, 35, '#fff', 18);
    this.renderer.drawUIText(`Gold: ${this.player.gold}`, 20, 60, '#FFD700', 18);
    this.renderer.drawUIText(`ATK: ${this.player.getAttackDamage()} | DEF: ${this.player.getTotalDefense()}`, 20, 85, '#fff', 16);

    const weaponName = this.player.weapon?.name || 'Fists';
    const weaponType = this.player.isRangedWeapon() ? '🔫' : '⚔️';
    this.renderer.drawUIText(`${weaponType} ${weaponName}`, 20, 110, '#FFD700', 16);

    // Dash cooldown indicator
    const dashCooldownPercent = Math.max(0, this.player.dashCooldown / 1.0);
    const dashColor = this.player.canDash() ? '#4CAF50' : '#666';
    this.renderer.drawUIText('💨 Dash:', 20, 135, dashColor, 14);
    // Dash cooldown bar
    const dashBarWidth = 80;
    this.renderer.drawUIRect(100, 123, dashBarWidth, 14, '#222');
    if (!this.player.canDash()) {
      const fillWidth = dashBarWidth * (1 - dashCooldownPercent);
      this.renderer.drawUIRect(100, 123, fillWidth, 14, '#4CAF50');
    } else {
      this.renderer.drawUIRect(100, 123, dashBarWidth, 14, '#4CAF50');
    }

    // Draw mode indicator
    this.renderer.drawUIText(this.mode === 'base' ? 'BASE CAMP' : 'EXPEDITION', canvas.width / 2, 30, '#fff', 24, 'center');

    // Draw controls (bottom-left)
    this.renderer.drawUIRectWithBorder(10, canvas.height - 195, 380, 185, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
    this.renderer.drawUIText('WASD/Arrows: Move', 20, canvas.height - 170, '#fff', 14);
    this.renderer.drawUIText('Shift: Dash (dodge)', 20, canvas.height - 150, '#4CAF50', 14);
    this.renderer.drawUIText('Space/Click: Attack', 20, canvas.height - 130, '#fff', 14);
    this.renderer.drawUIText('Dash + Shoot: SUPER SHOT! 💥', 20, canvas.height - 110, '#00FFFF', 14);
    this.renderer.drawUIText('  (2x DMG, 3x bullets, faster!)', 20, canvas.height - 95, '#00FFFF', 12);
    this.renderer.drawUIText('1-9: Switch weapons', 20, canvas.height - 75, '#FFD700', 14);
    this.renderer.drawUIText('E: Interact | F: Loot', 20, canvas.height - 55, '#fff', 14);
    this.renderer.drawUIText('🎯 Aim: Mouse/Movement', 20, canvas.height - 35, '#fff', 14);

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

  private renderShop(): void {
    const canvas = this.renderer.getCanvas();

    // Darken background
    this.renderer.drawUIRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.7)');

    // Shop panel
    const panelWidth = 700;
    const panelHeight = 600;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;

    this.renderer.drawUIRectWithBorder(panelX, panelY, panelWidth, panelHeight, 'rgba(20, 20, 20, 0.95)', '#4CAF50', 3);

    // Title
    this.renderer.drawUIText('WEAPON SHOP', canvas.width / 2, panelY + 40, '#4CAF50', 32, 'center');

    // Gold
    this.renderer.drawUIText(`Gold: ${this.player.gold}`, canvas.width / 2, panelY + 75, '#FFD700', 20, 'center');

    // Weapons list
    let yPos = panelY + 110;
    this.availableWeapons.slice(0, 8).forEach((weapon, i) => {
      const type = weapon.weaponType === 'ranged' ? '🔫' : '⚔️';
      const canAfford = this.player.gold >= weapon.cost;
      const color = canAfford ? '#fff' : '#666';
      const rarityColor = weapon.rarity === 'legendary' ? '#FF6B00' :
                         weapon.rarity === 'rare' ? '#9C27B0' :
                         weapon.rarity === 'uncommon' ? '#2196F3' : '#888';

      // Weapon box
      this.renderer.drawUIRectWithBorder(
        panelX + 20,
        yPos,
        panelWidth - 40,
        55,
        canAfford ? 'rgba(50, 50, 50, 0.8)' : 'rgba(30, 30, 30, 0.5)',
        rarityColor,
        2
      );

      // Number key
      this.renderer.drawUIText(`[${i + 1}]`, panelX + 40, yPos + 20, '#FFD700', 18);

      // Weapon name and type
      this.renderer.drawUIText(`${type} ${weapon.name}`, panelX + 80, yPos + 20, color, 18);

      // Stats
      const stats = `DMG: ${weapon.damage} | SPD: ${weapon.attackSpeed.toFixed(1)}s | RNG: ${weapon.range}`;
      this.renderer.drawUIText(stats, panelX + 80, yPos + 40, color, 14);

      // Price
      this.renderer.drawUIText(`${weapon.cost}g`, panelX + panelWidth - 80, yPos + 30, canAfford ? '#FFD700' : '#666', 20, 'right');

      yPos += 60;
    });

    // Instructions
    this.renderer.drawUIText('Press number key to buy weapon | ESC to close', canvas.width / 2, panelY + panelHeight - 30, '#aaa', 16, 'center');

    // Current weapon
    const currentWeapon = this.player.weapon;
    if (currentWeapon) {
      this.renderer.drawUIText(`Equipped: ${currentWeapon.name}`, canvas.width / 2, panelY + panelHeight - 60, '#4CAF50', 16, 'center');
    }
  }
}
