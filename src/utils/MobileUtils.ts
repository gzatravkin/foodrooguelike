/**
 * MobileUtils - Utility functions for mobile device detection and responsive sizing
 */

/**
 * Check if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

/**
 * Get the appropriate tile size based on device type
 * Mobile devices use smaller tiles to show more of the map on limited screen space
 */
export function getTileSize(): number {
  return isMobileDevice() ? 24 : 32;
}

/**
 * Get the appropriate player size based on tile size
 * Player should be smaller than tile size to allow passage through 1-tile corridors
 */
export function getPlayerSize(): number {
  const tileSize = getTileSize();
  // Player size is 70% of tile size to ensure comfortable passage through corridors
  return Math.floor(tileSize * 0.7);
}

/**
 * Get the appropriate enemy size based on tile size
 * Enemies should also scale with tile size for consistency
 */
export function getEnemySize(): number {
  const tileSize = getTileSize();
  // Enemy size is 62.5% of tile size (20/32 on desktop ratio)
  return Math.floor(tileSize * 0.625);
}

/**
 * Get UI scale factor based on screen size
 * This allows UI elements to scale proportionally with screen size
 */
export function getUIScaleFactor(): number {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (isMobileDevice()) {
    // Mobile: scale based on width (reference: 375px iPhone)
    return Math.max(0.7, Math.min(1.2, width / 375));
  } else {
    // Desktop: scale based on height (reference: 1080px)
    return Math.max(0.8, Math.min(1.5, height / 1080));
  }
}

/**
 * Scale a size value based on screen dimensions
 */
export function scaleSize(baseSize: number): number {
  return Math.floor(baseSize * getUIScaleFactor());
}
