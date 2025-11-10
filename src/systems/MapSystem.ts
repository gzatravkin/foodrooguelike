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
    this.tileColors.set(TileType.TRAINING_HALL, '#FFD700');
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

    // Add training hall (bottom-left area)
    tiles[11][3] = TileType.TRAINING_HALL;
    tiles[11][4] = TileType.TRAINING_HALL;
    tiles[12][3] = TileType.TRAINING_HALL;
    tiles[12][4] = TileType.TRAINING_HALL;

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
    // Retry generation up to 5 times to ensure valid map
    for (let attempt = 0; attempt < 5; attempt++) {
      const result = this.generateDungeonAttempt(level);

      // Validate the generated map
      if (result && this.validateDungeon(result)) {
        return result;
      }

      console.warn(`Dungeon generation attempt ${attempt + 1} failed, retrying...`);
    }

    // Fallback: return a simple valid dungeon
    console.error('Failed to generate valid dungeon after 5 attempts, using fallback');
    return this.generateFallbackDungeon(level);
  }

  private static validateDungeon(map: GameMap): boolean {
    // Check that spawn position exists and is valid
    if (!map.spawnX || !map.spawnY) return false;

    const spawnTileX = Math.floor(map.spawnX / map.tileSize);
    const spawnTileY = Math.floor(map.spawnY / map.tileSize);

    // Verify spawn position is within bounds
    if (spawnTileX < 0 || spawnTileX >= map.width || spawnTileY < 0 || spawnTileY >= map.height) {
      return false;
    }

    // Verify spawn tile is walkable
    const spawnTile = map.tiles[spawnTileY][spawnTileX];
    if (spawnTile === TileType.WALL) {
      return false;
    }

    return true;
  }

  private static generateFallbackDungeon(level: number): GameMap {
    // Simple 3-room linear dungeon that always works
    const width = 30;
    const height = 20;
    const tileSize = 32;
    const tiles: TileType[][] = [];

    // Initialize with walls
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = TileType.WALL;
      }
    }

    // Create 3 simple rooms
    const rooms = [
      { x: 3, y: 3, w: 8, h: 8 },
      { x: 14, y: 6, w: 8, h: 8 },
      { x: 20, y: 3, w: 7, h: 8 }
    ];

    // Carve rooms
    for (const room of rooms) {
      for (let y = room.y; y < room.y + room.h; y++) {
        for (let x = room.x; x < room.x + room.w; x++) {
          tiles[y][x] = TileType.FLOOR;
        }
      }
    }

    // Connect rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const r1 = rooms[i];
      const r2 = rooms[i + 1];
      const x1 = Math.floor(r1.x + r1.w / 2);
      const y1 = Math.floor(r1.y + r1.h / 2);
      const x2 = Math.floor(r2.x + r2.w / 2);
      const y2 = Math.floor(r2.y + r2.h / 2);

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        tiles[y1][x] = TileType.FLOOR;
      }
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        tiles[y][x2] = TileType.FLOOR;
      }
    }

    // Place stairs
    const entranceX = Math.floor(rooms[0].x + rooms[0].w / 2);
    const entranceY = Math.floor(rooms[0].y + rooms[0].h / 2);
    tiles[entranceY][entranceX] = TileType.STAIRS_UP;

    const exitX = Math.floor(rooms[2].x + rooms[2].w / 2);
    const exitY = Math.floor(rooms[2].y + rooms[2].h / 2);
    tiles[exitY][exitX] = TileType.STAIRS_DOWN;

    return {
      width,
      height,
      tileSize,
      tiles,
      name: `Dungeon Level ${level}`,
      spawnX: entranceX * tileSize + tileSize / 2,
      spawnY: entranceY * tileSize + tileSize / 2
    };
  }

  private static generateDungeonAttempt(level: number): GameMap | null {
    // Difficulty-based scaling
    let width = 30;
    let height = 20;
    let minRooms = 4;
    let maxRooms = 8;

    if (level >= 7) {
      width = 40;
      height = 30;
      minRooms = 8;
      maxRooms = 12;
    } else if (level >= 4) {
      width = 35;
      height = 25;
      minRooms = 6;
      maxRooms = 10;
    }

    const tileSize = 32;
    const tiles: TileType[][] = [];

    // Initialize with walls
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = TileType.WALL;
      }
    }

    // Generate random number of rooms
    const numRooms = minRooms + Math.floor(Math.random() * (maxRooms - minRooms + 1));
    const rooms: { x: number; y: number; w: number; h: number; type: string }[] = [];

    // Generate rooms with random sizes and positions
    for (let i = 0; i < numRooms; i++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
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

    // Ensure minimum room count
    if (rooms.length < 3) {
      return null; // Failed to generate enough rooms
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
    }

    // Create corridors between rooms using L-shaped paths (BEFORE placing features)
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

    // Connect first and last room for more connectivity
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

    // NOW place special features AFTER corridors (so they don't get overwritten)
    for (const room of rooms) {
      const centerX = Math.floor(room.x + room.w / 2);
      const centerY = Math.floor(room.y + room.h / 2);

      // Only place feature if the tile is still floor (not overwritten by corridor)
      if (tiles[centerY][centerX] === TileType.FLOOR ||
          tiles[centerY][centerX] === TileType.GRASS ||
          tiles[centerY][centerX] === TileType.ICE) {
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

    // Calculate spawn position (at the entrance stairs)
    const spawnX = entranceX * tileSize + tileSize / 2;
    const spawnY = entranceY * tileSize + tileSize / 2;

    return {
      width,
      height,
      tileSize,
      tiles,
      name: `Dungeon Level ${level}`,
      spawnX,
      spawnY
    };
  }
}
