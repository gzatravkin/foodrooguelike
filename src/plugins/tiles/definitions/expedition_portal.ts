import { TilePlugin } from '../TileRegistry';

export const ExpeditionPortalTile: TilePlugin = {
  id: 'expedition_portal',
  name: 'Expedition Portal',
  color: '#8B00FF',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreenUpdater - opens world map
      if (context?.showWorldMap) {
        context.showWorldMap();
      }
    },
  },
};
