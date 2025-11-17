/**
 * TileTypes - Core type definitions for the map system
 */

export enum TileType {
  // Basic structure tiles
  FLOOR = 0,
  WALL = 1,
  DOOR = 2,

  // Special structure tiles
  EXPEDITION_PORTAL = 5,
  STAIRS_DOWN = 7,
  STAIRS_UP = 8,

  // Terrain tiles
  WATER = 9,
  LAVA = 10,
  ICE = 11,
  GRASS = 12,

  // Interactive tiles (legacy - may be converted to plugins)
  HEALTH_FOUNTAIN = 13,
  TREASURE_CHEST = 14,
  TELEPORTER = 15,
  SHRINE = 16,

  // Trap tiles
  SPIKE_TRAP = 17,
  POISON_TRAP = 18,

  // Harvestable items
  BERRY_BUSH = 20,
  HERB_PLANT = 21,
  MUSHROOM_PATCH = 22,
  CRYSTAL_FORMATION = 23,
  FIRE_PLANT = 24,
  VOID_PLANT = 25,
  ANCIENT_TREE = 26,

  // Building tiles are auto-assigned starting from 1000 via BuildingRegistry
}

export type Tile = {
  type: TileType;
  walkable: boolean;
  color: string;
};

export type GameMap = {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileType[][];
  name: string;
  spawnX?: number; // Player spawn X coordinate (in pixels)
  spawnY?: number; // Player spawn Y coordinate (in pixels)
};
