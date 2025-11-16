/**
 * Shop Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { ShopScreen } from '../../components/screens/ShopScreen';
import { TileType } from '../../systems/MapSystem';

// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const ShopBuilding: BuildingPlugin = {
  id: 'shop',
  name: 'Shop',
  description: 'Buy weapons and equipment to prepare for expeditions',

  tileType: TileType.SHOP,

  tile: {
    color: '#FFD700',
    walkable: true,
    blocksLight: false,
  },

  interaction: {
    prompt: 'Press E to enter Shop',
    interactKey: 'E',
  },

  screen: {
    id: 'shop',
    component: ShopScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 17, y: 2 },
    size: { width: 2, height: 2 },
    priority: 100,
  },
};
