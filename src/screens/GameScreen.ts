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
import { Trap } from '../entities/Trap';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { Enemy as EnemyData } from '../entities/types';
import * as SVGArt from '../rendering/SVGArt';
import { GameScreenRenderer } from './GameScreenRenderer';
import { CombatSystem } from './CombatSystem';
import { InputHandler } from './InputHandler';
import { SpawnManager } from './SpawnManager';
import { GameScreenUpdater } from './GameScreenUpdater';
import { CheatPanel } from '../ui/CheatPanel';
import { ParticleSystem } from '../entities/Particle';
import { MobileControls } from '../ui/MobileControls';

export type GameMode = 'base' | 'expedition';

export class GameScreen {
  private renderer: GameScreenRenderer;
  private input: InputManager;
  private mapSystem: MapSystem;
  private player: Player;
  private enemies: Enemy[] = [];
  private traps: Trap[] = [];
  private combatSystem: CombatSystem;
  private inputHandler: InputHandler;
  private spawnManager: SpawnManager;
  private updater: GameScreenUpdater;
  private cheatPanel: CheatPanel;
  private particleSystem: ParticleSystem;
  private mobileControls: MobileControls | null = null;
  private mode: GameMode = 'base';
  private showInteractionPrompt: boolean = false;
  private interactionPromptText: string = '';
  private nearbyCorpse: Corpse | null = null;
  private svgsLoaded: boolean = false;
  private baseHealTimer: number = 0; // Timer for HP recovery at base
  private combatLog: Array<{text: string; timestamp: number; color: string}> = [];
  private readonly MAX_LOG_ENTRIES = 8;
  private readonly LOG_DURATION = 15000; // 15 seconds (increased from 5)

  constructor(
    renderer: CanvasRenderer,
    input: InputManager
  ) {
    this.renderer = new GameScreenRenderer(renderer);
    this.input = input;
    this.mapSystem = new MapSystem();
    this.combatSystem = new CombatSystem(this.mapSystem);
    this.spawnManager = new SpawnManager(this.mapSystem);
    this.inputHandler = new InputHandler(input, this.mapSystem, this.combatSystem);
    this.particleSystem = new ParticleSystem();
    this.updater = new GameScreenUpdater(this.mapSystem, this.combatSystem, this.particleSystem);
    this.inputHandler.setParticleSystem(this.particleSystem);
    this.combatSystem.setParticleSystem(this.particleSystem);
    this.cheatPanel = new CheatPanel({
      onRestartGame: () => this.restartGame(),
      onAddGold: (amount: number) => this.addGold(amount)
    });

    const startingWeapon = entityFactory.createWeapon('pistol');
    this.player = new Player(320, 240, startingWeapon || undefined);

    // Initialize mobile controls if on mobile device
    if (this.input.isMobileDevice()) {
      const canvas = renderer.getCanvas();
      this.mobileControls = new MobileControls(canvas);
    }

    this.loadBaseCamp();
    this.setupEventListeners();
    this.setupCheatPanelInput();

    // Add initial combat log entries
    this.addCombatLog('=== Food Roguelike ===', '#FFD700');
    this.addCombatLog('Press E on tiles to interact', '#90EE90');
    this.addCombatLog('Walk over expedition portal to start!', '#4FC3F7');
  }

  async init(): Promise<void> {
    await this.preloadSVGAssets();
  }

  private addCombatLog(text: string, color: string = '#FFF'): void {
    const entry = {
      text,
      timestamp: Date.now(),
      color
    };
    this.combatLog.unshift(entry);

    // Keep only the most recent entries
    if (this.combatLog.length > this.MAX_LOG_ENTRIES) {
      this.combatLog = this.combatLog.slice(0, this.MAX_LOG_ENTRIES);
    }

    // Debug logging
    console.log(`[Combat Log] ${text}`);
  }

  private updateCombatLog(): void {
    const now = Date.now();
    this.combatLog = this.combatLog.filter(entry => now - entry.timestamp < this.LOG_DURATION);
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

  private setupCheatPanelInput(): void {
    // Toggle cheat panel with backtick key
    window.addEventListener('keydown', (e) => {
      // ESC during expedition mode to flee back to base (check this FIRST)
      const currentScreen = gameState.getState().currentScreen;
      if (e.key === 'Escape' && this.mode === 'expedition' && currentScreen === 'game' && !this.cheatPanel.isVisible()) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Fleeing expedition, returning to base...');
        this.loadBaseCamp();
        return;
      }

      // Cheat panel toggle
      if (e.key === '`' || e.key === 'Dead') {
        e.preventDefault();
        this.cheatPanel.toggle();
        return;
      }

      // ESC to close cheat panel
      if (e.key === 'Escape' && this.cheatPanel.isVisible()) {
        e.preventDefault();
        this.cheatPanel.close();
        return;
      }
    });

    // Handle mouse clicks on cheat panel
    window.addEventListener('click', (e) => {
      if (this.cheatPanel.isVisible()) {
        const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;
        const canvas = canvasRenderer.getCanvas();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.cheatPanel.handleClick(mouseX, mouseY, canvas.width, canvas.height);
      }
    });
  }

