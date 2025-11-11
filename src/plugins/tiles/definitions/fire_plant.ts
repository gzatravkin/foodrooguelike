import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const harvestedFirePlants = new Set<string>();

export const FirePlantTile: TilePlugin = {
  id: 'fire_plant',
  name: 'Fire Plant',
  color: '#FF4500',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedFirePlants.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedFirePlants.has(key)) {
        onLog('The fire plant has already been harvested', '#888');
        return;
      }

      harvestedFirePlants.add(key);
      onLog('Carefully harvested fire peppers!', '#FF4500');

      // Always gives fire_pepper (rare ingredient)
      gameState.addToInventory('fire_pepper');
      const template = entityFactory.getTemplate('fire_pepper');
      onLog(`Found: ${template?.name || 'Fire Pepper'}`, '#FFD700');

      // 30% chance to also find phoenix_egg (very rare)
      if (Math.random() < 0.3) {
        gameState.addToInventory('phoenix_egg');
        const eggTemplate = entityFactory.getTemplate('phoenix_egg');
        onLog(`Bonus: ${eggTemplate?.name || 'Phoenix Egg'}!`, '#FF6347');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Volcanic soil
      ctx.fillStyle = '#3a1f1f';
      ctx.fillRect(worldX + size * 0.1, worldY + size * 0.7, size * 0.8, size * 0.2);

      // Plant stem (dark red)
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = size * 0.06;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.7);
      ctx.lineTo(worldX + size * 0.5, worldY + size * 0.4);
      ctx.stroke();

      // Leaves (flame-shaped, orange-red)
      ctx.fillStyle = '#ff4500';

      // Left leaf
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.55);
      ctx.quadraticCurveTo(worldX + size * 0.35, worldY + size * 0.5, worldX + size * 0.4, worldY + size * 0.35);
      ctx.quadraticCurveTo(worldX + size * 0.42, worldY + size * 0.48, worldX + size * 0.5, worldY + size * 0.55);
      ctx.fill();

      // Right leaf
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.55);
      ctx.quadraticCurveTo(worldX + size * 0.65, worldY + size * 0.5, worldX + size * 0.6, worldY + size * 0.35);
      ctx.quadraticCurveTo(worldX + size * 0.58, worldY + size * 0.48, worldX + size * 0.5, worldY + size * 0.55);
      ctx.fill();

      // Fire pepper (bright red)
      ctx.fillStyle = '#dc143c';
      ctx.beginPath();
      ctx.ellipse(worldX + size * 0.5, worldY + size * 0.38, size * 0.08, size * 0.12, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Pepper highlight
      ctx.fillStyle = '#ff6347';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.48, worldY + size * 0.35, size * 0.03, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect (fire aura)
      ctx.fillStyle = 'rgba(255, 69, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.45, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.12, // Rare spawn
    requiresRoomType: ['normal'],
  },
};
