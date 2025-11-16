/**
 * Main Plugin Initialization
 * This file automatically loads ALL game plugins
 */

import { initializeTiles } from './tiles';
import { initializeEnemies } from './enemies';
import { initializeWeapons } from './weapons';
import { initializeBuildings } from './buildings';

/**
 * Initialize all game plugins
 * Call this once at game startup!
 */
export function initializeAllPlugins(): void {
  console.log('🚀 Initializing all game plugins...');

  // Initialize all plugin systems
  initializeTiles();
  initializeBuildings(); // Initialize buildings (auto-registers tiles and screens)
  initializeEnemies();
  initializeWeapons();

  console.log('✅ All plugins initialized successfully!');
  console.log('');
  console.log('📦 Plugin Summary:');
  console.log('   - Tiles: Automatic registration via TileRegistry');
  console.log('   - Buildings: Automatic registration via BuildingRegistry');
  console.log('   - Enemies: Automatic registration via EnemyRegistry');
  console.log('   - Weapons: Automatic registration via WeaponRegistry');
  console.log('');
  console.log('💡 To add new content:');
  console.log('   - New Tile: Create file in src/plugins/tiles/definitions/');
  console.log('   - New Building: Create file in src/plugins/buildings/ (single file!)');
  console.log('   - New Enemy: Create JSON in src/plugins/enemies/');
  console.log('   - New Weapon: Create JSON in src/plugins/weapons/');
  console.log('');
}

// Export all registries
export { TileRegistry } from './tiles';
export { BuildingRegistry } from './buildings';
export { EnemyRegistry } from './enemies';
export { WeaponRegistry } from './weapons';
