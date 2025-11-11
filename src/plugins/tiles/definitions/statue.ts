import { TilePlugin } from '../TileRegistry';

const examinedStatues = new Set<string>();

export const StatueTile: TilePlugin = {
  id: 'statue',
  name: 'Ancient Statue',
  color: '#708090',
  walkable: false,
  blocksLight: true,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      const key = `${tileX},${tileY}`;
      if (examinedStatues.has(key)) {
        onLog('The statue stands silent', '#888');
        return;
      }

      examinedStatues.add(key);
      const messages = [
        'The statue depicts a warrior',
        'Ancient runes cover the base',
        'You feel watched...',
        'The craftsmanship is impressive',
      ];
      onLog(messages[Math.floor(Math.random() * messages.length)], '#708090');
    },
  },
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.2,
  },
};
