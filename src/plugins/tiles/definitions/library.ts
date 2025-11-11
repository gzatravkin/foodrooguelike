import { TilePlugin } from '../TileRegistry';

export const LibraryTile: TilePlugin = {
  id: 'library',
  name: 'Library',
  color: '#654321',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Library grants stat boost
      player.stats.attack += 2;
      player.stats.defense += 2;
      onLog('Studied ancient texts. +2 attack, +2 defense!', '#654321');
      onLog('Knowledge is power!', '#DAA520');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Bookshelf
      ctx.fillStyle = '#654321';
      ctx.fillRect(worldX + size * 0.1, worldY + size * 0.2, size * 0.8, size * 0.6);

      // Books
      const colors = ['#8B0000', '#00008B', '#006400', '#8B008B'];
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(worldX + size * (0.15 + i * 0.12), worldY + size * 0.3, size * 0.1, size * 0.4);
      }

      // Glow
      ctx.fillStyle = 'rgba(218, 165, 32, 0.3)';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.4, size * 0.6, size * 0.2);
    },
  },
};
