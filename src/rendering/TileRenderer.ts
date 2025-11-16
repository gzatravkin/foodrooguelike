/**
 * TileRenderer - Handles tile rendering for the game screen
 * Now automatically uses render functions from TileRegistry!
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TileType } from '../systems/MapSystem';
import { TerrainTileRenderer } from './TerrainTileRenderer';
import { StructureTileRenderer } from './StructureTileRenderer';
import { InteractiveTileRenderer } from './InteractiveTileRenderer';
import { TrapTileRenderer } from './TrapTileRenderer';
import { TileTypeMapper } from '../plugins/TileTypeMapper';
import { TileRegistry } from '../plugins/tiles/TileRegistry';
import { BuildingRegistry } from '../plugins/BuildingRegistry';

export class TileRenderer {
  private terrainRenderer: TerrainTileRenderer;
  private structureRenderer: StructureTileRenderer;
  private interactiveRenderer: InteractiveTileRenderer;
  private trapRenderer: TrapTileRenderer;

  constructor(private renderer: CanvasRenderer) {
    this.terrainRenderer = new TerrainTileRenderer(renderer);
    this.structureRenderer = new StructureTileRenderer(renderer);
    this.interactiveRenderer = new InteractiveTileRenderer(renderer);
    this.trapRenderer = new TrapTileRenderer(renderer);
  }

  public renderTile(tileType: TileType, worldX: number, worldY: number, size: number, x: number, y: number): void {
    // NEW SYSTEM: Try to get tile/building from registry first
    const tileId = TileTypeMapper.getTileIdFromType(tileType);
    if (tileId) {
      // Check if it's a building with custom render
      const building = BuildingRegistry.getBuilding(tileId);
      if (building?.tile.render) {
        const ctx = this.renderer.getContext();
        const camera = this.renderer.getCamera();

        // Apply camera transformation so render functions can use world coordinates
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        building.tile.render(ctx, worldX, worldY, size);
        ctx.restore();
        return;
      }

      // Check if it's a tile plugin with custom render
      const tilePlugin = TileRegistry.getTileById(tileId);
      if (tilePlugin?.rendering?.render) {
        const ctx = this.renderer.getContext();
        const camera = this.renderer.getCamera();

        // Apply camera transformation so render functions can use world coordinates
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        tilePlugin.rendering.render(ctx, worldX, worldY, size);
        ctx.restore();
        return;
      }

      // Fallback: render simple colored rectangle
      if (tilePlugin) {
        const camera = this.renderer.getCamera();
        const screenX = worldX - camera.x;
        const screenY = worldY - camera.y;
        const ctx = this.renderer.getContext();
        ctx.fillStyle = tilePlugin.color;
        ctx.fillRect(screenX, screenY, size, size);
        return;
      }
    }

    // LEGACY SYSTEM: Fallback for tiles not yet migrated to plugin system
    switch (tileType) {
      // Terrain tiles
      case TileType.GRASS:
        this.terrainRenderer.renderGrass(worldX, worldY, size, x, y);
        break;
      case TileType.WATER:
        this.terrainRenderer.renderWater(worldX, worldY, size, x, y);
        break;
      case TileType.LAVA:
        this.terrainRenderer.renderLava(worldX, worldY, size, x, y);
        break;
      case TileType.ICE:
        this.terrainRenderer.renderIce(worldX, worldY, size, x, y);
        break;

      // Structure tiles (basic ones without plugins yet)
      case TileType.FLOOR:
        this.structureRenderer.renderFloor(worldX, worldY, size, x, y);
        break;
      case TileType.WALL:
        this.structureRenderer.renderWall(worldX, worldY, size, x, y);
        break;
      case TileType.DOOR:
        this.structureRenderer.renderDoor(worldX, worldY, size);
        break;
      case TileType.EXPEDITION_PORTAL:
        this.structureRenderer.renderExpeditionPortal(worldX, worldY, size);
        break;
      case TileType.STAIRS_DOWN:
        this.structureRenderer.renderStairsDown(worldX, worldY, size);
        break;
      case TileType.STAIRS_UP:
        this.structureRenderer.renderStairsUp(worldX, worldY, size);
        break;

      // Trap tiles (if not in plugin system yet)
      case TileType.SPIKE_TRAP:
        this.trapRenderer.renderSpikeTrap(worldX, worldY, size);
        break;
      case TileType.POISON_TRAP:
        this.trapRenderer.renderPoisonTrap(worldX, worldY, size);
        break;
    }
  }
}
