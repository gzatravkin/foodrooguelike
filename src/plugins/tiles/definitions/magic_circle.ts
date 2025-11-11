import { TilePlugin } from '../TileRegistry';

const usedCircles = new Set<string>();

export const MagicCircleTile: TilePlugin = {
  id: 'magic_circle',
  name: 'Magic Circle',
  color: '#9370DB',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !usedCircles.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (usedCircles.has(key)) {
        onLog('Magic circle is dormant', '#888');
        return;
      }

      // Grant a random bonus
      const bonuses = [
        { name: 'Max HP', apply: () => { player.stats.maxHealth += 20; player.heal(20); } },
        { name: 'Speed', apply: () => { player.stats.speed += 10; } },
        { name: 'Attack', apply: () => { player.stats.attack += 5; } },
      ];

      const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
      bonus.apply();
      usedCircles.add(key);
      onLog(`Magic Circle grants +${bonus.name}!`, '#9370DB');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 2) * 0.2 + 0.8;

      // Outer circle
      ctx.strokeStyle = `rgba(147, 112, 219, ${pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating runes
      ctx.fillStyle = `rgba(200, 150, 255, ${pulse})`;
      for (let i = 0; i < 6; i++) {
        const angle = (time + i * Math.PI / 3);
        const x = worldX + size / 2 + Math.cos(angle) * size * 0.32;
        const y = worldY + size / 2 + Math.sin(angle) * size * 0.32;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }

      // Center glow
      ctx.fillStyle = `rgba(147, 112, 219, ${pulse * 0.6})`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.1,
  },
};
