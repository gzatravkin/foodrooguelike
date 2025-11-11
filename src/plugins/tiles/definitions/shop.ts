import { TilePlugin } from '../TileRegistry';

export const ShopTile: TilePlugin = {
  id: 'shop',
  name: 'Shop',
  color: '#FFD700',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreenUpdater - opens shop UI
      if (context?.showShop) {
        context.showShop();
      }
    },
  },
};
