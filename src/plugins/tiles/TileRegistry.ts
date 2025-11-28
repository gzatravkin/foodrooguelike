/**
 * TileRegistry - Automatic tile registration system
 * Add a new tile by creating a file in src/plugins/tiles/definitions/
 */

import { PluginRegistry, Plugin } from '../../core/PluginRegistry';
import { PhaserPlayer } from '../../entities/PhaserPlayer';
import { MapSystem, TileType } from '../../systems/MapSystem';

export interface TileInteraction {
  canInteract: (player: PhaserPlayer, tileX: number, tileY: number, mapSystem: MapSystem) => boolean;
  onInteract: (player: PhaserPlayer, tileX: number, tileY: number, mapSystem: MapSystem, onLog: (text: string, color: string) => void, context?: any) => void;
  onStepOn?: (player: PhaserPlayer, tileX: number, tileY: number, deltaTime: number, onLog: (text: string, color: string) => void) => void;
  update?: (deltaTime: number, player: PhaserPlayer, tileX: number, tileY: number) => void;
}

export interface TileRendering {
  render: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => void;
}

export interface TilePlugin extends Plugin {
  id: string; // Unique identifier (e.g., 'floor', 'wall', 'cooking_station')
  name: string; // Display name
  color: string; // Fallback color if no custom renderer
  walkable: boolean;
  blocksLight?: boolean;

  // TileType mapping (optional - for automatic lookup of interactive tiles)
  tileType?: TileType;

  // Optional custom rendering
  rendering?: TileRendering;

  // Optional interactions
  interaction?: TileInteraction;

  // Optional dungeon generation settings
  dungeon?: {
    canSpawnInRoom?: boolean;
    spawnWeight?: number; // 0-1, probability modifier
    requiresRoomType?: string[]; // e.g., ['treasure', 'normal']
  };
}

class TileRegistryClass extends PluginRegistry<TilePlugin> {
  private tileIdToIndex: Map<string, number> = new Map();
  private indexToTileId: Map<number, string> = new Map();
  private tileTypeToId: Map<TileType, string> = new Map();
  private nextIndex: number = 0;
  private nextAutoTileType: number = 2000; // Start auto-assignment at 2000 (buildings use 1000+)

  register(plugin: TilePlugin): void {
    super.register(plugin);

    // Assign numeric index for compatibility
    if (!this.tileIdToIndex.has(plugin.id)) {
      this.tileIdToIndex.set(plugin.id, this.nextIndex);
      this.indexToTileId.set(this.nextIndex, plugin.id);
      this.nextIndex++;
    }

    // AUTO-ASSIGN TileType if not provided!
    if (plugin.tileType === undefined && plugin.interaction) {
      // Only auto-assign for interactive tiles (not basic terrain like grass, water, etc.)
      plugin.tileType = this.nextAutoTileType as TileType;
      console.log(`🔧 Auto-assigned TileType ${this.nextAutoTileType} to ${plugin.name}`);
      this.nextAutoTileType++;
    }

    // Store TileType mapping if provided or auto-assigned
    if (plugin.tileType !== undefined) {
      this.tileTypeToId.set(plugin.tileType, plugin.id);
    }
  }

  getTileIndex(id: string): number {
    return this.tileIdToIndex.get(id) ?? 0;
  }

  getTileById(id: string): TilePlugin | undefined {
    return this.get(id);
  }

  getTileByIndex(index: number): TilePlugin | undefined {
    const id = this.indexToTileId.get(index);
    return id ? this.get(id) : undefined;
  }

  getTileId(index: number): string {
    return this.indexToTileId.get(index) || 'floor';
  }

  /**
   * Get tile ID from TileType (automatic mapping!)
   * This eliminates the need for manual TileType -> ID mappings
   */
  getTileIdByTileType(tileType: TileType): string | null {
    return this.tileTypeToId.get(tileType) || null;
  }
}

export const TileRegistry = new TileRegistryClass();
