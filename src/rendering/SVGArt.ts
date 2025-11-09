/**
 * SVG Art Generator - Creates SVG graphics for game entities
 * Enhanced with gradients, shadows, and detailed designs
 */

// Player character - fantasy/modern hybrid look with enhanced details
export function createPlayerSVG(): string {
  return `
    <defs>
      <radialGradient id="bodyGrad" cx="0.4" cy="0.3">
        <stop offset="0%" style="stop-color:#66BB6A;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="headGrad" cx="0.3" cy="0.3">
        <stop offset="0%" style="stop-color:#FFECB3;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFE0B2;stop-opacity:1" />
      </radialGradient>
      <filter id="shadow">
        <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g class="player-sprite" filter="url(#shadow)">
      <!-- Shadow -->
      <ellipse cx="12" cy="30" rx="10" ry="3" fill="#000" opacity="0.2"/>
      <!-- Legs -->
      <rect x="9" y="23" width="2.5" height="7" fill="#1565C0" rx="1.2"/>
      <rect x="12.5" y="23" width="2.5" height="7" fill="#1976D2" rx="1.2"/>
      <ellipse cx="10.25" cy="29.5" rx="2" ry="1.5" fill="#0D47A1"/>
      <ellipse cx="13.75" cy="29.5" rx="2" ry="1.5" fill="#1565C0"/>
      <!-- Body with gradient -->
      <ellipse cx="12" cy="16" rx="8" ry="10" fill="url(#bodyGrad)" stroke="#2E7D32" stroke-width="1.5"/>
      <!-- Belt -->
      <rect x="7" y="20" width="10" height="2" fill="#8D6E63" rx="0.5"/>
      <rect x="11" y="20" width="2" height="2.5" fill="#FFD700" rx="0.3"/>
      <!-- Arms -->
      <ellipse cx="5" cy="16" rx="2.5" ry="5" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <ellipse cx="19" cy="16" rx="2.5" ry="5" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <circle cx="5" cy="20" r="2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.5"/>
      <circle cx="19" cy="20" r="2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.5"/>
      <!-- Tactical vest with details -->
      <path d="M 8 14 L 8 22 L 16 22 L 16 14" fill="#37474F" opacity="0.8"/>
      <line x1="9" y1="16" x2="15" y2="16" stroke="#FFC107" stroke-width="0.7"/>
      <line x1="9" y1="18" x2="15" y2="18" stroke="#FFC107" stroke-width="0.7"/>
      <circle cx="10" cy="15" r="0.8" fill="#666"/>
      <circle cx="14" cy="15" r="0.8" fill="#666"/>
      <rect x="11.5" y="19" width="1" height="3" fill="#78909C"/>
      <!-- Head with gradient -->
      <circle cx="12" cy="8" r="6" fill="url(#headGrad)" stroke="#D7CCC8" stroke-width="1.5"/>
      <!-- Hair -->
      <path d="M 7 7 Q 6 5 8 4 Q 12 3 16 4 Q 18 5 17 7" fill="#5D4037" stroke="#3E2723" stroke-width="0.5"/>
      <!-- Eyes with more detail -->
      <circle cx="10" cy="8" r="1.5" fill="#FFF"/>
      <circle cx="14" cy="8" r="1.5" fill="#FFF"/>
      <circle cx="10" cy="8" r="1" fill="#1976D2"/>
      <circle cx="14" cy="8" r="1" fill="#1976D2"/>
      <circle cx="10.3" cy="7.7" r="0.4" fill="#FFF"/>
      <circle cx="14.3" cy="7.7" r="0.4" fill="#FFF"/>
      <!-- Smile -->
      <path d="M 9 10 Q 12 11 15 10" stroke="#D7CCC8" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    </g>
  `;
}

// Enemy SVGs
export function createSlimeSVG(): string {
  return `
    <defs>
      <radialGradient id="slimeGrad">
        <stop offset="0%" style="stop-color:#ADFF2F;stop-opacity:0.9" />
        <stop offset="70%" style="stop-color:#7FFF00;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#32CD32;stop-opacity:0.7" />
      </radialGradient>
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur"/>
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey"/>
      </filter>
    </defs>
    <g class="slime-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="22" rx="11" ry="3" fill="#000" opacity="0.25"/>
      <!-- Main body with gradient and gooey effect -->
      <ellipse cx="12" cy="14" rx="10" ry="8" fill="url(#slimeGrad)" filter="url(#gooey)"/>
      <ellipse cx="12" cy="14" rx="8" ry="6" fill="#00FF7F" opacity="0.5"/>
      <!-- Slime drips -->
      <ellipse cx="8" cy="20" rx="2" ry="2.5" fill="#7FFF00" opacity="0.7"/>
      <ellipse cx="16" cy="21" rx="1.5" ry="2" fill="#7FFF00" opacity="0.7"/>
      <ellipse cx="12" cy="20.5" rx="1.8" ry="2.2" fill="#7FFF00" opacity="0.7"/>
      <!-- Eyes with depth -->
      <ellipse cx="9" cy="12" rx="2.2" ry="2.5" fill="#000" opacity="0.8"/>
      <ellipse cx="15" cy="12" rx="2.2" ry="2.5" fill="#000" opacity="0.8"/>
      <circle cx="9" cy="12" r="2" fill="#1a1a1a"/>
      <circle cx="15" cy="12" r="2" fill="#1a1a1a"/>
      <circle cx="9.5" cy="11.3" r="1" fill="#FFF"/>
      <circle cx="15.5" cy="11.3" r="1" fill="#FFF"/>
      <!-- Shine effects -->
      <ellipse cx="7" cy="9" rx="3.5" ry="2.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="16" cy="11" rx="2" ry="1.2" fill="#FFF" opacity="0.4"/>
      <circle cx="10" cy="16" r="1" fill="#FFF" opacity="0.3"/>
    </g>
  `;
}

export function createGoblinSVG(): string {
  return `
    <defs>
      <radialGradient id="goblinSkin">
        <stop offset="0%" style="stop-color:#9CCC65;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#7CB342;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="goblin-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="8" ry="2.5" fill="#000" opacity="0.25"/>
      <!-- Body -->
      <ellipse cx="12" cy="17" rx="7" ry="9" fill="#7CB342" stroke="#558B2F" stroke-width="1.2"/>
      <!-- Ragged vest -->
      <path d="M 8 13 L 7 17 L 8 23 L 16 23 L 17 17 L 16 13 Z" fill="#5D4037" opacity="0.7"/>
      <path d="M 8 13 L 9 14 L 8 16 Z" fill="#3E2723"/>
      <path d="M 16 13 L 15 14 L 16 16 Z" fill="#3E2723"/>
      <!-- Arms -->
      <ellipse cx="6" cy="17" rx="2" ry="6" fill="#8BC34A" stroke="#689F38" stroke-width="0.8"/>
      <ellipse cx="18" cy="17" rx="2" ry="6" fill="#8BC34A" stroke="#689F38" stroke-width="0.8"/>
      <!-- Hands -->
      <circle cx="6" cy="22" r="1.8" fill="#9CCC65"/>
      <circle cx="18" cy="22" r="1.8" fill="#9CCC65"/>
      <!-- Head with gradient -->
      <circle cx="12" cy="9" r="5.5" fill="url(#goblinSkin)" stroke="#689F38" stroke-width="1.2"/>
      <!-- Ears with detail -->
      <ellipse cx="6.5" cy="8" rx="2.5" ry="4" fill="#8BC34A" stroke="#689F38" stroke-width="0.5"/>
      <ellipse cx="17.5" cy="8" rx="2.5" ry="4" fill="#8BC34A" stroke="#689F38" stroke-width="0.5"/>
      <ellipse cx="6.5" cy="8" rx="1.2" ry="2" fill="#7CB342"/>
      <ellipse cx="17.5" cy="8" rx="1.2" ry="2" fill="#7CB342"/>
      <!-- Eyes with glow -->
      <circle cx="10" cy="9" r="2" fill="#FFEB3B" opacity="0.6"/>
      <circle cx="14" cy="9" r="2" fill="#FFEB3B" opacity="0.6"/>
      <circle cx="10" cy="9" r="1.5" fill="#FFD700"/>
      <circle cx="14" cy="9" r="1.5" fill="#FFD700"/>
      <circle cx="10" cy="9" r="0.9" fill="#000"/>
      <circle cx="14" cy="9" r="0.9" fill="#000"/>
      <circle cx="10.3" cy="8.7" r="0.4" fill="#FFF"/>
      <circle cx="14.3" cy="8.7" r="0.4" fill="#FFF"/>
      <!-- Nose -->
      <ellipse cx="12" cy="10.5" rx="1" ry="1.5" fill="#689F38"/>
      <!-- Mouth/grin -->
      <path d="M 9 11.5 Q 12 13 15 11.5" stroke="#3E2723" stroke-width="1" fill="none"/>
      <line x1="9" y1="12" x2="10" y2="12.5" stroke="#FFF" stroke-width="0.8"/>
      <line x1="14" y1="12" x2="15" y2="12.5" stroke="#FFF" stroke-width="0.8"/>
      <!-- Weapon (detailed club) -->
      <rect x="18.5" y="12" width="2.5" height="10" fill="#6D4C41" rx="1.2"/>
      <ellipse cx="19.75" cy="11" rx="2.5" ry="2.8" fill="#5D4037" stroke="#3E2723" stroke-width="0.8"/>
      <circle cx="18.5" cy="10" r="0.5" fill="#3E2723"/>
      <circle cx="20.5" cy="11.5" r="0.5" fill="#3E2723"/>
      <circle cx="19.5" cy="9.5" r="0.4" fill="#3E2723"/>
    </g>
  `;
}

