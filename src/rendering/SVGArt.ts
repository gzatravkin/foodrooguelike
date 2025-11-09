/**
 * SVG Art Generator - Creates SVG graphics for game entities
 */

// Player character - fantasy/modern hybrid look
export function createPlayerSVG(): string {
  return `
    <g class="player-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="16" rx="8" ry="10" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5"/>
      <!-- Head -->
      <circle cx="12" cy="8" r="6" fill="#FFE0B2" stroke="#8D6E63" stroke-width="1.5"/>
      <!-- Eyes -->
      <circle cx="10" cy="7" r="1" fill="#000"/>
      <circle cx="14" cy="7" r="1" fill="#000"/>
      <!-- Tactical vest -->
      <rect x="8" y="14" width="8" height="8" fill="#37474F" opacity="0.7"/>
      <line x1="9" y1="16" x2="15" y2="16" stroke="#FFC107" stroke-width="0.5"/>
      <line x1="9" y1="18" x2="15" y2="18" stroke="#FFC107" stroke-width="0.5"/>
      <!-- Legs -->
      <rect x="9" y="24" width="2.5" height="6" fill="#1976D2" rx="1"/>
      <rect x="12.5" y="24" width="2.5" height="6" fill="#1976D2" rx="1"/>
    </g>
  `;
}

// Enemy SVGs
export function createSlimeSVG(): string {
  return `
    <g class="slime-sprite">
      <!-- Main body -->
      <ellipse cx="12" cy="14" rx="10" ry="8" fill="#7FFF00" opacity="0.8"/>
      <ellipse cx="12" cy="14" rx="8" ry="6" fill="#00FF7F" opacity="0.6"/>
      <!-- Eyes -->
      <circle cx="9" cy="12" r="2" fill="#000" opacity="0.7"/>
      <circle cx="15" cy="12" r="2" fill="#000" opacity="0.7"/>
      <circle cx="9.5" cy="11.5" r="0.8" fill="#FFF"/>
      <circle cx="15.5" cy="11.5" r="0.8" fill="#FFF"/>
      <!-- Shine effect -->
      <ellipse cx="8" cy="10" rx="3" ry="2" fill="#FFF" opacity="0.4"/>
    </g>
  `;
}

export function createGoblinSVG(): string {
  return `
    <g class="goblin-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="17" rx="7" ry="9" fill="#8BC34A" stroke="#558B2F" stroke-width="1"/>
      <!-- Head -->
      <circle cx="12" cy="9" r="5" fill="#9CCC65" stroke="#689F38" stroke-width="1"/>
      <!-- Ears -->
      <ellipse cx="7" cy="8" rx="2" ry="3" fill="#8BC34A"/>
      <ellipse cx="17" cy="8" rx="2" ry="3" fill="#8BC34A"/>
      <!-- Eyes -->
      <circle cx="10" cy="9" r="1.5" fill="#FF0" stroke="#000" stroke-width="0.5"/>
      <circle cx="14" cy="9" r="1.5" fill="#FF0" stroke="#000" stroke-width="0.5"/>
      <circle cx="10" cy="9" r="0.8" fill="#000"/>
      <circle cx="14" cy="9" r="0.8" fill="#000"/>
      <!-- Weapon (club) -->
      <rect x="18" y="12" width="2" height="8" fill="#8D6E63" rx="1"/>
      <circle cx="19" cy="12" r="2" fill="#6D4C41"/>
    </g>
  `;
}

