/**
 * GameScene - Main gameplay scene using Phaser 3
 */

import Phaser from 'phaser';
import { PhaserPlayer } from '../entities/PhaserPlayer';
import { PhaserEnemy } from '../entities/PhaserEnemy';
import { PhaserProjectile } from '../entities/PhaserProjectile';
import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { entityFactory } from '../entities/EntityFactory';
import { MapSystem } from '../systems/MapSystem';
import { TileRegistry } from '../plugins/tiles/TileRegistry';
import { TileTypeMapper } from '../plugins/TileTypeMapper';
import { InteractionSystem } from '../systems/InteractionSystem';

export class GameScene extends Phaser.Scene {
  private player!: PhaserPlayer;
  private enemies: PhaserEnemy[] = [];
  private projectiles: PhaserProjectile[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private mapSystem: MapSystem;
  private interactionSystem: InteractionSystem;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private tileLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'GameScene' });
    this.mapSystem = new MapSystem();
    this.interactionSystem = new InteractionSystem();
  }

  create(): void {
    console.log('GameScene created');

    // Create tilemap from MapSystem
    this.createTilemap();

    // Create player
    const initialState = gameState.getState();
    const weaponId = initialState.combatWeapon || 'fists';
    const startingWeapon = entityFactory.createWeapon(weaponId);

    // Get spawn position from map
    const map = this.mapSystem.getCurrentMap();
    const spawnX = map ? (map.width / 2) * map.tileSize : 400;
    const spawnY = map ? (map.height / 2) * map.tileSize : 300;

    this.player = new PhaserPlayer(this, spawnX, spawnY, 'player', startingWeapon || undefined);

    // Setup camera to follow player
    this.cameras.main.startFollow(this.player);
    if (map) {
      this.cameras.main.setBounds(0, 0, map.width * map.tileSize, map.height * map.tileSize);
      this.physics.world.setBounds(0, 0, map.width * map.tileSize, map.height * map.tileSize);
    }

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Setup mouse input for shooting
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handlePlayerAttack(pointer);
    });

    // Setup keyboard shortcuts
    this.input.keyboard!.on('keydown-ESC', () => {
      const currentScreen = gameState.getState().currentScreen;
      if (currentScreen === 'game') {
        gameState.setScreen('menu');
      } else {
        gameState.setScreen('game');
      }
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.handlePlayerDash();
    });

    this.input.keyboard!.on('keydown-E', () => {
      this.handleInteraction();
    });

    // Spawn some test enemies
    this.spawnTestEnemies();

    // Listen to screen changes
    eventBus.on('screen:changed', this.handleScreenChange.bind(this));
  }

  private createTilemap(): void {
    // Generate a base camp map using MapSystem
    const gameMap = MapSystem.createBaseCamp();
    this.mapSystem.loadMap(gameMap);

    // Create Phaser tilemap
    this.tilemap = this.make.tilemap({
      width: gameMap.width,
      height: gameMap.height,
      tileWidth: gameMap.tileSize,
      tileHeight: gameMap.tileSize,
    });

    // Add the tileset image we generated in PreloadScene
    const tileset = this.tilemap.addTilesetImage('tileset', 'tileset', gameMap.tileSize, gameMap.tileSize, 0, 0);
    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    // Create tile layer
    this.tileLayer = this.tilemap.createBlankLayer('layer1', tileset)!;

    // Populate tilemap from MapSystem data
    for (let y = 0; y < gameMap.height; y++) {
      for (let x = 0; x < gameMap.width; x++) {
        const tileType = gameMap.tiles[y][x];

        // Get tile ID from tile type
        const tileId = TileTypeMapper.getTileIdFromType(tileType);

        // Get tile index for the tileset
        const tileIndex = tileId ? TileRegistry.getTileIndex(tileId) : 0;

        // Set tile in Phaser tilemap
        this.tileLayer.putTileAt(tileIndex, x, y);
      }
    }

    // Set up collision for non-walkable tiles
    for (let y = 0; y < gameMap.height; y++) {
      for (let x = 0; x < gameMap.width; x++) {
        const tileType = gameMap.tiles[y][x];
        if (!this.mapSystem.isTileWalkable(tileType)) {
          const tile = this.tileLayer.getTileAt(x, y);
          if (tile) {
            tile.setCollision(true, true, true, true);
          }
        }
      }
    }
  }

  private spawnTestEnemies(): void {
    // Spawn a few test enemies
    for (let i = 0; i < 5; i++) {
      const map = this.mapSystem.getCurrentMap();
      if (!map) continue;

      // Find a random walkable position
      let x = 0;
      let y = 0;
      let attempts = 0;
      do {
        x = Phaser.Math.Between(2, map.width - 2) * map.tileSize;
        y = Phaser.Math.Between(2, map.height - 2) * map.tileSize;
        attempts++;
      } while (!this.mapSystem.canMoveTo(x, y) && attempts < 100);

      if (attempts >= 100) continue; // Couldn't find a valid spawn

      const enemy = new PhaserEnemy(
        this,
        x,
        y,
        'slime',
        'slime',
        {
          maxHealth: 50,
          attack: 5,
          defense: 2,
          speed: 80,
          gold: 10,
          behavior: 'aggressive',
        }
      );

      this.enemies.push(enemy);

      // Setup collision between player and enemy
      this.physics.add.overlap(
        this.player,
        enemy,
        () => this.handlePlayerEnemyCollision(enemy),
        undefined,
        this
      );
    }
  }

  private handlePlayerAttack(pointer: Phaser.Input.Pointer): void {
    if (this.player.attackCooldown > 0) {
      return;
    }

    const weapon = this.player.weapon;
    if (!weapon) {
      return;
    }

    // Calculate angle to mouse
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      worldPoint.x,
      worldPoint.y
    );

    this.player.facingAngle = angle;

    // Create projectile
    const projectile = new PhaserProjectile(
      this,
      this.player.x,
      this.player.y,
      'bullet', // Use texture based on weapon type
      angle,
      weapon.projectileSpeed || 400,
      this.player.attack + (weapon.damage || 0),
      'player'
    );

    this.projectiles.push(projectile);

    // Set attack cooldown
    this.player.attackCooldown = weapon.attackSpeed || 0.5;

    // Setup collision between projectile and enemies
    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(
        projectile,
        enemy,
        () => this.handleProjectileEnemyCollision(projectile, enemy),
        undefined,
        this
      );
    });
  }

  private handlePlayerDash(): void {
    if (this.player.dashCharges <= 0 || this.player.isDashing) {
      return;
    }

    // Get movement direction from input
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.wasdKeys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.wasdKeys.S.isDown) dy += 1;

    if (dx === 0 && dy === 0) {
      // Use facing direction if no input
      dx = Math.cos(this.player.facingAngle);
      dy = Math.sin(this.player.facingAngle);
    }

    // Normalize direction
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx /= length;
      dy /= length;
    }

    this.player.dashDirection = { x: dx, y: dy };
    this.player.dashDuration = 0.2;
    this.player.dashCharges -= 1;

    if (this.player.dashCharges === 0) {
      const baseCooldown = 3.0;
      this.player.dashCooldown = baseCooldown * (1 - this.player.dashCooldownReduction);
    }
  }

  private handleInteraction(): void {
    // We're always in base mode for now (base camp)
    const mode = 'base';

    // Handle the interaction
    const handled = this.interactionSystem.handleInteraction(
      this.player,
      this.mapSystem,
      mode,
      (text: string, color: string) => {
        console.log(`[${color}] ${text}`);
      }
    );

    if (!handled) {
      console.log('Nothing to interact with here');
    }
  }

  private handlePlayerEnemyCollision(enemy: PhaserEnemy): void {
    if (enemy.attackCooldown <= 0) {
      this.player.takeDamage(enemy.attack);
      enemy.attackCooldown = 1.0;

      // Flash player red
      this.player.setTint(0xff0000);
      this.time.delayedCall(100, () => {
        this.player.clearTint();
      });
    }
  }

  private handleProjectileEnemyCollision(projectile: PhaserProjectile, enemy: PhaserEnemy): void {
    if (projectile.owner !== 'player') {
      return;
    }

    const died = enemy.takeDamage(projectile.damage);

    if (died) {
      // Remove enemy
      const index = this.enemies.indexOf(enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
      enemy.destroy();

      // Award gold
      this.player.gold += enemy.gold;
      gameState.addGold(enemy.gold);
    } else {
      // Flash enemy
      enemy.setTint(0xff0000);
      this.time.delayedCall(100, () => {
        enemy.clearTint();
      });
    }

    // Destroy projectile
    const index = this.projectiles.indexOf(projectile);
    if (index > -1) {
      this.projectiles.splice(index, 1);
    }
    projectile.destroy();
  }

  private handleScreenChange(screenName: string): void {
    // Pause scene when UI screens are active
    if (screenName !== 'game') {
      this.scene.pause();
    } else {
      this.scene.resume();
    }
  }

  update(time: number, delta: number): void {
    const deltaTime = delta / 1000; // Convert to seconds

    // Update player
    this.player.update(deltaTime);
    this.handlePlayerMovement(deltaTime);

    // Update enemies
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime, this.player.x, this.player.y);
    });

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      const shouldDestroy = projectile.update(deltaTime);

      if (shouldDestroy) {
        this.projectiles.splice(i, 1);
        projectile.destroy();
      }
    }
  }

  private handlePlayerMovement(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    // Handle keyboard input
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.wasdKeys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.wasdKeys.S.isDown) dy += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    let speed = this.player.moveSpeed;

    // Apply dash
    if (this.player.isDashing) {
      dx = this.player.dashDirection.x;
      dy = this.player.dashDirection.y;
      speed *= 3.0 * (1 + this.player.dashDistanceBonus);
    }
    // Apply slow after dash
    else if (this.player.slowedDuration > 0) {
      speed *= this.player.slowMultiplier;
    }

    // Set player velocity
    this.player.setVelocity(dx * speed, dy * speed);

    // Update facing angle based on mouse position
    const pointer = this.input.activePointer;
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    this.player.facingAngle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      worldPoint.x,
      worldPoint.y
    );
  }
}
