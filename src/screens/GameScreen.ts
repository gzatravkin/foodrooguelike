/**
 * GameScreen - Main gameplay screen with 2D top-view roguelike combat
 * Now with projectiles, weapons, and corpse looting!
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { InputManager } from '../core/InputManager';
import { MapSystem, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Corpse } from '../entities/Corpse';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { Enemy as EnemyData } from '../entities/types';
import * as SVGArt from '../rendering/SVGArt';
import { GameScreenRenderer } from './GameScreenRenderer';
import { CombatSystem } from './CombatSystem';
import { InputHandler } from './InputHandler';
import { ShopManager } from './ShopManager';

export type GameMode = 'base' | 'expedition';

export class GameScreen {
  private renderer: GameScreenRenderer;
  private input: InputManager;
  private mapSystem: MapSystem;
  private player: Player;
  private enemies: Enemy[] = [];
  private combatSystem: CombatSystem;
  private inputHandler: InputHandler;
  private shopManager: ShopManager;
  private mode: GameMode = 'base';
  private showInteractionPrompt: boolean = false;
  private interactionPromptText: string = '';
  private nearbyCorpse: Corpse | null = null;
  private svgsLoaded: boolean = false;

  constructor(
    renderer: CanvasRenderer,
    input: InputManager
  ) {
    this.renderer = new GameScreenRenderer(renderer);
    this.input = input;
    this.mapSystem = new MapSystem();
    this.combatSystem = new CombatSystem(this.mapSystem);
    this.inputHandler = new InputHandler(input, this.mapSystem, this.combatSystem);
    this.shopManager = new ShopManager(input);

    const startingWeapon = entityFactory.createWeapon('pistol');
    this.player = new Player(320, 240, startingWeapon || undefined);

    this.loadBaseCamp();
    this.preloadSVGAssets();
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

  private async preloadSVGAssets(): Promise<void> {
    const wrapSVG = (content: string, viewBox: string = "0 0 24 30") =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`;
    const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;

    try {
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlayerSVG()), 'player');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'slime');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createGoblinSVG()), 'goblin');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'skeleton');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'orc');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'dragon');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createWolfSVG()), 'wolf');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'rat');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createBulletSVG(), "0 0 6 6"), 'bullet');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createMagicBoltSVG(), "0 0 8 8"), 'magic-bolt');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createFireBallSVG(), "0 0 10 10"), 'fireball');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlasmaBoltSVG(), "0 0 10 10"), 'plasma');
      this.svgsLoaded = true;
    } catch (error) {
      console.error('Failed to preload SVG assets:', error);
      throw error;
    }
  }

  loadBaseCamp(): void {
    this.mode = 'base';
    const baseCamp = MapSystem.createBaseCamp();
    this.mapSystem.loadMap(baseCamp);

    this.player.x = 320;
    this.player.y = 240;

    this.enemies = [];
    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();
  }

  loadExpedition(level: number = 1): void {
    this.mode = 'expedition';
    const dungeon = MapSystem.createDungeon(level);
    this.mapSystem.loadMap(dungeon);

    this.player.x = 3 * 32 + 16;
    this.player.y = 3 * 32 + 16;

    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();

    this.spawnEnemies(level);
  }

  private spawnEnemies(level: number): void {
    this.enemies = [];

    const allEnemies = entityFactory.getAllOfType('enemy') as EnemyData[];
    const levelEnemies = allEnemies.filter((e: EnemyData) => {
      if (level === 1) return e.goldReward <= 15;
      if (level === 2) return e.goldReward > 15 && e.goldReward <= 40;
      if (level === 3) return e.goldReward > 40 && e.goldReward <= 100;
      return e.goldReward > 100;
    });

    if (levelEnemies.length === 0) return;

    const numEnemies = 5 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numEnemies; i++) {
      const enemyData = levelEnemies[Math.floor(Math.random() * levelEnemies.length)];
      const position = this.findValidEnemyPosition();

      if (position) {
        const weaponId = enemyData.weaponId;
        const weapon = weaponId ? entityFactory.createWeapon(weaponId) : null;
        this.enemies.push(new Enemy(position.x, position.y, enemyData, weapon));
      }
    }
  }

  private findValidEnemyPosition(): { x: number; y: number } | null {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return null;

    for (let attempts = 0; attempts < 100; attempts++) {
      const x = (2 + Math.floor(Math.random() * (map.width - 4))) * map.tileSize + map.tileSize / 2;
      const y = (2 + Math.floor(Math.random() * (map.height - 4))) * map.tileSize + map.tileSize / 2;

      const distFromPlayer = Math.sqrt((x - this.player.x) ** 2 + (y - this.player.y) ** 2);
      if (this.mapSystem.canMoveTo(x, y) && distFromPlayer > 150) {
        return { x, y };
      }
    }

    return null;
  }

  update(deltaTime: number): void {
    if (this.shopManager.isShopOpen()) {
      this.shopManager.handleShopInput(this.player);
      return;
    }

    this.inputHandler.handleWeaponSwitching(this.player);
    this.inputHandler.handlePlayerMovement(this.player, deltaTime);
    this.inputHandler.handlePlayerAttack(this.player, this.enemies, deltaTime);
    this.player.update(deltaTime);

    this.updateEnemies(deltaTime);
    this.combatSystem.updateProjectiles(deltaTime, this.enemies, this.player);
    this.combatSystem.updateCorpses(deltaTime);
    this.handleDeadEnemies();
    this.checkInteractions();
    this.updateCamera();

    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    this.inputHandler.update();
  }

  private updateEnemies(deltaTime: number): void {
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      enemy.updateAI(
        this.player.x,
        this.player.y,
        deltaTime,
        (x, y) => this.mapSystem.canMoveTo(x, y, enemy.size)
      );
      enemy.update(deltaTime);

      if (enemy.canAttack() && !this.player.isDashing) {
        if (enemy.isRangedWeapon()) {
          this.combatSystem.spawnEnemyProjectile(enemy);
          enemy.attackCooldown = enemy.weapon!.attackSpeed;
        } else {
          const distance = enemy.getDistanceTo(this.player);
          if (distance <= enemy.getAttackRange()) {
            this.player.takeDamage(enemy.getAttackDamage());
            enemy.attackCooldown = enemy.weapon?.attackSpeed || 1.0;
          }
        }
      }
    }
  }

  private handleDeadEnemies(): void {
    this.enemies = this.enemies.filter(enemy => {
      if (!enemy.alive) {
        const loot = enemy.getLoot();
        this.combatSystem.addCorpse(new Corpse(
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
  }

  private checkInteractions(): void {
    this.showInteractionPrompt = false;
    this.nearbyCorpse = null;

    this.nearbyCorpse = this.combatSystem.findNearbyCorpse(this.player.x, this.player.y);
    if (this.nearbyCorpse) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = `Press F to loot ${this.nearbyCorpse.enemyName}`;

      if (this.input.isKeyJustPressed('f')) {
        const loot = this.nearbyCorpse.lootCorpse();
        if (loot) {
          this.player.gold += loot.gold;
          for (const ingredient of loot.ingredients) {
            gameState.addToInventory(ingredient);
          }
        }
      }
      return;
    }

    this.checkTileInteractions();
  }

  private checkTileInteractions(): void {
    const tile = this.mapSystem.getTileAt(this.player.x, this.player.y);

    if (tile === TileType.COOKING_STATION) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Cook';

      if (this.input.isKeyJustPressed('e')) {
        console.log('Opening cooking menu...');
      }
    } else if (tile === TileType.SHOP) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = 'Press E to Shop';

      if (this.input.isKeyJustPressed('e')) {
        this.shopManager.openShop();
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
    const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;
    const canvas = canvasRenderer.getCanvas();

    const cameraX = this.player.x - canvas.width / 2;
    const cameraY = this.player.y - canvas.height / 2;

    this.renderer.setCamera(cameraX, cameraY);
  }

  private handlePlayerDeath(): void {
    this.player.alive = true;
    this.player.stats.health = this.player.stats.maxHealth;
    this.player.gold = Math.floor(this.player.gold * 0.5);
    this.loadBaseCamp();
  }

  render(): void {
    this.renderer.clear();
    this.renderer.renderMap(this.mapSystem.getCurrentMap());

    if (this.shopManager.isShopOpen()) {
      this.renderer.renderShop(
        this.shopManager.getAvailableWeapons(),
        this.player.gold,
        this.player.weapon
      );
      return;
    }

    this.renderer.renderCorpses(this.combatSystem.getCorpses());
    this.renderer.renderEnemies(this.enemies);
    this.renderer.renderProjectiles(this.combatSystem.getProjectiles());
    this.renderer.renderPlayer(this.player);
    this.renderer.renderUI(
      this.player,
      this.mode,
      this.enemies,
      this.combatSystem.getCorpses(),
      this.showInteractionPrompt,
      this.interactionPromptText
    );
  }
}
