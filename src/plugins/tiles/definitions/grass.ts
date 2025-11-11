import { TilePlugin } from '../TileRegistry';

export const GrassTile: TilePlugin = {
  id: 'grass',
  name: 'Grass',
  color: '#228B22',
  walkable: true,
  blocksLight: false,
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.6,
    requiresRoomType: ['normal', 'grass'],
  },
};
