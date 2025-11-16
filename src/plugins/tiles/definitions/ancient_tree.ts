import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';
import { TileType } from '../../../systems/MapSystem';

const harvestedTrees = new Set<string>();

export const AncientTreeTile: TilePlugin = {
  id: 'ancient_tree',
  name: 'Ancient Fruit Tree',
  color: '#8B4513',
  walkable: true,
  blocksLight: false,
  tileType: TileType.ANCIENT_TREE,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedTrees.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedTrees.has(key)) {
        onLog('The ancient tree has already been harvested', '#888');
        return;
      }

      harvestedTrees.add(key);
      onLog('Harvested fruit from the ancient tree!', '#90EE90');

      // 70% dragon_fruit, 30% ancient_grain (both rare)
      if (Math.random() < 0.7) {
        gameState.addToInventory('dragon_fruit');
        const template = entityFactory.getTemplate('dragon_fruit');
        onLog(`Found: ${template?.name || 'Dragon Fruit'}`, '#FFD700');
      } else {
        gameState.addToInventory('ancient_grain');
        const template = entityFactory.getTemplate('ancient_grain');
        onLog(`Found: ${template?.name || 'Ancient Grain'}`, '#FFD700');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Tree trunk (brown)
      ctx.fillStyle = '#654321';
      ctx.fillRect(worldX + size * 0.42, worldY + size * 0.45, size * 0.16, size * 0.45);

      // Tree bark texture
      ctx.strokeStyle = '#4a3219';
      ctx.lineWidth = size * 0.02;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.44, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.44, worldY + size * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.56, worldY + size * 0.55);
      ctx.lineTo(worldX + size * 0.56, worldY + size * 0.9);
      ctx.stroke();

      // Canopy (dark green - ancient)
      ctx.fillStyle = '#2d5016';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.35, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Lighter green highlights
      ctx.fillStyle = '#3d6626';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.4, worldY + size * 0.3, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.6, worldY + size * 0.32, size * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Dragon fruit (pink/magenta)
      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.38, worldY + size * 0.35, size * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.55, worldY + size * 0.3, size * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // Fruit highlights
      ctx.fillStyle = '#ff69b4';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.37, worldY + size * 0.33, size * 0.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.54, worldY + size * 0.28, size * 0.02, 0, Math.PI * 2);
      ctx.fill();

      // Ancient glow effect (golden aura)
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.4, size * 0.38, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.1, // Rare spawn
    requiresRoomType: ['normal', 'garden', 'treasure'],
  },
};
