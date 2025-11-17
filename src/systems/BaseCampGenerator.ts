/**
 * BaseCampGenerator - Generates the base camp map
 * Now automatically places buildings from BuildingRegistry!
 */

import { TileType, GameMap } from './TileTypes';
import { getTileSize } from '../utils/MobileUtils';
import { BuildingRegistry } from '../plugins/BuildingRegistry';

export class BaseCampGenerator {
  static generate(restaurantLocation?: string): GameMap {
    const width = 30;
    const height = 20;
    const tiles: TileType[][] = [];

    // Choose floor type based on restaurant location
    const floorType = this.getFloorTypeForLocation(restaurantLocation || 'starter_kitchen');

    // Initialize with themed floor
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = floorType;
      }
    }

    // Add walls around the perimeter of main area
    for (let x = 0; x < 22; x++) {
      tiles[0][x] = TileType.WALL;
      tiles[height - 1][x] = TileType.WALL;
    }
    for (let y = 0; y < height; y++) {
      tiles[y][0] = TileType.WALL;
      if (y < 13) {
        tiles[y][21] = TileType.WALL; // Right wall of main area, with opening
      }
    }

    // Add expedition portal (bottom center)
    tiles[16][10] = TileType.EXPEDITION_PORTAL;
    tiles[16][11] = TileType.EXPEDITION_PORTAL;
    tiles[17][10] = TileType.EXPEDITION_PORTAL;
    tiles[17][11] = TileType.EXPEDITION_PORTAL;

    // Create dining room as a separate room (right side)
    // Hallway to dining room
    tiles[13][21] = TileType.DOOR; // Door from main area
    for (let x = 22; x < 24; x++) {
      tiles[13][x] = floorType; // Hallway
    }

    // Hallway walls (enclose the hallway)
    for (let x = 22; x < 24; x++) {
      tiles[12][x] = TileType.WALL; // Top wall of hallway
      tiles[14][x] = TileType.WALL; // Bottom wall of hallway
    }

    // Close off the main area wall above and below the door
    for (let y = 0; y < 12; y++) {
      tiles[y][21] = TileType.WALL;
    }
    for (let y = 15; y <= height - 1; y++) {
      tiles[y][21] = TileType.WALL;
    }
    tiles[12][21] = TileType.WALL; // Wall above door
    tiles[14][21] = TileType.WALL; // Wall below door

    // Dining room walls
    for (let x = 24; x < width; x++) {
      tiles[8][x] = TileType.WALL; // Top wall
      tiles[18][x] = TileType.WALL; // Bottom wall
    }
    for (let y = 8; y <= 18; y++) {
      tiles[y][24] = TileType.WALL; // Left wall (with door)
      tiles[y][width - 1] = TileType.WALL; // Right wall
    }
    // Door to dining room
    tiles[13][24] = TileType.DOOR;

    // Fill dining room with floor
    for (let y = 9; y < 18; y++) {
      for (let x = 25; x < width - 1; x++) {
        tiles[y][x] = floorType;
      }
    }

    // AUTOMATIC BUILDING PLACEMENT: Use BuildingRegistry!
    // IMPORTANT: This must be AFTER floor fills to prevent buildings from being overwritten
    // Get all buildings configured for base camp, sorted by priority
    const baseCampBuildings = BuildingRegistry.getBaseCampBuildings()
      .sort((a, b) => (b.baseCamp?.priority || 0) - (a.baseCamp?.priority || 0));

    // Place each building at its configured position
    for (const building of baseCampBuildings) {
      if (!building.baseCamp) continue;

      const { x, y } = building.baseCamp.position;
      const width = building.baseCamp.size?.width || 1;
      const height = building.baseCamp.size?.height || 1;

      // Place the building tiles
      for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
          const tileY = y + dy;
          const tileX = x + dx;
          if (tileY >= 0 && tileY < tiles.length && tileX >= 0 && tileX < tiles[0].length && building.tileType !== undefined) {
            tiles[tileY][tileX] = building.tileType;
          }
        }
      }
    }

    return {
      width,
      height,
      tileSize: getTileSize(),
      tiles,
      name: 'Base Camp',
    };
  }

  private static getFloorTypeForLocation(location: string): TileType {
    // Return themed floor based on restaurant location
    switch (location) {
      case 'forest_outskirts':
        return TileType.GRASS;
      case 'dark_cave':
        return TileType.FLOOR; // Cave floor
      case 'goblin_camp':
        return TileType.FLOOR; // Stone floor
      case 'orc_stronghold':
        return TileType.FLOOR; // Dungeon floor
      case 'frozen_wasteland':
        return TileType.ICE;
      case 'volcano_depths':
        return TileType.FLOOR; // Volcanic stone floor (safe)
      case 'demon_realm':
        return TileType.FLOOR; // Void/demon floor
      default:
        return TileType.FLOOR; // Default starter kitchen
    }
  }
}
