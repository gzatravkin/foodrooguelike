import { TilePlugin } from '../TileRegistry';

export const WallTile: TilePlugin = {
  id: 'wall',
  name: 'Wall',
  color: '#444',
  walkable: false,
  blocksLight: true,
};
