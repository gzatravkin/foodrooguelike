import { TilePlugin } from '../TileRegistry';

let damageTimer = 0;

export const QuicksandTile: TilePlugin = {
  id: 'quicksand',
  name: 'Quicksand',
  color: '#DEB887',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      // Severe slowing
      if (player.slowedDuration <= 0) {
        player.slowedDuration = 0.1;
        player.slowMultiplier = 0.2; // Very slow!
      }
    },
    update: (deltaTime, player, tileX, tileY) => {
      // Check if player is on quicksand
      const map = (player as any).mapSystem?.getCurrentMap();
      if (!map) return;

      const playerTileX = Math.floor(player.x / map.tileSize);
      const playerTileY = Math.floor(player.y / map.tileSize);

      if (playerTileX === tileX && playerTileY === tileY) {
        damageTimer += deltaTime;
        if (damageTimer >= 1.0) {
          player.takeDamage(5);
          damageTimer = 0;
        }
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.2,
    requiresRoomType: ['desert', 'normal'],
  },
};
