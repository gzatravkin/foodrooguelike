import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';

const openedDoors = new Set<string>();

export const MysteriousDoorTile: TilePlugin = {
  id: 'mysterious_door',
  name: 'Mysterious Door',
  color: '#4B0082',
  walkable: false,
  blocksLight: true,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !openedDoors.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (openedDoors.has(key)) {
        onLog('The door is already open', '#888');
        return;
      }

      const cost = 50;
      if (!gameState.spendGold(cost)) {
        onLog(`Need ${cost} gold to open`, '#FF0000');
        return;
      }

      openedDoors.add(key);

      // Change tile to floor
      const map = mapSystem.getCurrentMap();
      if (map) {
        map.tiles[tileY][tileX] = 0; // Floor tile index
      }

      onLog(`Spent ${cost} gold to open the door`, '#FFD700');
      onLog('The door opens to reveal...', '#4B0082');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Door frame
      ctx.strokeStyle = '#4B0082';
      ctx.lineWidth = 3;
      ctx.strokeRect(worldX + size * 0.15, worldY + size * 0.1, size * 0.7, size * 0.8);

      // Door surface
      ctx.fillStyle = '#483D8B';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.15, size * 0.6, size * 0.7);

      // Mystical runes
      const time = Date.now() / 1000;
      const glow = Math.sin(time * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(138, 43, 226, ${glow})`;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(worldX + size * (0.3 + i * 0.15), worldY + size * 0.4, 4, 4);
      }

      // Lock
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.7, worldY + size / 2, size * 0.06, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.1,
  },
};
