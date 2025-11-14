/**
 * SVG Art Generator - Patron/Client NPCs
 * Theme-based dining patron characters
 */

// Base patron (default/fallback)
export function createPatronSVG(): string {
  return createDefaultPatronSVG();
}

/**
 * Create a patron SVG based on the current theme
 */
export function createThemedPatronSVG(theme: string): string {
  switch (theme) {
    case 'forest':
      return createForestPatronSVG();
    case 'cave':
      return createCavePatronSVG();
    case 'ruins':
      return createRuinsPatronSVG();
    case 'dungeon':
      return createDungeonPatronSVG();
    case 'ice':
      return createIcePatronSVG();
    case 'lava':
      return createLavaPatronSVG();
    case 'void':
      return createVoidPatronSVG();
    default:
      return createDefaultPatronSVG();
  }
}

/**
 * Default Patron - Generic friendly diner
 */
function createDefaultPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="patronSkin">
        <stop offset="0%" style="stop-color:#ffdbac;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f4c696;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="patronClothes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#388E3C;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Body/Torso -->
      <ellipse cx="12" cy="17" rx="6" ry="8" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="16" rx="4.5" ry="6" fill="#66BB6A" opacity="0.3"/>

      <!-- Arms -->
      <ellipse cx="7" cy="16" rx="1.8" ry="5.5" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.7"/>
      <ellipse cx="17" cy="16" rx="1.8" ry="5.5" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.7"/>

      <!-- Hands -->
      <circle cx="7" cy="20" r="1.8" fill="#ffdbac"/>
      <circle cx="17" cy="20" r="1.8" fill="#ffdbac"/>
      <circle cx="7.2" cy="19.8" r="1.5" fill="url(#patronSkin)"/>
      <circle cx="16.8" cy="19.8" r="1.5" fill="url(#patronSkin)"/>

      <!-- Fork & Knife -->
      <line x1="6" y1="20" x2="5" y2="23" stroke="#C0C0C0" stroke-width="0.6"/>
      <line x1="4.5" y1="23" x2="4.5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>
      <line x1="5" y1="23" x2="5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>
      <line x1="5.5" y1="23" x2="5.5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>
      <line x1="18" y1="20" x2="19" y2="23" stroke="#C0C0C0" stroke-width="0.6"/>
      <path d="M 18.5 23 L 19.5 24 L 19 23.5 Z" fill="#D0D0D0"/>

      <!-- Head -->
      <circle cx="12" cy="7" r="4.5" fill="url(#patronSkin)" stroke="#e0a374" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="6.5" rx="3.5" ry="3.8" fill="#ffdbac" opacity="0.5"/>

      <!-- Hair -->
      <ellipse cx="12" cy="4" rx="4.8" ry="2.8" fill="#8B4513"/>
      <ellipse cx="11.8" cy="4" rx="4.2" ry="2.2" fill="#A0522D" opacity="0.6"/>

      <!-- Eyes -->
      <circle cx="10" cy="7" r="1.2" fill="#000"/>
      <circle cx="14" cy="7" r="1.2" fill="#000"/>
      <circle cx="10.3" cy="6.7" r="0.5" fill="#FFF"/>
      <circle cx="14.3" cy="6.7" r="0.5" fill="#FFF"/>

      <!-- Nose -->
      <ellipse cx="12" cy="8" rx="0.6" ry="1" fill="#e0a374" opacity="0.6"/>

      <!-- Smile -->
      <path d="M 10 9 Q 12 10 14 9" stroke="#8B4513" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    </g>
  `;
}

/**
 * Forest Patron - Goblin-like forest dweller with earthy tones
 */
function createForestPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="goblinSkin">
        <stop offset="0%" style="stop-color:#7cb342;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#558b2f;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="forestClothes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#6d4c41;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4e342e;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="forest-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Legs with brown pants -->
      <rect x="9" y="20" width="2" height="7" fill="#5d4037" rx="1"/>
      <rect x="13" y="20" width="2" height="7" fill="#5d4037" rx="1"/>

      <!-- Body/Torso with ragged vest -->
      <ellipse cx="12" cy="15" rx="5.5" ry="7" fill="url(#forestClothes)" stroke="#3e2723" stroke-width="0.8"/>
      <path d="M 8 12 L 7 18 L 9 17 Z" fill="#8d6e63" opacity="0.7"/>
      <path d="M 16 12 L 17 18 L 15 17 Z" fill="#8d6e63" opacity="0.7"/>

      <!-- Arms (green goblin skin) -->
      <ellipse cx="7.5" cy="15" rx="1.8" ry="5" fill="url(#goblinSkin)" stroke="#558b2f" stroke-width="0.7"/>
      <ellipse cx="16.5" cy="15" rx="1.8" ry="5" fill="url(#goblinSkin)" stroke="#558b2f" stroke-width="0.7"/>

      <!-- Hands with claws -->
      <circle cx="7.5" cy="19" r="1.8" fill="#689f38"/>
      <circle cx="16.5" cy="19" r="1.8" fill="#689f38"/>
      <line x1="6.5" y1="20" x2="6" y2="21" stroke="#558b2f" stroke-width="0.5"/>
      <line x1="8.5" y1="20" x2="9" y2="21" stroke="#558b2f" stroke-width="0.5"/>
      <line x1="15.5" y1="20" x2="15" y2="21" stroke="#558b2f" stroke-width="0.5"/>
      <line x1="17.5" y1="20" x2="18" y2="21" stroke="#558b2f" stroke-width="0.5"/>

      <!-- Utensils -->
      <line x1="6.5" y1="19" x2="5.5" y2="22" stroke="#8d6e63" stroke-width="0.7"/>
      <line x1="17.5" y1="19" x2="18.5" y2="22" stroke="#8d6e63" stroke-width="0.7"/>

      <!-- Head (goblin green) -->
      <circle cx="12" cy="8" r="4.5" fill="url(#goblinSkin)" stroke="#558b2f" stroke-width="0.7"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#7cb342" opacity="0.4"/>

      <!-- Large pointed ears -->
      <ellipse cx="6.5" cy="7" rx="1.5" ry="2.5" fill="#689f38" stroke="#558b2f" stroke-width="0.5"/>
      <ellipse cx="17.5" cy="7" rx="1.5" ry="2.5" fill="#689f38" stroke="#558b2f" stroke-width="0.5"/>
      <ellipse cx="7" cy="7" rx="0.7" ry="1.2" fill="#7cb342"/>
      <ellipse cx="17" cy="7" rx="0.7" ry="1.2" fill="#7cb342"/>

      <!-- Eyes (yellow with small pupils) -->
      <circle cx="10" cy="8" r="1.4" fill="#fff59d"/>
      <circle cx="14" cy="8" r="1.4" fill="#fff59d"/>
      <circle cx="10" cy="8" r="0.7" fill="#1b5e20"/>
      <circle cx="14" cy="8" r="0.7" fill="#1b5e20"/>
      <circle cx="10.3" cy="7.7" r="0.3" fill="#FFF"/>
      <circle cx="14.3" cy="7.7" r="0.3" fill="#FFF"/>

      <!-- Large nose -->
      <ellipse cx="12" cy="9" rx="1" ry="1.5" fill="#558b2f" opacity="0.7"/>

      <!-- Toothy grin -->
      <path d="M 9.5 10 Q 12 11 14.5 10" stroke="#3e2723" stroke-width="0.8" fill="none"/>
      <rect x="10" y="10" width="0.8" height="1" fill="#FFF" opacity="0.8"/>
      <rect x="11.2" y="10" width="0.8" height="1" fill="#FFF" opacity="0.8"/>
      <rect x="12.4" y="10" width="0.8" height="1" fill="#FFF" opacity="0.8"/>

      <!-- Leaf ornament -->
      <ellipse cx="9" cy="5" rx="1.5" ry="2.5" fill="#4caf50" opacity="0.8" transform="rotate(-25 9 5)"/>
      <line x1="9" y1="5" x2="9" y2="7" stroke="#2e7d32" stroke-width="0.3"/>
    </g>
  `;
}

