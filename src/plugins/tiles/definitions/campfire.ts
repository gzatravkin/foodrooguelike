import { TilePlugin } from '../TileRegistry';

const restedCampfires = new Set<string>();

export const CampfireTile: TilePlugin = {
  id: 'campfire',
  name: 'Campfire',
  color: '#FF6347',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !restedCampfires.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (restedCampfires.has(key)) {
        onLog('The fire has died down', '#888');
        return;
      }

      // Full heal and buff
      player.heal(player.stats.maxHealth);
      player.stats.speed *= 1.2;
      player.stats.defense += 5;

      restedCampfires.add(key);
      onLog('Rested by the fire. Fully healed!', '#FF6347');
      onLog('+20% speed, +5 defense temporarily', '#FFA500');

      // Reset buffs after 30 seconds (handled elsewhere)
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      const time = Date.now() / 1000;

      // Fire base
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(worldX + size * 0.35, worldY + size * 0.7, size * 0.3, size * 0.15);

      // Flames
      for (let i = 0; i < 3; i++) {
        const flicker = Math.sin(time * 5 + i) * 0.1 + 0.9;
        const offset = i * size * 0.15;

        // Orange flame
        ctx.fillStyle = `rgba(255, 140, 0, ${flicker})`;
        ctx.beginPath();
        ctx.moveTo(worldX + size * 0.35 + offset, worldY + size * 0.7);
        ctx.lineTo(worldX + size * 0.4 + offset, worldY + size * 0.3);
        ctx.lineTo(worldX + size * 0.45 + offset, worldY + size * 0.7);
        ctx.fill();

        // Yellow center
        ctx.fillStyle = `rgba(255, 255, 0, ${flicker * 0.8})`;
        ctx.beginPath();
        ctx.arc(worldX + size * 0.4 + offset, worldY + size * 0.5, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks
      for (let i = 0; i < 5; i++) {
        const sparkTime = time * 3 + i;
        const x = worldX + size / 2 + (Math.sin(sparkTime) * size * 0.2);
        const y = worldY + size * 0.3 - (sparkTime % 1) * size * 0.4;
        ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.15,
  },
};
