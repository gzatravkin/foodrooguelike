import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';

export const BlacksmithTile: TilePlugin = {
  id: 'blacksmith',
  name: 'Blacksmith',
  color: '#B87333',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Blacksmith repairs and upgrades
      const cost = 30;
      if (!gameState.spendGold(cost)) {
        onLog(`Blacksmith service costs ${cost} gold`, '#FF0000');
        return;
      }

      // Increase player defense
      player.stats.defense += 2;
      player.heal(20);

      onLog(`Paid ${cost} gold for smithing`, '#B87333');
      onLog('Equipment repaired! +2 defense, +20 HP', '#FFD700');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Anvil
      ctx.fillStyle = '#696969';
      ctx.fillRect(worldX + size * 0.3, worldY + size * 0.5, size * 0.4, size * 0.3);

      // Hammer
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(worldX + size * 0.6, worldY + size * 0.3, size * 0.1, size * 0.3);
      ctx.fillStyle = '#A9A9A9';
      ctx.fillRect(worldX + size * 0.55, worldY + size * 0.25, size * 0.2, size * 0.1);

      // Fire/Sparks
      const time = Date.now() / 1000;
      const spark = Math.sin(time * 4) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 140, 0, ${spark})`;
      ctx.fillRect(worldX + size * 0.4, worldY + size * 0.4, size * 0.15, size * 0.15);
    },
  },
};
