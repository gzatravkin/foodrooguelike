/**
 * SVG Art Generator - Environment Graphics
 * Includes: Corpse, Floor Tile, Wall Tile
 */

export function createCorpseSVG(enemyType: string): string {
  return `
    <g class="corpse" opacity="0.7">
      <ellipse cx="15" cy="18" rx="12" ry="8" fill="#3E2723" opacity="0.5"/>
      <text x="15" y="20" text-anchor="middle" font-size="8" fill="#999">💀</text>
    </g>
  `;
}

// Tile SVGs
export function createFloorTileSVG(): string {
  return `
    <defs>
      <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#323232;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#2E2E2E;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1E1E1E;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="stoneSpot">
        <stop offset="0%" style="stop-color:#1A1A1A;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#1A1A1A;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="floor-tile">
      <!-- Base with gradient -->
      <rect width="32" height="32" fill="url(#floorGrad)"/>
      <!-- Subtle ambient occlusion in corners -->
      <circle cx="0" cy="0" r="8" fill="#000" opacity="0.1"/>
      <circle cx="32" cy="0" r="8" fill="#000" opacity="0.1"/>
      <circle cx="0" cy="32" r="8" fill="#000" opacity="0.1"/>
      <circle cx="32" cy="32" r="8" fill="#000" opacity="0.1"/>
      <!-- Tile edges with depth -->
      <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="#3A3A3A" stroke-width="1"/>
      <rect x="1" y="1" width="30" height="30" fill="none" stroke="#0A0A0A" stroke-width="0.5"/>
      <rect x="0" y="0" width="32" height="32" fill="none" stroke="#282828" stroke-width="0.3" opacity="0.5"/>
      <!-- Enhanced stone texture - varied spots with gradients -->
      <circle cx="6" cy="6" r="1.5" fill="url(#stoneSpot)"/>
      <circle cx="24" cy="8" r="1" fill="url(#stoneSpot)"/>
      <circle cx="14" cy="12" r="1.8" fill="url(#stoneSpot)"/>
      <circle cx="8" cy="20" r="1.2" fill="url(#stoneSpot)"/>
      <circle cx="26" cy="22" r="1.5" fill="url(#stoneSpot)"/>
      <circle cx="18" cy="26" r="1.1" fill="url(#stoneSpot)"/>
      <circle cx="28" cy="14" r="0.9" fill="url(#stoneSpot)"/>
      <circle cx="4" cy="28" r="1" fill="url(#stoneSpot)"/>
      <circle cx="16" cy="5" r="0.7" fill="url(#stoneSpot)"/>
      <!-- Enhanced highlight specks -->
      <circle cx="10" cy="10" r="0.5" fill="#4A4A4A" opacity="0.6"/>
      <circle cx="20" cy="16" r="0.6" fill="#4A4A4A" opacity="0.5"/>
      <circle cx="12" cy="24" r="0.5" fill="#4A4A4A" opacity="0.6"/>
      <circle cx="28" cy="6" r="0.4" fill="#4A4A4A" opacity="0.5"/>
      <circle cx="5" cy="16" r="0.4" fill="#4A4A4A" opacity="0.5"/>
      <circle cx="22" cy="28" r="0.4" fill="#4A4A4A" opacity="0.6"/>
      <!-- More detailed cracks -->
      <path d="M 5 14 Q 8 15 11 14 Q 13 13.5 15 14" stroke="#1A1A1A" stroke-width="0.5" fill="none" opacity="0.4"/>
      <path d="M 20 8 L 22 11 L 23 14" stroke="#1A1A1A" stroke-width="0.4" fill="none" opacity="0.35"/>
      <path d="M 10 26 Q 12 27 14 26" stroke="#1A1A1A" stroke-width="0.4" fill="none" opacity="0.3"/>
      <path d="M 26 18 L 28 20" stroke="#1A1A1A" stroke-width="0.3" fill="none" opacity="0.3"/>
      <path d="M 2 8 Q 4 9 6 9" stroke="#1A1A1A" stroke-width="0.3" fill="none" opacity="0.25"/>
      <!-- Grout lines (subtle) -->
      <line x1="16" y1="0" x2="16" y2="32" stroke="#1A1A1A" stroke-width="0.2" opacity="0.15"/>
      <line x1="0" y1="16" x2="32" y2="16" stroke="#1A1A1A" stroke-width="0.2" opacity="0.15"/>
      <!-- Wear and tear marks -->
      <path d="M 8 14 L 9 14.5" stroke="#0A0A0A" stroke-width="0.4" opacity="0.2"/>
      <path d="M 22 20 L 23 21" stroke="#0A0A0A" stroke-width="0.3" opacity="0.2"/>
    </g>
  `;
}

