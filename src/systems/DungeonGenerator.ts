/**
 * DungeonGenerator - Procedural dungeon generation
 */

import { TileType, GameMap } from './TileTypes';
import { Theme, getThemeConfig } from './ThemeConfig';

export class DungeonGenerator {
  // Create a procedurally generated dungeon map with variety
  static generate(level: number = 1, theme?: Theme): GameMap {
    const themeConfig = theme ? getThemeConfig(theme) : null;

    // Retry generation up to 5 times to ensure valid map
    for (let attempt = 0; attempt < 5; attempt++) {
      const result = this.generateAttempt(level, theme, themeConfig);

      // Validate the generated map
      if (result && this.validate(result)) {
        return result;
      }

      console.warn(`Dungeon generation attempt ${attempt + 1} failed, retrying...`);
    }

    // Fallback: return a simple valid dungeon
    console.error('Failed to generate valid dungeon after 5 attempts, using fallback');
    return this.generateFallback(level);
  }

  private static validate(map: GameMap): boolean {
    // Check that spawn position exists and is valid
    if (typeof map.spawnX !== 'number' || typeof map.spawnY !== 'number') return false;

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

  private static generateFallback(level: number): GameMap {
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

  private static generateAttempt(level: number, theme?: Theme, themeConfig?: any): GameMap | null {
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

    // Adjust based on theme openness
    if (themeConfig?.generation.openness > 0.7) {
      width = Math.floor(width * 1.2);
      height = Math.floor(height * 1.2);
    } else if (themeConfig?.generation.openness < 0.5) {
      width = Math.floor(width * 0.9);
      height = Math.floor(height * 0.9);
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
        // Use theme-specific room sizing if available
        let minSize = 5;
        let maxSize = 12;
        if (themeConfig) {
          minSize = themeConfig.generation.minRoomSize;
          maxSize = themeConfig.generation.maxRoomSize;
        }

        let w = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
        let h = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));

        // Apply room size variation based on theme
        if (themeConfig?.generation.roomSizeVariation > 0.6) {
          // High variation: some rooms much bigger or smaller
          const variance = 1 + (Math.random() - 0.5) * themeConfig.generation.roomSizeVariation;
          w = Math.max(minSize, Math.floor(w * variance));
          h = Math.max(minSize, Math.floor(h * variance));
        }

        // For irregular/circular rooms, adjust aspect ratio
        if (themeConfig?.generation.roomShape === 'irregular' || themeConfig?.generation.roomShape === 'circular') {
          const aspectRatio = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
          w = Math.floor(w * aspectRatio);
        }

        const x = 2 + Math.floor(Math.random() * (width - w - 4));
        const y = 2 + Math.floor(Math.random() * (height - h - 4));

        // Check if room overlaps with existing rooms
        let overlaps = false;
        const spacing = themeConfig?.generation.openness > 0.6 ? 3 : 2;
        for (const room of rooms) {
          if (!(x + w + spacing < room.x || x > room.x + room.w + spacing ||
                y + h + spacing < room.y || y > room.y + room.h + spacing)) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          // Assign room type based on theme hazards
          let roomTypes = ['normal', 'treasure'];
          if (themeConfig?.generation.hazardTiles.includes('water')) roomTypes.push('water');
          if (themeConfig?.generation.hazardTiles.includes('lava')) roomTypes.push('lava');
          if (themeConfig?.generation.hazardTiles.includes('ice')) roomTypes.push('ice');
          if (themeConfig?.generation.hazardTiles.includes('grass')) roomTypes.push('grass');
          if (themeConfig?.generation.hazardTiles.includes('mud')) roomTypes.push('mud');

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

    // Create corridors between rooms using theme-appropriate style (BEFORE placing features)
    const corridorWidth = themeConfig?.generation.corridorWidth || 1;
    const corridorStyle = themeConfig?.generation.corridorStyle || 'straight';

    for (let i = 0; i < rooms.length - 1; i++) {
      this.createCorridor(tiles, rooms[i], rooms[i + 1], corridorWidth, corridorStyle);
    }

    // Add extra connections based on theme connectivity
    const extraConnections = Math.floor((rooms.length - 2) * (themeConfig?.generation.connectivity || 0.4));
    for (let i = 0; i < extraConnections; i++) {
      const room1 = rooms[Math.floor(Math.random() * rooms.length)];
      const room2 = rooms[Math.floor(Math.random() * rooms.length)];
      if (room1 !== room2) {
        this.createCorridor(tiles, room1, room2, corridorWidth, corridorStyle);
      }
    }

    // Connect first and last room for better flow
    if (rooms.length > 2 && (themeConfig?.generation.connectivity || 0.4) > 0.5) {
      this.createCorridor(tiles, rooms[0], rooms[rooms.length - 1], corridorWidth, corridorStyle);
    }

    // NOW place special features AFTER corridors (so they don't get overwritten)
    const interactiveDensity = themeConfig?.generation.interactiveDensity || 0.4;
    const interactiveTiles = themeConfig?.generation.interactiveTiles || ['health_fountain', 'treasure_chest', 'shrine', 'teleporter'];

    for (const room of rooms) {
      const centerX = Math.floor(room.x + room.w / 2);
      const centerY = Math.floor(room.y + room.h / 2);

      // Only place feature if the tile is still floor (not overwritten by corridor)
      if (tiles[centerY][centerX] === TileType.FLOOR ||
          tiles[centerY][centerX] === TileType.GRASS ||
          tiles[centerY][centerX] === TileType.ICE) {
        if (room.type === 'treasure' && room.w >= 6 && room.h >= 6) {
          // Always place treasure chest in treasure rooms
          tiles[centerY][centerX] = TileType.TREASURE_CHEST;
        } else if (Math.random() < interactiveDensity) {
          // Place theme-appropriate interactive tile
          const tileChoice = interactiveTiles[Math.floor(Math.random() * interactiveTiles.length)];
          const tileType = this.getInteractiveTileType(tileChoice);
          if (tileType !== null) {
            tiles[centerY][centerX] = tileType;
          }
        }
      }

      // Add traps based on theme
      const trapChance = interactiveTiles.some((t: string) => t.includes('trap')) ? 0.5 : 0.3;
      if (Math.random() < trapChance) {
        const numTraps = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numTraps; i++) {
          const tx = room.x + 1 + Math.floor(Math.random() * (room.w - 2));
          const ty = room.y + 1 + Math.floor(Math.random() * (room.h - 2));
          if (tiles[ty][tx] === TileType.FLOOR || tiles[ty][tx] === TileType.GRASS) {
            // Use theme-appropriate traps
            if (interactiveTiles.includes('spike_trap') && interactiveTiles.includes('poison_trap')) {
              tiles[ty][tx] = Math.random() < 0.5 ? TileType.SPIKE_TRAP : TileType.POISON_TRAP;
            } else if (interactiveTiles.includes('spike_trap')) {
              tiles[ty][tx] = TileType.SPIKE_TRAP;
            } else if (interactiveTiles.includes('poison_trap')) {
              tiles[ty][tx] = TileType.POISON_TRAP;
            } else {
              tiles[ty][tx] = Math.random() < 0.5 ? TileType.SPIKE_TRAP : TileType.POISON_TRAP;
            }
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

  private static createCorridor(
    tiles: TileType[][],
    room1: { x: number; y: number; w: number; h: number },
    room2: { x: number; y: number; w: number; h: number },
    width: number,
    style: string
  ): void {
    const x1 = Math.floor(room1.x + room1.w / 2);
    const y1 = Math.floor(room1.y + room1.h / 2);
    const x2 = Math.floor(room2.x + room2.w / 2);
    const y2 = Math.floor(room2.y + room2.h / 2);

    if (style === 'winding' || style === 'natural') {
      // Create a winding path with multiple segments
      let currentX = x1;
      let currentY = y1;
      const steps = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i <= steps; i++) {
        const targetX = x1 + Math.floor((x2 - x1) * (i / steps));
        const targetY = y1 + Math.floor((y2 - y1) * (i / steps));

        // Add some randomness to path
        const offsetX = style === 'natural' ? Math.floor(Math.random() * 3 - 1) : 0;
        const offsetY = style === 'natural' ? Math.floor(Math.random() * 3 - 1) : 0;

        this.carvePath(tiles, currentX, currentY, targetX + offsetX, targetY + offsetY, width);
        currentX = targetX + offsetX;
        currentY = targetY + offsetY;
      }
    } else if (style === 'chaotic') {
      // Chaotic paths with multiple random waypoints
      const waypoints = [{ x: x1, y: y1 }];
      const numWaypoints = 2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < numWaypoints; i++) {
        waypoints.push({
          x: Math.min(x1, x2) + Math.floor(Math.random() * Math.abs(x2 - x1)),
          y: Math.min(y1, y2) + Math.floor(Math.random() * Math.abs(y2 - y1))
        });
      }
      waypoints.push({ x: x2, y: y2 });

      for (let i = 0; i < waypoints.length - 1; i++) {
        this.carvePath(tiles, waypoints[i].x, waypoints[i].y, waypoints[i + 1].x, waypoints[i + 1].y, width);
      }
    } else {
      // Straight L-shaped corridor
      if (Math.random() < 0.5) {
        this.carvePath(tiles, x1, y1, x2, y1, width);
        this.carvePath(tiles, x2, y1, x2, y2, width);
      } else {
        this.carvePath(tiles, x1, y1, x1, y2, width);
        this.carvePath(tiles, x1, y2, x2, y2, width);
      }
    }
  }

  private static carvePath(
    tiles: TileType[][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number
  ): void {
    const height = tiles.length;
    const mapWidth = tiles[0].length;

    // Carve horizontal segment
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let w = 0; w < width; w++) {
        const y = y1 + w - Math.floor(width / 2);
        if (y >= 0 && y < height && x >= 0 && x < mapWidth) {
          if (tiles[y][x] === TileType.WALL) {
            tiles[y][x] = TileType.FLOOR;
          }
        }
      }
    }

    // Carve vertical segment
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      for (let w = 0; w < width; w++) {
        const x = x2 + w - Math.floor(width / 2);
        if (y >= 0 && y < height && x >= 0 && x < mapWidth) {
          if (tiles[y][x] === TileType.WALL) {
            tiles[y][x] = TileType.FLOOR;
          }
        }
      }
    }
  }

  private static getInteractiveTileType(tileId: string): TileType | null {
    // Map tile IDs to TileType enum values
    const mapping: Record<string, TileType> = {
      'health_fountain': TileType.HEALTH_FOUNTAIN,
      'treasure_chest': TileType.TREASURE_CHEST,
      'shrine': TileType.SHRINE,
      'teleporter': TileType.TELEPORTER,
      'spike_trap': TileType.SPIKE_TRAP,
      'poison_trap': TileType.POISON_TRAP,
      // Harvestable items
      'berry_bush': TileType.BERRY_BUSH,
      'herb_plant': TileType.HERB_PLANT,
      'mushroom_patch': TileType.MUSHROOM_PATCH,
      'crystal_formation': TileType.CRYSTAL_FORMATION,
      'fire_plant': TileType.FIRE_PLANT,
      'void_plant': TileType.VOID_PLANT,
      'ancient_tree': TileType.ANCIENT_TREE,
    };
    return mapping[tileId] || null;
  }
}
