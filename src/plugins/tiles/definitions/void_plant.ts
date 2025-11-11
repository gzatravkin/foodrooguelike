import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';
import { entityFactory } from '../../../entities/EntityFactory';

const harvestedVoidPlants = new Set<string>();

export const VoidPlantTile: TilePlugin = {
  id: 'void_plant',
  name: 'Void Plant',
  color: '#4B0082',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !harvestedVoidPlants.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (harvestedVoidPlants.has(key)) {
        onLog('The void plant has already been harvested', '#888');
        return;
      }

      harvestedVoidPlants.add(key);
      onLog('Extracted essence from the void plant!', '#9370DB');

      // 60% void_essence, 40% celestial_nectar (both legendary)
      if (Math.random() < 0.6) {
        gameState.addToInventory('void_essence');
        const template = entityFactory.getTemplate('void_essence');
        onLog(`Found legendary: ${template?.name || 'Void Essence'}!`, '#9370DB');
      } else {
        gameState.addToInventory('celestial_nectar');
        const template = entityFactory.getTemplate('celestial_nectar');
        onLog(`Found legendary: ${template?.name || 'Celestial Nectar'}!`, '#FFD700');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Void energy base (dark purple)
      ctx.fillStyle = '#2f004f';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.7, size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Plant tendrils (purple gradient)
      ctx.strokeStyle = '#6a0dad';
      ctx.lineWidth = size * 0.04;

      // Tendril 1
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.7);
      ctx.bezierCurveTo(
        worldX + size * 0.4, worldY + size * 0.6,
        worldX + size * 0.35, worldY + size * 0.5,
        worldX + size * 0.4, worldY + size * 0.35
      );
      ctx.stroke();

      // Tendril 2
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.7);
      ctx.bezierCurveTo(
        worldX + size * 0.5, worldY + size * 0.5,
        worldX + size * 0.48, worldY + size * 0.4,
        worldX + size * 0.5, worldY + size * 0.25
      );
      ctx.stroke();

      // Tendril 3
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.7);
      ctx.bezierCurveTo(
        worldX + size * 0.6, worldY + size * 0.6,
        worldX + size * 0.65, worldY + size * 0.5,
        worldX + size * 0.6, worldY + size * 0.35
      );
      ctx.stroke();

      // Void essence orbs (glowing purple)
      ctx.fillStyle = '#9370db';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.4, worldY + size * 0.35, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.25, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.6, worldY + size * 0.35, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Inner glow on orbs
      ctx.fillStyle = '#da70d6';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.25, size * 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Outer void aura
      ctx.fillStyle = 'rgba(75, 0, 130, 0.3)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.5, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Sparkling effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.42, worldY + size * 0.28, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(worldX + size * 0.58, worldY + size * 0.38, 1, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.08, // Very rare spawn
    requiresRoomType: ['normal', 'treasure'],
  },
};