export function createSkeletonSVG(): string {
  return `
    <g class="skeleton-sprite">
      <!-- Skull -->
      <circle cx="12" cy="8" r="5" fill="#E0E0E0" stroke="#424242" stroke-width="1"/>
      <!-- Eye sockets -->
      <circle cx="10" cy="7" r="1.5" fill="#000"/>
      <circle cx="14" cy="7" r="1.5" fill="#000"/>
      <circle cx="10" cy="7" r="0.6" fill="#F44336"/>
      <circle cx="14" cy="7" r="0.6" fill="#F44336"/>
      <!-- Jaw -->
      <path d="M 8 10 L 12 11 L 16 10" stroke="#424242" stroke-width="1" fill="none"/>
      <!-- Ribcage -->
      <ellipse cx="12" cy="17" rx="6" ry="8" fill="none" stroke="#E0E0E0" stroke-width="1.5"/>
      <line x1="8" y1="14" x2="16" y2="14" stroke="#E0E0E0" stroke-width="1"/>
      <line x1="8" y1="17" x2="16" y2="17" stroke="#E0E0E0" stroke-width="1"/>
      <line x1="8" y1="20" x2="16" y2="20" stroke="#E0E0E0" stroke-width="1"/>
      <!-- Sword -->
      <line x1="18" y1="10" x2="18" y2="22" stroke="#90A4AE" stroke-width="2"/>
      <rect x="17" y="9" width="2" height="2" fill="#78909C"/>
    </g>
  `;
}

export function createOrcSVG(): string {
  return `
    <g class="orc-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="18" rx="9" ry="10" fill="#6D4C41" stroke="#3E2723" stroke-width="1.5"/>
      <!-- Head -->
      <circle cx="12" cy="9" r="6" fill="#795548" stroke="#4E342E" stroke-width="1.5"/>
      <!-- Tusks -->
      <path d="M 9 11 L 8 13 L 9 13" fill="#FFF" stroke="#000" stroke-width="0.5"/>
      <path d="M 15 11 L 16 13 L 15 13" fill="#FFF" stroke="#000" stroke-width="0.5"/>
      <!-- Eyes -->
      <circle cx="10" cy="8" r="1.5" fill="#F00"/>
      <circle cx="14" cy="8" r="1.5" fill="#F00"/>
      <!-- Armor plates -->
      <rect x="8" y="15" width="8" height="3" fill="#37474F"/>
      <circle cx="12" cy="16" r="1.5" fill="#78909C"/>
      <!-- Axe -->
      <line x1="2" y1="15" x2="6" y2="15" stroke="#8D6E63" stroke-width="1.5"/>
      <path d="M 3 13 L 2 15 L 3 17 Z" fill="#607D8B"/>
    </g>
  `;
}

export function createDragonSVG(): string {
  return `
    <g class="dragon-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="16" rx="10" ry="12" fill="#D32F2F" stroke="#B71C1C" stroke-width="2"/>
      <!-- Wings -->
      <path d="M 4 12 Q 0 10 2 16 L 6 14 Z" fill="#C62828" opacity="0.8"/>
      <path d="M 20 12 Q 24 10 22 16 L 18 14 Z" fill="#C62828" opacity="0.8"/>
      <!-- Head -->
      <ellipse cx="12" cy="8" rx="7" ry="6" fill="#E53935" stroke="#C62828" stroke-width="1.5"/>
      <!-- Horns -->
      <path d="M 8 6 L 6 2 L 8 4" fill="#FFEB3B" stroke="#F57F17" stroke-width="1"/>
      <path d="M 16 6 L 18 2 L 16 4" fill="#FFEB3B" stroke="#F57F17" stroke-width="1"/>
      <!-- Eyes -->
      <circle cx="10" cy="8" r="1.5" fill="#FFEB3B"/>
      <circle cx="14" cy="8" r="1.5" fill="#FFEB3B"/>
      <!-- Nostrils with fire -->
      <circle cx="9" cy="10" r="0.8" fill="#FF5722"/>
      <circle cx="15" cy="10" r="0.8" fill="#FF5722"/>
      <!-- Spikes on back -->
      <path d="M 10 14 L 9 10 L 11 14 Z" fill="#FFEB3B"/>
      <path d="M 14 14 L 13 10 L 15 14 Z" fill="#FFEB3B"/>
    </g>
  `;
}

