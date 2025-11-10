/**
 * SVG Art Generator - Basic Enemy Characters
 * Includes: Slime, Goblin, Skeleton, Orc
 */

export function createSlimeSVG(): string {
  return `
    <defs>
      <radialGradient id="slimeGrad">
        <stop offset="0%" style="stop-color:#ADFF2F;stop-opacity:0.95" />
        <stop offset="70%" style="stop-color:#7FFF00;stop-opacity:0.85" />
        <stop offset="100%" style="stop-color:#32CD32;stop-opacity:0.75" />
      </radialGradient>
      <radialGradient id="slimeInner">
        <stop offset="0%" style="stop-color:#00FF7F;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#00FF00;stop-opacity:0.4" />
      </radialGradient>
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur"/>
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="gooey"/>
      </filter>
    </defs>
    <g class="slime-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="22" rx="11" ry="3.5" fill="#000" opacity="0.3"/>
      <!-- Main body with gradient and gooey effect -->
      <ellipse cx="12" cy="14" rx="10.5" ry="8.5" fill="url(#slimeGrad)" filter="url(#gooey)"/>
      <ellipse cx="12" cy="14" rx="8.5" ry="6.5" fill="url(#slimeInner)"/>
      <ellipse cx="12" cy="13" rx="7" ry="5" fill="#00FF7F" opacity="0.4"/>
      <!-- Slime drips with detail -->
      <ellipse cx="8" cy="20" rx="2.2" ry="2.8" fill="#7FFF00" opacity="0.75"/>
      <ellipse cx="8" cy="21" rx="1.8" ry="2.2" fill="#32CD32" opacity="0.6"/>
      <ellipse cx="16" cy="21" rx="1.7" ry="2.3" fill="#7FFF00" opacity="0.75"/>
      <ellipse cx="16" cy="22" rx="1.3" ry="1.8" fill="#32CD32" opacity="0.6"/>
      <ellipse cx="12" cy="20.5" rx="2" ry="2.5" fill="#7FFF00" opacity="0.75"/>
      <ellipse cx="12" cy="21.5" rx="1.6" ry="2" fill="#32CD32" opacity="0.6"/>
      <!-- Mini drips -->
      <circle cx="6" cy="18" r="0.8" fill="#7FFF00" opacity="0.6"/>
      <circle cx="18" cy="19" r="0.7" fill="#7FFF00" opacity="0.6"/>
      <!-- Eyes with depth and reflection -->
      <ellipse cx="9" cy="12" rx="2.5" ry="2.8" fill="#000" opacity="0.9"/>
      <ellipse cx="15" cy="12" rx="2.5" ry="2.8" fill="#000" opacity="0.9"/>
      <circle cx="9" cy="12" r="2.2" fill="#1a1a1a"/>
      <circle cx="15" cy="12" r="2.2" fill="#1a1a1a"/>
      <circle cx="9" cy="12" r="1.5" fill="#000"/>
      <circle cx="15" cy="12" r="1.5" fill="#000"/>
      <circle cx="9.6" cy="11.2" r="1.1" fill="#FFF"/>
      <circle cx="15.6" cy="11.2" r="1.1" fill="#FFF"/>
      <circle cx="9.3" cy="11.5" r="0.5" fill="#FFF" opacity="0.7"/>
      <circle cx="15.3" cy="11.5" r="0.5" fill="#FFF" opacity="0.7"/>
      <!-- Enhanced shine effects with more layers -->
      <ellipse cx="7" cy="9" rx="4" ry="2.8" fill="#FFF" opacity="0.7"/>
      <ellipse cx="7.5" cy="9.5" rx="3" ry="2" fill="#FFF" opacity="0.4"/>
      <ellipse cx="16" cy="11" rx="2.5" ry="1.5" fill="#FFF" opacity="0.5"/>
      <ellipse cx="16.5" cy="11.5" rx="1.5" ry="1" fill="#FFF" opacity="0.3"/>
      <circle cx="10" cy="16" r="1.2" fill="#FFF" opacity="0.35"/>
      <circle cx="14" cy="17" r="0.9" fill="#FFF" opacity="0.3"/>
      <!-- Gooey bubbles inside -->
      <circle cx="9" cy="15" r="1" fill="#ADFF2F" opacity="0.4"/>
      <circle cx="15" cy="14" r="0.8" fill="#ADFF2F" opacity="0.4"/>
      <circle cx="12" cy="16" r="0.6" fill="#ADFF2F" opacity="0.3"/>
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
      <linearGradient id="goblinShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8BC34A;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#558B2F;stop-opacity:0.4" />
      </linearGradient>
    </defs>
    <g class="goblin-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="8.5" ry="2.8" fill="#000" opacity="0.3"/>
      <!-- Body with shading -->
      <ellipse cx="12" cy="17" rx="7" ry="9" fill="#7CB342" stroke="#558B2F" stroke-width="1.2"/>
      <ellipse cx="11" cy="16" rx="5" ry="7" fill="url(#goblinShade)"/>
      <!-- Ragged vest with more detail -->
      <path d="M 8 13 L 7 17 L 8 23 L 16 23 L 17 17 L 16 13 Z" fill="#5D4037" opacity="0.75"/>
      <path d="M 8.5 13.5 L 7.5 17 L 8.5 22.5 L 15.5 22.5 L 16.5 17 L 15.5 13.5 Z" fill="#6D4C41" opacity="0.4"/>
      <!-- Torn edges -->
      <path d="M 8 13 L 9 14 L 8 16 Z" fill="#3E2723"/>
      <path d="M 16 13 L 15 14 L 16 16 Z" fill="#3E2723"/>
      <path d="M 7.5 20 L 8.5 21 L 8 22" fill="#3E2723" opacity="0.7"/>
      <path d="M 16.5 20 L 15.5 21 L 16 22" fill="#3E2723" opacity="0.7"/>
      <!-- Belt/rope -->
      <path d="M 7.5 17 Q 12 18 16.5 17" stroke="#4E342E" stroke-width="0.8" fill="none"/>
      <!-- Arms with muscle definition -->
      <ellipse cx="6" cy="17" rx="2.2" ry="6.5" fill="#8BC34A" stroke="#689F38" stroke-width="0.9"/>
      <ellipse cx="18" cy="17" rx="2.2" ry="6.5" fill="#8BC34A" stroke="#689F38" stroke-width="0.9"/>
      <ellipse cx="6.5" cy="16" rx="1.2" ry="4" fill="#9CCC65" opacity="0.5"/>
      <ellipse cx="17.5" cy="16" rx="1.2" ry="4" fill="#9CCC65" opacity="0.5"/>
      <!-- Clawed hands -->
      <circle cx="6" cy="22" r="2" fill="#9CCC65"/>
      <circle cx="18" cy="22" r="2" fill="#9CCC65"/>
      <circle cx="6.2" cy="21.8" r="1.6" fill="#8BC34A"/>
      <circle cx="17.8" cy="21.8" r="1.6" fill="#8BC34A"/>
      <!-- Claws -->
      <path d="M 5.5 23 L 5 24" stroke="#558B2F" stroke-width="0.5"/>
      <path d="M 6 23 L 6 24.5" stroke="#558B2F" stroke-width="0.5"/>
      <path d="M 6.5 23 L 7 24" stroke="#558B2F" stroke-width="0.5"/>
      <path d="M 17.5 23 L 17 24" stroke="#558B2F" stroke-width="0.5"/>
      <path d="M 18 23 L 18 24.5" stroke="#558B2F" stroke-width="0.5"/>
      <path d="M 18.5 23 L 19 24" stroke="#558B2F" stroke-width="0.5"/>
      <!-- Head with gradient -->
      <circle cx="12" cy="9" r="5.5" fill="url(#goblinSkin)" stroke="#689F38" stroke-width="1.2"/>
      <ellipse cx="11.5" cy="8.5" rx="4" ry="4.5" fill="#9CCC65" opacity="0.4"/>
      <!-- Ears with enhanced detail -->
      <ellipse cx="6.5" cy="8" rx="2.8" ry="4.3" fill="#8BC34A" stroke="#689F38" stroke-width="0.6"/>
      <ellipse cx="17.5" cy="8" rx="2.8" ry="4.3" fill="#8BC34A" stroke="#689F38" stroke-width="0.6"/>
      <ellipse cx="6.5" cy="8" rx="1.5" ry="2.5" fill="#7CB342"/>
      <ellipse cx="17.5" cy="8" rx="1.5" ry="2.5" fill="#7CB342"/>
      <ellipse cx="6.5" cy="7.5" rx="0.8" ry="1.5" fill="#9CCC65" opacity="0.6"/>
      <ellipse cx="17.5" cy="7.5" rx="0.8" ry="1.5" fill="#9CCC65" opacity="0.6"/>
      <!-- Eyes with enhanced glow -->
      <circle cx="10" cy="9" r="2.3" fill="#FFEB3B" opacity="0.7"/>
      <circle cx="14" cy="9" r="2.3" fill="#FFEB3B" opacity="0.7"/>
      <circle cx="10" cy="9" r="1.8" fill="#FFD700"/>
      <circle cx="14" cy="9" r="1.8" fill="#FFD700"/>
      <circle cx="10" cy="9" r="1" fill="#000"/>
      <circle cx="14" cy="9" r="1" fill="#000"/>
      <circle cx="10.4" cy="8.6" r="0.5" fill="#FFF"/>
      <circle cx="14.4" cy="8.6" r="0.5" fill="#FFF"/>
      <circle cx="10.2" cy="9.2" r="0.2" fill="#FFD700"/>
      <circle cx="14.2" cy="9.2" r="0.2" fill="#FFD700"/>
      <!-- Nose with detail -->
      <ellipse cx="12" cy="10.5" rx="1.2" ry="1.8" fill="#689F38"/>
      <ellipse cx="11.6" cy="11" rx="0.4" ry="0.6" fill="#558B2F"/>
      <ellipse cx="12.4" cy="11" rx="0.4" ry="0.6" fill="#558B2F"/>
      <!-- Mouth/grin with teeth -->
      <path d="M 9 11.5 Q 12 13.5 15 11.5" stroke="#3E2723" stroke-width="1.2" fill="none"/>
      <path d="M 9 11.8 Q 12 13.3 15 11.8" fill="#4E342E" opacity="0.5"/>
      <line x1="9" y1="12" x2="10" y2="12.8" stroke="#FFF" stroke-width="0.9"/>
      <line x1="11" y1="12.5" x2="11.5" y2="13.2" stroke="#FFF" stroke-width="0.8"/>
      <line x1="13" y1="12.5" x2="12.5" y2="13.2" stroke="#FFF" stroke-width="0.8"/>
      <line x1="14" y1="12" x2="15" y2="12.8" stroke="#FFF" stroke-width="0.9"/>
      <!-- Skin texture/warts -->
      <circle cx="8.5" cy="7" r="0.5" fill="#7CB342" opacity="0.6"/>
      <circle cx="15.5" cy="7.5" r="0.4" fill="#7CB342" opacity="0.6"/>
      <circle cx="10" cy="5" r="0.3" fill="#7CB342" opacity="0.5"/>
      <!-- Enhanced club weapon -->
      <rect x="18.5" y="12" width="2.8" height="10.5" fill="#6D4C41" rx="1.3"/>
      <rect x="18.7" y="12.2" width="2.4" height="10.1" fill="#5D4037" rx="1.1"/>
      <line x1="19" y1="13" x2="19" y2="22" stroke="#8D6E63" stroke-width="0.4" opacity="0.5"/>
      <ellipse cx="19.85" cy="11" rx="2.8" ry="3.2" fill="#5D4037" stroke="#3E2723" stroke-width="0.9"/>
      <ellipse cx="19.85" cy="11" rx="2.3" ry="2.6" fill="#6D4C41" opacity="0.6"/>
      <!-- Nails/spikes in club -->
      <circle cx="18.5" cy="10" r="0.6" fill="#424242"/>
      <circle cx="20.5" cy="11.5" r="0.6" fill="#424242"/>
      <circle cx="19.5" cy="9.5" r="0.5" fill="#424242"/>
      <circle cx="21" cy="10" r="0.5" fill="#424242"/>
      <circle cx="18.8" cy="12" r="0.4" fill="#424242"/>
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
        <stop offset="0%" style="stop-color:#E0E0E0;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#CFD8DC;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#90A4AE;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#78909C;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="eyeGlow">
        <stop offset="0%" style="stop-color:#FF5252;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#F44336;stop-opacity:0.5" />
      </radialGradient>
    </defs>
    <g class="skeleton-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7.5" ry="2.3" fill="#000" opacity="0.35"/>
      <!-- Pelvis with detail -->
      <ellipse cx="12" cy="24" rx="5.5" ry="3.5" fill="none" stroke="#E0E0E0" stroke-width="1.6"/>
      <ellipse cx="12" cy="24" rx="4.5" ry="2.5" fill="none" stroke="#BDBDBD" stroke-width="1.2"/>
      <line x1="10" y1="24" x2="14" y2="24" stroke="#E0E0E0" stroke-width="1.2"/>
      <circle cx="10.5" cy="24" r="0.6" fill="#9E9E9E"/>
      <circle cx="13.5" cy="24" r="0.6" fill="#9E9E9E"/>
      <!-- Ribcage with enhanced depth -->
      <ellipse cx="12" cy="17" rx="7" ry="9" fill="none" stroke="#BDBDBD" stroke-width="2.2"/>
      <ellipse cx="12" cy="17" rx="6" ry="7.5" fill="none" stroke="#E0E0E0" stroke-width="1.6"/>
      <ellipse cx="12" cy="17" rx="5" ry="6" fill="#F5F5F5" opacity="0.1"/>
      <!-- Ribs with more detail -->
      <line x1="8" y1="13" x2="16" y2="13" stroke="#E0E0E0" stroke-width="1.3"/>
      <line x1="7.5" y1="15" x2="16.5" y2="15" stroke="#E0E0E0" stroke-width="1.3"/>
      <line x1="7.5" y1="17" x2="16.5" y2="17" stroke="#E0E0E0" stroke-width="1.3"/>
      <line x1="7.5" y1="19" x2="16.5" y2="19" stroke="#E0E0E0" stroke-width="1.3"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="#E0E0E0" stroke-width="1.2"/>
      <line x1="9" y1="23" x2="15" y2="23" stroke="#E0E0E0" stroke-width="1"/>
      <!-- Rib curves -->
      <path d="M 8 13 Q 7 15 7.5 17" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <path d="M 16 13 Q 17 15 16.5 17" stroke="#BDBDBD" stroke-width="0.8" fill="none"/>
      <!-- Spine with vertebrae -->
      <line x1="12" y1="12" x2="12" y2="23" stroke="#E0E0E0" stroke-width="1.8"/>
      <line x1="12" y1="12" x2="12" y2="23" stroke="#F5F5F5" stroke-width="1" opacity="0.6"/>
      <circle cx="12" cy="13" r="0.9" fill="#BDBDBD"/>
      <circle cx="12" cy="15" r="0.9" fill="#BDBDBD"/>
      <circle cx="12" cy="17" r="0.9" fill="#BDBDBD"/>
      <circle cx="12" cy="19" r="0.9" fill="#BDBDBD"/>
      <circle cx="12" cy="21" r="0.9" fill="#BDBDBD"/>
      <circle cx="12" cy="23" r="0.8" fill="#BDBDBD"/>
      <!-- Skull with gradient and texture -->
      <ellipse cx="12" cy="8" rx="5.8" ry="6.3" fill="url(#skullGrad)" stroke="#757575" stroke-width="1.3"/>
      <ellipse cx="11.5" cy="7.5" rx="4.5" ry="5" fill="#F5F5F5" opacity="0.3"/>
      <!-- Cranium details and cracks -->
      <path d="M 8 6 Q 12 4 16 6" stroke="#9E9E9E" stroke-width="0.9" fill="none"/>
      <path d="M 9 5.5 Q 12 4.5 15 5.5" stroke="#BDBDBD" stroke-width="0.5" fill="none" opacity="0.6"/>
      <path d="M 10 7 Q 10.5 6 11 7" stroke="#9E9E9E" stroke-width="0.4" fill="none"/>
      <path d="M 13 6.5 Q 13.5 5.5 14 6.5" stroke="#9E9E9E" stroke-width="0.4" fill="none"/>
      <!-- Eye sockets with enhanced glow -->
      <ellipse cx="9.5" cy="7" rx="2.3" ry="2.5" fill="#424242"/>
      <ellipse cx="14.5" cy="7" rx="2.3" ry="2.5" fill="#424242"/>
      <circle cx="9.5" cy="7" r="1.8" fill="#000"/>
      <circle cx="14.5" cy="7" r="1.8" fill="#000"/>
      <!-- Red glowing eyes -->
      <circle cx="9.5" cy="7" r="1.2" fill="url(#eyeGlow)" opacity="0.9"/>
      <circle cx="14.5" cy="7" r="1.2" fill="url(#eyeGlow)" opacity="0.9"/>
      <circle cx="9.5" cy="7" r="0.8" fill="#F44336"/>
      <circle cx="14.5" cy="7" r="0.8" fill="#F44336"/>
      <circle cx="9.5" cy="7" r="0.4" fill="#FF5252"/>
      <circle cx="14.5" cy="7" r="0.4" fill="#FF5252"/>
      <circle cx="9.7" cy="6.7" r="0.2" fill="#FFF" opacity="0.8"/>
      <circle cx="14.7" cy="6.7" r="0.2" fill="#FFF" opacity="0.8"/>
      <!-- Nose cavity with depth -->
      <path d="M 11 9 L 11 10.8 L 13 10.8 L 13 9 Z" fill="#424242"/>
      <path d="M 11.2 9.2 L 11.2 10.6 L 12.8 10.6 L 12.8 9.2 Z" fill="#212121"/>
      <ellipse cx="11.5" cy="10.3" rx="0.3" ry="0.4" fill="#000"/>
      <ellipse cx="12.5" cy="10.3" rx="0.3" ry="0.4" fill="#000"/>
      <!-- Jaw with detailed teeth -->
      <path d="M 7.5 10.5 Q 12 12.5 16.5 10.5" stroke="#757575" stroke-width="1.3" fill="none"/>
      <path d="M 8 10.8 Q 12 12.3 16 10.8" stroke="#9E9E9E" stroke-width="0.8" fill="none"/>
      <!-- Teeth with gaps -->
      <line x1="8.5" y1="11" x2="8.5" y2="12.2" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="9.5" y1="11.2" x2="9.5" y2="12.5" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="10.5" y1="11.4" x2="10.5" y2="12.7" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="11.5" y1="11.5" x2="11.5" y2="12.8" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="12.5" y1="11.5" x2="12.5" y2="12.8" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="13.5" y1="11.4" x2="13.5" y2="12.7" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="14.5" y1="11.2" x2="14.5" y2="12.5" stroke="#F5F5F5" stroke-width="0.9"/>
      <line x1="15.5" y1="11" x2="15.5" y2="12.2" stroke="#F5F5F5" stroke-width="0.9"/>
      <!-- Enhanced sword with more detail -->
      <line x1="19" y1="11" x2="19" y2="24" stroke="#757575" stroke-width="3" opacity="0.3"/>
      <line x1="19" y1="11" x2="19" y2="24" stroke="url(#swordGrad)" stroke-width="2.6"/>
      <line x1="19" y1="12" x2="19" y2="23" stroke="#CFD8DC" stroke-width="1.2" opacity="0.7"/>
      <line x1="18.7" y1="12.5" x2="18.7" y2="22.5" stroke="#FFF" stroke-width="0.4" opacity="0.5"/>
      <!-- Blood groove -->
      <line x1="19" y1="13" x2="19" y2="22" stroke="#90A4AE" stroke-width="0.5"/>
      <!-- Guard/crossguard with detail -->
      <rect x="17.5" y="9" width="3" height="2.5" fill="#78909C" rx="0.5"/>
      <rect x="17.7" y="9.2" width="2.6" height="2.1" fill="#90A4AE" rx="0.4"/>
      <rect x="18" y="9.5" width="2" height="1.5" fill="#FFC107"/>
      <rect x="18.2" y="9.7" width="1.6" height="1.1" fill="#FFD54F"/>
      <circle cx="18" cy="10.2" r="0.3" fill="#B8860B"/>
      <circle cx="20" cy="10.2" r="0.3" fill="#B8860B"/>
      <!-- Pommel -->
      <circle cx="19" cy="24.5" r="1" fill="#78909C"/>
      <circle cx="19" cy="24.5" r="0.7" fill="#90A4AE"/>
      <circle cx="19" cy="24.5" r="0.4" fill="#B0BEC5"/>
      <!-- Blade tip -->
      <path d="M 17.5 11 L 19 8 L 20.5 11 Z" fill="#B0BEC5" stroke="#78909C" stroke-width="0.9"/>
      <path d="M 18" cy="10" r="0.6" fill="#B8860B"/>
      <circle cx="20" cy="10" r="0.6" fill="#B8860B"/>
      <!-- Pommel -->
      <circle cx="19" cy="24.5" r="1" fill="#78909C"/>
      <circle cx="19" cy="24.5" r="0.7" fill="#90A4AE"/>
      <circle cx="19" cy="24.5" r="0.4" fill="#B0BEC5"/>
      <!-- Blade tip -->
      <path d="M 17.5 11 L 19 8 L 20.5 11 Z" fill="#B0BEC5" stroke="#78909C" stroke-width="0.9"/>
      <path d="M 18 10 L 19 8.5 L 20 10 Z" fill="#CFD8DC"/>
      <line x1="19" y1="8.7" x2="19" y2="10" stroke="#FFF" stroke-width="0.4" opacity="0.6"/>
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
      <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#546E7A;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#455A64;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="orc-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="29" rx="10.5" ry="2.8" fill="#000" opacity="0.35"/>
      <!-- Body with enhanced muscle definition -->
      <ellipse cx="12" cy="18" rx="9.5" ry="10.5" fill="#6D4C41" stroke="#3E2723" stroke-width="1.8"/>
      <ellipse cx="10" cy="16" rx="3.5" ry="4.5" fill="#5D4037" opacity="0.4"/>
      <ellipse cx="14" cy="16" rx="3.5" ry="4.5" fill="#5D4037" opacity="0.4"/>
      <ellipse cx="12" cy="19" rx="7" ry="8" fill="#795548" opacity="0.3"/>
      <!-- Belly/abs definition -->
      <path d="M 10 18 Q 12 19 14 18" stroke="#4E342E" stroke-width="0.8" opacity="0.5"/>
      <path d="M 10 20 Q 12 21 14 20" stroke="#4E342E" stroke-width="0.8" opacity="0.5"/>
      <path d="M 10.5 22 Q 12 23 13.5 22" stroke="#4E342E" stroke-width="0.7" opacity="0.5"/>
      <!-- Enhanced armor plates with rivets and detail -->
      <rect x="7" y="14" width="10" height="4.5" fill="url(#armorGrad)" stroke="#263238" stroke-width="1.2" rx="0.5"/>
      <rect x="7.2" y="14.2" width="9.6" height="4.1" fill="#546E7A" opacity="0.3" rx="0.4"/>
      <rect x="7" y="18.5" width="10" height="3.5" fill="#455A64" stroke="#263238" stroke-width="1.2" rx="0.4"/>
      <rect x="7.2" y="18.7" width="9.6" height="3.1" fill="#607D8B" opacity="0.3" rx="0.3"/>
      <!-- Center medallion -->
      <circle cx="12" cy="16" r="2.3" fill="#607D8B" stroke="#37474F" stroke-width="1.2"/>
      <circle cx="12" cy="16" r="1.8" fill="#78909C"/>
      <circle cx="12" cy="16" r="1.3" fill="#455A64"/>
      <path d="M 11 15 L 12 16 L 13 15" stroke="#263238" stroke-width="0.5" fill="none"/>
      <path d="M 11 17 L 12 16 L 13 17" stroke="#263238" stroke-width="0.5" fill="none"/>
      <!-- Rivets and fasteners -->
      <circle cx="8" cy="15" r="0.7" fill="#263238"/>
      <circle cx="16" cy="15" r="0.7" fill="#263238"/>
      <circle cx="8" cy="17" r="0.7" fill="#263238"/>
      <circle cx="16" cy="17" r="0.7" fill="#263238"/>
      <circle cx="8" cy="19.5" r="0.7" fill="#263238"/>
      <circle cx="16" cy="19.5" r="0.7" fill="#263238"/>
      <circle cx="8" cy="21" r="0.6" fill="#263238"/>
      <circle cx="16" cy="21" r="0.6" fill="#263238"/>
      <!-- Rivet highlights -->
      <circle cx="8.3" cy="14.7" r="0.3" fill="#546E7A"/>
      <circle cx="16.3" cy="14.7" r="0.3" fill="#546E7A"/>
      <!-- Shoulder plates -->
      <ellipse cx="5" cy="14" rx="2.5" ry="2" fill="#455A64" stroke="#263238" stroke-width="0.8"/>
      <ellipse cx="19" cy="14" rx="2.5" ry="2" fill="#455A64" stroke="#263238" stroke-width="0.8"/>
      <ellipse cx="5" cy="14" rx="1.8" ry="1.4" fill="#607D8B" opacity="0.5"/>
      <ellipse cx="19" cy="14" rx="1.8" ry="1.4" fill="#607D8B" opacity="0.5"/>
      <!-- Thick muscular arms -->
      <ellipse cx="4" cy="18" rx="3.2" ry="7.5" fill="#6D4C41" stroke="#4E342E" stroke-width="1.3"/>
      <ellipse cx="20" cy="18" rx="3.2" ry="7.5" fill="#6D4C41" stroke="#4E342E" stroke-width="1.3"/>
      <ellipse cx="4.5" cy="17" rx="1.8" ry="5" fill="#795548" opacity="0.5"/>
      <ellipse cx="19.5" cy="17" rx="1.8" ry="5" fill="#795548" opacity="0.5"/>
      <!-- Battle scars on arms -->
      <line x1="3" y1="16" x2="4.5" y2="17" stroke="#4E342E" stroke-width="0.5" opacity="0.6"/>
      <line x1="19.5" y1="15" x2="21" y2="16.5" stroke="#4E342E" stroke-width="0.5" opacity="0.6"/>
      <line x1="3.5" y1="20" x2="5" y2="21" stroke="#4E342E" stroke-width="0.4" opacity="0.5"/>
      <!-- Hands/fists with more detail -->
      <circle cx="4" cy="24" r="2.7" fill="#795548"/>
      <circle cx="20" cy="24" r="2.7" fill="#795548"/>
      <circle cx="4.2" cy="23.8" r="2.3" fill="#8D6E63"/>
      <circle cx="19.8" cy="23.8" r="2.3" fill="#8D6E63"/>
      <!-- Knuckles -->
      <circle cx="3" cy="23.5" r="0.5" fill="#6D4C41"/>
      <circle cx="4.5" cy="23.3" r="0.5" fill="#6D4C41"/>
      <circle cx="19.5" cy="23.3" r="0.5" fill="#6D4C41"/>
      <circle cx="21" cy="23.5" r="0.5" fill="#6D4C41"/>
      <!-- Head with gradient -->
      <circle cx="12" cy="9" r="6.8" fill="url(#orcSkin)" stroke="#4E342E" stroke-width="1.9"/>
      <ellipse cx="11.5" cy="8.5" rx="5" ry="5.5" fill="#8D6E63" opacity="0.4"/>
      <!-- Brutal brow ridge -->
      <rect x="6" y="9" width="12" height="2.8" fill="#388E3C" rx="1.2"/>
      <rect x="6.5" y="9.3" width="11" height="2.2" fill="#6D4C41" opacity="0.5" rx="1"/>
      <!-- Enhanced tusks with more detail -->
      <path d="M 8.5 11 L 7 14.5 L 8.8 13.8 Z" fill="#FFFACD" stroke="#8B4513" stroke-width="0.8"/>
      <path d="M 15.5 11 L 17 14.5 L 15.2 13.8 Z" fill="#FFFACD" stroke="#8B4513" stroke-width="0.8"/>
      <path d="M 8.5 11.5 L 7.5 14 L 8.5 13.5 Z" fill="#FFF8DC" opacity="0.8"/>
      <path d="M 15.5 11.5 L 16.5 14 L 15.5 13.5 Z" fill="#FFF8DC" opacity="0.8"/>
      <!-- Tusk highlights -->
      <line x1="7.5" y1="12" x2="8.2" y2="12" stroke="#FFF" stroke-width="0.6" opacity="0.7"/>
      <line x1="16.5" y1="12" x2="15.8" y2="12" stroke="#FFF" stroke-width="0.6" opacity="0.7"/>
      <!-- Angry eyes with more intensity -->
      <ellipse cx="10" cy="8.5" rx="2" ry="2.3" fill="#3E2723"/>
      <ellipse cx="14" cy="8.5" rx="2" ry="2.3" fill="#3E2723"/>
      <circle cx="10" cy="8.5" r="1.7" fill="#C62828"/>
      <circle cx="14" cy="8.5" r="1.7" fill="#C62828"/>
      <circle cx="10" cy="8.5" r="1.2" fill="#D32F2F"/>
      <circle cx="14" cy="8.5" r="1.2" fill="#D32F2F"/>
      <ellipse cx="10" cy="8.5" rx="0.9" ry="1.1" fill="#000"/>
      <ellipse cx="14" cy="8.5" rx="0.9" ry="1.1" fill="#000"/>
      <circle cx="10.3" cy="8.2" r="0.4" fill="#FF5252"/>
      <circle cx="14.3" cy="8.2" r="0.4" fill="#FF5252"/>
      <!-- Thick brow ridge shadow -->
      <path d="M 7 7 L 11 6.5 M 13 6.5 L 17 7" stroke="#4E342E" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 7.5 7.5 L 10.5 7 M 13.5 7 L 16.5 7.5" stroke="#3E2723" stroke-width="0.8" stroke-linecap="round"/>
      <!-- War paint with detail -->
      <line x1="9" y1="5" x2="9" y2="7.5" stroke="#C62828" stroke-width="1.8"/>
      <line x1="15" y1="5" x2="15" y2="7.5" stroke="#C62828" stroke-width="1.8"/>
      <line x1="8.8" y1="5.2" x2="8.8" y2="7.3" stroke="#D32F2F" stroke-width="0.8" opacity="0.6"/>
      <line x1="15.2" y1="5.2" x2="15.2" y2="7.3" stroke="#D32F2F" stroke-width="0.8" opacity="0.6"/>
      <!-- Facial scars -->
      <path d="M 7 10 Q 8.5 10.5 10 10" stroke="#4E342E" stroke-width="0.5" opacity="0.6"/>
      <line x1="14.5" y1="6" x2="16" y2="7" stroke="#4E342E" stroke-width="0.5" opacity="0.5"/>
      <!-- Nose ridge -->
      <ellipse cx="12" cy="10" rx="1" ry="1.3" fill="#6D4C41" opacity="0.5"/>
      <!-- Enhanced battle axe -->
      <line x1="2" y1="15" x2="7" y2="15" stroke="#6D4C41" stroke-width="2.2"/>
      <line x1="2" y1="15" x2="7" y2="15" stroke="#5D4037" stroke-width="1.6"/>
      <line x1="2.5" y1="15" x2="6.5" y2="15" stroke="#8D6E63" stroke-width="0.6" opacity="0.5"/>
      <!-- Axe head with detail -->
      <path d="M 2 11 L 0.5 15 L 2 19 Z" fill="#546E7A" stroke="#37474F" stroke-width="1.2"/>
      <path d="M 2.5 12 L 1.5 15 L 2.5 18 Z" fill="#78909C"/>
      <path d="M 2.2 12.5 L 1.7 15 L 2.2 17.5 Z" fill="#90A4AE" opacity="0.6"/>
      <!-- Blade edge highlight -->
      <line x1="2.5" y1="13" x2="1.5" y2="15" stroke="#CFD8DC" stroke-width="0.6" opacity="0.8"/>
      <line x1="2.5" y1="17" x2="1.5" y2="15" stroke="#CFD8DC" stroke-width="0.6" opacity="0.8"/>
      <line x1="2" y1="14" x2="1.2" y2="15" stroke="#FFF" stroke-width="0.4" opacity="0.6"/>
      <!-- Axe notches/damage -->
      <path d="M 1.8 12.5 L 2.2 12.8" stroke="#263238" stroke-width="0.4"/>
      <path d="M 1.5 16.5 L 2 16.8" stroke="#263238" stroke-width="0.4"/>
      <!-- Handle grip -->
      <circle cx="5" cy="15" r="0.9" fill="#37474F"/>
      <circle cx="5" cy="15" r="0.6" fill="#546E7A"/>
    </g>
  `;
}
