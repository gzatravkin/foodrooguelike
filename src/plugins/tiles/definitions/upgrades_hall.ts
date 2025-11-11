import { TilePlugin } from '../TileRegistry';

export const UpgradesHallTile: TilePlugin = {
  id: 'upgrades_hall',
  name: 'Upgrades Hall',
  color: '#9370DB',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreenUpdater - opens upgrades UI
      if (context?.showUpgradesHall) {
        context.showUpgradesHall();
      }
    },
  },
};
