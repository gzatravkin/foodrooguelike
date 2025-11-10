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
  private interactedTiles: Set<string> = new Set(); // Track which tiles have been used
  private tileEffectCooldowns: Map<string, number> = new Map(); // Cooldowns for tile effects
  private playerBuffs: { speed?: number; damage?: number; defense?: number; duration: number } | null = null;
  private lavaDamageTimer: number = 0;
  private waterSlowTimer: number = 0;
  private teleporterLocations: Array<{ x: number; y: number }> = [];

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

    // Use the spawn position from the dungeon (at STAIRS_UP)
    this.player.x = dungeon.spawnX || 3 * 32 + 16;
    this.player.y = dungeon.spawnY || 3 * 32 + 16;

    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();

    this.enemies = this.spawnManager.spawnEnemies(level, this.player);
    this.traps = this.spawnManager.spawnTraps(this.player);

    // Reset interactive tiles tracking
    this.interactedTiles.clear();
    this.tileEffectCooldowns.clear();
    this.playerBuffs = null;
    this.teleporterLocations = [];

    // Find all teleporter locations
    for (let y = 0; y < dungeon.height; y++) {
      for (let x = 0; x < dungeon.width; x++) {
        if (dungeon.tiles[y][x] === TileType.TELEPORTER) {
          this.teleporterLocations.push({
            x: x * dungeon.tileSize + dungeon.tileSize / 2,
            y: y * dungeon.tileSize + dungeon.tileSize / 2
          });
        }
      }
    }

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
      () => this.loadExpedition(1),
      () => this.loadBaseCamp()
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
      } else if (this.mode === 'expedition' && tileType) {
        if (tileType === TileType.STAIRS_DOWN) {
          this.loadBaseCamp();
        } else if (tileType === TileType.HEALTH_FOUNTAIN) {
          this.interactWithHealthFountain();
        } else if (tileType === TileType.TREASURE_CHEST) {
          this.interactWithTreasureChest();
        } else if (tileType === TileType.SHRINE) {
          this.interactWithShrine();
        } else if (tileType === TileType.TELEPORTER) {
          this.interactWithTeleporter();
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
        enemy.loggedDeath = true; // Mark as logged
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

    // Handle tile effects in expeditions
    if (this.mode === 'expedition') {
      this.handleTileEffects(deltaTime);
    }

    // Update player buffs
    if (this.playerBuffs && this.playerBuffs.duration > 0) {
      this.playerBuffs.duration -= deltaTime;
      if (this.playerBuffs.duration <= 0) {
        // Remove buffs
        if (this.playerBuffs.speed) {
          this.player.stats.speed /= this.playerBuffs.speed;
        }
        if (this.playerBuffs.damage) {
          this.player.stats.attack /= this.playerBuffs.damage;
        }
        if (this.playerBuffs.defense) {
          this.player.stats.defense /= this.playerBuffs.defense;
        }
        this.playerBuffs = null;
        this.addCombatLog('Buff expired', '#888');
      }
    }

    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    // Update combat log to remove old entries
    this.updateCombatLog();

    this.inputHandler.update();
  }








  private handleTileEffects(deltaTime: number): void {
    const tileType = this.mapSystem.getTileAt(this.player.x, this.player.y);
    if (!tileType) return;

    const map = this.mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(this.player.x / map.tileSize);
    const tileY = Math.floor(this.player.y / map.tileSize);
    const tileKey = `${tileX},${tileY}`;

    // Lava damage
    if (tileType === TileType.LAVA) {
      this.lavaDamageTimer += deltaTime;
      if (this.lavaDamageTimer >= 0.5) { // 10 damage per 0.5 seconds
        this.player.takeDamage(10);
        this.addCombatLog('Burned by lava! -10 HP', '#FF4500');
        this.lavaDamageTimer = 0;
      }
    } else {
      this.lavaDamageTimer = 0;
    }

    // Water slowing effect
    if (tileType === TileType.WATER) {
      if (this.player.slowedDuration <= 0) {
        this.player.slowedDuration = 0.1; // Keep applying slow while on water
        this.player.slowMultiplier = 0.5; // 50% speed in water
      }
    }

    // Spike/Poison trap damage
    if (tileType === TileType.SPIKE_TRAP || tileType === TileType.POISON_TRAP) {
      const cooldown = this.tileEffectCooldowns.get(tileKey) || 0;
      if (cooldown <= 0 && !this.player.isDashing) {
        const damage = tileType === TileType.SPIKE_TRAP ? 20 : 15;
        this.player.takeDamage(damage);
        this.addCombatLog(`Trap triggered! -${damage} HP`, '#FF0000');
        this.tileEffectCooldowns.set(tileKey, 2.0); // 2 second cooldown

        if (tileType === TileType.POISON_TRAP) {
          // Add poison DOT effect
          this.player.slowedDuration = Math.max(this.player.slowedDuration, 3.0);
          this.player.slowMultiplier = 0.6;
          this.addCombatLog('Poisoned!', '#32CD32');
        }
      }
    }

    // Update cooldowns
    this.tileEffectCooldowns.forEach((value, key) => {
      const newValue = value - deltaTime;
      if (newValue <= 0) {
        this.tileEffectCooldowns.delete(key);
      } else {
        this.tileEffectCooldowns.set(key, newValue);
      }
    });
  }

  private interactWithHealthFountain(): void {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(this.player.x / map.tileSize);
    const tileY = Math.floor(this.player.y / map.tileSize);
    const tileKey = `fountain-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      this.addCombatLog('Fountain is dry', '#888');
      return;
    }

    const healAmount = 30;
    this.player.heal(healAmount);
    this.interactedTiles.add(tileKey);
    this.addCombatLog(`Healed ${healAmount} HP from fountain!`, '#FF69B4');
    this.addCombatLog('Fountain dried up', '#888');
  }

  private interactWithTreasureChest(): void {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(this.player.x / map.tileSize);
    const tileY = Math.floor(this.player.y / map.tileSize);
    const tileKey = `chest-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      this.addCombatLog('Chest is empty', '#888');
      return;
    }

    const goldReward = 50 + Math.floor(Math.random() * 100);
    gameState.addGold(goldReward);
    this.interactedTiles.add(tileKey);
    this.addCombatLog(`Found ${goldReward} gold!`, '#FFD700');

    // 50% chance for random ingredient
    if (Math.random() < 0.5) {
      const ingredients = ['tomato', 'cheese', 'lettuce', 'beef', 'bread', 'chicken', 'fish', 'potato'];
      const randomIng = ingredients[Math.floor(Math.random() * ingredients.length)];
      gameState.addToInventory(randomIng);
      const template = entityFactory.getTemplate(randomIng);
      const itemName = template?.name || randomIng;
      this.addCombatLog(`Found: ${itemName}`, '#90EE90');
    }
  }

  private interactWithShrine(): void {
    const map = this.mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(this.player.x / map.tileSize);
    const tileY = Math.floor(this.player.y / map.tileSize);
    const tileKey = `shrine-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      this.addCombatLog('Shrine power depleted', '#888');
      return;
    }

    // Random buff
    const buffTypes = ['speed', 'damage', 'defense'];
    const buffType = buffTypes[Math.floor(Math.random() * buffTypes.length)];

    this.interactedTiles.add(tileKey);

    if (buffType === 'speed') {
      this.playerBuffs = { speed: 1.5, duration: 15.0 };
      this.player.stats.speed *= 1.5;
      this.addCombatLog('Blessed with speed! +50% speed for 15s', '#DAA520');
    } else if (buffType === 'damage') {
      this.playerBuffs = { damage: 1.5, duration: 15.0 };
      this.player.stats.attack *= 1.5;
      this.addCombatLog('Blessed with power! +50% damage for 15s', '#DAA520');
    } else {
      this.playerBuffs = { defense: 1.5, duration: 15.0 };
      this.player.stats.defense *= 1.5;
      this.addCombatLog('Blessed with protection! +50% defense for 15s', '#DAA520');
    }
  }

  private interactWithTeleporter(): void {
    if (this.teleporterLocations.length < 2) {
      this.addCombatLog('Teleporter is inactive', '#888');
      return;
    }

    // Find which teleporter we're on
    let currentTeleporterIndex = -1;
    for (let i = 0; i < this.teleporterLocations.length; i++) {
      const dist = Math.sqrt(
        Math.pow(this.player.x - this.teleporterLocations[i].x, 2) +
        Math.pow(this.player.y - this.teleporterLocations[i].y, 2)
      );
      if (dist < 20) {
        currentTeleporterIndex = i;
        break;
      }
    }

    if (currentTeleporterIndex === -1) return;

    // Teleport to a different random teleporter
    const otherTeleporters = this.teleporterLocations.filter((_, i) => i !== currentTeleporterIndex);
    const destination = otherTeleporters[Math.floor(Math.random() * otherTeleporters.length)];

    this.player.x = destination.x;
    this.player.y = destination.y;
    this.addCombatLog('Teleported!', '#8B00FF');
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