export function createWolfSVG(): string {
  return `
    <g class="wolf-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="18" rx="8" ry="9" fill="#616161" stroke="#424242" stroke-width="1.5"/>
      <!-- Head -->
      <ellipse cx="12" cy="10" rx="6" ry="5" fill="#757575" stroke="#424242" stroke-width="1"/>
      <!-- Ears -->
      <path d="M 8 8 L 7 4 L 9 7 Z" fill="#616161" stroke="#424242"/>
      <path d="M 16 8 L 17 4 L 15 7 Z" fill="#616161" stroke="#424242"/>
      <!-- Snout -->
      <ellipse cx="12" cy="12" rx="3" ry="2" fill="#9E9E9E"/>
      <circle cx="12" cy="13" r="0.8" fill="#000"/>
      <!-- Eyes -->
      <circle cx="10" cy="9" r="1" fill="#FFC107"/>
      <circle cx="14" cy="9" r="1" fill="#FFC107"/>
      <circle cx="10" cy="9" r="0.5" fill="#000"/>
      <circle cx="14" cy="9" r="0.5" fill="#000"/>
      <!-- Teeth -->
      <line x1="11" y1="13" x2="10" y2="14" stroke="#FFF" stroke-width="1"/>
      <line x1="13" y1="13" x2="14" y2="14" stroke="#FFF" stroke-width="1"/>
    </g>
  `;
}

export function createRatSVG(): string {
  return `
    <g class="rat-sprite">
      <!-- Body -->
      <ellipse cx="12" cy="14" rx="6" ry="7" fill="#8D6E63" stroke="#5D4037" stroke-width="1"/>
      <!-- Head -->
      <circle cx="12" cy="8" r="4" fill="#A1887F" stroke="#6D4C41" stroke-width="1"/>
      <!-- Ears -->
      <circle cx="9" cy="6" r="2" fill="#BCAAA4"/>
      <circle cx="15" cy="6" r="2" fill="#BCAAA4"/>
      <!-- Eyes -->
      <circle cx="10" cy="8" r="1" fill="#F00"/>
      <circle cx="14" cy="8" r="1" fill="#F00"/>
      <!-- Nose -->
      <circle cx="12" cy="10" r="0.8" fill="#000"/>
      <!-- Whiskers -->
      <line x1="7" y1="9" x2="4" y2="8" stroke="#000" stroke-width="0.5"/>
      <line x1="7" y1="10" x2="4" y2="10" stroke="#000" stroke-width="0.5"/>
      <line x1="17" y1="9" x2="20" y2="8" stroke="#000" stroke-width="0.5"/>
      <line x1="17" y1="10" x2="20" y2="10" stroke="#000" stroke-width="0.5"/>
      <!-- Tail -->
      <path d="M 16 16 Q 20 18 22 22" stroke="#8D6E63" stroke-width="1.5" fill="none"/>
    </g>
  `;
}

