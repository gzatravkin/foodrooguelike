/**
 * EnemyRegistry - File-based enemy registration
 * Add a new enemy by creating a JSON file in src/plugins/enemies/
 */

import { PluginRegistry, Plugin } from '../../core/PluginRegistry';

export interface EnemyPlugin extends Plugin {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  xp: number;
  color: string;
  size?: number;
  weaponId?: string;
  ai?: {
    type?: string;
    chaseRange?: number;
    attackRange?: number;
    patrolRadius?: number;
    fleeThreshold?: number;
  };
  loot?: {
    ingredients?: Array<{ id: string; chance: number }>;
    gold?: { min: number; max: number };
  };
}

class EnemyRegistryClass extends PluginRegistry<EnemyPlugin> {}

export const EnemyRegistry = new EnemyRegistryClass();
