/**
 * TilesetGenerator - Generates a tileset image from tile plugins
 * Creates a single image containing all tile graphics for Phaser tilemap
 */

import { TileRegistry } from '../plugins/tiles/TileRegistry';

export class TilesetGenerator {
  private tileSize: number = 32;
  private tilesPerRow: number = 16; // 16x16 grid = 256 tiles max

  /**
   * Generate a tileset image from all registered tiles
   * Returns a canvas that can be converted to blob URL for Phaser
   */
  generateTileset(): HTMLCanvasElement {
    const tiles = TileRegistry.getAll();
    const tileCount = tiles.length;
    const rows = Math.ceil(tileCount / this.tilesPerRow);

    // Create canvas for tileset
    const canvas = document.createElement('canvas');
    canvas.width = this.tilesPerRow * this.tileSize;
    canvas.height = rows * this.tileSize;
    const ctx = canvas.getContext('2d')!;

    // Draw each tile
    tiles.forEach((tile, index) => {
      const x = (index % this.tilesPerRow) * this.tileSize;
      const y = Math.floor(index / this.tilesPerRow) * this.tileSize;

      // Fill with tile color
      ctx.fillStyle = tile.color;
      ctx.fillRect(x, y, this.tileSize, this.tileSize);

      // If tile has custom rendering, use it
      if (tile.rendering?.render) {
        ctx.save();
        tile.rendering.render(ctx, x, y, this.tileSize);
        ctx.restore();
      }

      // Add border for debugging (commented out for production)
      // ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      // ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    });

    return canvas;
  }

  /**
   * Get tile index for a given tile ID
   */
  getTileIndex(tileId: string): number {
    return TileRegistry.getTileIndex(tileId);
  }

  /**
   * Generate tileset as blob URL for Phaser loading
   */
  generateTilesetURL(): string {
    const canvas = this.generateTileset();
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      }, 'image/png');
    }) as any;
  }

  /**
   * Generate tileset synchronously (returns data URL)
   */
  generateTilesetDataURL(): string {
    const canvas = this.generateTileset();
    return canvas.toDataURL('image/png');
  }
}
