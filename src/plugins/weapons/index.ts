/**
 * Weapon Plugin Auto-Loader
 * Automatically imports and registers all weapon definitions
 */

import { WeaponRegistry } from './WeaponRegistry';

// Import new weapon definitions
import darkBoltData from './dark_bolt.json';
import battleAxeData from './battle_axe.json';
import elementalBlastData from './elemental_blast.json';
import crossbowData from './crossbow.json';

/**
 * Initialize all plugin weapons - called at game startup
 */
export function initializeWeapons(): void {
  console.log('🎮 Initializing weapon plugins...');

  // Register new weapons
  WeaponRegistry.register(darkBoltData as any);
  WeaponRegistry.register(battleAxeData as any);
  WeaponRegistry.register(elementalBlastData as any);
  WeaponRegistry.register(crossbowData as any);

  WeaponRegistry.markInitialized();
  console.log('✅ Weapon plugins initialized!');
}

export { WeaponRegistry };