export function createSkeletonSVG(): string {
  return `
    <defs>
      <radialGradient id="skullGrad">
        <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#BDBDBD;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="swordGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#CFD8DC;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#90A4AE;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#78909C;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="skeleton-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2" fill="#000" opacity="0.3"/>
      <!-- Pelvis -->
      <ellipse cx="12" cy="24" rx="5" ry="3" fill="none" stroke="#E0E0E0" stroke-width="1.5"/>
      <line x1="10" y1="24" x2="14" y2="24" stroke="#E0E0E0" stroke-width="1"/>
      <!-- Ribcage with depth -->
      <ellipse cx="12" cy="17" rx="6.5" ry="8.5" fill="none" stroke="#BDBDBD" stroke-width="2"/>
      <ellipse cx="12" cy="17" rx="5.5" ry="7" fill="none" stroke="#E0E0E0" stroke-width="1.5"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="#E0E0E0" stroke-width="1.2"/>
      <line x1="7.5" y1="16" x2="16.5" y2="16" stroke="#E0E0E0" stroke-width="1.2"/>
      <line x1="8" y1="19" x2="16" y2="19" stroke="#E0E0E0" stroke-width="1.2"/>
      <line x1="9" y1="22" x2="15" y2="22" stroke="#E0E0E0" stroke-width="1"/>
      <!-- Spine -->
      <line x1="12" y1="12" x2="12" y2="23" stroke="#E0E0E0" stroke-width="1.5"/>
      <circle cx="12" cy="14" r="0.8" fill="#BDBDBD"/>
      <circle cx="12" cy="17" r="0.8" fill="#BDBDBD"/>
      <circle cx="12" cy="20" r="0.8" fill="#BDBDBD"/>
      <!-- Skull with gradient -->
      <ellipse cx="12" cy="8" rx="5.5" ry="6" fill="url(#skullGrad)" stroke="#757575" stroke-width="1.2"/>
      <!-- Cranium detail -->
      <path d="M 8 6 Q 12 4 16 6" stroke="#9E9E9E" stroke-width="0.8" fill="none"/>
      <!-- Eye sockets with depth -->
      <ellipse cx="9.5" cy="7" rx="2" ry="2.2" fill="#424242"/>
      <ellipse cx="14.5" cy="7" rx="2" ry="2.2" fill="#424242"/>
      <circle cx="9.5" cy="7" r="1.5" fill="#000"/>
      <circle cx="14.5" cy="7" r="1.5" fill="#000"/>
      <circle cx="9.5" cy="7" r="0.7" fill="#F44336" opacity="0.8"/>
      <circle cx="14.5" cy="7" r="0.7" fill="#F44336" opacity="0.8"/>
      <circle cx="9.5" cy="7" r="0.3" fill="#FF5252"/>
      <circle cx="14.5" cy="7" r="0.3" fill="#FF5252"/>
      <!-- Nose cavity -->
      <path d="M 11 9 L 11 10.5 L 13 10.5 L 13 9 Z" fill="#424242"/>
      <!-- Jaw with teeth -->
      <path d="M 7.5 10.5 Q 12 12 16.5 10.5" stroke="#757575" stroke-width="1.2" fill="none"/>
      <line x1="9" y1="11" x2="9" y2="12" stroke="#F5F5F5" stroke-width="0.8"/>
      <line x1="10.5" y1="11.3" x2="10.5" y2="12.3" stroke="#F5F5F5" stroke-width="0.8"/>
      <line x1="12" y1="11.5" x2="12" y2="12.5" stroke="#F5F5F5" stroke-width="0.8"/>
      <line x1="13.5" y1="11.3" x2="13.5" y2="12.3" stroke="#F5F5F5" stroke-width="0.8"/>
      <line x1="15" y1="11" x2="15" y2="12" stroke="#F5F5F5" stroke-width="0.8"/>
      <!-- Detailed sword -->
      <line x1="19" y1="11" x2="19" y2="24" stroke="url(#swordGrad)" stroke-width="2.5"/>
      <line x1="19" y1="12" x2="19" y2="23" stroke="#CFD8DC" stroke-width="1" opacity="0.6"/>
      <rect x="17.5" y="9" width="3" height="2.5" fill="#78909C" rx="0.5"/>
      <rect x="18" y="9.5" width="2" height="1.5" fill="#FFC107"/>
      <path d="M 17 11 L 19 8 L 21 11 Z" fill="#B0BEC5" stroke="#78909C" stroke-width="0.8"/>
    </g>
  `;
}

export function createOrcSVG(): string {
  return `
    <defs>
      <radialGradient id="orcSkin">
        <stop offset="0%" style="stop-color:#8D6E63;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#5D4037;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="orc-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="29" rx="10" ry="2.5" fill="#000" opacity="0.3"/>
      <!-- Body with muscle definition -->
      <ellipse cx="12" cy="18" rx="9.5" ry="10.5" fill="#6D4C41" stroke="#3E2723" stroke-width="1.8"/>
      <ellipse cx="10" cy="16" rx="3" ry="4" fill="#5D4037" opacity="0.3"/>
      <ellipse cx="14" cy="16" rx="3" ry="4" fill="#5D4037" opacity="0.3"/>
      <!-- Armor plates with rivets -->
      <rect x="7" y="14" width="10" height="4" fill="#37474F" stroke="#263238" stroke-width="1"/>
      <rect x="7" y="18" width="10" height="3" fill="#455A64" stroke="#263238" stroke-width="1"/>
      <circle cx="12" cy="16" r="2" fill="#607D8B" stroke="#37474F" stroke-width="1"/>
      <circle cx="12" cy="16" r="1.2" fill="#78909C"/>
      <circle cx="8" cy="15" r="0.6" fill="#263238"/>
      <circle cx="16" cy="15" r="0.6" fill="#263238"/>
      <circle cx="8" cy="19" r="0.6" fill="#263238"/>
      <circle cx="16" cy="19" r="0.6" fill="#263238"/>
      <!-- Thick arms -->
      <ellipse cx="4" cy="18" rx="3" ry="7" fill="#6D4C41" stroke="#4E342E" stroke-width="1.2"/>
      <ellipse cx="20" cy="18" rx="3" ry="7" fill="#6D4C41" stroke="#4E342E" stroke-width="1.2"/>
      <!-- Hands/fists -->
      <circle cx="4" cy="24" r="2.5" fill="#795548"/>
      <circle cx="20" cy="24" r="2.5" fill="#795548"/>
      <!-- Head with gradient -->
      <circle cx="12" cy="9" r="6.5" fill="url(#orcSkin)" stroke="#4E342E" stroke-width="1.8"/>
      <!-- Brutal features -->
      <rect x="8" y="7" width="8" height="3" fill="#6D4C41"/>
      <!-- Tusks with detail -->
      <path d="M 8.5 11 L 7 14 L 8.5 13.5 Z" fill="#FFFACD" stroke="#8B4513" stroke-width="0.7"/>
      <path d="M 15.5 11 L 17 14 L 15.5 13.5 Z" fill="#FFFACD" stroke="#8B4513" stroke-width="0.7"/>
      <line x1="7.5" y1="12" x2="8.2" y2="12" stroke="#FFF" stroke-width="0.5"/>
      <line x1="16.5" y1="12" x2="15.8" y2="12" stroke="#FFF" stroke-width="0.5"/>
      <!-- Angry eyes -->
      <ellipse cx="10" cy="8.5" rx="1.8" ry="2" fill="#3E2723"/>
      <ellipse cx="14" cy="8.5" rx="1.8" ry="2" fill="#3E2723"/>
      <circle cx="10" cy="8.5" r="1.5" fill="#C62828"/>
      <circle cx="14" cy="8.5" r="1.5" fill="#C62828"/>
      <circle cx="10" cy="8.5" r="0.8" fill="#000"/>
      <circle cx="14" cy="8.5" r="0.8" fill="#000"/>
      <!-- Brow ridge -->
      <path d="M 7 7 L 11 6.5 M 13 6.5 L 17 7" stroke="#4E342E" stroke-width="1.2" stroke-linecap="round"/>
      <!-- War paint -->
      <line x1="9" y1="5" x2="9" y2="7" stroke="#C62828" stroke-width="1.5"/>
      <line x1="15" y1="5" x2="15" y2="7" stroke="#C62828" stroke-width="1.5"/>
      <!-- Detailed battle axe -->
      <line x1="2" y1="15" x2="7" y2="15" stroke="#6D4C41" stroke-width="2"/>
      <path d="M 2 11 L 1 15 L 2 19 Z" fill="#546E7A" stroke="#37474F" stroke-width="1"/>
      <path d="M 3 12 L 2 15 L 3 18 Z" fill="#78909C"/>
      <line x1="2.5" y1="13" x2="1.5" y2="15" stroke="#90A4AE" stroke-width="0.5"/>
      <circle cx="5" cy="15" r="0.8" fill="#37474F"/>
    </g>
  `;
}

