import { TilePlugin } from '../TileRegistry';

export const WaterTile: TilePlugin = {
  id: 'water',
  name: 'Water',
  color: '#4169E1',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      // Slowing effect
      if (player.slowedDuration <= 0) {
        player.slowedDuration = 0.1;
        player.slowMultiplier = 0.5;
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.4,
    requiresRoomType: ['water'],
  },
};
