/**
 * Upgrades Hall Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { UpgradesScreen } from '../../components/screens/UpgradesScreen';


// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const UpgradesHallBuilding: BuildingPlugin = {
  id: 'upgrades_hall',
  name: 'Upgrades Hall',
  description: 'Purchase permanent upgrades for your kitchen, restaurant, and character',

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#9370DB',
    walkable: true,
    blocksLight: false,
  },

  interaction: {
    prompt: 'Press E to enter Upgrades Hall',
    interactKey: 'E',
  },

  screen: {
    id: 'upgrades',
    component: UpgradesScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 17, y: 16 },  // Fixed: was swapped
    size: { width: 2, height: 2 },
    priority: 85,
  },
};
