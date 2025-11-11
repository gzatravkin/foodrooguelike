import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const harvestedHerbs = new Set<string>();

export const HerbPlantTile: TilePlugin = {
  id: 'herb_plant',
  name: 'Herb Plant',
  color: '#228B22',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedHerbs.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedHerbs.has(key)) {
        onLog('The herbs have already been harvested', '#888');
        return;
      }

      harvestedHerbs.add(key);
      onLog('Harvested aromatic herbs!', '#90EE90');

      // 70% common herb, 25% garlic/onion, 5% rare (mana_herb or ancient_grain)
      const roll = Math.random();
      if (roll < 0.7) {
        gameState.addToInventory('herb');
        const template = entityFactory.getTemplate('herb');
        onLog(`Found: ${template?.name || 'Herb'}`, '#90EE90');
      } else if (roll < 0.95) {
        const item = Math.random() < 0.5 ? 'garlic' : 'onion';
        gameState.addToInventory(item);
        const template = entityFactory.getTemplate(item);
        onLog(`Found: ${template?.name || item}`, '#90EE90');
      } else {
        // Rare drops based on location theme (would need theme context, defaulting to mana_herb)
        const item = Math.random() < 0.7 ? 'mana_herb' : 'ancient_grain';
        gameState.addToInventory(item);
        const template = entityFactory.getTemplate(item);
        onLog(`Found: ${template?.name || item}`, '#FFD700');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Soil/ground
      ctx.fillStyle = '#3d2817';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.7, size * 0.6, size * 0.2);

      // Herb stems (green)
      ctx.strokeStyle = '#32cd32';
      ctx.lineWidth = size * 0.05;

      // Left stem
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.35, worldY + size * 0.7);
      ctx.lineTo(worldX + size * 0.32, worldY + size * 0.4);
      ctx.stroke();

      // Middle stem
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.7);
      ctx.lineTo(worldX + size * 0.5, worldY + size * 0.35);
      ctx.stroke();

      // Right stem
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.65, worldY + size * 0.7);
      ctx.lineTo(worldX + size * 0.68, worldY + size * 0.45);
      ctx.stroke();

      // Leaves (darker green circles)
      ctx.fillStyle = '#2e8b57';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.32, worldY + size * 0.4, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.35, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.68, worldY + size * 0.45, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.35,
    requiresRoomType: ['normal', 'garden'],
  },
};