/**
 * Cave Patron - Primitive cave dweller with gray/earth tones
 */
function createCavePatronSVG(): string {
  return `
    <defs>
      <radialGradient id="caveSkin">
        <stop offset="0%" style="stop-color:#a1887f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8d6e63;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="furClothes">
        <stop offset="0%" style="stop-color:#6d4c41;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4e342e;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="cave-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Legs -->
      <rect x="9" y="20" width="2.5" height="7" fill="#5d4037" rx="1.2"/>
      <rect x="12.5" y="20" width="2.5" height="7" fill="#5d4037" rx="1.2"/>

      <!-- Fur clothing (primitive) -->
      <ellipse cx="12" cy="15" rx="6" ry="7.5" fill="url(#furClothes)" stroke="#3e2723" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="14" rx="4.5" ry="5.5" fill="#795548" opacity="0.3"/>
      <!-- Fur texture -->
      <path d="M 8 12 Q 7.5 13 8 14" stroke="#5d4037" stroke-width="0.6" fill="none"/>
      <path d="M 10 11 Q 9.5 12 10 13" stroke="#5d4037" stroke-width="0.6" fill="none"/>
      <path d="M 14 11 Q 14.5 12 14 13" stroke="#5d4037" stroke-width="0.6" fill="none"/>
      <path d="M 16 12 Q 16.5 13 16 14" stroke="#5d4037" stroke-width="0.6" fill="none"/>

      <!-- Arms -->
      <ellipse cx="7" cy="15" rx="2" ry="5.5" fill="url(#caveSkin)" stroke="#6d4c41" stroke-width="0.7"/>
      <ellipse cx="17" cy="15" rx="2" ry="5.5" fill="url(#caveSkin)" stroke="#6d4c41" stroke-width="0.7"/>

      <!-- Hands -->
      <circle cx="7" cy="19.5" r="2" fill="#8d6e63"/>
      <circle cx="17" cy="19.5" r="2" fill="#8d6e63"/>
      <circle cx="7.2" cy="19.3" r="1.6" fill="url(#caveSkin)"/>
      <circle cx="16.8" cy="19.3" r="1.6" fill="url(#caveSkin)"/>

      <!-- Stone utensils -->
      <path d="M 6 20 L 5 23 L 4.5 23.5 L 5.5 23.5 Z" fill="#616161" stroke="#424242" stroke-width="0.5"/>
      <path d="M 18 20 L 19 23 L 19.5 23.5 L 18.5 23.5 Z" fill="#616161" stroke="#424242" stroke-width="0.5"/>

      <!-- Head -->
      <circle cx="12" cy="8" r="5" fill="url(#caveSkin)" stroke="#6d4c41" stroke-width="0.7"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.8" fill="#a1887f" opacity="0.4"/>

      <!-- Wild hair/beard -->
      <ellipse cx="12" cy="4" rx="5.5" ry="3" fill="#3e2723"/>
      <ellipse cx="11.8" cy="4" rx="4.8" ry="2.3" fill="#4e342e" opacity="0.6"/>
      <ellipse cx="12" cy="10" rx="5" ry="2.5" fill="#3e2723"/>
      <ellipse cx="12" cy="10" rx="4" ry="1.8" fill="#4e342e" opacity="0.6"/>

      <!-- Eyes (deep set) -->
      <ellipse cx="10" cy="7.5" rx="1.3" ry="1.5" fill="#3e2723"/>
      <ellipse cx="14" cy="7.5" rx="1.3" ry="1.5" fill="#3e2723"/>
      <circle cx="10" cy="7.5" r="0.6" fill="#8d6e63"/>
      <circle cx="14" cy="7.5" r="0.6" fill="#8d6e63"/>
      <circle cx="10.2" cy="7.3" r="0.3" fill="#FFF"/>
      <circle cx="14.2" cy="7.3" r="0.3" fill="#FFF"/>

      <!-- Large nose -->
      <ellipse cx="12" cy="9" rx="1" ry="1.8" fill="#795548" opacity="0.7"/>

      <!-- Stone necklace -->
      <ellipse cx="12" cy="12" rx="5" ry="1" fill="none" stroke="#757575" stroke-width="0.5"/>
      <circle cx="12" cy="13" r="0.8" fill="#616161" stroke="#424242" stroke-width="0.3"/>
    </g>
  `;
}

