/**
 * SVG Art Generator - Boss Enemy Characters
 * Includes: Ice Golem, Fire Elemental, Giant Crab, Demon Lord
 */

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
