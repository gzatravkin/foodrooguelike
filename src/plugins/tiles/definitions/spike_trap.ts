import { TilePlugin } from '../TileRegistry';

const trapCooldowns = new Map<string, number>();

export const SpikeTrapTile: TilePlugin = {
  id: 'spike_trap',
  name: 'Spike Trap',
  color: '#696969',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      const key = `${tileX},${tileY}`;
      const cooldown = trapCooldowns.get(key) || 0;

      if (cooldown <= 0 && !player.isDashing) {
        const damage = 20;
        player.takeDamage(damage);
        onLog(`Trap triggered! -${damage} HP`, '#FF0000');
        trapCooldowns.set(key, 2.0);
      }
    },
    update: (deltaTime) => {
      // Update cooldowns
      trapCooldowns.forEach((value, key) => {
        const newValue = value - deltaTime;
        if (newValue <= 0) {
          trapCooldowns.delete(key);
        } else {
          trapCooldowns.set(key, newValue);
        }
      });
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.4,
  },
};
