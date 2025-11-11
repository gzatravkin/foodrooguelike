import { TilePlugin } from '../TileRegistry';

const usedAltars = new Set<string>();

export const EnchantingAltarTile: TilePlugin = {
  id: 'enchanting_altar',
  name: 'Enchanting Altar',
  color: '#FF69B4',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !usedAltars.has(key) && !!player.weapon;
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (usedAltars.has(key)) {
        onLog('Altar power depleted', '#888');
        return;
      }

      if (!player.weapon) {
        onLog('You need a weapon to enchant!', '#888');
        return;
      }

      // Enhance weapon stats
      player.weapon.damage = Math.floor(player.weapon.damage * 1.2);
      usedAltars.add(key);
      onLog('Weapon enchanted! +20% damage', '#FF69B4');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Altar base
      ctx.fillStyle = '#4B0082';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.5, size * 0.6, size * 0.4);

      // Mystical glow
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(255, 105, 180, ${pulse})`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size * 0.35, size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Floating particles
      for (let i = 0; i < 4; i++) {
        const angle = time + i * Math.PI / 2;
        const x = worldX + size / 2 + Math.cos(angle) * size * 0.25;
        const y = worldY + size * 0.35 + Math.sin(angle * 2) * size * 0.15;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.15,
  },
};
