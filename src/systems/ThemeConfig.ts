/**
 * ThemeConfig - Theme-specific configurations for dungeons
 */

export type Theme = 'forest' | 'cave' | 'ruins' | 'dungeon' | 'ice' | 'lava' | 'void';

export interface ThemeColors {
  floor: string;
  wall: string;
  alternateFloor?: string;
  accentColor: string;
}

export interface ThemeGenerationConfig {
  // Room generation
  roomShape: 'rectangular' | 'irregular' | 'circular' | 'mixed' | 'chaotic';
  minRoomSize: number;
  maxRoomSize: number;
  roomSizeVariation: number; // 0-1, how much sizes vary

  // Corridor style
  corridorStyle: 'straight' | 'winding' | 'natural' | 'chaotic';
  corridorWidth: number;

  // Hazard tiles
  hazardTiles: string[];
  hazardDensity: number; // 0-1

  // Interactive objects
  interactiveTiles: string[];
  interactiveDensity: number; // 0-1

  // Special features
  openness: number; // 0-1, how open vs cramped
  connectivity: number; // 0-1, how many extra connections between rooms
}

export const ThemeConfigs: Record<Theme, { colors: ThemeColors; generation: ThemeGenerationConfig }> = {
  forest: {
    colors: {
      floor: '#2d5016',
      wall: '#1a3010',
      alternateFloor: '#3a6b1f',
      accentColor: '#4a8b2c',
    },
    generation: {
      roomShape: 'irregular',
      minRoomSize: 6,
      maxRoomSize: 12,
      roomSizeVariation: 0.8,
      corridorStyle: 'winding',
      corridorWidth: 2,
      hazardTiles: ['water', 'grass', 'mud'],
      hazardDensity: 0.5,
      interactiveTiles: ['health_fountain', 'wishing_well', 'treasure_chest', 'campfire'],
      interactiveDensity: 0.4,
      openness: 0.7,
      connectivity: 0.6,
    },
  },
  cave: {
    colors: {
      floor: '#3a3a3a',
      wall: '#1a1a1a',
      alternateFloor: '#4a4a4a',
      accentColor: '#2a5a7a',
    },
    generation: {
      roomShape: 'irregular',
      minRoomSize: 7,
      maxRoomSize: 14,
      roomSizeVariation: 0.9,
      corridorStyle: 'natural',
      corridorWidth: 2,
      hazardTiles: ['water', 'ice'],
      hazardDensity: 0.3,
      interactiveTiles: ['statue', 'treasure_chest', 'shrine', 'spike_trap'],
      interactiveDensity: 0.35,
      openness: 0.6,
      connectivity: 0.4,
    },
  },
  ruins: {
    colors: {
      floor: '#5a5a4a',
      wall: '#3a3a2a',
      alternateFloor: '#6a6a5a',
      accentColor: '#8a7a5a',
    },
    generation: {
      roomShape: 'rectangular',
      minRoomSize: 6,
      maxRoomSize: 10,
      roomSizeVariation: 0.5,
      corridorStyle: 'straight',
      corridorWidth: 2,
      hazardTiles: ['grass', 'mud'],
      hazardDensity: 0.4,
      interactiveTiles: ['shrine', 'statue', 'treasure_chest', 'spike_trap', 'poison_trap'],
      interactiveDensity: 0.4,
      openness: 0.5,
      connectivity: 0.5,
    },
  },
  dungeon: {
    colors: {
      floor: '#2a2a2a',
      wall: '#555555',
      alternateFloor: '#353535',
      accentColor: '#6a6a6a',
    },
    generation: {
      roomShape: 'rectangular',
      minRoomSize: 8,
      maxRoomSize: 12,
      roomSizeVariation: 0.3,
      corridorStyle: 'straight',
      corridorWidth: 2,
      hazardTiles: [],
      hazardDensity: 0.2,
      interactiveTiles: ['treasure_chest', 'shrine', 'spike_trap', 'poison_trap', 'mysterious_door'],
      interactiveDensity: 0.5,
      openness: 0.4,
      connectivity: 0.3,
    },
  },
  ice: {
    colors: {
      floor: '#b0d8f0',
      wall: '#6090c0',
      alternateFloor: '#c0e8ff',
      accentColor: '#7ab0e0',
    },
    generation: {
      roomShape: 'irregular',
      minRoomSize: 10,
      maxRoomSize: 16,
      roomSizeVariation: 0.7,
      corridorStyle: 'natural',
      corridorWidth: 3,
      hazardTiles: ['ice', 'water'],
      hazardDensity: 0.7,
      interactiveTiles: ['magic_circle', 'statue', 'shrine', 'treasure_chest'],
      interactiveDensity: 0.3,
      openness: 0.8,
      connectivity: 0.5,
    },
  },
  lava: {
    colors: {
      floor: '#3a1a0a',
      wall: '#1a0a00',
      alternateFloor: '#4a2a1a',
      accentColor: '#ff4500',
    },
    generation: {
      roomShape: 'irregular',
      minRoomSize: 8,
      maxRoomSize: 14,
      roomSizeVariation: 0.8,
      corridorStyle: 'natural',
      corridorWidth: 2,
      hazardTiles: ['lava'],
      hazardDensity: 0.5,
      interactiveTiles: ['shrine', 'treasure_chest', 'magic_circle', 'spike_trap'],
      interactiveDensity: 0.4,
      openness: 0.6,
      connectivity: 0.6,
    },
  },
  void: {
    colors: {
      floor: '#1a0a1a',
      wall: '#0a000a',
      alternateFloor: '#2a1a2a',
      accentColor: '#6a2a6a',
    },
    generation: {
      roomShape: 'chaotic',
      minRoomSize: 6,
      maxRoomSize: 16,
      roomSizeVariation: 1.0,
      corridorStyle: 'chaotic',
      corridorWidth: 2,
      hazardTiles: ['lava', 'poison_trap', 'spike_trap'],
      hazardDensity: 0.6,
      interactiveTiles: ['magic_circle', 'shrine', 'treasure_chest', 'teleporter', 'mysterious_door'],
      interactiveDensity: 0.5,
      openness: 0.7,
      connectivity: 0.8,
    },
  },
};

export function getThemeConfig(theme: Theme): { colors: ThemeColors; generation: ThemeGenerationConfig } {
  return ThemeConfigs[theme] || ThemeConfigs.dungeon;
}
