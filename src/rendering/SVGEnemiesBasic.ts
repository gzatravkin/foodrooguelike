/**
 * SVG Art Generator - Basic Enemy Characters
 * Includes: Slime, Goblin
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
