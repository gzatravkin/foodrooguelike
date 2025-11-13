/**
 * DiningRoomGenerator - Generates the dining room map (separate from base camp)
 */

import { TileType, GameMap } from './TileTypes';
import { getTileSize } from '../utils/MobileUtils';

export class DiningRoomGenerator {
  static generate(): GameMap {
    const width = 18;
    const height = 14;
    const tiles: TileType[][] = [];

    // Initialize with floor tiles
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = TileType.FLOOR;
      }
    }

    // Add walls around the perimeter
    for (let x = 0; x < width; x++) {
      tiles[0][x] = TileType.WALL;
      tiles[height - 1][x] = TileType.WALL;
    }
    for (let y = 0; y < height; y++) {
      tiles[y][0] = TileType.WALL;
      tiles[y][width - 1] = TileType.WALL;
    }

    // Add door back to base (bottom center)
    tiles[height - 1][Math.floor(width / 2)] = TileType.DOOR;
    tiles[height - 1][Math.floor(width / 2) + 1] = TileType.DOOR;

    // Add dining tables (represented as floor with decorative layout)
    // Left side tables
    this.addTable(tiles, 3, 3);
    this.addTable(tiles, 3, 7);
    this.addTable(tiles, 3, 11);

    // Right side tables
    this.addTable(tiles, 11, 3);
    this.addTable(tiles, 11, 7);
    this.addTable(tiles, 11, 11);

    // Center tables
    this.addTable(tiles, 7, 5);
    this.addTable(tiles, 7, 9);

    // Set player spawn near the entrance
    const tileSize = getTileSize();
    const spawnX = Math.floor(width / 2) * tileSize + tileSize / 2;
    const spawnY = (height - 3) * tileSize + tileSize / 2;

    return {
      width,
      height,
      tileSize,
      tiles,
      name: 'Dining Room',
      spawnX,
      spawnY,
    };
  }

  // Add a 2x2 table area
  private static addTable(tiles: TileType[][], y: number, x: number): void {
    if (y >= 0 && y < tiles.length - 1 && x >= 0 && x < tiles[0].length - 1) {
      // Tables are represented as walkable floor but will have NPCs around them
      // Keep them as floor so NPCs can walk around
    }
  }
}