export function createDragonSVG(): string {
  return `
    <defs>
      <radialGradient id="dragonBody">
        <stop offset="0%" style="stop-color:#EF5350;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#B71C1C;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#D32F2F;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#C62828;stop-opacity:0.7" />
      </linearGradient>
      <radialGradient id="fireGlow">
        <stop offset="0%" style="stop-color:#FFEB3B;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FF9800;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.4" />
      </radialGradient>
    </defs>
    <g class="dragon-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="30" rx="14" ry="3" fill="#000" opacity="0.35"/>
      <!-- Tail -->
      <path d="M 16 24 Q 20 26 22 30" stroke="#C62828" stroke-width="3" fill="none"/>
      <path d="M 16 24 Q 20 26 22 30" stroke="#D32F2F" stroke-width="2" fill="none"/>
      <path d="M 21 28 L 23 30 L 22 32 Z" fill="#EF5350" stroke="#C62828" stroke-width="0.8"/>
      <!-- Wings with membrane detail -->
      <path d="M 4 12 Q -2 8 0 16 Q 1 20 4 18 Z" fill="url(#wingGrad)" stroke="#B71C1C" stroke-width="1.2"/>
      <path d="M 20 12 Q 26 8 24 16 Q 23 20 20 18 Z" fill="url(#wingGrad)" stroke="#B71C1C" stroke-width="1.2"/>
      <path d="M 3 12 L 2 16 M 3 14 L 1.5 17" stroke="#B71C1C" stroke-width="0.5"/>
      <path d="M 21 12 L 22 16 M 21 14 L 22.5 17" stroke="#B71C1C" stroke-width="0.5"/>
      <!-- Body with gradient -->
      <ellipse cx="12" cy="17" rx="10.5" ry="12" fill="url(#dragonBody)" stroke="#B71C1C" stroke-width="2.2"/>
      <!-- Scales on belly -->
      <ellipse cx="12" cy="20" rx="7" ry="8" fill="#C62828" opacity="0.4"/>
      <path d="M 8 16 Q 12 17 16 16" stroke="#B71C1C" stroke-width="0.8" fill="none"/>
      <path d="M 8 19 Q 12 20 16 19" stroke="#B71C1C" stroke-width="0.8" fill="none"/>
      <path d="M 9 22 Q 12 23 15 22" stroke="#B71C1C" stroke-width="0.8" fill="none"/>
      <!-- Spikes on back -->
      <path d="M 8 12 L 7 7 L 9 12 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="0.8"/>
      <path d="M 11 11 L 10 6 L 12 11 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="0.8"/>
      <path d="M 14 11 L 13 6 L 15 11 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="0.8"/>
      <path d="M 17 12 L 16 7 L 18 12 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="0.8"/>
      <!-- Head -->
      <ellipse cx="12" cy="8" rx="7.5" ry="6.5" fill="#EF5350" stroke="#C62828" stroke-width="1.8"/>
      <!-- Horns with detail -->
      <path d="M 7 6 L 5 1 L 7.5 5 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="1"/>
      <path d="M 17 6 L 19 1 L 16.5 5 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="1"/>
      <path d="M 6 4 L 5.5 2 L 6.5 4" stroke="#FFF176" stroke-width="0.5"/>
      <path d="M 18 4 L 18.5 2 L 17.5 4" stroke="#FFF176" stroke-width="0.5"/>
      <!-- Eyes with intensity -->
      <ellipse cx="9.5" cy="8" rx="2.2" ry="2.5" fill="#FFC107" opacity="0.8"/>
      <ellipse cx="14.5" cy="8" rx="2.2" ry="2.5" fill="#FFC107" opacity="0.8"/>
      <ellipse cx="9.5" cy="8" rx="1.8" ry="2" fill="#FFEB3B"/>
      <ellipse cx="14.5" cy="8" rx="1.8" ry="2" fill="#FFEB3B"/>
      <ellipse cx="9.5" cy="8" rx="0.8" ry="1.5" fill="#000"/>
      <ellipse cx="14.5" cy="8" rx="0.8" ry="1.5" fill="#000"/>
      <circle cx="9.7" cy="7.5" r="0.4" fill="#FFF"/>
      <circle cx="14.7" cy="7.5" r="0.4" fill="#FFF"/>
      <!-- Snout -->
      <ellipse cx="12" cy="11" rx="4" ry="2.5" fill="#D32F2F"/>
      <!-- Nostrils with fire glow -->
      <ellipse cx="10" cy="11.5" rx="1" ry="0.8" fill="#424242"/>
      <ellipse cx="14" cy="11.5" rx="1" ry="0.8" fill="#424242"/>
      <circle cx="10" cy="11.5" r="1.2" fill="url(#fireGlow)" opacity="0.6"/>
      <circle cx="14" cy="11.5" r="1.2" fill="url(#fireGlow)" opacity="0.6"/>
      <!-- Teeth -->
      <path d="M 9 12 L 8.5 13 L 9.5 13 Z" fill="#FFF"/>
      <path d="M 15 12 L 14.5 13 L 15.5 13 Z" fill="#FFF"/>
    </g>
  `;
}

export function createWolfSVG(): string {
  return `
    <defs>
      <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#9E9E9E;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#616161;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="wolf-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="28" rx="9" ry="2.5" fill="#000" opacity="0.3"/>
      <!-- Tail -->
      <path d="M 16 20 Q 20 22 22 26" stroke="#757575" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 16 20 Q 20 22 22 26" stroke="#9E9E9E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="26" rx="2" ry="3" fill="#BDBDBD"/>
      <!-- Hind legs -->
      <ellipse cx="14" cy="25" rx="2" ry="5" fill="#757575" stroke="#424242" stroke-width="0.8"/>
      <ellipse cx="10" cy="25" rx="2" ry="5" fill="#757575" stroke="#424242" stroke-width="0.8"/>
      <!-- Body -->
      <ellipse cx="12" cy="18" rx="8.5" ry="9.5" fill="url(#furGrad)" stroke="#424242" stroke-width="1.5"/>
      <!-- Fur texture -->
      <path d="M 6 14 Q 8 13 10 14" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <path d="M 14 14 Q 16 13 18 14" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <path d="M 6 18 Q 8 17 10 18" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <path d="M 14 18 Q 16 17 18 18" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <!-- Chest fluff -->
      <ellipse cx="12" cy="20" rx="5" ry="6" fill="#BDBDBD" opacity="0.5"/>
      <!-- Front legs -->
      <rect x="8" y="22" width="2.5" height="6" fill="#616161" stroke="#424242" stroke-width="0.8" rx="1"/>
      <rect x="13.5" y="22" width="2.5" height="6" fill="#616161" stroke="#424242" stroke-width="0.8" rx="1"/>
      <ellipse cx="9.25" cy="28" rx="1.8" ry="1.2" fill="#424242"/>
      <ellipse cx="14.75" cy="28" rx="1.8" ry="1.2" fill="#424242"/>
      <!-- Neck -->
      <ellipse cx="12" cy="13" rx="5" ry="4" fill="#757575" stroke="#424242" stroke-width="1"/>
      <!-- Head -->
      <ellipse cx="12" cy="9" rx="6" ry="5.5" fill="#9E9E9E" stroke="#616161" stroke-width="1.2"/>
      <!-- Ears with detail -->
      <path d="M 7.5 7 L 6 2 L 9 6 Z" fill="#757575" stroke="#424242" stroke-width="1"/>
      <path d="M 16.5 7 L 18 2 L 15 6 Z" fill="#757575" stroke="#424242" stroke-width="1"/>
      <path d="M 7.5 6 L 7 3 L 8 6" fill="#E0E0E0"/>
      <path d="M 16.5 6 L 17 3 L 16 6" fill="#E0E0E0"/>
      <!-- Snout with detail -->
      <ellipse cx="12" cy="11.5" rx="3.5" ry="2.5" fill="#BDBDBD" stroke="#9E9E9E" stroke-width="0.8"/>
      <ellipse cx="12" cy="13" rx="1.2" ry="1" fill="#212121"/>
      <line x1="12" y1="13" x2="12" y2="11" stroke="#212121" stroke-width="0.8"/>
      <!-- Eyes with predator glow -->
      <ellipse cx="9.5" cy="8.5" rx="1.8" ry="2" fill="#FFA000" opacity="0.8"/>
      <ellipse cx="14.5" cy="8.5" rx="1.8" ry="2" fill="#FFA000" opacity="0.8"/>
      <circle cx="9.5" cy="8.5" r="1.3" fill="#FFC107"/>
      <circle cx="14.5" cy="8.5" r="1.3" fill="#FFC107"/>
      <ellipse cx="9.5" cy="8.5" rx="0.6" ry="1" fill="#000"/>
      <ellipse cx="14.5" cy="8.5" rx="0.6" ry="1" fill="#000"/>
      <circle cx="9.7" cy="8" r="0.4" fill="#FFF"/>
      <circle cx="14.7" cy="8" r="0.4" fill="#FFF"/>
      <!-- Fangs -->
      <path d="M 10 12 L 9.5 14 L 10.5 13 Z" fill="#FFF" stroke="#E0E0E0" stroke-width="0.3"/>
      <path d="M 14 12 L 13.5 13 L 14.5 14 Z" fill="#FFF" stroke="#E0E0E0" stroke-width="0.3"/>
    </g>
  `;
}

