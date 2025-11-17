/**
 * BuildingRegistry - Central registry for all interactive buildings
 * Enables single-file building definitions with automatic registration
 */

import { ComponentType } from 'preact';
import { TileRegistry, TilePlugin } from './tiles/TileRegistry';
import { Player } from '../entities/Player';
import { MapSystem, TileType } from '../systems/MapSystem';

export interface BuildingPlugin {
  // Basic info
  id: string;
  name: string;
  description?: string;

  // TileType mapping (OPTIONAL - auto-assigned if not provided!)
  tileType?: TileType;

  // Tile configuration
  tile: {
    color: string;
    walkable: boolean;
    blocksLight?: boolean;
    render?: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => void;
  };

  // Interaction
  interaction: {
    prompt: string; // e.g., "Press E to customize character"
    interactKey?: string; // Default: 'E'
    canInteract?: (player: Player, tileX: number, tileY: number, mapSystem: MapSystem) => boolean;
    onInteract?: (player: Player, tileX: number, tileY: number, mapSystem: MapSystem, onLog: (text: string, color: string) => void, context?: any) => void;
  };

  // Screen (optional - for buildings that open UI)
  screen?: {
    id: string; // Screen identifier (e.g., 'customization')
    component: ComponentType<any>; // Preact component
  };

  // Base camp placement (optional)
  baseCamp?: {
    enabled: boolean;
    position: { x: number; y: number }; // Tile position
    size?: { width: number; height: number }; // Default: 1x1
    priority?: number; // Higher priority = placed first (default: 0)
  };

  // Expedition/dungeon placement (optional - for future use)
  expedition?: {
    canSpawn: boolean;
    spawnWeight?: number;
    requiredLevel?: number;
  };
}

class BuildingRegistryClass {
  private buildings: Map<string, BuildingPlugin> = new Map();
  private screenComponents: Map<string, ComponentType<any>> = new Map();
  private screenIdToBuildingId: Map<string, string> = new Map();
  private tileTypeToId: Map<TileType, string> = new Map();
  private nextAutoTileType: number = 1000; // Start auto-assignment at 1000 to avoid conflicts

  register(building: BuildingPlugin): void {
    console.log(`🏢 Registering building: ${building.name}`);

    // AUTO-ASSIGN TileType if not provided!
    if (building.tileType === undefined) {
      building.tileType = this.nextAutoTileType as TileType;
      console.log(`   Auto-assigned TileType ${this.nextAutoTileType} to ${building.name}`);
      this.nextAutoTileType++;
    }

    // Store building
    this.buildings.set(building.id, building);

    // Store TileType mapping for automatic lookup
    this.tileTypeToId.set(building.tileType, building.id);

    // Auto-register as tile plugin
    const tilePlugin: TilePlugin = {
      id: building.id,
      name: building.name,
      tileType: building.tileType, // IMPORTANT: Pass the tileType to avoid double-assignment!
      color: building.tile.color,
      walkable: building.tile.walkable,
      blocksLight: building.tile.blocksLight,
      rendering: building.tile.render ? {
        render: building.tile.render
      } : undefined,
      interaction: {
        canInteract: building.interaction.canInteract || (() => true),
        onInteract: building.interaction.onInteract || (() => {}),
      },
    };
    TileRegistry.register(tilePlugin);

    // Auto-register screen component (if defined)
    if (building.screen) {
      this.screenComponents.set(building.screen.id, building.screen.component);
      this.screenIdToBuildingId.set(building.screen.id, building.id);
    }
  }

  getBuilding(id: string): BuildingPlugin | undefined {
    return this.buildings.get(id);
  }

  getBuildingByScreenId(screenId: string): BuildingPlugin | undefined {
    const buildingId = this.screenIdToBuildingId.get(screenId);
    return buildingId ? this.buildings.get(buildingId) : undefined;
  }

  getScreenComponent(screenId: string): ComponentType<any> | undefined {
    return this.screenComponents.get(screenId);
  }

  getAllBuildings(): BuildingPlugin[] {
    return Array.from(this.buildings.values());
  }

  getBaseCampBuildings(): BuildingPlugin[] {
    return this.getAllBuildings().filter(b => b.baseCamp?.enabled);
  }

  getInteractionPrompt(buildingId: string): string | null {
    const building = this.buildings.get(buildingId);
    return building?.interaction.prompt || null;
  }

  getScreenIdForBuilding(buildingId: string): string | null {
    const building = this.buildings.get(buildingId);
    return building?.screen?.id || null;
  }

  hasScreenForBuilding(buildingId: string): boolean {
    const building = this.buildings.get(buildingId);
    return !!building?.screen;
  }

  /**
   * Get building ID from TileType (automatic mapping!)
   * This eliminates the need for manual TileType -> ID mappings
   */
  getBuildingIdByTileType(tileType: TileType): string | null {
    return this.tileTypeToId.get(tileType) || null;
  }
}

export const BuildingRegistry = new BuildingRegistryClass();
