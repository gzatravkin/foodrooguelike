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
        <stop offset="0%" style="stop-color:#2E2E2E;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1E1E1E;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="floor-tile">
      <!-- Base -->
      <rect width="32" height="32" fill="url(#floorGrad)"/>
      <!-- Tile edges with depth -->
      <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="#3A3A3A" stroke-width="1"/>
      <rect x="1" y="1" width="30" height="30" fill="none" stroke="#0A0A0A" stroke-width="0.5"/>
      <!-- Stone texture - varied spots and cracks -->
      <circle cx="6" cy="6" r="1.2" fill="#1A1A1A" opacity="0.4"/>
      <circle cx="24" cy="8" r="0.8" fill="#1A1A1A" opacity="0.3"/>
      <circle cx="14" cy="12" r="1.5" fill="#1A1A1A" opacity="0.35"/>
      <circle cx="8" cy="20" r="1" fill="#1A1A1A" opacity="0.3"/>
      <circle cx="26" cy="22" r="1.3" fill="#1A1A1A" opacity="0.4"/>
      <circle cx="18" cy="26" r="0.9" fill="#1A1A1A" opacity="0.3"/>
      <!-- Small highlight specks -->
      <circle cx="10" cy="10" r="0.4" fill="#4A4A4A" opacity="0.5"/>
      <circle cx="20" cy="16" r="0.5" fill="#4A4A4A" opacity="0.4"/>
      <circle cx="12" cy="24" r="0.4" fill="#4A4A4A" opacity="0.5"/>
      <!-- Subtle cracks -->
      <path d="M 5 14 Q 8 15 11 14" stroke="#1A1A1A" stroke-width="0.4" fill="none" opacity="0.3"/>
      <path d="M 20 8 L 22 11" stroke="#1A1A1A" stroke-width="0.3" fill="none" opacity="0.25"/>
    </g>
  `;
}

export function createWallTileSVG(): string {
  return `
    <defs>
      <linearGradient id="brickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#707070;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#555;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="wall-tile">
      <!-- Base wall color -->
      <rect width="32" height="32" fill="#4A4A4A"/>
      <!-- Brick rows with improved depth -->
      <!-- Row 1 -->
      <rect x="0" y="0" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="16" y="0" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <!-- Row 2 (offset) -->
      <rect x="-8" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="8" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="24" y="8" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <!-- Row 3 -->
      <rect x="0" y="16" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="16" y="16" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <!-- Row 4 (offset) -->
      <rect x="-8" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="8" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <rect x="24" y="24" width="16" height="8" fill="url(#brickGrad)" stroke="#3A3A3A" stroke-width="0.8"/>
      <!-- Brick texture details -->
      <circle cx="8" cy="4" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="24" cy="4" r="0.6" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="4" cy="12" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="16" cy="12" r="0.6" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="28" cy="12" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="8" cy="20" r="0.6" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="24" cy="20" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="4" cy="28" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="16" cy="28" r="0.6" fill="#5A5A5A" opacity="0.4"/>
      <circle cx="28" cy="28" r="0.5" fill="#5A5A5A" opacity="0.4"/>
      <!-- Highlights on brick edges -->
      <line x1="0" y1="1" x2="32" y2="1" stroke="#7A7A7A" stroke-width="0.5" opacity="0.3"/>
      <line x1="0" y1="9" x2="32" y2="9" stroke="#7A7A7A" stroke-width="0.5" opacity="0.3"/>
      <line x1="0" y1="17" x2="32" y2="17" stroke="#7A7A7A" stroke-width="0.5" opacity="0.3"/>
      <line x1="0" y1="25" x2="32" y2="25" stroke="#7A7A7A" stroke-width="0.5" opacity="0.3"/>
      <!-- Deep mortar shadows -->
      <line x1="0" y1="7" x2="32" y2="7" stroke="#2A2A2A" stroke-width="0.5" opacity="0.5"/>
      <line x1="0" y1="15" x2="32" y2="15" stroke="#2A2A2A" stroke-width="0.5" opacity="0.5"/>
      <line x1="0" y1="23" x2="32" y2="23" stroke="#2A2A2A" stroke-width="0.5" opacity="0.5"/>
      <line x1="0" y1="31" x2="32" y2="31" stroke="#2A2A2A" stroke-width="0.5" opacity="0.5"/>
    </g>
  `;
}

