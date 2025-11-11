/**
 * TileRenderer - Handles tile rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TileType } from '../systems/MapSystem';
import { TerrainTileRenderer } from './TerrainTileRenderer';
import { StructureTileRenderer } from './StructureTileRenderer';
import { InteractiveTileRenderer } from './InteractiveTileRenderer';
import { TrapTileRenderer } from './TrapTileRenderer';

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

      // Structure tiles
      case TileType.FLOOR:
        this.structureRenderer.renderFloor(worldX, worldY, size, x, y);
        break;
      case TileType.WALL:
        this.structureRenderer.renderWall(worldX, worldY, size, x, y);
        break;
      case TileType.DOOR:
        this.structureRenderer.renderDoor(worldX, worldY, size);
        break;
      case TileType.COOKING_STATION:
        this.structureRenderer.renderCookingStation(worldX, worldY, size);
        break;
      case TileType.SHOP:
        this.structureRenderer.renderShopTile(worldX, worldY, size);
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

      // Interactive tiles
      case TileType.HEALTH_FOUNTAIN:
        this.interactiveRenderer.renderHealthFountain(worldX, worldY, size);
        break;
      case TileType.TREASURE_CHEST:
        this.interactiveRenderer.renderTreasureChest(worldX, worldY, size);
        break;
      case TileType.TELEPORTER:
        this.interactiveRenderer.renderTeleporter(worldX, worldY, size);
        break;
      case TileType.SHRINE:
        this.interactiveRenderer.renderShrine(worldX, worldY, size);
        break;

      // Trap tiles
      case TileType.SPIKE_TRAP:
        this.trapRenderer.renderSpikeTrap(worldX, worldY, size);
        break;
      case TileType.POISON_TRAP:
        this.trapRenderer.renderPoisonTrap(worldX, worldY, size);
        break;
    }
  }
}
