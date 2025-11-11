import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const harvestedCrystals = new Set<string>();

export const CrystalFormationTile: TilePlugin = {
  id: 'crystal_formation',
  name: 'Crystal Formation',
  color: '#87CEEB',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedCrystals.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedCrystals.has(key)) {
        onLog('The crystals have already been harvested', '#888');
        return;
      }

      harvestedCrystals.add(key);
      onLog('Harvested crystal salt from the formation!', '#87CEEB');

      // Always gives crystal_salt (rare ingredient)
      gameState.addToInventory('crystal_salt');
      const template = entityFactory.getTemplate('crystal_salt');
      onLog(`Found: ${template?.name || 'Crystal Salt'}`, '#FFD700');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Base rock
      ctx.fillStyle = '#696969';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.65, size * 0.6, size * 0.25);

      // Crystal shards (light blue)
      ctx.fillStyle = '#87ceeb';

      // Left crystal
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.3, worldY + size * 0.65);
      ctx.lineTo(worldX + size * 0.28, worldY + size * 0.4);
      ctx.lineTo(worldX + size * 0.36, worldY + size * 0.65);
      ctx.fill();

      // Middle crystal (tallest)
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.48, worldX + size * 0.65);
      ctx.lineTo(worldX + size * 0.5, worldY + size * 0.3);
      ctx.lineTo(worldX + size * 0.52, worldY + size * 0.65);
      ctx.fill();

      // Right crystal
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.64, worldY + size * 0.65);
      ctx.lineTo(worldX + size * 0.68, worldY + size * 0.45);
      ctx.lineTo(worldX + size * 0.72, worldY + size * 0.65);
      ctx.fill();

      // Highlights on crystals (white)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.29, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.28, worldY + size * 0.4);
      ctx.lineTo(worldX + size * 0.31, worldY + size * 0.55);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.49, worldY + size * 0.4);
      ctx.lineTo(worldX + size * 0.5, worldY + size * 0.3);
      ctx.lineTo(worldX + size * 0.51, worldY + size * 0.45);
      ctx.fill();

      // Glow effect
      ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.5, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.15, // Rarer spawn
    requiresRoomType: ['normal', 'treasure'],
  },
};
