import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const openedChests = new Set<string>();

export const TreasureChestTile: TilePlugin = {
  id: 'treasure_chest',
  name: 'Treasure Chest',
  color: '#DAA520',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !openedChests.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (openedChests.has(key)) {
        onLog('Chest is empty', '#888');
        return;
      }

      openedChests.add(key);
      onLog('Opened treasure chest!', '#FFD700');

      const numIngredients = 2 + Math.floor(Math.random() * 3);
      const ingredients = ['tomato', 'cheese', 'lettuce', 'beef', 'bread', 'chicken', 'fish', 'potato'];
      for (let i = 0; i < numIngredients; i++) {
        const randomIng = ingredients[Math.floor(Math.random() * ingredients.length)];
        gameState.addToInventory(randomIng);
        const template = entityFactory.getTemplate(randomIng);
        const itemName = template?.name || randomIng;
        onLog(`Found: ${itemName}`, '#90EE90');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Chest body
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.4, size * 0.6, size * 0.4);

      // Chest lid
      ctx.fillStyle = '#daa520';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.25, size * 0.6, size * 0.2);

      // Lock
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size * 0.5, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.3, worldY + size * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.2,
    requiresRoomType: ['treasure', 'normal'],
  },
};