/**
 * Ruins Patron - Ancient scholar with weathered robes
 */
function createRuinsPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="scholarSkin">
        <stop offset="0%" style="stop-color:#d7ccc8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bcaaa4;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="ancientRobes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#8d6e63;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#5d4037;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="ruins-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Long flowing robes -->
      <ellipse cx="12" cy="19" rx="7" ry="9" fill="url(#ancientRobes)" stroke="#4e342e" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="18" rx="5.5" ry="7" fill="#a1887f" opacity="0.2"/>
      <!-- Robe trim -->
      <path d="M 5 19 L 5 27" stroke="#d4af37" stroke-width="1"/>
      <path d="M 19 19 L 19 27" stroke="#d4af37" stroke-width="1"/>
      <ellipse cx="12" cy="27" rx="7" ry="1" fill="#d4af37" opacity="0.6"/>

      <!-- Wide sleeves -->
      <path d="M 5 14 Q 3 16 4 20 L 7 19 Z" fill="url(#ancientRobes)" stroke="#4e342e" stroke-width="0.7"/>
      <path d="M 19 14 Q 21 16 20 20 L 17 19 Z" fill="url(#ancientRobes)" stroke="#4e342e" stroke-width="0.7"/>

      <!-- Hands (pale from age) -->
      <circle cx="5" cy="19" r="1.8" fill="#d7ccc8"/>
      <circle cx="19" cy="19" r="1.8" fill="#d7ccc8"/>
      <circle cx="5.2" cy="18.8" r="1.5" fill="url(#scholarSkin)"/>
      <circle cx="18.8" cy="18.8" r="1.5" fill="url(#scholarSkin)"/>

      <!-- Ancient utensils -->
      <line x1="4" y1="19" x2="3" y2="22" stroke="#d4af37" stroke-width="0.6"/>
      <circle cx="3" cy="22" r="0.5" fill="#ffd700"/>
      <line x1="20" y1="19" x2="21" y2="22" stroke="#d4af37" stroke-width="0.6"/>
      <circle cx="21" cy="22" r="0.5" fill="#ffd700"/>

      <!-- Head (aged) -->
      <circle cx="12" cy="8" r="4.8" fill="url(#scholarSkin)" stroke="#a1887f" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#d7ccc8" opacity="0.4"/>

      <!-- Balding head with side hair -->
      <ellipse cx="12" cy="4" rx="5" ry="2" fill="#bdbdbd"/>
      <path d="M 7 6 Q 6.5 7 7 9" fill="#bdbdbd" stroke="#9e9e9e" stroke-width="0.4"/>
      <path d="M 17 6 Q 17.5 7 17 9" fill="#bdbdbd" stroke="#9e9e9e" stroke-width="0.4"/>

      <!-- Long beard -->
      <ellipse cx="12" cy="11" rx="4" ry="3.5" fill="#e0e0e0"/>
      <ellipse cx="12" cy="12" rx="3.5" ry="3" fill="#f5f5f5" opacity="0.6"/>
      <path d="M 10 11 L 10 14" stroke="#bdbdbd" stroke-width="0.3"/>
      <path d="M 12" y1="11" x2="12" y2="14" stroke="#bdbdbd" stroke-width="0.3"/>
      <path d="M 14 11 L 14 14" stroke="#bdbdbd" stroke-width="0.3"/>

      <!-- Wise eyes -->
      <ellipse cx="10" cy="7.5" rx="1.3" ry="1.4" fill="#FFF"/>
      <ellipse cx="14" cy="7.5" rx="1.3" ry="1.4" fill="#FFF"/>
      <circle cx="10" cy="7.5" r="0.8" fill="#5d4037"/>
      <circle cx="14" cy="7.5" r="0.8" fill="#5d4037"/>
      <circle cx="10.3" cy="7.3" r="0.35" fill="#FFF"/>
      <circle cx="14.3" cy="7.3" r="0.35" fill="#FFF"/>

      <!-- Wrinkles -->
      <path d="M 8 8.5 Q 9 8.7 10 8.5" stroke="#a1887f" stroke-width="0.3" fill="none"/>
      <path d="M 14 8.5 Q 15 8.7 16 8.5" stroke="#a1887f" stroke-width="0.3" fill="none"/>

      <!-- Ancient medallion -->
      <circle cx="12" cy="14" r="1.5" fill="#d4af37" stroke="#ffd700" stroke-width="0.4"/>
      <circle cx="12" cy="14" r="0.8" fill="#8d6e63"/>
    </g>
  `;
}

/**
 * Dungeon Patron - Prisoner or guard with simple tunic
 */
function createDungeonPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="prisonerSkin">
        <stop offset="0%" style="stop-color:#ffe0b2;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffcc80;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="prisonerClothes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#616161;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#424242;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="dungeon-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Legs with striped pants -->
      <rect x="9" y="20" width="2.5" height="7" fill="#616161" rx="1"/>
      <rect x="12.5" y="20" width="2.5" height="7" fill="#616161" rx="1"/>
      <line x1="9" y1="22" x2="11.5" y2="22" stroke="#424242" stroke-width="1"/>
      <line x1="9" y1="24" x2="11.5" y2="24" stroke="#424242" stroke-width="1"/>
      <line x1="12.5" y1="22" x2="15" y2="22" stroke="#424242" stroke-width="1"/>
      <line x1="12.5" y1="24" x2="15" y2="24" stroke="#424242" stroke-width="1"/>

      <!-- Simple tunic -->
      <ellipse cx="12" cy="15" rx="5.5" ry="7" fill="url(#prisonerClothes)" stroke="#212121" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="14" rx="4" ry="5" fill="#757575" opacity="0.3"/>
      <!-- Torn patches -->
      <path d="M 7 16 L 6.5 17 L 7.5 17.5 Z" fill="#9e9e9e" opacity="0.5"/>
      <path d="M 16 18 L 16.5 19 L 15.5 19.5 Z" fill="#9e9e9e" opacity="0.5"/>

      <!-- Arms -->
      <ellipse cx="7.5" cy="15" rx="1.8" ry="5" fill="url(#prisonerSkin)" stroke="#ffcc80" stroke-width="0.6"/>
      <ellipse cx="16.5" cy="15" rx="1.8" ry="5" fill="url(#prisonerSkin)" stroke="#ffcc80" stroke-width="0.6"/>

      <!-- Hands -->
      <circle cx="7.5" cy="19" r="1.8" fill="#ffe0b2"/>
      <circle cx="16.5" cy="19" r="1.8" fill="#ffe0b2"/>
      <circle cx="7.7" cy="18.8" r="1.5" fill="url(#prisonerSkin)"/>
      <circle cx="16.3" cy="18.8" r="1.5" fill="url(#prisonerSkin)"/>

      <!-- Metal utensils (prison spoon/fork) -->
      <line x1="6.5" y1="19" x2="5.5" y2="22" stroke="#9e9e9e" stroke-width="0.7"/>
      <ellipse cx="5.5" cy="22.5" rx="0.8" ry="1.2" fill="#757575"/>
      <line x1="17.5" y1="19" x2="18.5" y2="22" stroke="#9e9e9e" stroke-width="0.7"/>
      <rect x="18" y="22" width="1" height="1" fill="#757575"/>

      <!-- Head -->
      <circle cx="12" cy="8" r="4.5" fill="url(#prisonerSkin)" stroke="#ffcc80" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#ffe0b2" opacity="0.4"/>

      <!-- Disheveled hair -->
      <ellipse cx="12" cy="4.5" rx="5" ry="2.5" fill="#5d4037"/>
      <ellipse cx="11.8" cy="4.5" rx="4.3" ry="1.8" fill="#6d4c41" opacity="0.6"/>
      <path d="M 8 5 Q 7.5 6 8 7" stroke="#4e342e" stroke-width="0.5" fill="none"/>
      <path d="M 16 5 Q 16.5 6 16 7" stroke="#4e342e" stroke-width="0.5" fill="none"/>

      <!-- Tired eyes -->
      <ellipse cx="10" cy="8" rx="1.4" ry="1.5" fill="#FFF"/>
      <ellipse cx="14" cy="8" rx="1.4" ry="1.5" fill="#FFF"/>
      <circle cx="10" cy="8.2" r="0.9" fill="#5d4037"/>
      <circle cx="14" cy="8.2" r="0.9" fill="#5d4037"/>
      <circle cx="10.3" cy="7.9" r="0.3" fill="#FFF"/>
      <circle cx="14.3" cy="7.9" r="0.3" fill="#FFF"/>
      <!-- Dark circles -->
      <ellipse cx="10" cy="9.5" rx="1.5" ry="0.7" fill="#424242" opacity="0.3"/>
      <ellipse cx="14" cy="9.5" rx="1.5" ry="0.7" fill="#424242" opacity="0.3"/>

      <!-- Nose -->
      <ellipse cx="12" cy="9" rx="0.7" ry="1.2" fill="#ffcc80" opacity="0.6"/>

      <!-- Neutral expression -->
      <path d="M 10 10.5 L 14 10.5" stroke="#8d6e63" stroke-width="0.7" stroke-linecap="round"/>

      <!-- Chain/shackle detail -->
      <circle cx="7.5" cy="18" r="1" fill="none" stroke="#616161" stroke-width="0.5"/>
      <circle cx="16.5" cy="18" r="1" fill="none" stroke="#616161" stroke-width="0.5"/>
    </g>
  `;
}

