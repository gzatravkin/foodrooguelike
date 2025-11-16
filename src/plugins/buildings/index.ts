/**
 * Building Plugin Auto-Loader
 * Automatically imports and registers all building definitions
 */

import { BuildingRegistry } from '../BuildingRegistry';

// Import all building definitions
import { CharacterCustomizationBuilding } from './character_customization';

/**
 * Initialize all buildings - called at game startup
 */
export function initializeBuildings(): void {
  console.log('🏢 Initializing building plugins...');

  // Auto-register all buildings
  BuildingRegistry.register(CharacterCustomizationBuilding);

  // TODO: Register other buildings as they are migrated
  // BuildingRegistry.register(ShopBuilding);
  // BuildingRegistry.register(TrainingHallBuilding);
  // BuildingRegistry.register(UpgradesHallBuilding);
  // BuildingRegistry.register(CookingStationBuilding);
  // BuildingRegistry.register(DiningRoomBuilding);

  console.log('✅ Building plugins initialized!');
}

export { BuildingRegistry };
