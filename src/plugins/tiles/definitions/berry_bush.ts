import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';
import { TileType } from '../../../systems/MapSystem';

const harvestedBushes = new Set<string>();

export const BerryBushTile: TilePlugin = {
  id: 'berry_bush',
  name: 'Berry Bush',
  color: '#8B4513',
  walkable: true,
  blocksLight: false,
  tileType: TileType.BERRY_BUSH,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedBushes.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedBushes.has(key)) {
        onLog('The bush has already been harvested', '#888');
        return;
      }

      harvestedBushes.add(key);
      onLog('Harvested berries from the bush!', '#90EE90');

      // 60% chance for sugar, 40% chance for honey (uncommon)
      if (Math.random() < 0.6) {
        gameState.addToInventory('sugar');
        const template = entityFactory.getTemplate('sugar');
        onLog(`Found: ${template?.name || 'Sugar'}`, '#90EE90');
      } else {
        gameState.addToInventory('honey');
        const template = entityFactory.getTemplate('honey');
        onLog(`Found: ${template?.name || 'Honey'}`, '#FFD700');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Bush base (dark green)
      ctx.fillStyle = '#2d5016';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.6, size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Bush highlights (lighter green)
      ctx.fillStyle = '#4a7c2e';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.35, worldY + size * 0.5, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.65, worldY + size * 0.55, size * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Berries (red dots)
      ctx.fillStyle = '#dc143c';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.4, worldY + size * 0.5, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.6, worldY + size * 0.55, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.65, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
    requiresRoomType: ['normal', 'garden'],
  },
};
