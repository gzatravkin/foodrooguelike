import { TilePlugin } from '../TileRegistry';
import { TileType } from '../../../systems/MapSystem';
import { gameState } from '../../../core/GameState';

export const ExpeditionPortalTile: TilePlugin = {
  id: 'expedition_portal',
  name: 'Expedition Portal',
  tileType: TileType.EXPEDITION_PORTAL, // Map to TileType enum
  color: '#8B00FF',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Open world map using centralized game state
      gameState.setScreen('worldmap');
    },
  },
};
