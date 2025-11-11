/**
 * Enemy Plugin Auto-Loader
 * Automatically imports and registers all enemy definitions
 */

import { EnemyRegistry } from './EnemyRegistry';

// Import new enemy definitions
import wraithData from './wraith.json';
import minotaurData from './minotaur.json';
import elementalData from './elemental.json';
import banditData from './bandit.json';

/**
 * Initialize all plugin enemies - called at game startup
 */
export function initializeEnemies(): void {
  console.log('🎮 Initializing enemy plugins...');

  // Register new enemies
  EnemyRegistry.register(wraithData as any);
  EnemyRegistry.register(minotaurData as any);
  EnemyRegistry.register(elementalData as any);
  EnemyRegistry.register(banditData as any);

  EnemyRegistry.markInitialized();
  console.log('✅ Enemy plugins initialized!');
}

export { EnemyRegistry };
