/**
 * TileTypeMapper - Centralized TileType to ID mapping
 * Automatically resolves TileType enum values to tile/building IDs
 * by querying both BuildingRegistry and TileRegistry.
 *
 * This eliminates the need for manual mapping tables!
 */

import { TileType } from '../systems/MapSystem';
import { BuildingRegistry } from './BuildingRegistry';
import { TileRegistry } from './tiles/TileRegistry';

class TileTypeMapperClass {
  /**
   * Get tile/building ID from TileType enum
   * Checks BuildingRegistry first, then TileRegistry
   */
  getTileIdFromType(tileType: TileType): string | null {
    // First check if it's a building
    const buildingId = BuildingRegistry.getBuildingIdByTileType(tileType);
    if (buildingId) {
      return buildingId;
    }

    // Then check if it's a tile plugin
    const tileId = TileRegistry.getTileIdByTileType(tileType);
    if (tileId) {
      return tileId;
    }

    // Not found in either registry
    return null;
  }
}

export const TileTypeMapper = new TileTypeMapperClass();