export function createRatSVG(): string {
  return `
    <defs>
      <radialGradient id="ratFur">
        <stop offset="0%" style="stop-color:#A1887F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6D4C41;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="rat-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.25"/>
      <!-- Tail with segments -->
      <path d="M 16 16 Q 19 18 21 22 Q 22 25 23 28" stroke="#8D6E63" stroke-width="2" fill="none"/>
      <path d="M 16 16 Q 19 18 21 22 Q 22 25 23 28" stroke="#A1887F" stroke-width="1.2" fill="none"/>
      <line x1="18" y1="18" x2="18.5" y2="19" stroke="#6D4C41" stroke-width="0.5"/>
      <line x1="20" y1="21" x2="20.5" y2="22" stroke="#6D4C41" stroke-width="0.5"/>
      <line x1="21.5" y1="24" x2="22" y2="25" stroke="#6D4C41" stroke-width="0.5"/>
      <!-- Body -->
      <ellipse cx="12" cy="15" rx="6.5" ry="7.5" fill="url(#ratFur)" stroke="#5D4037" stroke-width="1.2"/>
      <!-- Fur details -->
      <ellipse cx="12" cy="16" rx="5" ry="6" fill="#8D6E63" opacity="0.4"/>
      <!-- Legs -->
      <ellipse cx="9" cy="20" rx="1.5" ry="3" fill="#8D6E63"/>
      <ellipse cx="15" cy="20" rx="1.5" ry="3" fill="#8D6E63"/>
      <ellipse cx="9" cy="22.5" rx="1.2" ry="0.8" fill="#6D4C41"/>
      <ellipse cx="15" cy="22.5" rx="1.2" ry="0.8" fill="#6D4C41"/>
      <!-- Head -->
      <ellipse cx="12" cy="8" rx="4.5" ry="4.2" fill="#A1887F" stroke="#6D4C41" stroke-width="1"/>
      <!-- Large ears -->
      <ellipse cx="8.5" cy="5" rx="2.5" ry="3" fill="#D7CCC8" stroke="#8D6E63" stroke-width="0.8"/>
      <ellipse cx="15.5" cy="5" rx="2.5" ry="3" fill="#D7CCC8" stroke="#8D6E63" stroke-width="0.8"/>
      <ellipse cx="8.5" cy="5.5" rx="1.5" ry="2" fill="#F5F5F5" opacity="0.6"/>
      <ellipse cx="15.5" cy="5.5" rx="1.5" ry="2" fill="#F5F5F5" opacity="0.6"/>
      <!-- Eyes with gleam -->
      <circle cx="10" cy="8" r="1.5" fill="#C62828"/>
      <circle cx="14" cy="8" r="1.5" fill="#C62828"/>
      <circle cx="10" cy="8" r="1.2" fill="#D32F2F"/>
      <circle cx="14" cy="8" r="1.2" fill="#D32F2F"/>
      <circle cx="10.3" cy="7.7" r="0.5" fill="#FF5252"/>
      <circle cx="14.3" cy="7.7" r="0.5" fill="#FF5252"/>
      <!-- Snout -->
      <ellipse cx="12" cy="9.5" rx="2.5" ry="1.8" fill="#BCAAA4"/>
      <ellipse cx="12" cy="10.5" rx="1" ry="0.8" fill="#212121"/>
      <!-- Whiskers -->
      <line x1="6" y1="8" x2="3" y2="6" stroke="#424242" stroke-width="0.6"/>
      <line x1="6" y1="9" x2="2" y2="9" stroke="#424242" stroke-width="0.6"/>
      <line x1="6" y1="10" x2="3" y2="11" stroke="#424242" stroke-width="0.6"/>
      <line x1="18" y1="8" x2="21" y2="6" stroke="#424242" stroke-width="0.6"/>
      <line x1="18" y1="9" x2="22" y2="9" stroke="#424242" stroke-width="0.6"/>
      <line x1="18" y1="10" x2="21" y2="11" stroke="#424242" stroke-width="0.6"/>
      <!-- Front paws -->
      <ellipse cx="9" cy="13" rx="1.3" ry="2" fill="#A1887F"/>
      <ellipse cx="15" cy="13" rx="1.3" ry="2" fill="#A1887F"/>
      <circle cx="9" cy="14" r="0.8" fill="#8D6E63"/>
      <circle cx="15" cy="14" r="0.8" fill="#8D6E63"/>
    </g>
  `;
}

// Bat - flying creature
export function createBatSVG(): string {
  return `
    <defs>
      <linearGradient id="batWing">
        <stop offset="0%" style="stop-color:#4527A0;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#311B92;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="bat-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="26" rx="8" ry="2" fill="#000" opacity="0.2"/>
      <!-- Wings spread -->
      <path d="M 6 14 Q 2 12 0 14 Q -1 16 2 18 Q 4 17 6 16 Z" fill="url(#batWing)" stroke="#1A237E" stroke-width="1"/>
      <path d="M 18 14 Q 22 12 24 14 Q 25 16 22 18 Q 20 17 18 16 Z" fill="url(#batWing)" stroke="#1A237E" stroke-width="1"/>
      <!-- Wing membrane detail -->
      <path d="M 2 14 L 4 16 M 3 14 L 5 17" stroke="#1A237E" stroke-width="0.4"/>
      <path d="M 22 14 L 20 16 M 21 14 L 19 17" stroke="#1A237E" stroke-width="0.4"/>
      <!-- Body -->
      <ellipse cx="12" cy="16" rx="6" ry="7" fill="#512DA8" stroke="#311B92" stroke-width="1.2"/>
      <ellipse cx="12" cy="17" rx="4.5" ry="5" fill="#673AB7" opacity="0.5"/>
      <!-- Head -->
      <circle cx="12" cy="10" r="4.5" fill="#5E35B1" stroke="#311B92" stroke-width="1"/>
      <!-- Ears -->
      <path d="M 9 8 L 8 5 L 10 7 Z" fill="#512DA8" stroke="#311B92" stroke-width="0.8"/>
      <path d="M 15 8 L 16 5 L 14 7 Z" fill="#512DA8" stroke="#311B92" stroke-width="0.8"/>
      <ellipse cx="9" cy="7" rx="1" ry="1.5" fill="#D1C4E9" opacity="0.5"/>
      <ellipse cx="15" cy="7" rx="1" ry="1.5" fill="#D1C4E9" opacity="0.5"/>
      <!-- Eyes glowing -->
      <circle cx="10" cy="10" r="1.5" fill="#F44336" opacity="0.8"/>
      <circle cx="14" cy="10" r="1.5" fill="#F44336" opacity="0.8"/>
      <circle cx="10" cy="10" r="1" fill="#FF5252"/>
      <circle cx="14" cy="10" r="1" fill="#FF5252"/>
      <circle cx="10.3" cy="9.7" r="0.4" fill="#FFF"/>
      <circle cx="14.3" cy="9.7" r="0.4" fill="#FFF"/>
      <!-- Snout -->
      <ellipse cx="12" cy="11.5" rx="1.5" ry="1" fill="#424242"/>
      <!-- Fangs -->
      <path d="M 11 12 L 10.5 13.5 L 11.5 13 Z" fill="#FFF" stroke="#E0E0E0" stroke-width="0.3"/>
      <path d="M 13 12 L 12.5 13 L 13.5 13.5 Z" fill="#FFF" stroke="#E0E0E0" stroke-width="0.3"/>
      <!-- Clawed feet -->
      <ellipse cx="10" cy="22" rx="1.5" ry="2" fill="#311B92"/>
      <ellipse cx="14" cy="22" rx="1.5" ry="2" fill="#311B92"/>
      <line x1="10" y1="23" x2="9.5" y2="24" stroke="#1A237E" stroke-width="0.8"/>
      <line x1="14" y1="23" x2="14.5" y2="24" stroke="#1A237E" stroke-width="0.8"/>
    </g>
  `;
}

