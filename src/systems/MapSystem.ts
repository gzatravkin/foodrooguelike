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
  WATER = 8,
  LAVA = 9,
  ICE = 10,
  GRASS = 11,
  HEALTH_FOUNTAIN = 12,
  TREASURE_CHEST = 13,
  TELEPORTER = 14,
  SHRINE = 15,
  SPIKE_TRAP = 16,
  POISON_TRAP = 17,
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
    this.tileColors.set(TileType.WATER, '#1e90ff');
    this.tileColors.set(TileType.LAVA, '#ff4500');
    this.tileColors.set(TileType.ICE, '#87ceeb');
    this.tileColors.set(TileType.GRASS, '#228b22');
    this.tileColors.set(TileType.HEALTH_FOUNTAIN, '#ff69b4');
    this.tileColors.set(TileType.TREASURE_CHEST, '#ffd700');
    this.tileColors.set(TileType.TELEPORTER, '#8b00ff');
    this.tileColors.set(TileType.SHRINE, '#daa520');
    this.tileColors.set(TileType.SPIKE_TRAP, '#8b0000');
    this.tileColors.set(TileType.POISON_TRAP, '#32cd32');
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

  // Create a procedurally generated dungeon map with variety
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

    // Generate random number of rooms (4-8)
    const numRooms = 4 + Math.floor(Math.random() * 5);
    const rooms: { x: number; y: number; w: number; h: number; type: string }[] = [];

    // Generate rooms with random sizes and positions
    for (let i = 0; i < numRooms; i++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const w = 5 + Math.floor(Math.random() * 8); // Width 5-12
        const h = 5 + Math.floor(Math.random() * 8); // Height 5-12
        const x = 2 + Math.floor(Math.random() * (width - w - 4));
        const y = 2 + Math.floor(Math.random() * (height - h - 4));

        // Check if room overlaps with existing rooms
        let overlaps = false;
        for (const room of rooms) {
          if (!(x + w + 2 < room.x || x > room.x + room.w + 2 ||
                y + h + 2 < room.y || y > room.y + room.h + 2)) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          // Assign room type randomly
          const roomTypes = ['normal', 'water', 'lava', 'ice', 'grass', 'treasure'];
          const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
          rooms.push({ x, y, w, h, type });
          placed = true;
        }
        attempts++;
      }
    }

    // Carve out rooms with themed tiles
    for (const room of rooms) {
      for (let y = room.y; y < room.y + room.h; y++) {
        for (let x = room.x; x < room.x + room.w; x++) {
          let tileType = TileType.FLOOR;

          // Room theming
          if (room.type === 'water' && Math.random() < 0.4) {
            tileType = TileType.WATER;
          } else if (room.type === 'lava' && Math.random() < 0.3) {
            tileType = TileType.LAVA;
          } else if (room.type === 'ice') {
            tileType = TileType.ICE;
          } else if (room.type === 'grass' && Math.random() < 0.6) {
            tileType = TileType.GRASS;
          } else if (room.type === 'treasure') {
            tileType = TileType.FLOOR;
          }

          tiles[y][x] = tileType;
        }
      }

      // Add special features to rooms
      const centerX = Math.floor(room.x + room.w / 2);
      const centerY = Math.floor(room.y + room.h / 2);

      if (room.type === 'treasure' && room.w >= 6 && room.h >= 6) {
        // Place treasure chest in center
        tiles[centerY][centerX] = TileType.TREASURE_CHEST;
      } else if (Math.random() < 0.3) {
        // 30% chance for health fountain
        tiles[centerY][centerX] = TileType.HEALTH_FOUNTAIN;
      } else if (Math.random() < 0.2) {
        // 20% chance for shrine
        tiles[centerY][centerX] = TileType.SHRINE;
      } else if (Math.random() < 0.15) {
        // 15% chance for teleporter
        tiles[centerY][centerX] = TileType.TELEPORTER;
      }

      // Add random spike/poison traps around room edges
      if (Math.random() < 0.4) {
        const numTraps = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numTraps; i++) {
          const tx = room.x + 1 + Math.floor(Math.random() * (room.w - 2));
          const ty = room.y + 1 + Math.floor(Math.random() * (room.h - 2));
          if (tiles[ty][tx] === TileType.FLOOR || tiles[ty][tx] === TileType.GRASS) {
            tiles[ty][tx] = Math.random() < 0.5 ? TileType.SPIKE_TRAP : TileType.POISON_TRAP;
          }
        }
      }
    }

    // Create corridors between rooms using L-shaped paths
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];

      const x1 = Math.floor(room1.x + room1.w / 2);
      const y1 = Math.floor(room1.y + room1.h / 2);
      const x2 = Math.floor(room2.x + room2.w / 2);
      const y2 = Math.floor(room2.y + room2.h / 2);

      // Randomly choose horizontal-first or vertical-first
      if (Math.random() < 0.5) {
        // Horizontal then vertical
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          if (tiles[y1][x] === TileType.WALL) tiles[y1][x] = TileType.FLOOR;
        }
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          if (tiles[y][x2] === TileType.WALL) tiles[y][x2] = TileType.FLOOR;
        }
      } else {
        // Vertical then horizontal
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          if (tiles[y][x1] === TileType.WALL) tiles[y][x1] = TileType.FLOOR;
        }
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          if (tiles[y2][x] === TileType.WALL) tiles[y2][x] = TileType.FLOOR;
        }
      }
    }

    // Connect first and last room as well for more connectivity
    if (rooms.length > 2) {
      const room1 = rooms[0];
      const room2 = rooms[rooms.length - 1];
      const x1 = Math.floor(room1.x + room1.w / 2);
      const y1 = Math.floor(room1.y + room1.h / 2);
      const x2 = Math.floor(room2.x + room2.w / 2);
      const y2 = Math.floor(room2.y + room2.h / 2);

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        if (tiles[y1][x] === TileType.WALL) tiles[y1][x] = TileType.FLOOR;
      }
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (tiles[y][x2] === TileType.WALL) tiles[y][x2] = TileType.FLOOR;
      }
    }

    // Place entrance in first room
    const firstRoom = rooms[0];
    const entranceX = Math.floor(firstRoom.x + firstRoom.w / 2);
    const entranceY = Math.floor(firstRoom.y + firstRoom.h / 2);
    tiles[entranceY][entranceX] = TileType.STAIRS_UP;

    // Place exit in last room
    const lastRoom = rooms[rooms.length - 1];
    const exitX = Math.floor(lastRoom.x + lastRoom.w / 2);
    const exitY = Math.floor(lastRoom.y + lastRoom.h / 2);
    tiles[exitY][exitX] = TileType.STAIRS_DOWN;

    return {
      width,
      height,
      tileSize: 32,
      tiles,
      name: `Dungeon Level ${level}`,
    };
  }
}
