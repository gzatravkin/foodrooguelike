/**
 * Building Plugin Auto-Loader
 * Automatically imports and registers all building definitions
 */

import { BuildingRegistry } from '../BuildingRegistry';

// Import all building definitions
import { CharacterCustomizationBuilding } from './character_customization';
import { ShopBuilding } from './shop';
import { TrainingHallBuilding } from './training_hall';
import { UpgradesHallBuilding } from './upgrades_hall';
import { CookingStationBuilding } from './cooking_station';
import { DiningRoomBuilding } from './dining_room';

/**
 * Initialize all buildings - called at game startup
 */
export function initializeBuildings(): void {
  console.log('🏢 Initializing building plugins...');

  // Auto-register all buildings
  BuildingRegistry.register(CharacterCustomizationBuilding);
  BuildingRegistry.register(ShopBuilding);
  BuildingRegistry.register(TrainingHallBuilding);
  BuildingRegistry.register(UpgradesHallBuilding);
  BuildingRegistry.register(CookingStationBuilding);
  BuildingRegistry.register(DiningRoomBuilding);

  console.log('✅ All 6 buildings initialized!');
}

export { BuildingRegistry };