/**
 * Ice Patron - Ice tribe member with blue/white furs
 */
function createIcePatronSVG(): string {
  return `
    <defs>
      <radialGradient id="iceSkin">
        <stop offset="0%" style="stop-color:#e3f2fd;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bbdefb;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="iceFurs" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#90caf9;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#42a5f5;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="whiteFur">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e3f2fd;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="ice-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Legs with fur boots -->
      <rect x="9" y="20" width="2.5" height="7" fill="#64b5f6" rx="1.2"/>
      <rect x="12.5" y="20" width="2.5" height="7" fill="#64b5f6" rx="1.2"/>
      <!-- Fur boot trim -->
      <ellipse cx="10.25" cy="27" rx="2" ry="1.5" fill="url(#whiteFur)" stroke="#e3f2fd" stroke-width="0.5"/>
      <ellipse cx="13.75" cy="27" rx="2" ry="1.5" fill="url(#whiteFur)" stroke="#e3f2fd" stroke-width="0.5"/>

      <!-- Thick fur coat -->
      <ellipse cx="12" cy="16" rx="6.5" ry="7.5" fill="url(#iceFurs)" stroke="#1976d2" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="15" rx="5" ry="5.5" fill="#90caf9" opacity="0.4"/>
      <!-- Fur texture -->
      <ellipse cx="9" cy="14" rx="1.5" ry="2" fill="#FFF" opacity="0.5"/>
      <ellipse cx="15" cy="14" rx="1.5" ry="2" fill="#FFF" opacity="0.5"/>
      <ellipse cx="12" cy="18" rx="2" ry="2.5" fill="#FFF" opacity="0.5"/>

      <!-- Fur collar -->
      <ellipse cx="12" cy="11" rx="6" ry="2.5" fill="url(#whiteFur)" stroke="#e3f2fd" stroke-width="0.6"/>
      <ellipse cx="12" cy="10.5" rx="5" ry="1.8" fill="#FFF" opacity="0.6"/>

      <!-- Arms with fur sleeves -->
      <ellipse cx="7" cy="15" rx="2" ry="5.5" fill="url(#iceFurs)" stroke="#1976d2" stroke-width="0.7"/>
      <ellipse cx="17" cy="15" rx="2" ry="5.5" fill="url(#iceFurs)" stroke="#1976d2" stroke-width="0.7"/>
      <!-- Fur cuffs -->
      <ellipse cx="7" cy="19" rx="2.2" ry="1.5" fill="url(#whiteFur)"/>
      <ellipse cx="17" cy="19" rx="2.2" ry="1.5" fill="url(#whiteFur)"/>

      <!-- Hands (pale from cold) -->
      <circle cx="7" cy="20" r="1.8" fill="#e3f2fd"/>
      <circle cx="17" cy="20" r="1.8" fill="#e3f2fd"/>
      <circle cx="7.2" cy="19.8" r="1.5" fill="url(#iceSkin)"/>
      <circle cx="16.8" cy="19.8" r="1.5" fill="url(#iceSkin)"/>

      <!-- Ice crystal utensils -->
      <path d="M 6 20 L 5 23" stroke="#64b5f6" stroke-width="0.7"/>
      <path d="M 5 22 L 4.5 23 L 5.5 23 Z" fill="#bbdefb" stroke="#64b5f6" stroke-width="0.4"/>
      <path d="M 18 20 L 19 23" stroke="#64b5f6" stroke-width="0.7"/>
      <path d="M 19 22 L 18.5 23 L 19.5 23 Z" fill="#bbdefb" stroke="#64b5f6" stroke-width="0.4"/>

      <!-- Head with fur hood -->
      <circle cx="12" cy="8" r="4.8" fill="url(#iceSkin)" stroke="#90caf9" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#e3f2fd" opacity="0.4"/>

      <!-- Fur-trimmed hood -->
      <path d="M 7 8 Q 7 3 12 2 Q 17 3 17 8" fill="url(#iceFurs)" stroke="#1976d2" stroke-width="0.6"/>
      <path d="M 7.5 7.5 Q 7.5 4 12 3 Q 16.5 4 16.5 7.5" fill="#64b5f6" opacity="0.4"/>
      <!-- Fur trim on hood -->
      <path d="M 7 8 Q 7 7 7.5 7" fill="#FFF" opacity="0.8"/>
      <path d="M 17 8 Q 17 7 16.5 7" fill="#FFF" opacity="0.8"/>

      <!-- White/silver hair (partially visible) -->
      <ellipse cx="12" cy="5" rx="3.5" ry="1.5" fill="#f5f5f5"/>

      <!-- Eyes (ice blue) -->
      <ellipse cx="10" cy="8" rx="1.4" ry="1.5" fill="#FFF"/>
      <ellipse cx="14" cy="8" rx="1.4" ry="1.5" fill="#FFF"/>
      <circle cx="10" cy="8" r="0.9" fill="#42a5f5"/>
      <circle cx="14" cy="8" r="0.9" fill="#42a5f5"/>
      <circle cx="10" cy="8" r="0.5" fill="#1976d2"/>
      <circle cx="14" cy="8" r="0.5" fill="#1976d2"/>
      <circle cx="10.3" cy="7.7" r="0.35" fill="#FFF"/>
      <circle cx="14.3" cy="7.7" r="0.35" fill="#FFF"/>

      <!-- Nose -->
      <ellipse cx="12" cy="9" rx="0.6" ry="1" fill="#bbdefb" opacity="0.6"/>

      <!-- Gentle smile -->
      <path d="M 10 10 Q 12 11 14 10" stroke="#64b5f6" stroke-width="0.7" fill="none" stroke-linecap="round"/>

      <!-- Ice crystal pendant -->
      <path d="M 12 13 L 11.5 14 L 12 14.5 L 12.5 14 Z" fill="#64b5f6" stroke="#42a5f5" stroke-width="0.3"/>
      <circle cx="12" cy="14" r="0.3" fill="#e3f2fd"/>
    </g>
  `;
}

