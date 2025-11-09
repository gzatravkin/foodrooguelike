/**
 * SVG Art Generator - Basic Enemy Characters
 * Includes: Slime, Goblin, Skeleton, Orc
 */

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
