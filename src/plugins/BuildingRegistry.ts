/**
 * BuildingRegistry - Central registry for all interactive buildings
 * Enables single-file building definitions with automatic registration
 */

import { ComponentType } from 'preact';
import { TileRegistry, TilePlugin } from './tiles/TileRegistry';
import { Player } from '../entities/Player';
import { MapSystem } from '../systems/MapSystem';

export interface BuildingPlugin {
  // Basic info
  id: string;
  name: string;
  description?: string;

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

  register(building: BuildingPlugin): void {
    console.log(`🏢 Registering building: ${building.name}`);

    // Store building
    this.buildings.set(building.id, building);

    // Auto-register as tile plugin
    const tilePlugin: TilePlugin = {
      id: building.id,
      name: building.name,
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
}

export const BuildingRegistry = new BuildingRegistryClass();
