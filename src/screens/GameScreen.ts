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
import { GameScreenRenderer } from './GameScreenRenderer';
import { CombatSystem } from './CombatSystem';
import { InputHandler } from './InputHandler';
import { SpawnManager } from './SpawnManager';
import { GameScreenUpdater } from './GameScreenUpdater';
import { CheatPanel } from '../ui/CheatPanel';
import { ParticleSystem } from '../entities/Particle';
import { MobileControls } from '../ui/MobileControls';
import { CombatLogManager } from './CombatLogManager';
import { TileInteractionManager } from './TileInteractionManager';
import { GameModeManager, GameMode } from './GameModeManager';
import { SVGAssetLoader } from './SVGAssetLoader';
import { TileRegistry } from '../plugins/tiles/TileRegistry';

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
  private showInteractionPrompt: boolean = false;
  private interactionPromptText: string = '';
  private nearbyCorpse: Corpse | null = null;
  private baseHealTimer: number = 0;

  // New managers
  private combatLogManager: CombatLogManager;
  private tileInteractionManager: TileInteractionManager;
  private gameModeManager: GameModeManager;
  private svgAssetLoader: SVGAssetLoader;

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

    // Initialize new managers
    this.combatLogManager = new CombatLogManager();
    this.tileInteractionManager = new TileInteractionManager();
    this.gameModeManager = new GameModeManager(this.spawnManager);
    this.svgAssetLoader = new SVGAssetLoader();

    const startingWeapon = entityFactory.createWeapon('pistol');
    this.player = new Player(320, 240, startingWeapon || undefined);

    // Apply initial dash training bonuses from saved state
    const initialState = gameState.getState();
    const trainingLevels: { [key: string]: number } = {};
    initialState.trainingSkills.forEach(skill => {
      trainingLevels[skill.id] = skill.level;
    });
    this.player.applyDashTrainingBonuses(trainingLevels);

    // Initialize mobile controls if on mobile device
    if (this.input.isMobileDevice()) {
      const canvas = renderer.getCanvas();
      this.mobileControls = new MobileControls(canvas);
    }

    this.loadBaseCamp();
    this.setupEventListeners();
    this.setupCheatPanelInput();

    // Add initial combat log entries
    this.combatLogManager.addEntry('=== Food Roguelike ===', '#FFD700');
    this.combatLogManager.addEntry('Press E on tiles to interact', '#90EE90');
    this.combatLogManager.addEntry('Walk over expedition portal to start!', '#4FC3F7');
  }

  async init(): Promise<void> {
    const canvasRenderer = (this.renderer as any).renderer as CanvasRenderer;
    await this.svgAssetLoader.preloadAssets(canvasRenderer);
  }

  private addCombatLog(text: string, color: string = '#FFF'): void {
    this.combatLogManager.addEntry(text, color);
  }

  private getTileIdFromType(tileType: TileType): string | null {
    // Map TileType enum to tile plugin IDs
    const tileTypeMap: Record<number, string> = {
      [TileType.HEALTH_FOUNTAIN]: 'health_fountain',
      [TileType.TREASURE_CHEST]: 'treasure_chest',
      [TileType.SHRINE]: 'shrine',
      [TileType.TELEPORTER]: 'teleporter',
      [TileType.BERRY_BUSH]: 'berry_bush',
      [TileType.HERB_PLANT]: 'herb_plant',
      [TileType.MUSHROOM_PATCH]: 'mushroom_patch',
      [TileType.CRYSTAL_FORMATION]: 'crystal_formation',
      [TileType.FIRE_PLANT]: 'fire_plant',
      [TileType.VOID_PLANT]: 'void_plant',
      [TileType.ANCIENT_TREE]: 'ancient_tree',
    };
    return tileTypeMap[tileType] || null;
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

      // Listen for player stat updates (from upgrades, training, etc.)
      eventBus.on('player:updated', (playerStats: any) => {
        this.player.stats.maxHealth = playerStats.maxHealth;
        this.player.stats.health = playerStats.health;
        this.player.stats.attack = playerStats.attack;
        this.player.stats.defense = playerStats.defense;
      });

      // Listen for training purchases to apply dash bonuses
      eventBus.on('training:purchased', () => {
        const state = gameState.getState();
        const trainingLevels: { [key: string]: number } = {};
        state.trainingSkills.forEach(skill => {
          trainingLevels[skill.id] = skill.level;
        });
        this.player.applyDashTrainingBonuses(trainingLevels);
      });

      // Listen for screen changes to handle expedition starts
      eventBus.on('screen:changed', (screen: string) => {
        if (screen === 'game') {
          // Check if we should load an expedition
          const storedData = localStorage.getItem('selectedExpedition');
          if (storedData) {
            console.log('Starting expedition from stored data');
            this.loadExpedition();
          }
        }
      });
    });
  }

  private setupCheatPanelInput(): void {
    window.addEventListener('keydown', (e) => {
      const currentScreen = gameState.getState().currentScreen;
      if (e.key === 'Escape' && this.gameModeManager.getMode() === 'expedition' && currentScreen === 'game' && !this.cheatPanel.isVisible()) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Fleeing expedition, returning to base...');
        this.loadBaseCamp();
        return;
      }

      if (e.key === '`' || e.key === 'Dead') {
        e.preventDefault();
        this.cheatPanel.toggle();
        return;
      }

      if (e.key === 'Escape' && this.cheatPanel.isVisible()) {
        e.preventDefault();
        this.cheatPanel.close();
        return;
      }
    });

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

  loadBaseCamp(): void {
    const wasExpedition = this.gameModeManager.getMode() === 'expedition';

    // Clear current expedition when returning to base
    gameState.clearCurrentExpedition();

    const result = this.gameModeManager.loadBaseCamp(this.mapSystem, this.player);

    this.enemies = result.enemies;
    this.traps = result.traps;
    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();
    this.baseHealTimer = 0;
    this.tileInteractionManager.reset();

    if (wasExpedition) {
      this.addCombatLog('=== RETURNED TO BASE ===', '#90EE90');
      this.addCombatLog('You are safe now!', '#90EE90');
    }
  }

  loadExpedition(level: number = 1): void {
    const result = this.gameModeManager.loadExpedition(this.mapSystem, this.player, level);

    this.enemies = result.enemies;
    this.traps = result.traps;
    this.combatSystem.clearProjectiles();
    this.combatSystem.clearCorpses();
    this.tileInteractionManager.reset();
    this.tileInteractionManager.findTeleporters(this.mapSystem);

    // Get current expedition info
    const state = gameState.getState();
    const expeditionId = state.expeditionState.currentExpeditionId;
    const currentLevel = state.expeditionState.currentLevel || level;

    this.addCombatLog('=== EXPEDITION STARTED ===', '#FF6B6B');
    if (expeditionId) {
      this.addCombatLog(`Level ${currentLevel}`, '#4FC3F7');
    }
    this.addCombatLog(`${this.enemies.length} enemies detected!`, '#FF6B6B');
    this.addCombatLog('Kill all enemies to complete!', '#FFD700');
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
      this.gameModeManager.getMode(),
      this.mapSystem,
      () => gameState.setScreen('shop'),
      () => gameState.setScreen('expedition'),
      () => this.loadBaseCamp()
    );

    // Handle interact action (E key or virtual button)
    if (this.inputHandler.handleInteract()) {
      const tileType = this.mapSystem.getTileAt(this.player.x, this.player.y);
      if (this.gameModeManager.getMode() === 'base' && tileType) {
        if (tileType === TileType.SHOP) {
          gameState.setScreen('shop');
        } else if (tileType === TileType.EXPEDITION_PORTAL) {
          gameState.setScreen('worldmap');
        } else if (tileType === TileType.COOKING_STATION) {
          gameState.setScreen('cooking');
        } else if (tileType === TileType.TRAINING_HALL) {
          gameState.setScreen('training');
        } else if (tileType === TileType.UPGRADES_HALL) {
          gameState.setScreen('upgrades');
        }
      } else if (this.gameModeManager.getMode() === 'expedition' && tileType !== null) {
        // Special case for stairs
        if (tileType === TileType.STAIRS_DOWN) {
          this.loadBaseCamp();
        } else {
          // Try to use TileRegistry for all interactive tiles
          const tileId = this.getTileIdFromType(tileType);
          if (tileId) {
            const tilePlugin = TileRegistry.getTileById(tileId);
            if (tilePlugin?.interaction) {
              const map = this.mapSystem.getCurrentMap();
              if (map) {
                const tileX = Math.floor(this.player.x / map.tileSize);
                const tileY = Math.floor(this.player.y / map.tileSize);

                if (tilePlugin.interaction.canInteract(this.player, tileX, tileY, this.mapSystem)) {
                  tilePlugin.interaction.onInteract(
                    this.player,
                    tileX,
                    tileY,
                    this.mapSystem,
                    (text, color) => this.addCombatLog(text, color)
                  );
                } else {
                  // Tile cannot be interacted with (already used, etc.)
                  // The plugin's onInteract will handle the message
                  tilePlugin.interaction.onInteract(
                    this.player,
                    tileX,
                    tileY,
                    this.mapSystem,
                    (text, color) => this.addCombatLog(text, color)
                  );
                }
              }
            }
          }
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
    if (this.gameModeManager.getMode() === 'expedition' && enemiesBeforeDeath > 0 && enemiesAfterDeath === 0) {
      this.handleExpeditionVictory();
    }
    const interactionResult = this.updater.checkInteractions(this.player, this.gameModeManager.getMode(), this.combatSystem.getCorpses());

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
    this.baseHealTimer = this.updater.handleBaseHealing(this.player, this.gameModeManager.getMode(), this.baseHealTimer, deltaTime);

    // Handle tile effects in expeditions
    if (this.gameModeManager.getMode() === 'expedition') {
      this.tileInteractionManager.updateTileEffects(deltaTime, this.player, this.mapSystem, (text, color) => this.addCombatLog(text, color));

      // Update hunger timer
      gameState.tickHunger(deltaTime);
      const state = gameState.getState();

      // Check if hunger timer expired
      if (state.expeditionState.hungerTimer <= 0) {
        this.addCombatLog('Out of time! Returning to base...', '#F44336');
        this.addCombatLog('Mission failed - hunger overtook you', '#F44336');
        setTimeout(() => {
          this.loadBaseCamp();
        }, 1000);
      } else if (state.expeditionState.hungerTimer <= 10 && Math.floor(state.expeditionState.hungerTimer) % 2 === 0) {
        // Warning at 10 seconds remaining
        this.addCombatLog(`Time running out: ${Math.floor(state.expeditionState.hungerTimer)}s`, '#FF8C00');
      }
    }

    // Update player buffs
    this.tileInteractionManager.updateBuffs(deltaTime, this.player, (text, color) => this.addCombatLog(text, color));

    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    // Update combat log to remove old entries
    this.combatLogManager.update();

    this.inputHandler.update();
  }






  private handleExpeditionVictory(): void {
    const state = gameState.getState();
    const expeditionId = state.expeditionState.currentExpeditionId;
    const currentLevel = state.expeditionState.currentLevel;

    if (expeditionId && currentLevel) {
      // Complete the level
      gameState.completeExpeditionLevel(expeditionId, currentLevel);

      const progress = gameState.getExpeditionProgress(expeditionId);

      this.addCombatLog('=== LEVEL COMPLETE ===', '#4CAF50');
      this.addCombatLog(`Level ${currentLevel} cleared!`, '#4CAF50');

      if (currentLevel < 50) {
        this.addCombatLog(`Level ${currentLevel + 1} unlocked!`, '#FFD700');
      } else {
        this.addCombatLog('Max level reached!', '#FFD700');
      }

      this.addCombatLog('Press E on portal to return', '#90EE90');
    } else {
      this.addCombatLog('All enemies cleared! Press E on portal to return to base', '#FFD700');
    }
  }

  private handlePlayerDeath(): void {
    this.player.alive = true;
    this.player.stats.health = this.player.stats.maxHealth;
    const currentGold = gameState.getState().gold;
    const goldLoss = Math.floor(currentGold * 0.5);
    gameState.addGold(-goldLoss);

    // Clear current expedition on death (no level completion)
    gameState.clearCurrentExpedition();

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
      this.gameModeManager.getMode(),
      this.enemies,
      this.combatSystem.getCorpses(),
      this.showInteractionPrompt,
      this.interactionPromptText,
      this.combatLogManager.getEntries(),
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
