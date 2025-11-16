/**
 * Cooking Station Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { CookingScreen } from '../../components/screens/CookingScreen';


// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const CookingStationBuilding: BuildingPlugin = {
  id: 'cooking_station',
  name: 'Cooking Station',
  description: 'Cook delicious dishes from gathered ingredients',

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#FF6347',
    walkable: true,
    blocksLight: false,
  },

  interaction: {
    prompt: 'Press E to Cook',
    interactKey: 'E',
  },

  screen: {
    id: 'cooking',
    component: CookingScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 3, y: 2 },  // Fixed: was swapped
    size: { width: 2, height: 2 },
    priority: 95,
  },
};
