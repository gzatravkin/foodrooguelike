import { TilePlugin } from '../TileRegistry';

const trapCooldowns = new Map<string, number>();

export const PoisonTrapTile: TilePlugin = {
  id: 'poison_trap',
  name: 'Poison Trap',
  color: '#32CD32',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => false,
    onInteract: () => {},
    onStepOn: (player, tileX, tileY, deltaTime, onLog) => {
      const key = `${tileX},${tileY}`;
      const cooldown = trapCooldowns.get(key) || 0;

      if (cooldown <= 0 && !player.isDashing) {
        const damage = 15;
        player.takeDamage(damage);
        onLog(`Trap triggered! -${damage} HP`, '#FF0000');
        trapCooldowns.set(key, 2.0);

        // Apply poison slow
        player.slowedDuration = Math.max(player.slowedDuration, 3.0);
        player.slowMultiplier = 0.6;
        onLog('Poisoned!', '#32CD32');
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
