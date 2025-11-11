import { TilePlugin } from '../TileRegistry';

export const CookingStationTile: TilePlugin = {
  id: 'cooking_station',
  name: 'Cooking Station',
  color: '#FF6347',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreenUpdater - opens cooking UI
      if (context?.showCookingMenu) {
        context.showCookingMenu();
      }
    },
  },
};
