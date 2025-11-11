import { TilePlugin } from '../TileRegistry';

const interactedFountains = new Set<string>();

export const HealthFountainTile: TilePlugin = {
  id: 'health_fountain',
  name: 'Health Fountain',
  color: '#FF69B4',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !interactedFountains.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (interactedFountains.has(key)) {
        onLog('Fountain is dry', '#888');
        return;
      }

      const healAmount = 30;
      player.heal(healAmount);
      interactedFountains.add(key);
      onLog(`Healed ${healAmount} HP from fountain!`, '#FF69B4');
      onLog('Fountain dried up', '#888');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Base
      ctx.fillStyle = '#8b7355';
      ctx.fillRect(worldX + size * 0.25, worldY + size * 0.6, size * 0.5, size * 0.3);

      // Water
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 3) * 0.1 + 0.9;
      ctx.fillStyle = `rgba(255, 105, 180, ${pulse})`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size * 0.5, size * 0.25 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Sparkles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 3; i++) {
        const angle = (time + i * Math.PI * 2 / 3) * 2;
        const sparkleX = worldX + size / 2 + Math.cos(angle) * size * 0.3;
        const sparkleY = worldY + size * 0.4 + Math.sin(angle) * size * 0.3;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
  },
};
