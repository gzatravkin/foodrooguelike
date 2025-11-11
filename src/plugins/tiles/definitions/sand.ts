import { TilePlugin } from '../TileRegistry';

export const SandTile: TilePlugin = {
  id: 'sand',
  name: 'Sand',
  color: '#F4A460',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      // Slight slowing effect
      if (player.slowedDuration <= 0) {
        player.slowedDuration = 0.1;
        player.slowMultiplier = 0.8; // Minor slow
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.5,
    requiresRoomType: ['normal', 'desert'],
  },
};
