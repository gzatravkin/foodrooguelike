/**
 * SVG Art Generator - Main entry point
 * Re-exports all SVG generators from specialized modules
 */

// Import all SVG generators
import { createPlayerSVG } from './SVGPlayer';
import {
  createSlimeSVG,
  createGoblinSVG,
  createSkeletonSVG,
  createOrcSVG,
} from './SVGEnemiesBasic';
import {
  createDragonSVG,
  createWolfSVG,
  createTrollSVG,
} from './SVGEnemiesLarge';
import {
  createRatSVG,
  createBatSVG,
  createSpiderSVG,
} from './SVGEnemiesSmall';
import {
  createIceGolemSVG,
  createFireElementalSVG,
  createGiantCrabSVG,
  createDemonLordSVG,
} from './SVGEnemiesBoss';
import {
  createMeleeSVG,
  createPistolSVG,
  createRifleSVG,
  createStaffSVG,
} from './SVGWeapons';
import {
  createBulletSVG,
  createMagicBoltSVG,
  createFireBallSVG,
  createPlasmaBoltSVG,
} from './SVGProjectiles';
import {
  createCorpseSVG,
  createFloorTileSVG,
  createWallTileSVG,
} from './SVGEnvironment';

// Re-export all
export {
  createPlayerSVG,
  createSlimeSVG,
  createGoblinSVG,
  createSkeletonSVG,
  createOrcSVG,
  createDragonSVG,
  createWolfSVG,
  createTrollSVG,
  createRatSVG,
  createBatSVG,
  createSpiderSVG,
  createIceGolemSVG,
  createFireElementalSVG,
  createGiantCrabSVG,
  createDemonLordSVG,
  createMeleeSVG,
  createPistolSVG,
  createRifleSVG,
  createStaffSVG,
  createBulletSVG,
  createMagicBoltSVG,
  createFireBallSVG,
  createPlasmaBoltSVG,
  createCorpseSVG,
  createFloorTileSVG,
  createWallTileSVG,
};

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