// Troll - large brutish creature
export function createTrollSVG(): string {
  return `
    <defs>
      <radialGradient id="trollSkin">
        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="troll-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="30" rx="11" ry="3" fill="#000" opacity="0.35"/>
      <!-- Hunched body -->
      <ellipse cx="12" cy="20" rx="10" ry="11" fill="url(#trollSkin)" stroke="#1B5E20" stroke-width="2"/>
      <ellipse cx="12" cy="22" rx="8" ry="8" fill="#388E3C" opacity="0.3"/>
      <!-- Muscular arms -->
      <ellipse cx="4" cy="20" rx="4" ry="9" fill="#43A047" stroke="#2E7D32" stroke-width="1.5"/>
      <ellipse cx="20" cy="20" rx="4" ry="9" fill="#43A047" stroke="#2E7D32" stroke-width="1.5"/>
      <!-- Large hands -->
      <ellipse cx="3" cy="28" rx="3.5" ry="3" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <ellipse cx="21" cy="28" rx="3.5" ry="3" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <circle cx="2" cy="28" r="0.8" fill="#2E7D32"/>
      <circle cx="3.5" cy="29" r="0.8" fill="#2E7D32"/>
      <circle cx="20.5" cy="29" r="0.8" fill="#2E7D32"/>
      <circle cx="22" cy="28" r="0.8" fill="#2E7D32"/>
      <!-- Head -->
      <ellipse cx="12" cy="11" rx="7" ry="6.5" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5"/>
      <!-- Brow ridge -->
      <rect x="6" y="9" width="12" height="2.5" fill="#388E3C" rx="1"/>
      <!-- Small eyes -->
      <circle cx="9" cy="10.5" r="1.2" fill="#000"/>
      <circle cx="15" cy="10.5" r="1.2" fill="#000"/>
      <circle cx="9.3" cy="10.2" r="0.4" fill="#FF5722"/>
      <circle cx="15.3" cy="10.2" r="0.4" fill="#FF5722"/>
      <!-- Large nose -->
      <ellipse cx="12" cy="12.5" rx="2" ry="2.5" fill="#388E3C" stroke="#2E7D32" stroke-width="0.8"/>
      <ellipse cx="11.3" cy="13" rx="0.6" ry="0.8" fill="#1B5E20"/>
      <ellipse cx="12.7" cy="13" rx="0.6" ry="0.8" fill="#1B5E20"/>
      <!-- Large mouth -->
      <path d="M 8 14.5 Q 12 16 16 14.5" stroke="#1B5E20" stroke-width="1.5" fill="none"/>
      <path d="M 8 14.5 Q 12 15.5 16 14.5" fill="#2E7D32" opacity="0.5"/>
      <!-- Tusks -->
      <path d="M 9 14 L 8 16 L 9.5 15 Z" fill="#FFF" stroke="#BDBDBD" stroke-width="0.5"/>
      <path d="M 15 14 L 16 16 L 14.5 15 Z" fill="#FFF" stroke="#BDBDBD" stroke-width="0.5"/>
      <!-- Warts/bumps -->
      <circle cx="8" cy="11" r="0.8" fill="#388E3C"/>
      <circle cx="16" cy="11.5" r="0.7" fill="#388E3C"/>
      <circle cx="10" cy="18" r="1" fill="#388E3C"/>
      <circle cx="14" cy="19" r="0.9" fill="#388E3C"/>
    </g>
  `;
}

// Spider - eight-legged horror
export function createSpiderSVG(): string {
  return `
    <defs>
      <radialGradient id="spiderBody">
        <stop offset="0%" style="stop-color:#424242;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#212121;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="spider-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="24" rx="10" ry="2.5" fill="#000" opacity="0.4"/>
      <!-- Legs (8 legs) -->
      <path d="M 6 14 Q 2 12 0 14 Q -1 16 1 17" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 7 16 Q 3 16 1 18 Q 0 20 2 21" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 8 18 Q 4 20 3 23" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 9 19 Q 6 22 5 25" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 18 14 Q 22 12 24 14 Q 25 16 23 17" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 17 16 Q 21 16 23 18 Q 24 20 22 21" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 16 18 Q 20 20 21 23" stroke="#424242" stroke-width="1.8" fill="none"/>
      <path d="M 15 19 Q 18 22 19 25" stroke="#424242" stroke-width="1.8" fill="none"/>
      <!-- Leg segments -->
      <circle cx="1" cy="15" r="0.8" fill="#212121"/>
      <circle cx="2" cy="20" r="0.8" fill="#212121"/>
      <circle cx="23" cy="15" r="0.8" fill="#212121"/>
      <circle cx="22" cy="20" r="0.8" fill="#212121"/>
      <!-- Abdomen (rear body) -->
      <ellipse cx="12" cy="19" rx="7" ry="8" fill="url(#spiderBody)" stroke="#000" stroke-width="1.5"/>
      <ellipse cx="12" cy="20" rx="5.5" ry="6" fill="#616161" opacity="0.3"/>
      <!-- Pattern on abdomen -->
      <circle cx="12" cy="17" r="1.5" fill="#9E9E9E" opacity="0.5"/>
      <circle cx="10" cy="19" r="1" fill="#9E9E9E" opacity="0.5"/>
      <circle cx="14" cy="19" r="1" fill="#9E9E9E" opacity="0.5"/>
      <circle cx="11" cy="21" r="0.8" fill="#9E9E9E" opacity="0.5"/>
      <circle cx="13" cy="21" r="0.8" fill="#9E9E9E" opacity="0.5"/>
      <!-- Cephalothorax (front body/head) -->
      <ellipse cx="12" cy="11" rx="5.5" ry="5" fill="#424242" stroke="#000" stroke-width="1.2"/>
      <ellipse cx="12" cy="11" rx="4" ry="3.5" fill="#616161" opacity="0.3"/>
      <!-- Multiple eyes -->
      <circle cx="9" cy="10" r="1.5" fill="#1A237E"/>
      <circle cx="15" cy="10" r="1.5" fill="#1A237E"/>
      <circle cx="9" cy="10" r="1" fill="#3949AB"/>
      <circle cx="15" cy="10" r="1" fill="#3949AB"/>
      <circle cx="9.3" cy="9.7" r="0.4" fill="#9FA8DA"/>
      <circle cx="15.3" cy="9.7" r="0.4" fill="#9FA8DA"/>
      <!-- Smaller eyes -->
      <circle cx="11" cy="8.5" r="0.8" fill="#1A237E"/>
      <circle cx="13" cy="8.5" r="0.8" fill="#1A237E"/>
      <circle cx="8" cy="11" r="0.7" fill="#1A237E"/>
      <circle cx="16" cy="11" r="0.7" fill="#1A237E"/>
      <!-- Fangs/chelicerae -->
      <path d="M 10.5 13 L 9.5 15 L 11 14.5 Z" fill="#1A237E" stroke="#000" stroke-width="0.5"/>
      <path d="M 13.5 13 L 14.5 15 L 13 14.5 Z" fill="#1A237E" stroke="#000" stroke-width="0.5"/>
      <circle cx="10" cy="14.5" r="0.4" fill="#00E676" opacity="0.8"/>
      <circle cx="14" cy="14.5" r="0.4" fill="#00E676" opacity="0.8"/>
    </g>
  `;
}

