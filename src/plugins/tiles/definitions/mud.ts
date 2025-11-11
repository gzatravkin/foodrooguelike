import { TilePlugin } from '../TileRegistry';

export const MudTile: TilePlugin = {
  id: 'mud',
  name: 'Mud',
  color: '#654321',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      // Heavy slowing effect
      if (player.slowedDuration <= 0) {
        player.slowedDuration = 0.1;
        player.slowMultiplier = 0.3; // Even slower than water!
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
    requiresRoomType: ['normal', 'swamp'],
  },
};
