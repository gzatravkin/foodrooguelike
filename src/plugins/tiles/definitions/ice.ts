import { TilePlugin } from '../TileRegistry';

export const IceTile: TilePlugin = {
  id: 'ice',
  name: 'Ice',
  color: '#B0E0E6',
  walkable: true,
  blocksLight: false,
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 1.0,
    requiresRoomType: ['ice'],
  },
};
