/**
 * MapSystem - Handles tile-based maps and collision
 */

import { TileType, GameMap } from './TileTypes';
import { TileManager } from './TileManager';
import { BaseCampGenerator } from './BaseCampGenerator';
import { DungeonGenerator } from './DungeonGenerator';
import { Theme } from './ThemeConfig';

// Re-export types for backwards compatibility
export { TileType, GameMap } from './TileTypes';
export type { Tile } from './TileTypes';

export class MapSystem {
  private currentMap: GameMap | null = null;

  getTileColor(type: TileType): string {
    return TileManager.getTileColor(type);
  }

  isTileWalkable(type: TileType): boolean {
    return TileManager.isTileWalkable(type);
  }

  loadMap(map: GameMap): void {
    this.currentMap = map;
  }

  getCurrentMap(): GameMap | null {
    return this.currentMap;
  }

  getTileAt(x: number, y: number): TileType | null {
    if (!this.currentMap) return null;

    const tileX = Math.floor(x / this.currentMap.tileSize);
    const tileY = Math.floor(y / this.currentMap.tileSize);

    if (tileX < 0 || tileX >= this.currentMap.width || tileY < 0 || tileY >= this.currentMap.height) {
      return TileType.WALL; // Out of bounds = wall
    }

    return this.currentMap.tiles[tileY][tileX];
  }

  canMoveTo(x: number, y: number, size: number = 16): boolean {
    if (!this.currentMap) return false;

    // Check all corners of the entity's bounding box
    const corners = [
      { x: x - size / 2, y: y - size / 2 }, // Top-left
      { x: x + size / 2, y: y - size / 2 }, // Top-right
      { x: x - size / 2, y: y + size / 2 }, // Bottom-left
      { x: x + size / 2, y: y + size / 2 }, // Bottom-right
    ];

    for (const corner of corners) {
      const tile = this.getTileAt(corner.x, corner.y);
      if (tile === null || !this.isTileWalkable(tile)) {
        return false;
      }
    }

    return true;
  }

  // Static factory methods
  static createBaseCamp(): GameMap {
    return BaseCampGenerator.generate();
  }

  static createDungeon(level: number = 1, theme?: Theme): GameMap {
    return DungeonGenerator.generate(level, theme);
  }
}
