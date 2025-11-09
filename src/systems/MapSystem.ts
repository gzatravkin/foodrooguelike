/**
 * MapSystem - Handles tile-based maps and collision
 */

export enum TileType {
  FLOOR = 0,
  WALL = 1,
  DOOR = 2,
  COOKING_STATION = 3,
  SHOP = 4,
  EXPEDITION_PORTAL = 5,
  STAIRS_DOWN = 6,
  STAIRS_UP = 7,
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
};

export class MapSystem {
  private currentMap: GameMap | null = null;
  private tileColors: Map<TileType, string> = new Map();

  constructor() {
    this.setupTileColors();
  }

  private setupTileColors(): void {
    this.tileColors.set(TileType.FLOOR, '#2a2a2a');
    this.tileColors.set(TileType.WALL, '#555');
    this.tileColors.set(TileType.DOOR, '#8b4513');
    this.tileColors.set(TileType.COOKING_STATION, '#ff6b35');
    this.tileColors.set(TileType.SHOP, '#4ecdc4');
    this.tileColors.set(TileType.EXPEDITION_PORTAL, '#9b59b6');
    this.tileColors.set(TileType.STAIRS_DOWN, '#95a5a6');
    this.tileColors.set(TileType.STAIRS_UP, '#ecf0f1');
  }

  getTileColor(type: TileType): string {
    return this.tileColors.get(type) || '#000';
  }

  isTileWalkable(type: TileType): boolean {
    return type !== TileType.WALL;
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

  // Create base camp map
  static createBaseCamp(): GameMap {
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

  // Create a simple dungeon map
  static createDungeon(level: number = 1): GameMap {
    const width = 30;
    const height = 20;
    const tiles: TileType[][] = [];

    // Initialize with walls
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = TileType.WALL;
      }
    }

    // Create rooms
    const rooms = [
      { x: 2, y: 2, w: 8, h: 6 },
      { x: 12, y: 2, w: 6, h: 8 },
      { x: 20, y: 2, w: 8, h: 6 },
      { x: 2, y: 10, w: 10, h: 8 },
      { x: 18, y: 12, w: 10, h: 6 },
    ];

    // Carve out rooms
    for (const room of rooms) {
      for (let y = room.y; y < room.y + room.h; y++) {
        for (let x = room.x; x < room.x + room.w; x++) {
          tiles[y][x] = TileType.FLOOR;
        }
      }
    }

    // Create corridors between rooms
    // Room 0 to 1
    for (let x = 10; x <= 12; x++) tiles[5][x] = TileType.FLOOR;

    // Room 1 to 2
    for (let x = 18; x <= 20; x++) tiles[5][x] = TileType.FLOOR;

    // Room 0 to 3
    for (let y = 8; y <= 10; y++) tiles[y][5] = TileType.FLOOR;

    // Room 3 to 4
    for (let x = 12; x <= 18; x++) tiles[15][x] = TileType.FLOOR;

    // Add stairs up (entrance)
    tiles[3][3] = TileType.STAIRS_UP;

    // Add stairs down (exit)
    tiles[17][26] = TileType.STAIRS_DOWN;

    return {
      width,
      height,
      tileSize: 32,
      tiles,
      name: `Dungeon Level ${level}`,
    };
  }
}
