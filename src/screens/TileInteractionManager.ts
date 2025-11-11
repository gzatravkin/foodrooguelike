/**
 * TileInteractionManager - Handles interactive tile logic (fountains, chests, shrines, teleporters)
 */
import { Player } from '../entities/Player';
import { MapSystem, TileType } from '../systems/MapSystem';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';

export class TileInteractionManager {
  private interactedTiles: Set<string> = new Set();
  private tileEffectCooldowns: Map<string, number> = new Map();
  private playerBuffs: { speed?: number; damage?: number; defense?: number; duration: number } | null = null;
  private lavaDamageTimer: number = 0;
  private teleporterLocations: Array<{ x: number; y: number }> = [];

  reset(): void {
    this.interactedTiles.clear();
    this.tileEffectCooldowns.clear();
    this.playerBuffs = null;
    this.lavaDamageTimer = 0;
    this.teleporterLocations = [];
  }

  findTeleporters(mapSystem: MapSystem): void {
    const map = mapSystem.getCurrentMap();
    if (!map) return;

    this.teleporterLocations = [];
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.tiles[y][x] === TileType.TELEPORTER) {
          this.teleporterLocations.push({
            x: x * map.tileSize + map.tileSize / 2,
            y: y * map.tileSize + map.tileSize / 2
          });
        }
      }
    }
  }

  updateTileEffects(deltaTime: number, player: Player, mapSystem: MapSystem, onLog: (text: string, color: string) => void): void {
    const tileType = mapSystem.getTileAt(player.x, player.y);
    if (!tileType) return;

    const map = mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(player.x / map.tileSize);
    const tileY = Math.floor(player.y / map.tileSize);
    const tileKey = `${tileX},${tileY}`;

    // Lava damage
    if (tileType === TileType.LAVA) {
      this.lavaDamageTimer += deltaTime;
      if (this.lavaDamageTimer >= 0.5) {
        player.takeDamage(10);
        onLog('Burned by lava! -10 HP', '#FF4500');
        this.lavaDamageTimer = 0;
      }
    } else {
      this.lavaDamageTimer = 0;
    }

    // Water slowing effect
    if (tileType === TileType.WATER) {
      if (player.slowedDuration <= 0) {
        player.slowedDuration = 0.1;
        player.slowMultiplier = 0.5;
      }
    }

    // Spike/Poison trap damage
    if (tileType === TileType.SPIKE_TRAP || tileType === TileType.POISON_TRAP) {
      const cooldown = this.tileEffectCooldowns.get(tileKey) || 0;
      if (cooldown <= 0 && !player.isDashing) {
        const damage = tileType === TileType.SPIKE_TRAP ? 20 : 15;
        player.takeDamage(damage);
        onLog(`Trap triggered! -${damage} HP`, '#FF0000');
        this.tileEffectCooldowns.set(tileKey, 2.0);

        if (tileType === TileType.POISON_TRAP) {
          player.slowedDuration = Math.max(player.slowedDuration, 3.0);
          player.slowMultiplier = 0.6;
          onLog('Poisoned!', '#32CD32');
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

  updateBuffs(deltaTime: number, player: Player, onLog: (text: string, color: string) => void): void {
    if (this.playerBuffs && this.playerBuffs.duration > 0) {
      this.playerBuffs.duration -= deltaTime;
      if (this.playerBuffs.duration <= 0) {
        if (this.playerBuffs.speed) {
          player.stats.speed /= this.playerBuffs.speed;
        }
        if (this.playerBuffs.damage) {
          player.stats.attack /= this.playerBuffs.damage;
        }
        if (this.playerBuffs.defense) {
          player.stats.defense /= this.playerBuffs.defense;
        }
        this.playerBuffs = null;
        onLog('Buff expired', '#888');
      }
    }
  }

  interactWithHealthFountain(player: Player, mapSystem: MapSystem, onLog: (text: string, color: string) => void): void {
    const map = mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(player.x / map.tileSize);
    const tileY = Math.floor(player.y / map.tileSize);
    const tileKey = `fountain-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      onLog('Fountain is dry', '#888');
      return;
    }

    const healAmount = 30;
    player.heal(healAmount);
    this.interactedTiles.add(tileKey);
    onLog(`Healed ${healAmount} HP from fountain!`, '#FF69B4');
    onLog('Fountain dried up', '#888');
  }

  interactWithTreasureChest(player: any, mapSystem: MapSystem, onLog: (text: string, color: string) => void): void {
    const map = mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(player.x / map.tileSize);
    const tileY = Math.floor(player.y / map.tileSize);
    const tileKey = `chest-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      onLog('Chest is empty', '#888');
      return;
    }

    this.interactedTiles.add(tileKey);
    onLog('Opened treasure chest!', '#FFD700');

    const numIngredients = 2 + Math.floor(Math.random() * 3);
    const ingredients = ['tomato', 'cheese', 'lettuce', 'beef', 'bread', 'chicken', 'fish', 'potato'];
    for (let i = 0; i < numIngredients; i++) {
      const randomIng = ingredients[Math.floor(Math.random() * ingredients.length)];
      gameState.addToInventory(randomIng);
      const template = entityFactory.getTemplate(randomIng);
      const itemName = template?.name || randomIng;
      onLog(`Found: ${itemName}`, '#90EE90');
    }
  }

  interactWithShrine(player: Player, mapSystem: MapSystem, onLog: (text: string, color: string) => void): void {
    const map = mapSystem.getCurrentMap();
    if (!map) return;

    const tileX = Math.floor(player.x / map.tileSize);
    const tileY = Math.floor(player.y / map.tileSize);
    const tileKey = `shrine-${tileX},${tileY}`;

    if (this.interactedTiles.has(tileKey)) {
      onLog('Shrine power depleted', '#888');
      return;
    }

    const buffTypes = ['speed', 'damage', 'defense'];
    const buffType = buffTypes[Math.floor(Math.random() * buffTypes.length)];

    this.interactedTiles.add(tileKey);

    if (buffType === 'speed') {
      this.playerBuffs = { speed: 1.5, duration: 15.0 };
      player.stats.speed *= 1.5;
      onLog('Blessed with speed! +50% speed for 15s', '#DAA520');
    } else if (buffType === 'damage') {
      this.playerBuffs = { damage: 1.5, duration: 15.0 };
      player.stats.attack *= 1.5;
      onLog('Blessed with power! +50% damage for 15s', '#DAA520');
    } else {
      this.playerBuffs = { defense: 1.5, duration: 15.0 };
      player.stats.defense *= 1.5;
      onLog('Blessed with protection! +50% defense for 15s', '#DAA520');
    }
  }

  interactWithTeleporter(player: Player, onLog: (text: string, color: string) => void): void {
    if (this.teleporterLocations.length < 2) {
      onLog('Teleporter is inactive', '#888');
      return;
    }

    let currentTeleporterIndex = -1;
    for (let i = 0; i < this.teleporterLocations.length; i++) {
      const dist = Math.sqrt(
        Math.pow(player.x - this.teleporterLocations[i].x, 2) +
        Math.pow(player.y - this.teleporterLocations[i].y, 2)
      );
      if (dist < 20) {
        currentTeleporterIndex = i;
        break;
      }
    }

    if (currentTeleporterIndex === -1) return;

    const otherTeleporters = this.teleporterLocations.filter((_, i) => i !== currentTeleporterIndex);
    const destination = otherTeleporters[Math.floor(Math.random() * otherTeleporters.length)];

    player.x = destination.x;
    player.y = destination.y;
    onLog('Teleported!', '#8B00FF');
  }
}
