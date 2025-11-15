import { TilePlugin } from '../TileRegistry';

export const CharacterCustomizationTile: TilePlugin = {
  id: 'character_customization',
  name: 'Character Customization',
  color: '#FF69B4',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreen - opens customization UI
      if (context?.showCharacterCustomization) {
        context.showCharacterCustomization();
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Draw a mirror/vanity table
      const centerX = worldX + size / 2;
      const centerY = worldY + size / 2;

      // Draw table base
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.5, size * 0.6, size * 0.4);

      // Draw mirror frame
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(worldX + size * 0.25, worldY + size * 0.1, size * 0.5, size * 0.5);

      // Draw mirror surface
      ctx.fillStyle = '#E0FFFF';
      ctx.fillRect(worldX + size * 0.3, worldY + size * 0.15, size * 0.4, size * 0.4);

      // Draw sparkles
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.35, worldY + size * 0.2, 2, 0, Math.PI * 2);
      ctx.arc(worldX + size * 0.65, worldY + size * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
};
