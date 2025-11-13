/**
 * TileTypes - Core type definitions for the map system
 */

export enum TileType {
  FLOOR = 0,
  WALL = 1,
  DOOR = 2,
  COOKING_STATION = 3,
  SHOP = 4,
  EXPEDITION_PORTAL = 5,
  TRAINING_HALL = 6,
  STAIRS_DOWN = 7,
  STAIRS_UP = 8,
  WATER = 9,
  LAVA = 10,
  ICE = 11,
  GRASS = 12,
  HEALTH_FOUNTAIN = 13,
  TREASURE_CHEST = 14,
  TELEPORTER = 15,
  SHRINE = 16,
  SPIKE_TRAP = 17,
  POISON_TRAP = 18,
  UPGRADES_HALL = 19,
  DINING_ROOM = 27,
  // Harvestable items
  BERRY_BUSH = 20,
  HERB_PLANT = 21,
  MUSHROOM_PATCH = 22,
  CRYSTAL_FORMATION = 23,
  FIRE_PLANT = 24,
  VOID_PLANT = 25,
  ANCIENT_TREE = 26,
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