// Ice Golem - frozen construct
export function createIceGolemSVG(): string {
  return `
    <defs>
      <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#E1F5FE;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#81D4FA;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#03A9F4;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="iceGlow">
        <stop offset="0%" style="stop-color:#00E5FF;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#00B0FF;stop-opacity:0.3" />
      </radialGradient>
    </defs>
    <g class="ice-golem-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="30" rx="10" ry="2.5" fill="#000" opacity="0.25"/>
      <!-- Ice glow aura -->
      <ellipse cx="12" cy="18" rx="13" ry="14" fill="url(#iceGlow)" opacity="0.4"/>
      <!-- Legs -->
      <rect x="8" y="24" width="3" height="6" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.2" rx="0.5"/>
      <rect x="13" y="24" width="3" height="6" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.2" rx="0.5"/>
      <rect x="8" y="28" width="3" height="2" fill="#01579B" opacity="0.7"/>
      <rect x="13" y="28" width="3" height="2" fill="#01579B" opacity="0.7"/>
      <!-- Body - crystalline -->
      <path d="M 6 22 L 12 14 L 18 22 L 12 24 Z" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.5"/>
      <ellipse cx="12" cy="19" rx="8" ry="9" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.8" opacity="0.9"/>
      <!-- Ice crystals on body -->
      <path d="M 8 16 L 9 18 L 8 20 Z" fill="#E1F5FE" opacity="0.8"/>
      <path d="M 16 16 L 15 18 L 16 20 Z" fill="#E1F5FE" opacity="0.8"/>
      <path d="M 11 22 L 12 24 L 13 22 Z" fill="#E1F5FE" opacity="0.8"/>
      <!-- Arms - icicle-like -->
      <path d="M 6 16 L 2 18 L 3 19 L 6 18 Z" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.2"/>
      <path d="M 18 16 L 22 18 L 21 19 L 18 18 Z" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.2"/>
      <circle cx="2.5" cy="18.5" r="1.5" fill="#81D4FA"/>
      <circle cx="21.5" cy="18.5" r="1.5" fill="#81D4FA"/>
      <!-- Head - angular ice block -->
      <path d="M 8 10 L 12 6 L 16 10 L 16 13 L 8 13 Z" fill="url(#iceGrad)" stroke="#0288D1" stroke-width="1.5"/>
      <rect x="8.5" y="10" width="7" height="3" fill="#B3E5FC" opacity="0.6"/>
      <!-- Eyes - glowing ice cores -->
      <circle cx="10" cy="10" r="1.8" fill="#00E5FF" opacity="0.8"/>
      <circle cx="14" cy="10" r="1.8" fill="#00E5FF" opacity="0.8"/>
      <circle cx="10" cy="10" r="1.2" fill="#00FFFF"/>
      <circle cx="14" cy="10" r="1.2" fill="#00FFFF"/>
      <circle cx="10.3" cy="9.7" r="0.5" fill="#FFF"/>
      <circle cx="14.3" cy="9.7" r="0.5" fill="#FFF"/>
      <!-- Ice spikes on head -->
      <path d="M 10 6 L 9 3 L 10.5 6 Z" fill="#E1F5FE" stroke="#81D4FA" stroke-width="0.5"/>
      <path d="M 12 6 L 12 2 L 12.5 6 Z" fill="#E1F5FE" stroke="#81D4FA" stroke-width="0.5"/>
      <path d="M 14 6 L 15 3 L 13.5 6 Z" fill="#E1F5FE" stroke="#81D4FA" stroke-width="0.5"/>
      <!-- Frost patterns -->
      <path d="M 10 15 L 10 17 M 9 16 L 11 16" stroke="#E1F5FE" stroke-width="0.8" opacity="0.7"/>
      <path d="M 14 15 L 14 17 M 13 16 L 15 16" stroke="#E1F5FE" stroke-width="0.8" opacity="0.7"/>
    </g>
  `;
}

// Fire Elemental - living flames
export function createFireElementalSVG(): string {
  return `
    <defs>
      <radialGradient id="fireCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#FFEB3B;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#FF9800;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.7" />
      </radialGradient>
      <radialGradient id="flameGlow">
        <stop offset="0%" style="stop-color:#FFD54F;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#FF6F00;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="fire-elemental-sprite">
      <!-- Glow aura -->
      <ellipse cx="12" cy="18" rx="15" ry="16" fill="url(#flameGlow)" opacity="0.6"/>
      <!-- Flame body - no solid shadow, it's fire! -->
      <!-- Base flames -->
      <ellipse cx="12" cy="24" rx="8" ry="6" fill="#FF6F00" opacity="0.8"/>
      <!-- Main flame body -->
      <path d="M 6 24 Q 4 20 5 16 Q 6 12 8 10 Q 10 8 12 6 Q 14 8 16 10 Q 18 12 19 16 Q 20 20 18 24 Z" fill="url(#fireCore)" opacity="0.9"/>
      <path d="M 8 22 Q 7 18 8 14 Q 10 10 12 8 Q 14 10 16 14 Q 17 18 16 22 Z" fill="#FFEB3B" opacity="0.7"/>
      <!-- Inner core -->
      <ellipse cx="12" cy="16" rx="5" ry="7" fill="#FFF" opacity="0.6"/>
      <ellipse cx="12" cy="16" rx="3" ry="5" fill="#FFEB3B"/>
      <!-- Flame tongues -->
      <path d="M 8 10 Q 7 6 8 4 Q 9 2 9 6 Q 9 8 9 10 Z" fill="#FF9800" opacity="0.8"/>
      <path d="M 12 6 Q 11 2 12 0 Q 13 2 12 6 Z" fill="#FFEB3B" opacity="0.9"/>
      <path d="M 16 10 Q 17 6 16 4 Q 15 2 15 6 Q 15 8 15 10 Z" fill="#FF9800" opacity="0.8"/>
      <path d="M 10 8 Q 9 5 10 3 Q 10.5 5 10.5 8 Z" fill="#FFD54F" opacity="0.7"/>
      <path d="M 14 8 Q 15 5 14 3 Q 13.5 5 13.5 8 Z" fill="#FFD54F" opacity="0.7"/>
      <!-- Dancing flames on sides -->
      <path d="M 5 18 Q 3 16 4 14 Q 4.5 16 5 18 Z" fill="#FF5722" opacity="0.7"/>
      <path d="M 19 18 Q 21 16 20 14 Q 19.5 16 19 18 Z" fill="#FF5722" opacity="0.7"/>
      <path d="M 6 20 Q 4 19 5 17 Q 5.5 19 6 21 Z" fill="#FF6F00" opacity="0.6"/>
      <path d="M 18 20 Q 20 19 19 17 Q 18.5 19 18 21 Z" fill="#FF6F00" opacity="0.6"/>
      <!-- Eyes - burning embers -->
      <ellipse cx="10" cy="14" rx="1.5" ry="2" fill="#FFF" opacity="0.9"/>
      <ellipse cx="14" cy="14" rx="1.5" ry="2" fill="#FFF" opacity="0.9"/>
      <circle cx="10" cy="14" r="1" fill="#FF6F00"/>
      <circle cx="14" cy="14" r="1" fill="#FF6F00"/>
      <circle cx="10.3" cy="13.5" r="0.5" fill="#FFF"/>
      <circle cx="14.3" cy="13.5" r="0.5" fill="#FFF"/>
      <!-- Ember particles floating -->
      <circle cx="8" cy="12" r="0.5" fill="#FFD54F" opacity="0.8"/>
      <circle cx="16" cy="12" r="0.5" fill="#FFD54F" opacity="0.8"/>
      <circle cx="11" cy="10" r="0.4" fill="#FFEB3B" opacity="0.7"/>
      <circle cx="13" cy="9" r="0.4" fill="#FFEB3B" opacity="0.7"/>
      <circle cx="7" cy="16" r="0.6" fill="#FF9800" opacity="0.6"/>
      <circle cx="17" cy="16" r="0.6" fill="#FF9800" opacity="0.6"/>
    </g>
  `;
}

