import { TilePlugin } from '../TileRegistry';

export const LavaTile: TilePlugin = {
  id: 'lava',
  name: 'Lava',
  color: '#FF4500',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      // Damage is handled by TileInteractionManager with a cooldown
      // This is just a marker
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
    requiresRoomType: ['lava'],
  },
};
