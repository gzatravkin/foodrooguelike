import { TilePlugin } from '../TileRegistry';
import { TileType } from '../../../systems/MapSystem';

export const TeleporterTile: TilePlugin = {
  id: 'teleporter',
  name: 'Teleporter',
  color: '#8B00FF',
  walkable: true,
  blocksLight: false,
  tileType: TileType.TELEPORTER,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Teleporter logic handled by TileInteractionManager
      if (context?.teleporterLocations && context.teleporterLocations.length >= 2) {
        const map = mapSystem.getCurrentMap();
        if (!map) return;

        // Find current teleporter
        let currentIndex = -1;
        for (let i = 0; i < context.teleporterLocations.length; i++) {
          const dist = Math.sqrt(
            Math.pow(player.x - context.teleporterLocations[i].x, 2) +
            Math.pow(player.y - context.teleporterLocations[i].y, 2)
          );
          if (dist < 20) {
            currentIndex = i;
            break;
          }
        }

        if (currentIndex === -1) return;

        // Pick random other teleporter
        const others = context.teleporterLocations.filter((_: any, i: number) => i !== currentIndex);
        const dest = others[Math.floor(Math.random() * others.length)];

        player.x = dest.x;
        player.y = dest.y;
        onLog('Teleported!', '#8B00FF');
      } else {
        onLog('Teleporter is inactive', '#888');
      }
    },
  },
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(worldX, worldY, size, size);

      const time = Date.now() / 1000;

      // Spinning outer ring
      ctx.fillStyle = 'rgba(139, 0, 255, 0.6)';
      for (let i = 0; i < 8; i++) {
        const angle = (time * 2 + i * Math.PI / 4);
        const x = worldX + size / 2 + Math.cos(angle) * size * 0.35;
        const y = worldY + size / 2 + Math.sin(angle) * size * 0.35;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing center
      const pulse = Math.sin(time * 4) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(139, 0, 255, ${pulse})`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.2 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(200, 100, 255, ${pulse})`;
      ctx.beginPath();
      ctx.arc(worldX + size / 2, worldY + size / 2, size * 0.1 * pulse, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.15,
  },
};