// Giant Crab - armored crustacean
export function createGiantCrabSVG(): string {
  return `
    <defs>
      <radialGradient id="shellGrad">
        <stop offset="0%" style="stop-color:#FF6F00;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#E65100;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="crab-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="28" rx="12" ry="3" fill="#000" opacity="0.3"/>
      <!-- Legs (8 legs total) -->
      <path d="M 6 18 Q 2 18 0 20 Q -1 22 1 23" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 7 19 Q 3 20 1 23 Q 0 25 2 26" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 8 21 Q 4 24 3 27" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 9 22 Q 6 26 5 28" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 18 18 Q 22 18 24 20 Q 25 22 23 23" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 17 19 Q 21 20 23 23 Q 24 25 22 26" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 16 21 Q 20 24 21 27" stroke="#D84315" stroke-width="2" fill="none"/>
      <path d="M 15 22 Q 18 26 19 28" stroke="#D84315" stroke-width="2" fill="none"/>
      <!-- Leg segments -->
      <circle cx="1" cy="22" r="1" fill="#BF360C"/>
      <circle cx="23" cy="22" r="1" fill="#BF360C"/>
      <circle cx="2" cy="25" r="1" fill="#BF360C"/>
      <circle cx="22" cy="25" r="1" fill="#BF360C"/>
      <!-- Shell/carapace -->
      <ellipse cx="12" cy="18" rx="9" ry="8" fill="url(#shellGrad)" stroke="#BF360C" stroke-width="2"/>
      <ellipse cx="12" cy="18" rx="7.5" ry="6.5" fill="#FF8A50" opacity="0.4"/>
      <!-- Shell pattern/ridges -->
      <path d="M 8 14 Q 12 13 16 14" stroke="#BF360C" stroke-width="1" fill="none"/>
      <path d="M 7 16 Q 12 15 17 16" stroke="#BF360C" stroke-width="1" fill="none"/>
      <path d="M 7 18 Q 12 17 17 18" stroke="#BF360C" stroke-width="1" fill="none"/>
      <path d="M 8 20 Q 12 19 16 20" stroke="#BF360C" stroke-width="1" fill="none"/>
      <path d="M 9 22 Q 12 21 15 22" stroke="#BF360C" stroke-width="1" fill="none"/>
      <!-- Shell spikes -->
      <path d="M 6 16 L 5 14 L 6.5 16 Z" fill="#D84315"/>
      <path d="M 18 16 L 19 14 L 17.5 16 Z" fill="#D84315"/>
      <path d="M 12 13 L 12 11 L 12.5 13 Z" fill="#D84315"/>
      <!-- Claws (pincers) -->
      <ellipse cx="4" cy="14" rx="3" ry="2.5" fill="#FF6F00" stroke="#D84315" stroke-width="1.2"/>
      <ellipse cx="20" cy="14" rx="3" ry="2.5" fill="#FF6F00" stroke="#D84315" stroke-width="1.2"/>
      <path d="M 2 13 L 0 11 L 2 14 Z" fill="#FF8A50" stroke="#D84315" stroke-width="1"/>
      <path d="M 1.5 14 L 0 15 L 2.5 14.5 Z" fill="#FF8A50" stroke="#D84315" stroke-width="1"/>
      <path d="M 22 13 L 24 11 L 22 14 Z" fill="#FF8A50" stroke="#D84315" stroke-width="1"/>
      <path d="M 22.5 14 L 24 15 L 21.5 14.5 Z" fill="#FF8A50" stroke="#D84315" stroke-width="1"/>
      <!-- Head/eyes on stalks -->
      <line x1="10" y1="13" x2="9" y2="10" stroke="#FF6F00" stroke-width="1.5"/>
      <line x1="14" y1="13" x2="15" y2="10" stroke="#FF6F00" stroke-width="1.5"/>
      <circle cx="9" cy="10" r="1.5" fill="#424242" stroke="#212121" stroke-width="0.5"/>
      <circle cx="15" cy="10" r="1.5" fill="#424242" stroke="#212121" stroke-width="0.5"/>
      <circle cx="9.3" cy="9.7" r="0.5" fill="#FFF"/>
      <circle cx="15.3" cy="9.7" r="0.5" fill="#FFF"/>
      <!-- Mouth -->
      <path d="M 11 16 L 12 17 L 13 16" stroke="#BF360C" stroke-width="1" fill="none"/>
    </g>
  `;
}

// Demon Lord - ultimate boss
export function createDemonLordSVG(): string {
  return `
    <defs>
      <radialGradient id="demonSkin">
        <stop offset="0%" style="stop-color:#4A148C;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1A237E;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="hellfire">
        <stop offset="0%" style="stop-color:#FF6F00;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#D84315;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#BF360C;stop-opacity:0.5" />
      </radialGradient>
      <linearGradient id="demonWing">
        <stop offset="0%" style="stop-color:#1A237E;stop-opacity:0.95" />
        <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="demon-lord-sprite">
      <!-- Shadow and hellfire aura -->
      <ellipse cx="12" cy="32" rx="16" ry="4" fill="#000" opacity="0.5"/>
      <ellipse cx="12" cy="18" rx="18" ry="20" fill="url(#hellfire)" opacity="0.3"/>
      <!-- Demon wings - large and tattered -->
      <path d="M 4 14 Q -4 10 -2 18 Q 0 24 4 22 L 6 16 Z" fill="url(#demonWing)" stroke="#000" stroke-width="1.5"/>
      <path d="M 20 14 Q 28 10 26 18 Q 24 24 20 22 L 18 16 Z" fill="url(#demonWing)" stroke="#000" stroke-width="1.5"/>
      <!-- Wing claws/bones -->
      <path d="M 0 14 L -2 12 L 1 15" stroke="#4A148C" stroke-width="1.2"/>
      <path d="M 2 18 L 0 20 L 3 19" stroke="#4A148C" stroke-width="1.2"/>
      <path d="M 24 14 L 26 12 L 23 15" stroke="#4A148C" stroke-width="1.2"/>
      <path d="M 22 18 L 24 20 L 21 19" stroke="#4A148C" stroke-width="1.2"/>
      <!-- Tail -->
      <path d="M 14 26 Q 18 28 20 32 L 21 32 L 19 31 L 20 30" stroke="#4A148C" stroke-width="2.5" fill="none"/>
      <path d="M 20 30 L 22 28 L 20 32 Z" fill="#7B1FA2" stroke="#4A148C" stroke-width="1"/>
      <!-- Powerful legs -->
      <ellipse cx="9" cy="26" rx="3" ry="7" fill="#311B92" stroke="#1A237E" stroke-width="1.5"/>
      <ellipse cx="15" cy="26" rx="3" ry="7" fill="#311B92" stroke="#1A237E" stroke-width="1.5"/>
      <ellipse cx="9" cy="32" rx="3" ry="2" fill="#1A237E"/>
      <ellipse cx="15" cy="32" rx="3" ry="2" fill="#1A237E"/>
      <path d="M 8 32 L 7 33 L 8 33 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 10 32 L 11 33 L 10 33 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 14 32 L 13 33 L 14 33 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 16 32 L 17 33 L 16 33 Z" fill="#FFF" opacity="0.8"/>
      <!-- Muscular body -->
      <ellipse cx="12" cy="19" rx="10" ry="12" fill="url(#demonSkin)" stroke="#000" stroke-width="2"/>
      <ellipse cx="12" cy="20" rx="8" ry="9" fill="#512DA8" opacity="0.4"/>
      <!-- Chest muscles -->
      <ellipse cx="10" cy="16" rx="3.5" ry="4" fill="#1A237E" opacity="0.5"/>
      <ellipse cx="14" cy="16" rx="3.5" ry="4" fill="#1A237E" opacity="0.5"/>
      <!-- Arms - powerful -->
      <ellipse cx="4" cy="18" rx="3.5" ry="8" fill="#311B92" stroke="#1A237E" stroke-width="1.5"/>
      <ellipse cx="20" cy="18" rx="3.5" ry="8" fill="#311B92" stroke="#1A237E" stroke-width="1.5"/>
      <!-- Clawed hands -->
      <ellipse cx="3" cy="25" rx="3" ry="2.5" fill="#4A148C"/>
      <ellipse cx="21" cy="25" rx="3" ry="2.5" fill="#4A148C"/>
      <path d="M 2 26 L 1 28 L 2 27 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 3.5 26 L 3 28 L 3.5 27 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 22 26 L 23 28 L 22 27 Z" fill="#FFF" opacity="0.8"/>
      <path d="M 20.5 26 L 21 28 L 20.5 27 Z" fill="#FFF" opacity="0.8"/>
      <!-- Head - demonic -->
      <ellipse cx="12" cy="9" rx="8" ry="7" fill="#4A148C" stroke="#000" stroke-width="2"/>
      <ellipse cx="12" cy="10" rx="6.5" ry="5" fill="#6A1B9A" opacity="0.5"/>
      <!-- Large curved horns -->
      <path d="M 6 8 Q 3 6 2 2 Q 3 0 5 3 Q 6 6 6.5 8 Z" fill="#212121" stroke="#000" stroke-width="1.2"/>
      <path d="M 18 8 Q 21 6 22 2 Q 21 0 19 3 Q 18 6 17.5 8 Z" fill="#212121" stroke="#000" stroke-width="1.2"/>
      <path d="M 4 4 Q 3.5 2 4 3" stroke="#4A148C" stroke-width="0.8"/>
      <path d="M 20 4 Q 20.5 2 20 3" stroke="#4A148C" stroke-width="0.8"/>
      <!-- Eyes - burning with power -->
      <ellipse cx="9" cy="9" rx="2.5" ry="3" fill="#FF5722" opacity="0.8"/>
      <ellipse cx="15" cy="9" rx="2.5" ry="3" fill="#FF5722" opacity="0.8"/>
      <circle cx="9" cy="9" r="2" fill="#FF6F00"/>
      <circle cx="15" cy="9" r="2" fill="#FF6F00"/>
      <ellipse cx="9" cy="9" rx="1" ry="1.8" fill="#000"/>
      <ellipse cx="15" cy="9" rx="1" ry="1.8" fill="#000"/>
      <circle cx="9.3" cy="8.2" r="0.6" fill="#FFD54F"/>
      <circle cx="15.3" cy="8.2" r="0.6" fill="#FFD54F"/>
      <!-- Fanged mouth -->
      <path d="M 8 12 Q 12 14 16 12" stroke="#000" stroke-width="1.5" fill="none"/>
      <path d="M 8 12 Q 12 13.5 16 12" fill="#1A237E"/>
      <path d="M 9 12 L 8 14 L 9.5 13 Z" fill="#FFF"/>
      <path d="M 11 13 L 10.5 15 L 11.5 14 Z" fill="#FFF"/>
      <path d="M 13 13 L 12.5 14 L 13.5 15 Z" fill="#FFF"/>
      <path d="M 15 12 L 16 14 L 14.5 13 Z" fill="#FFF"/>
      <!-- Third eye on forehead -->
      <ellipse cx="12" cy="6.5" rx="1.5" ry="2" fill="#FF6F00" opacity="0.9"/>
      <ellipse cx="12" cy="6.5" rx="0.8" ry="1.3" fill="#000"/>
      <circle cx="12.2" cy="6" r="0.4" fill="#FFD54F"/>
      <!-- Mystical runes on body -->
      <path d="M 10 22 L 10 24 M 9 23 L 11 23" stroke="#D84315" stroke-width="0.8" opacity="0.7"/>
      <circle cx="14" cy="23" r="1.2" fill="none" stroke="#D84315" stroke-width="0.8" opacity="0.7"/>
    </g>
  `;
}