export function createWallTileSVG(): string {
  return `
    <defs>
      <linearGradient id="brickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#757575;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#707070;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#555;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="brickDamage">
        <stop offset="0%" style="stop-color:#4A4A4A;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#4A4A4A;stop-opacity:0" />
      </radialGradient>
    </defs>
    <g class="wall-tile">
      <!-- Base wall color -->
      <rect width="32" height="32" fill="#4A4A4A"/>
      <!-- Brick rows with improved depth -->
      <!-- Row 1 -->
      <rect x="0" y="0" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="0.3" y="0.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <rect x="16" y="0" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="16.3" y="0.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <!-- Row 2 (offset) -->
      <rect x="-8" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="8" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="8.3" y="8.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <rect x="24" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <!-- Row 3 -->
      <rect x="0" y="16" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="0.3" y="16.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <rect x="16" y="16" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="16.3" y="16.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <!-- Row 4 (offset) -->
      <rect x="-8" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="8" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <rect x="8.3" y="24.3" width="15.4" height="7.4" fill="none" stroke="#808080" stroke-width="0.3" opacity="0.3"/>
      <rect x="24" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.9"/>
      <!-- Enhanced brick texture details -->
      <circle cx="8" cy="4" r="0.7" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="24" cy="4" r="0.8" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="4" cy="12" r="0.6" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="16" cy="12" r="0.8" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="28" cy="12" r="0.6" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="8" cy="20" r="0.8" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="24" cy="20" r="0.7" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="4" cy="28" r="0.6" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="16" cy="28" r="0.8" fill="#5A5A5A" opacity="0.5"/>
      <circle cx="28" cy="28" r="0.6" fill="#5A5A5A" opacity="0.5"/>
      <!-- Damage/weathering spots -->
      <circle cx="12" cy="3" r="1.2" fill="url(#brickDamage)"/>
      <circle cx="20" cy="11" r="1" fill="url(#brickDamage)"/>
      <circle cx="6" cy="19" r="1.1" fill="url(#brickDamage)"/>
      <circle cx="26" cy="27" r="0.9" fill="url(#brickDamage)"/>
      <!-- Cracks in bricks -->
      <path d="M 6 3 L 7 5" stroke="#3A3A3A" stroke-width="0.3" opacity="0.5"/>
      <path d="M 22 4 L 23 6" stroke="#3A3A3A" stroke-width="0.3" opacity="0.5"/>
      <path d="M 14 11 L 15 13" stroke="#3A3A3A" stroke-width="0.3" opacity="0.5"/>
      <path d="M 10 19 L 11 21" stroke="#3A3A3A" stroke-width="0.3" opacity="0.5"/>
      <!-- Highlights on brick edges (top) -->
      <line x1="0" y1="1" x2="32" y2="1" stroke="#7A7A7A" stroke-width="0.6" opacity="0.4"/>
      <line x1="0" y1="9" x2="32" y2="9" stroke="#7A7A7A" stroke-width="0.6" opacity="0.4"/>
      <line x1="0" y1="17" x2="32" y2="17" stroke="#7A7A7A" stroke-width="0.6" opacity="0.4"/>
      <line x1="0" y1="25" x2="32" y2="25" stroke="#7A7A7A" stroke-width="0.6" opacity="0.4"/>
      <!-- Deep mortar shadows (bottom) -->
      <line x1="0" y1="7" x2="32" y2="7" stroke="#2A2A2A" stroke-width="0.6" opacity="0.6"/>
      <line x1="0" y1="15" x2="32" y2="15" stroke="#2A2A2A" stroke-width="0.6" opacity="0.6"/>
      <line x1="0" y1="23" x2="32" y2="23" stroke="#2A2A2A" stroke-width="0.6" opacity="0.6"/>
      <line x1="0" y1="31" x2="32" y2="31" stroke="#2A2A2A" stroke-width="0.6" opacity="0.6"/>
      <!-- Vertical mortar highlights -->
      <line x1="16" y1="0" x2="16" y2="8" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
      <line x1="8" y1="8" x2="8" y2="16" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
      <line x1="24" y1="8" x2="24" y2="16" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
      <line x1="16" y1="16" x2="16" y2="24" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
      <line x1="8" y1="24" x2="8" y2="32" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
      <line x1="24" y1="24" x2="24" y2="32" stroke="#2A2A2A" stroke-width="0.4" opacity="0.5"/>
    </g>
  `;
}