/**
 * Lava Patron - Fire cult member with red/orange robes
 */
function createLavaPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="fireSkin">
        <stop offset="0%" style="stop-color:#ffccbc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff8a65;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="fireRobes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ff5722;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bf360c;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="emberGlow">
        <stop offset="0%" style="stop-color:#ffeb3b;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#ff5722;stop-opacity:0" />
      </radialGradient>
    </defs>
    <g class="lava-patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Flowing fire robes -->
      <ellipse cx="12" cy="19" rx="7.5" ry="9" fill="url(#fireRobes)" stroke="#bf360c" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="18" rx="6" ry="7" fill="#ff7043" opacity="0.3"/>
      <!-- Flame pattern on robes -->
      <path d="M 8 20 Q 7 22 8 24 Q 9 22 8 20" fill="#ff9800" opacity="0.6"/>
      <path d="M 12 21 Q 11 23 12 25 Q 13 23 12 21" fill="#ffb74d" opacity="0.6"/>
      <path d="M 16 20 Q 15 22 16 24 Q 17 22 16 20" fill="#ff9800" opacity="0.6"/>

      <!-- Glowing ember trim -->
      <ellipse cx="12" cy="27" rx="7.5" ry="1.5" fill="#ff9800" opacity="0.7"/>
      <ellipse cx="12" cy="27" rx="7" ry="1" fill="#ffeb3b" opacity="0.5"/>

      <!-- Sleeves with ember glow -->
      <path d="M 5 14 Q 3 16 4 20 L 7.5 19 Z" fill="url(#fireRobes)" stroke="#bf360c" stroke-width="0.7"/>
      <path d="M 19 14 Q 21 16 20 20 L 16.5 19 Z" fill="url(#fireRobes)" stroke="#bf360c" stroke-width="0.7"/>
      <ellipse cx="5" cy="17" rx="2" ry="3" fill="url(#emberGlow)"/>
      <ellipse cx="19" cy="17" rx="2" ry="3" fill="url(#emberGlow)"/>

      <!-- Hands (warm-toned) -->
      <circle cx="6" cy="19" r="1.8" fill="#ffccbc"/>
      <circle cx="18" cy="19" r="1.8" fill="#ffccbc"/>
      <circle cx="6.2" cy="18.8" r="1.5" fill="url(#fireSkin)"/>
      <circle cx="17.8" cy="18.8" r="1.5" fill="url(#fireSkin)"/>

      <!-- Obsidian utensils -->
      <line x1="5" y1="19" x2="4" y2="22" stroke="#212121" stroke-width="0.7"/>
      <path d="M 3.5 22 L 4.5 22 L 4 23 Z" fill="#424242" stroke="#212121" stroke-width="0.3"/>
      <line x1="19" y1="19" x2="20" y2="22" stroke="#212121" stroke-width="0.7"/>
      <path d="M 19.5 22 L 20.5 22 L 20 23 Z" fill="#424242" stroke="#212121" stroke-width="0.3"/>

      <!-- Head -->
      <circle cx="12" cy="8" r="4.8" fill="url(#fireSkin)" stroke="#ff8a65" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#ffccbc" opacity="0.4"/>

      <!-- Flame-like hair -->
      <path d="M 8 5 Q 7 3 9 2 Q 10 4 9 6" fill="#ff5722"/>
      <path d="M 12 3 Q 11 1 13 1 Q 13 3 12 5" fill="#ff9800"/>
      <path d="M 15 2 Q 14 4 15 6 Q 17 3 16 5" fill="#ff5722"/>
      <path d="M 9 4 Q 10 2 11 4" fill="#ffb74d" opacity="0.7"/>
      <path d="M 13 3 Q 14 1 15 3" fill="#ffeb3b" opacity="0.6"/>

      <!-- Eyes (orange glow) -->
      <ellipse cx="10" cy="8" rx="1.4" ry="1.5" fill="#ff9800"/>
      <ellipse cx="14" cy="8" rx="1.4" ry="1.5" fill="#ff9800"/>
      <circle cx="10" cy="8" r="0.8" fill="#ff5722"/>
      <circle cx="14" cy="8" r="0.8" fill="#ff5722"/>
      <circle cx="10" cy="8" r="0.4" fill="#bf360c"/>
      <circle cx="14" cy="8" r="0.4" fill="#bf360c"/>
      <circle cx="10.3" cy="7.7" r="0.3" fill="#ffeb3b"/>
      <circle cx="14.3" cy="7.7" r="0.3" fill="#ffeb3b"/>

      <!-- Nose -->
      <ellipse cx="12" cy="9" rx="0.7" ry="1.1" fill="#ff8a65" opacity="0.6"/>

      <!-- Confident smile -->
      <path d="M 9.5 10 Q 12 11.5 14.5 10" stroke="#bf360c" stroke-width="0.8" fill="none" stroke-linecap="round"/>

      <!-- Fire symbol pendant -->
      <circle cx="12" cy="14" r="1.8" fill="#ff5722" stroke="#ff9800" stroke-width="0.5"/>
      <circle cx="12" cy="14" r="1.3" fill="#ffeb3b" opacity="0.6"/>
      <path d="M 12 13 Q 11.5 14 12 15 Q 12.5 14 12 13" fill="#bf360c"/>

      <!-- Ember particles floating -->
      <circle cx="8" cy="12" r="0.4" fill="#ffeb3b" opacity="0.8"/>
      <circle cx="16" cy="13" r="0.3" fill="#ff9800" opacity="0.7"/>
      <circle cx="10" cy="16" r="0.3" fill="#ffeb3b" opacity="0.6"/>
    </g>
  `;
}

/**
 * Void Patron - Void cultist with dark purple/shadowy robes
 */
function createVoidPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="voidSkin">
        <stop offset="0%" style="stop-color:#9575cd;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#7e57c2;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="voidRobes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#4a148c;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a0033;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="voidGlow">
        <stop offset="0%" style="stop-color:#ce93d8;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#4a148c;stop-opacity:0" />
      </radialGradient>
    </defs>
    <g class="void-patron-sprite">
      <!-- Shadow (darker) -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.5"/>

      <!-- Dark flowing robes -->
      <ellipse cx="12" cy="19" rx="7.5" ry="9.5" fill="url(#voidRobes)" stroke="#1a0033" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="18" rx="6" ry="7.5" fill="#6a1b9a" opacity="0.2"/>
      <!-- Void tendrils -->
      <path d="M 7 22 Q 5 24 6 27" stroke="#7e57c2" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M 17 22 Q 19 24 18 27" stroke="#7e57c2" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M 10 23 Q 8.5 25 9 27" stroke="#9575cd" stroke-width="0.6" fill="none" opacity="0.5"/>
      <path d="M 14 23 Q 15.5 25 15 27" stroke="#9575cd" stroke-width="0.6" fill="none" opacity="0.5"/>

      <!-- Purple void glow at base -->
      <ellipse cx="12" cy="27" rx="8" ry="2" fill="url(#voidGlow)"/>

      <!-- Tattered sleeves -->
      <path d="M 5 13 Q 2 15 3 20 L 7 19 Z" fill="url(#voidRobes)" stroke="#1a0033" stroke-width="0.7"/>
      <path d="M 19 13 Q 22 15 21 20 L 17 19 Z" fill="url(#voidRobes)" stroke="#1a0033" stroke-width="0.7"/>
      <!-- Void energy around hands -->
      <ellipse cx="5" cy="18" rx="2.5" ry="3.5" fill="url(#voidGlow)"/>
      <ellipse cx="19" cy="18" rx="2.5" ry="3.5" fill="url(#voidGlow)"/>

      <!-- Hands (pale/purple-tinted) -->
      <circle cx="6" cy="19" r="1.8" fill="#9575cd"/>
      <circle cx="18" cy="19" r="1.8" fill="#9575cd"/>
      <circle cx="6.2" cy="18.8" r="1.5" fill="url(#voidSkin)"/>
      <circle cx="17.8" cy="18.8" r="1.5" fill="url(#voidSkin)"/>

      <!-- Void-touched utensils (ethereal) -->
      <line x1="5" y1="19" x2="4" y2="22" stroke="#9575cd" stroke-width="0.7" opacity="0.8"/>
      <line x1="3.5" y1="22" x2="4.5" y2="22" stroke="#ce93d8" stroke-width="0.4" opacity="0.6"/>
      <line x1="19" y1="19" x2="20" y2="22" stroke="#9575cd" stroke-width="0.7" opacity="0.8"/>
      <line x1="19.5" y1="22" x2="20.5" y2="22" stroke="#ce93d8" stroke-width="0.4" opacity="0.6"/>

      <!-- Head with hood -->
      <circle cx="12" cy="8" r="4.5" fill="url(#voidSkin)" stroke="#7e57c2" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="7.5" rx="3.5" ry="3.5" fill="#9575cd" opacity="0.3"/>

      <!-- Deep hood -->
      <path d="M 6.5 9 Q 6 4 12 2 Q 18 4 17.5 9" fill="url(#voidRobes)" stroke="#1a0033" stroke-width="0.7"/>
      <path d="M 7 8.5 Q 6.5 5 12 3 Q 17.5 5 17 8.5" fill="#4a148c" opacity="0.5"/>
      <!-- Hood shadow over face -->
      <ellipse cx="12" cy="6" rx="4" ry="2" fill="#1a0033" opacity="0.4"/>

      <!-- Shadowy hair (barely visible) -->
      <ellipse cx="12" cy="5" rx="4" ry="1.8" fill="#1a0033" opacity="0.6"/>

      <!-- Glowing eyes (purple/violet) -->
      <ellipse cx="10" cy="8" rx="1.5" ry="1.6" fill="#7e57c2" opacity="0.8"/>
      <ellipse cx="14" cy="8" rx="1.5" ry="1.6" fill="#7e57c2" opacity="0.8"/>
      <circle cx="10" cy="8" r="0.9" fill="#ce93d8"/>
      <circle cx="14" cy="8" r="0.9" fill="#ce93d8"/>
      <circle cx="10" cy="8" r="0.5" fill="#e1bee7"/>
      <circle cx="14" cy="8" r="0.5" fill="#e1bee7"/>
      <circle cx="10.3" cy="7.7" r="0.35" fill="#FFF"/>
      <circle cx="14.3" cy="7.7" r="0.35" fill="#FFF"/>
      <!-- Eye glow -->
      <ellipse cx="10" cy="8" rx="2" ry="2.2" fill="url(#voidGlow)" opacity="0.4"/>
      <ellipse cx="14" cy="8" rx="2" ry="2.2" fill="url(#voidGlow)" opacity="0.4"/>

      <!-- Nose (subtle) -->
      <ellipse cx="12" cy="9" rx="0.6" ry="0.9" fill="#7e57c2" opacity="0.5"/>

      <!-- Mysterious expression -->
      <path d="M 10 10.5 Q 12 10.8 14 10.5" stroke="#4a148c" stroke-width="0.7" fill="none" stroke-linecap="round"/>

      <!-- Void symbol pendant -->
      <circle cx="12" cy="14" r="2" fill="#1a0033" stroke="#7e57c2" stroke-width="0.5"/>
      <circle cx="12" cy="14" r="1.2" fill="#4a148c"/>
      <circle cx="12" cy="14" r="0.6" fill="#ce93d8" opacity="0.8"/>
      <!-- Orbiting void particles -->
      <circle cx="10.5" cy="13" r="0.3" fill="#9575cd" opacity="0.8"/>
      <circle cx="13.5" cy="15" r="0.3" fill="#ce93d8" opacity="0.7"/>
      <circle cx="11" cy="15.5" r="0.25" fill="#ba68c8" opacity="0.6"/>

      <!-- Void particles floating -->
      <circle cx="7" cy="11" r="0.4" fill="#ce93d8" opacity="0.7"/>
      <circle cx="17" cy="12" r="0.35" fill="#9575cd" opacity="0.6"/>
      <circle cx="9" cy="15" r="0.3" fill="#ba68c8" opacity="0.5"/>
      <circle cx="15" cy="16" r="0.35" fill="#ce93d8" opacity="0.6"/>
    </g>
  `;
}
