/**
 * TileUtils - Utility functions for tile rendering
 */

export class TileUtils {
  /**
   * Converts a hex color to rgba format
   */
  static hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
