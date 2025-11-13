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