// Weapon SVGs (small icons)
export function createMeleeSVG(): string {
  return `<path d="M 2 2 L 4 4 M 1 4 L 4 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
}

export function createPistolSVG(): string {
  return `
    <g class="pistol-icon">
      <rect x="1" y="2" width="4" height="1.5" fill="currentColor"/>
      <rect x="2" y="3.5" width="1.5" height="2" fill="currentColor"/>
      <circle cx="5" cy="2.5" r="0.5" fill="#FFD700"/>
    </g>
  `;
}

export function createRifleSVG(): string {
  return `
    <g class="rifle-icon">
      <rect x="0" y="2" width="6" height="1" fill="currentColor"/>
      <rect x="5" y="1.5" width="1" height="2" fill="currentColor"/>
      <circle cx="6.5" cy="2.5" r="0.5" fill="#FFD700"/>
    </g>
  `;
}

export function createStaffSVG(): string {
  return `
    <g class="staff-icon">
      <line x1="2" y1="0" x2="2" y2="6" stroke="currentColor" stroke-width="1"/>
      <circle cx="2" cy="1" r="1" fill="#9C27B0"/>
      <circle cx="2" cy="1" r="1.5" fill="#9C27B0" opacity="0.3"/>
    </g>
  `;
}

// Projectile SVGs
export function createBulletSVG(color: string = '#FFD700'): string {
  return `<circle r="3" fill="${color}" opacity="0.9"/>`;
}

export function createMagicBoltSVG(): string {
  return `
    <g class="magic-bolt">
      <circle r="4" fill="#9C27B0" opacity="0.6"/>
      <circle r="2.5" fill="#E1BEE7"/>
      <circle r="1.5" fill="#FFF"/>
    </g>
  `;
}

export function createFireBallSVG(): string {
  return `
    <g class="fireball">
      <circle r="5" fill="#FF9800" opacity="0.4"/>
      <circle r="3.5" fill="#FF5722" opacity="0.7"/>
      <circle r="2" fill="#FFEB3B"/>
    </g>
  `;
}

export function createPlasmaBoltSVG(): string {
  return `
    <g class="plasma-bolt">
      <circle r="5" fill="#00E5FF" opacity="0.3"/>
      <circle r="3" fill="#00B0FF" opacity="0.7"/>
      <circle r="1.5" fill="#FFF"/>
    </g>
  `;
}

// Corpse SVG
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
    <g class="floor-tile">
      <rect width="32" height="32" fill="#2C2C2C"/>
      <rect x="1" y="1" width="30" height="30" fill="#323232"/>
      <!-- Stone texture -->
      <circle cx="8" cy="8" r="1" fill="#282828" opacity="0.3"/>
      <circle cx="20" cy="12" r="1.5" fill="#282828" opacity="0.3"/>
      <circle cx="16" cy="24" r="1" fill="#282828" opacity="0.3"/>
    </g>
  `;
}

export function createWallTileSVG(): string {
  return `
    <g class="wall-tile">
      <rect width="32" height="32" fill="#555"/>
      <!-- Brick pattern -->
      <rect x="0" y="0" width="16" height="8" fill="#666" stroke="#444" stroke-width="0.5"/>
      <rect x="16" y="0" width="16" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
      <rect x="8" y="8" width="16" height="8" fill="#666" stroke="#444" stroke-width="0.5"/>
      <rect x="24" y="8" width="8" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
      <rect x="0" y="8" width="8" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
      <rect x="0" y="16" width="16" height="8" fill="#666" stroke="#444" stroke-width="0.5"/>
      <rect x="16" y="16" width="16" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
      <rect x="8" y="24" width="16" height="8" fill="#666" stroke="#444" stroke-width="0.5"/>
      <rect x="24" y="24" width="8" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
      <rect x="0" y="24" width="8" height="8" fill="#606060" stroke="#444" stroke-width="0.5"/>
    </g>
  `;
}

// Map enemy IDs to SVG generators
export const ENEMY_SVG_MAP: Record<string, () => string> = {
  'slime': createSlimeSVG,
  'goblin': createGoblinSVG,
  'skeleton': createSkeletonSVG,
  'orc': createOrcSVG,
  'dragon': createDragonSVG,
  'wolf': createWolfSVG,
  'rat': createRatSVG,
  'bat': createRatSVG, // Reuse rat for now
  'troll': createOrcSVG, // Reuse orc for now
  'spider': createSlimeSVG, // Reuse slime for now
  'ice_golem': createSkeletonSVG,
  'fire_elemental': createDragonSVG,
  'giant_crab': createOrcSVG,
  'demon_lord': createDragonSVG,
};

// Get enemy SVG by ID
export function getEnemySVG(enemyId: string): string {
  const generator = ENEMY_SVG_MAP[enemyId];
  return generator ? generator() : createSlimeSVG();
}
