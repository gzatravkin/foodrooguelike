/**
 * BaseCampGenerator - Generates the base camp map
 */

import { TileType, GameMap } from './TileTypes';

export class BaseCampGenerator {
  static generate(): GameMap {
    const width = 20;
    const height = 15;
    const tiles: TileType[][] = [];

    // Initialize with floor
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

    // Add cooking station (top-left area)
    tiles[2][3] = TileType.COOKING_STATION;
    tiles[2][4] = TileType.COOKING_STATION;
    tiles[3][3] = TileType.COOKING_STATION;
    tiles[3][4] = TileType.COOKING_STATION;

    // Add shop (top-right area)
    tiles[2][15] = TileType.SHOP;
    tiles[2][16] = TileType.SHOP;
    tiles[3][15] = TileType.SHOP;
    tiles[3][16] = TileType.SHOP;

    // Add training hall (bottom-left area)
    tiles[11][3] = TileType.TRAINING_HALL;
    tiles[11][4] = TileType.TRAINING_HALL;
    tiles[12][3] = TileType.TRAINING_HALL;
    tiles[12][4] = TileType.TRAINING_HALL;

    // Add upgrades hall (bottom-right area)
    tiles[11][15] = TileType.UPGRADES_HALL;
    tiles[11][16] = TileType.UPGRADES_HALL;
    tiles[12][15] = TileType.UPGRADES_HALL;
    tiles[12][16] = TileType.UPGRADES_HALL;

    // Add expedition portal (bottom center)
    tiles[11][9] = TileType.EXPEDITION_PORTAL;
    tiles[11][10] = TileType.EXPEDITION_PORTAL;
    tiles[12][9] = TileType.EXPEDITION_PORTAL;
    tiles[12][10] = TileType.EXPEDITION_PORTAL;

    return {
      width,
      height,
      tileSize: 32,
      tiles,
      name: 'Base Camp',
    };
  }
}
