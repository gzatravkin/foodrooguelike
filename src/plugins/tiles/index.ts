/**
 * Tile Plugin Auto-Loader
 * Automatically imports and registers all tile definitions
 */

import { TileRegistry } from './TileRegistry';

// Import all existing tile definitions
import { FloorTile } from './definitions/floor';
import { WallTile } from './definitions/wall';
import { DoorTile } from './definitions/door';
import { GrassTile } from './definitions/grass';
import { WaterTile } from './definitions/water';
import { LavaTile } from './definitions/lava';
import { IceTile } from './definitions/ice';
import { CookingStationTile } from './definitions/cooking_station';
import { ShopTile } from './definitions/shop';
import { ExpeditionPortalTile } from './definitions/expedition_portal';
import { TrainingHallTile } from './definitions/training_hall';
import { UpgradesHallTile } from './definitions/upgrades_hall';
import { StairsDownTile } from './definitions/stairs_down';
import { StairsUpTile } from './definitions/stairs_up';
import { HealthFountainTile } from './definitions/health_fountain';
import { TreasureChestTile } from './definitions/treasure_chest';
import { ShrineTile } from './definitions/shrine';
import { TeleporterTile } from './definitions/teleporter';
import { SpikeTrapTile } from './definitions/spike_trap';
import { PoisonTrapTile } from './definitions/poison_trap';

// NEW TILES - Just add the import and register!
import { MudTile } from './definitions/mud';
import { SandTile } from './definitions/sand';
import { MagicCircleTile } from './definitions/magic_circle';
import { QuicksandTile } from './definitions/quicksand';

// NEW INTERACTABLES
import { EnchantingAltarTile } from './definitions/enchanting_altar';
import { WishingWellTile } from './definitions/wishing_well';
import { StatueTile } from './definitions/statue';
import { CampfireTile } from './definitions/campfire';
import { MysteriousDoorTile } from './definitions/mysterious_door';

// NEW BUILDINGS
import { LibraryTile } from './definitions/library';
import { BlacksmithTile } from './definitions/blacksmith';

/**
 * Initialize all tiles - called at game startup
 */
export function initializeTiles(): void {
  console.log('🎮 Initializing tile plugins...');

  // Register all tile definitions
  TileRegistry.register(FloorTile);
  TileRegistry.register(WallTile);
  TileRegistry.register(DoorTile);
  TileRegistry.register(CookingStationTile);
  TileRegistry.register(ShopTile);
  TileRegistry.register(ExpeditionPortalTile);
  TileRegistry.register(TrainingHallTile);
  TileRegistry.register(StairsDownTile);
  TileRegistry.register(StairsUpTile);
  TileRegistry.register(WaterTile);
  TileRegistry.register(LavaTile);
  TileRegistry.register(IceTile);
  TileRegistry.register(GrassTile);
  TileRegistry.register(HealthFountainTile);
  TileRegistry.register(TreasureChestTile);
  TileRegistry.register(TeleporterTile);
  TileRegistry.register(ShrineTile);
  TileRegistry.register(SpikeTrapTile);
  TileRegistry.register(PoisonTrapTile);
  TileRegistry.register(UpgradesHallTile);

  // NEW TILES - Proof of concept!
  TileRegistry.register(MudTile);
  TileRegistry.register(SandTile);
  TileRegistry.register(MagicCircleTile);
  TileRegistry.register(QuicksandTile);

  // NEW INTERACTABLES - Proof of concept!
  TileRegistry.register(EnchantingAltarTile);
  TileRegistry.register(WishingWellTile);
  TileRegistry.register(StatueTile);
  TileRegistry.register(CampfireTile);
  TileRegistry.register(MysteriousDoorTile);

  // NEW BUILDINGS - Proof of concept!
  TileRegistry.register(LibraryTile);
  TileRegistry.register(BlacksmithTile);

  TileRegistry.markInitialized();
  console.log('✅ Tile plugins initialized!');
}

export { TileRegistry };
