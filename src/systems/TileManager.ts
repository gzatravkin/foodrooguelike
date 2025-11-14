/**
 * TileManager - Handles tile colors and properties
 */

import { TileType } from './TileTypes';
import { Theme, ThemeConfigs } from './ThemeConfig';

export class TileManager {
  private static tileColors: Map<TileType, string> = new Map();
  private static currentTheme: Theme | null = null;

  static {
    // Initialize tile colors when the class is loaded
    this.setupTileColors();
  }

  private static setupTileColors(): void {
    this.tileColors.set(TileType.FLOOR, '#2a2a2a');
    this.tileColors.set(TileType.WALL, '#555');
    this.tileColors.set(TileType.DOOR, '#8b4513');
    this.tileColors.set(TileType.COOKING_STATION, '#ff6b35');
    this.tileColors.set(TileType.SHOP, '#4ecdc4');
    this.tileColors.set(TileType.EXPEDITION_PORTAL, '#9b59b6');
    this.tileColors.set(TileType.TRAINING_HALL, '#FFD700');
    this.tileColors.set(TileType.UPGRADES_HALL, '#b19cd9');
    this.tileColors.set(TileType.DINING_ROOM, '#ff9999');
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

  static setTheme(theme: Theme | null): void {
    this.currentTheme = theme;
  }

  static getCurrentTheme(): Theme | null {
    return this.currentTheme;
  }

  static getTileColor(type: TileType): string {
    // Use theme-specific colors for floor and wall if a theme is active
    if (this.currentTheme) {
      const themeConfig = ThemeConfigs[this.currentTheme];
      if (themeConfig) {
        if (type === TileType.FLOOR) {
          return themeConfig.colors.floor;
        }
        if (type === TileType.WALL) {
          return themeConfig.colors.wall;
        }
      }
    }

    return this.tileColors.get(type) || '#000';
  }

  static isTileWalkable(type: TileType): boolean {
    return type !== TileType.WALL;
  }
}
