import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const harvestedMushrooms = new Set<string>();

export const MushroomPatchTile: TilePlugin = {
  id: 'mushroom_patch',
  name: 'Mushroom Patch',
  color: '#8B7355',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedMushrooms.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedMushrooms.has(key)) {
        onLog('The mushrooms have already been harvested', '#888');
        return;
      }

      harvestedMushrooms.add(key);
      onLog('Harvested mushrooms from the patch!', '#90EE90');

      // 85% common mushroom, 15% rare truffle
      if (Math.random() < 0.85) {
        // Harvest 1-2 mushrooms
        const count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          gameState.addToInventory('mushroom');
        }
        const template = entityFactory.getTemplate('mushroom');
        onLog(`Found: ${count}x ${template?.name || 'Mushroom'}`, '#90EE90');
      } else {
        gameState.addToInventory('truffle');
        const template = entityFactory.getTemplate('truffle');
        onLog(`Found rare: ${template?.name || 'Truffle'}!`, '#FFD700');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Dark ground
      ctx.fillStyle = '#2d2416';
      ctx.fillRect(worldX + size * 0.1, worldY + size * 0.6, size * 0.8, size * 0.3);

      // Left mushroom (small)
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.28, worldY + size * 0.6);
      ctx.lineTo(worldX + size * 0.32, worldY + size * 0.6);
      ctx.lineTo(worldX + size * 0.32, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.28, worldY + size * 0.5);
      ctx.fill();

      ctx.fillStyle = '#cd853f';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.3, worldY + size * 0.5, size * 0.1, 0, Math.PI, true);
      ctx.fill();

      // Middle mushroom (large)
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.48, worldY + size * 0.65);
      ctx.lineTo(worldX + size * 0.52, worldY + size * 0.65);
      ctx.lineTo(worldX + size * 0.52, worldY + size * 0.45);
      ctx.lineTo(worldX + size * 0.48, worldY + size * 0.45);
      ctx.fill();

      ctx.fillStyle = '#8b4513';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.45, size * 0.15, 0, Math.PI, true);
      ctx.fill();

      // Spots on large mushroom cap
      ctx.fillStyle = '#d2b48c';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.45, worldY + size * 0.4, size * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.55, worldY + size * 0.38, size * 0.03, 0, Math.PI * 2);
      ctx.fill();

      // Right mushroom (medium)
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.68, worldY + size * 0.63);
      ctx.lineTo(worldX + size * 0.72, worldY + size * 0.63);
      ctx.lineTo(worldX + size * 0.72, worldY + size * 0.48);
      ctx.lineTo(worldX + size * 0.68, worldY + size * 0.48);
      ctx.fill();

      ctx.fillStyle = '#a0522d';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.7, worldY + size * 0.48, size * 0.12, 0, Math.PI, true);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
    requiresRoomType: ['normal'],
  },
};
