import { TilePlugin } from '../TileRegistry';

export const TrainingHallTile: TilePlugin = {
  id: 'training_hall',
  name: 'Training Hall',
  color: '#CD853F',
  walkable: true,
  blocksLight: false,
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      // Interaction handled by GameScreenUpdater - opens training UI
      if (context?.showTrainingHall) {
        context.showTrainingHall();
      }
    },
  },
};