// Weapon SVGs (small icons) - Enhanced
export function createMeleeSVG(): string {
  return `
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#E0E0E0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9E9E9E;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="melee-icon">
      <path d="M 1.5 1.5 L 4.5 4.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0.5 4.5 L 4.5 0.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="3" cy="3" r="0.8" fill="#FFD700" opacity="0.8"/>
      <line x1="1.5" y1="1.5" x2="4.5" y2="4.5" stroke="#FFF" stroke-width="0.5" opacity="0.6"/>
    </g>
  `;
}

export function createPistolSVG(): string {
  return `
    <defs>
      <linearGradient id="gunMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#546E7A;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="pistol-icon">
      <!-- Barrel -->
      <rect x="1" y="2" width="4.5" height="1.5" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <rect x="4.5" y="2.3" width="0.8" height="0.9" fill="#37474F"/>
      <!-- Muzzle flash hint -->
      <circle cx="5.5" cy="2.75" r="0.6" fill="#FFD700" opacity="0.7"/>
      <circle cx="5.5" cy="2.75" r="0.3" fill="#FFF" opacity="0.5"/>
      <!-- Handle -->
      <rect x="2" y="3.5" width="1.5" height="2.2" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.4"/>
      <!-- Details -->
      <rect x="2.3" y="4" width="0.9" height="0.4" fill="#5D4037" rx="0.2"/>
      <line x1="1.5" y1="2.5" x2="4.5" y2="2.5" stroke="#78909C" stroke-width="0.2"/>
    </g>
  `;
}

export function createRifleSVG(): string {
  return `
    <defs>
      <linearGradient id="rifleMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#607D8B;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#455A64;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="rifle-icon">
      <!-- Long barrel -->
      <rect x="0" y="2.2" width="6.5" height="1.2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.2"/>
      <rect x="5.5" y="1.8" width="1.2" height="2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <!-- Muzzle flash -->
      <circle cx="7" cy="2.8" r="0.7" fill="#FFD700" opacity="0.8"/>
      <circle cx="7" cy="2.8" r="0.4" fill="#FFF" opacity="0.6"/>
      <!-- Barrel vents -->
      <line x1="1" y1="2.5" x2="1" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <line x1="2" y1="2.5" x2="2" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <line x1="3" y1="2.5" x2="3" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <!-- Stock -->
      <rect x="0" y="2.5" width="1.2" height="1" fill="#5D4037" rx="0.2"/>
      <line x1="1" y1="2.8" x2="6" y2="2.8" stroke="#78909C" stroke-width="0.2"/>
    </g>
  `;
}

export function createStaffSVG(): string {
  return `
    <defs>
      <radialGradient id="magicGem">
        <stop offset="0%" style="stop-color:#CE93D8;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#9C27B0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="magicGlow">
        <stop offset="0%" style="stop-color:#E1BEE7;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="staff-icon">
      <!-- Glow aura -->
      <circle cx="2" cy="1" r="2" fill="url(#magicGlow)"/>
      <!-- Staff shaft -->
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="#8D6E63" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="#A1887F" stroke-width="0.6"/>
      <!-- Decorative rings -->
      <circle cx="2" cy="3.5" r="0.6" fill="none" stroke="#FFD700" stroke-width="0.3"/>
      <circle cx="2" cy="5" r="0.5" fill="none" stroke="#FFD700" stroke-width="0.3"/>
      <!-- Magic gem -->
      <circle cx="2" cy="1" r="1.2" fill="url(#magicGem)" stroke="#6A1B9A" stroke-width="0.3"/>
      <circle cx="2" cy="1" r="0.7" fill="#BA68C8" opacity="0.7"/>
      <circle cx="1.6" cy="0.7" r="0.3" fill="#FFF" opacity="0.8"/>
      <!-- Energy wisps -->
      <path d="M 1.2 1 Q 0.8 0.5 1 0.3" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.7"/>
      <path d="M 2.8 1 Q 3.2 0.5 3 0.3" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.7"/>
    </g>
  `;
}

// Projectile SVGs - Enhanced with better visual effects
export function createBulletSVG(color: string = '#FFD700'): string {
  return `
    <defs>
      <radialGradient id="bulletGrad">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="40%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="bullet">
      <circle r="4" fill="${color}" opacity="0.3"/>
      <circle r="3" fill="url(#bulletGrad)"/>
      <ellipse rx="1.5" ry="2" fill="#FFF" opacity="0.6"/>
    </g>
  `;
}

export function createMagicBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="magicCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="40%" style="stop-color:#E1BEE7;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.8" />
      </radialGradient>
    </defs>
    <g class="magic-bolt">
      <!-- Outer glow -->
      <circle r="5" fill="#9C27B0" opacity="0.3"/>
      <circle r="4.5" fill="#BA68C8" opacity="0.5"/>
      <!-- Main bolt -->
      <circle r="3.5" fill="url(#magicCore)"/>
      <circle r="2" fill="#E1BEE7"/>
      <circle r="1.2" fill="#FFF"/>
      <!-- Sparkles -->
      <circle cx="2.5" cy="-1.5" r="0.5" fill="#FFF" opacity="0.8"/>
      <circle cx="-2" cy="2" r="0.4" fill="#E1BEE7" opacity="0.8"/>
      <circle cx="1" cy="2.5" r="0.3" fill="#FFF" opacity="0.9"/>
    </g>
  `;
}

export function createFireBallSVG(): string {
  return `
    <defs>
      <radialGradient id="fireballCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#FFEB3B;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#FF9800;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="fireball">
      <!-- Outer flames -->
      <circle r="6" fill="#FF5722" opacity="0.3"/>
      <circle r="5.5" fill="#FF9800" opacity="0.4"/>
      <!-- Fire trails -->
      <ellipse cx="-3" cy="0" rx="2" ry="3" fill="#FF6F00" opacity="0.5"/>
      <ellipse cx="3" cy="1" rx="1.5" ry="2.5" fill="#FF6F00" opacity="0.5"/>
      <!-- Core -->
      <circle r="4" fill="url(#fireballCore)"/>
      <circle r="2.5" fill="#FFEB3B" opacity="0.9"/>
      <circle r="1.5" fill="#FFF" opacity="0.8"/>
      <!-- Ember particles -->
      <circle cx="3.5" cy="-2" r="0.5" fill="#FFD54F" opacity="0.8"/>
      <circle cx="-3" cy="2.5" r="0.6" fill="#FF9800" opacity="0.7"/>
      <circle cx="2" cy="3" r="0.4" fill="#FFEB3B" opacity="0.8"/>
      <circle cx="-2" cy="-2.5" r="0.5" fill="#FF5722" opacity="0.6"/>
    </g>
  `;
}

export function createPlasmaBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="plasmaCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#80DEEA;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#00BCD4;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="plasma-bolt">
      <!-- Electric aura -->
      <circle r="6" fill="#00E5FF" opacity="0.2"/>
      <circle r="5.5" fill="#00BCD4" opacity="0.3"/>
      <!-- Lightning arcs -->
      <path d="M -4 0 Q -3 -2 -1 -1 Q 0 0 1 -2" stroke="#80DEEA" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M 4 1 Q 2 2 1 0 Q 0 -1 -1 1" stroke="#80DEEA" stroke-width="0.8" fill="none" opacity="0.7"/>
      <!-- Core -->
      <circle r="4" fill="url(#plasmaCore)"/>
      <circle r="2.5" fill="#80DEEA"/>
      <circle r="1.5" fill="#FFF" opacity="0.9"/>
      <!-- Electric particles -->
      <circle cx="3" cy="-2.5" r="0.5" fill="#00E5FF" opacity="0.9"/>
      <circle cx="-3.5" cy="1.5" r="0.6" fill="#80DEEA" opacity="0.8"/>
      <circle cx="2.5" cy="3" r="0.4" fill="#FFF" opacity="0.9"/>
      <circle cx="-2" cy="-3" r="0.5" fill="#00BCD4" opacity="0.7"/>
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
