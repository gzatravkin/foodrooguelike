/**
 * SVG Art Generator - Main entry point
 * Re-exports all SVG generators from specialized modules
 */

// Player
export { createPlayerSVG } from './SVGPlayer';

// Basic Enemies
export {
  createSlimeSVG,
  createGoblinSVG,
  createSkeletonSVG,
  createOrcSVG,
} from './SVGEnemiesBasic';

// Large Enemies
export {
  createDragonSVG,
  createWolfSVG,
  createTrollSVG,
} from './SVGEnemiesLarge';

// Small Enemies
export {
  createRatSVG,
  createBatSVG,
  createSpiderSVG,
} from './SVGEnemiesSmall';

// Boss Enemies
export {
  createIceGolemSVG,
  createFireElementalSVG,
  createGiantCrabSVG,
  createDemonLordSVG,
} from './SVGEnemiesBoss';

// Weapons
export {
  createMeleeSVG,
  createPistolSVG,
  createRifleSVG,
  createStaffSVG,
} from './SVGWeapons';

// Projectiles
export {
  createBulletSVG,
  createMagicBoltSVG,
  createFireBallSVG,
  createPlasmaBoltSVG,
} from './SVGProjectiles';

// Environment
export {
  createCorpseSVG,
  createFloorTileSVG,
  createWallTileSVG,
} from './SVGEnvironment';

// Map enemy IDs to SVG generators
export const ENEMY_SVG_MAP: Record<string, () => string> = {
  'slime': createSlimeSVG,
  'goblin': createGoblinSVG,
  'skeleton': createSkeletonSVG,
  'orc': createOrcSVG,
  'dragon': createDragonSVG,
  'wolf': createWolfSVG,
  'rat': createRatSVG,
  'bat': createBatSVG,
  'troll': createTrollSVG,
  'spider': createSpiderSVG,
  'ice_golem': createIceGolemSVG,
  'fire_elemental': createFireElementalSVG,
  'giant_crab': createGiantCrabSVG,
  'demon_lord': createDemonLordSVG,
};

// Get enemy SVG by ID
export function getEnemySVG(enemyId: string): string {
  const generator = ENEMY_SVG_MAP[enemyId];
  return generator ? generator() : createSlimeSVG();
}
