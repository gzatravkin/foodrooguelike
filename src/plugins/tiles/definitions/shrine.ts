import { TilePlugin } from '../TileRegistry';
import { TileType } from '../../../systems/MapSystem';

const usedShrines = new Set<string>();
let playerBuffs: { speed?: number; damage?: number; defense?: number; duration: number } | null = null;

export const ShrineTile: TilePlugin = {
  id: 'shrine',
  name: 'Shrine',
  color: '#DAA520',
  walkable: true,
  blocksLight: false,
  tileType: TileType.SHRINE,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !usedShrines.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (usedShrines.has(key)) {
        onLog('Shrine power depleted', '#888');
        return;
      }

      const buffTypes = ['speed', 'damage', 'defense'];
      const buffType = buffTypes[Math.floor(Math.random() * buffTypes.length)];

      usedShrines.add(key);

      if (buffType === 'speed') {
        playerBuffs = { speed: 1.5, duration: 15.0 };
        player.stats.speed *= 1.5;
        onLog('Blessed with speed! +50% speed for 15s', '#DAA520');
      } else if (buffType === 'damage') {
        playerBuffs = { damage: 1.5, duration: 15.0 };
        player.stats.attack *= 1.5;
        onLog('Blessed with power! +50% damage for 15s', '#DAA520');
      } else {
        playerBuffs = { defense: 1.5, duration: 15.0 };
        player.stats.defense *= 1.5;
        onLog('Blessed with protection! +50% defense for 15s', '#DAA520');
      }
    },
    update: (deltaTime, player) => {
      if (playerBuffs && playerBuffs.duration > 0) {
        playerBuffs.duration -= deltaTime;
        if (playerBuffs.duration <= 0) {
          if (playerBuffs.speed) {
            player.stats.speed /= playerBuffs.speed;
          }
          if (playerBuffs.damage) {
            player.stats.attack /= playerBuffs.damage;
          }
          if (playerBuffs.defense) {
            player.stats.defense /= playerBuffs.defense;
          }
          playerBuffs = null;
        }
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Pedestal
      ctx.fillStyle = '#696969';
      ctx.fillRect(worldX + size * 0.3, worldY + size * 0.6, size * 0.4, size * 0.3);

      // Shrine top (pyramid)
      const centerX = worldX + size / 2;
      const topY = worldY + size * 0.2;
      const bottomY = worldY + size * 0.6;
      const leftX = worldX + size * 0.3;
      const rightX = worldX + size * 0.7;

      // Draw triangle for pyramid
      ctx.strokeStyle = '#daa520';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX, bottomY);
      ctx.lineTo(centerX, topY);
      ctx.lineTo(rightX, bottomY);
      ctx.lineTo(leftX, bottomY);
      ctx.stroke();

      // Glow effect
      const time = Date.now() / 1000;
      const glow = Math.sin(time * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(218, 165, 32, ${glow})`;
      ctx.beginPath();
      ctx.arc(centerX, topY, 4, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.2,
  },
};