  private restartGame(): void {
    // Reset player stats
    this.player.stats.health = this.player.stats.maxHealth;
    this.player.alive = true;

    // Return to base camp
    this.loadBaseCamp();

    console.log('Game restarted!');
  }

  private addGold(amount: number): void {
    gameState.addGold(amount);
    console.log(`Added ${amount} gold. Total: ${gameState.getState().gold}`);
  }

  private async preloadSVGAssets(): Promise<void> {
    const wrapSVG = (content: string, viewBox: string = "0 0 24 30") =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`;
    const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;

    try {
      // Player
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlayerSVG()), 'player');

      // All unique enemy sprites
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'slime');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createGoblinSVG()), 'goblin');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'skeleton');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'orc');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'dragon');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createWolfSVG()), 'wolf');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'rat');

      // Missing enemies - using appropriate sprites (some reuse existing)
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'bat'); // bat reuses rat
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'troll'); // troll reuses orc
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'spider'); // spider reuses slime
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'ice_golem'); // ice_golem reuses skeleton
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'fire_elemental'); // fire_elemental reuses dragon
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'giant_crab'); // giant_crab reuses orc
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'demon_lord'); // demon_lord reuses dragon

      // Projectile sprites
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createBulletSVG(), "0 0 6 6"), 'bullet');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createMagicBoltSVG(), "0 0 8 8"), 'magic-bolt');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createFireBallSVG(), "0 0 10 10"), 'fireball');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlasmaBoltSVG(), "0 0 10 10"), 'plasma');

      this.svgsLoaded = true;
      console.log('All SVG assets preloaded successfully');
    } catch (error) {
      console.error('Failed to preload SVG assets:', error);
      throw error;
    }
  }

  loadBaseCamp(): void {
    const wasExpedition = this.mode === 'expedition';
    this.mode = 'base';
    const baseCamp = MapSystem.createBaseCamp();
    this.mapSystem.loadMap(baseCamp);

    this.player.x = 320;
    this.player.y = 240;

    this.enemies = [];
    this.traps = [];
    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();
    this.baseHealTimer = 0;

    // Add log entry when returning from expedition
    if (wasExpedition) {
      this.addCombatLog('=== RETURNED TO BASE ===', '#90EE90');
      this.addCombatLog('You are safe now!', '#90EE90');
    }
  }

  loadExpedition(level: number = 1): void {
    this.mode = 'expedition';
    const dungeon = MapSystem.createDungeon(level);
    this.mapSystem.loadMap(dungeon);

    this.player.x = 3 * 32 + 16;
    this.player.y = 3 * 32 + 16;

    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();

    this.enemies = this.spawnManager.spawnEnemies(level, this.player);
    this.traps = this.spawnManager.spawnTraps(this.player);

    // Add log entries
    this.addCombatLog('=== EXPEDITION STARTED ===', '#FF6B6B');
    this.addCombatLog(`${this.enemies.length} enemies detected!`, '#FF6B6B');
    this.addCombatLog('Press ESC to flee anytime', '#FFD700');
  }


  update(deltaTime: number): void {
    // Update mobile controls state
    if (this.mobileControls) {
      const controlState = this.mobileControls.getState();
      this.input.setVirtualJoystick(controlState.joystick.x, controlState.joystick.y);
      this.input.setVirtualButton('attack', controlState.buttons.attack);
      this.input.setVirtualButton('dash', controlState.buttons.dash);
      this.input.setVirtualButton('interact', controlState.buttons.interact);
      this.input.setVirtualButton('loot', controlState.buttons.loot);
    }

    // Don't process game input if we're in a UI screen (cooking, shop, settings, etc.)
    const currentScreen = gameState.getState().currentScreen;
    const isUIScreen = ['cooking', 'shop', 'settings', 'recipebook'].includes(currentScreen);
    if (isUIScreen) {
      this.inputHandler.update();
      return;
    }

    this.inputHandler.handleWeaponSwitching(this.player);
    this.inputHandler.handlePlayerMovement(this.player, deltaTime);
    this.inputHandler.handlePlayerAttack(this.player, this.enemies, deltaTime);

    // Check for tile interactions (shop, expedition portal, cooking station)
    const tileInteraction = this.updater.checkTileInteractions(
      this.player,
      this.mode,
      this.mapSystem,
      () => gameState.setScreen('shop'),
      () => this.loadExpedition(1)
    );

    // Handle interact action (E key or virtual button)
    if (this.inputHandler.handleInteract()) {
      const tileType = this.mapSystem.getTileAt(this.player.x, this.player.y);
      if (this.mode === 'base' && tileType) {
        if (tileType === TileType.SHOP) {
          gameState.setScreen('shop');
        } else if (tileType === TileType.EXPEDITION_PORTAL) {
          this.loadExpedition(1);
        } else if (tileType === TileType.COOKING_STATION) {
          gameState.setScreen('cooking');
        }
      }
    }

    // Handle loot action
    if (this.inputHandler.handleLoot() && this.nearbyCorpse && !this.nearbyCorpse.looted) {
      const loot = this.nearbyCorpse.lootCorpse();
      if (loot) {
        if (loot.gold > 0) {
          gameState.addGold(loot.gold);
          this.addCombatLog(`+${loot.gold} Gold`, '#FFD700');
        }
        // Add ingredients to inventory and show in log
        loot.ingredients.forEach(ing => {
          gameState.addToInventory(ing);
          const template = entityFactory.getTemplate(ing);
          const itemName = template?.name || ing;
          this.addCombatLog(`Found: ${itemName}`, '#90EE90');
        });
      }
    }

    this.player.update(deltaTime);

    // Track enemy count before processing deaths
    const enemiesBeforeDeath = this.enemies.filter(e => e.alive).length;

    this.updater.updateEnemies(this.enemies, this.player, deltaTime);
    this.updater.updateTraps(this.traps, this.player, deltaTime);
    this.combatSystem.updateProjectiles(deltaTime, this.enemies, this.player);
    this.combatSystem.updateCorpses(deltaTime);
    this.particleSystem.update(deltaTime);

    // Track which enemies died
    const deadEnemies = this.enemies.filter(e => !e.alive);
    deadEnemies.forEach(enemy => {
      if (!enemy.loggedDeath) {
        this.addCombatLog(`Killed ${enemy.enemyData.name}!`, '#FF6B6B');
        (enemy as any).loggedDeath = true; // Mark as logged
      }
    });

    this.enemies = this.updater.handleDeadEnemies(this.enemies);

    // Check if all enemies are cleared
    const enemiesAfterDeath = this.enemies.filter(e => e.alive).length;
    if (this.mode === 'expedition' && enemiesBeforeDeath > 0 && enemiesAfterDeath === 0) {
      this.addCombatLog('All enemies cleared! Press E on portal to return to base', '#FFD700');
    }
    const interactionResult = this.updater.checkInteractions(this.player, this.mode, this.combatSystem.getCorpses());

    // Combine tile interactions with corpse interactions (prioritize tile interactions)
    if (tileInteraction.showPrompt) {
      this.showInteractionPrompt = true;
      this.interactionPromptText = tileInteraction.promptText;
      this.nearbyCorpse = null;
    } else {
      this.showInteractionPrompt = interactionResult.showPrompt;
      this.interactionPromptText = interactionResult.promptText;
      this.nearbyCorpse = interactionResult.nearbyCorpse;
    }

    this.updater.updateCamera(this.player, this.renderer);
    this.baseHealTimer = this.updater.handleBaseHealing(this.player, this.mode, this.baseHealTimer, deltaTime);

    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    // Update combat log to remove old entries
    this.updateCombatLog();

    this.inputHandler.update();
  }








  private handlePlayerDeath(): void {
    this.player.alive = true;
    this.player.stats.health = this.player.stats.maxHealth;
    const currentGold = gameState.getState().gold;
    const goldLoss = Math.floor(currentGold * 0.5);
    gameState.addGold(-goldLoss);
    this.loadBaseCamp();
  }

  render(): void {
    this.renderer.clear();
    this.renderer.renderMap(this.mapSystem.getCurrentMap());

    this.renderer.renderTraps(this.traps);
    this.renderer.renderCorpses(this.combatSystem.getCorpses(), this.nearbyCorpse);
    this.renderer.renderEnemies(this.enemies);
    this.renderer.renderProjectiles(this.combatSystem.getProjectiles());
    this.renderer.renderParticles(this.particleSystem.getParticles());
    this.renderer.renderPlayer(this.player);
    // Get inventory from game state
    const inventory = gameState.getState().inventory;

    this.renderer.renderUI(
      this.player,
      this.mode,
      this.enemies,
      this.combatSystem.getCorpses(),
      this.showInteractionPrompt,
      this.interactionPromptText,
      this.combatLog,
      inventory
    );

    // Render cheat panel on top of everything
    const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;
    const canvas = canvasRenderer.getCanvas();
    this.cheatPanel.render(canvasRenderer.getContext(), canvas.width, canvas.height);

    // Render mobile controls on top of everything (if mobile)
    if (this.mobileControls) {
      this.mobileControls.render(canvasRenderer.getContext());
    }
  }
}
