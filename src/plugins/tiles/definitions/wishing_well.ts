import { TilePlugin } from '../TileRegistry';
import { gameState } from '../../../core/GameState';

const usedWells = new Set<string>();

export const WishingWellTile: TilePlugin = {
  id: 'wishing_well',
  name: 'Wishing Well',
  color: '#4682B4',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: (player, tileX, tileY) => {
      const key = `${tileX},${tileY}`;
      return !usedWells.has(key);
    },
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (usedWells.has(key)) {
        onLog('Well is dry', '#888');
        return;
      }

      // Random rewards
      const rewards = [
        { type: 'gold', amount: 100, msg: 'Found 100 gold!' },
        { type: 'health', amount: 50, msg: 'Healed 50 HP!' },
        { type: 'attack', amount: 3, msg: 'Gained +3 attack!' },
      ];

      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      usedWells.add(key);

      if (reward.type === 'gold') {
        gameState.addGold(reward.amount);
      } else if (reward.type === 'health') {
        player.heal(reward.amount);
      } else if (reward.type === 'attack') {
        player.stats.attack += reward.amount;
      }

      onLog(reward.msg, '#4682B4');
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      // Well structure
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Water
      const time = Date.now() / 1000;
      const ripple = Math.sin(time * 2) * 0.05 + 0.3;
      ctx.fillStyle = `rgba(70, 130, 180, 0.6)`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * ripple, 0, Math.PI * 2);
      ctx.fill();

      // Shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(worldX + size * 0.4, worldY + size * 0.35, 3, 3);
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.1,
  },
};
