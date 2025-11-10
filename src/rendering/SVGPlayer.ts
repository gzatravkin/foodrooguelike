/**
 * SVG Art Generator - Player Character
 */

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
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#6D4C41;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3E2723;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g class="player-sprite" filter="url(#shadow)">
      <!-- Shadow -->
      <ellipse cx="12" cy="30" rx="10" ry="3" fill="#000" opacity="0.25"/>
      <!-- Legs with shading -->
      <rect x="9" y="23" width="2.5" height="7" fill="#1565C0" rx="1.2"/>
      <rect x="12.5" y="23" width="2.5" height="7" fill="#1976D2" rx="1.2"/>
      <rect x="9.2" y="23" width="0.8" height="7" fill="#1E88E5" opacity="0.6" rx="1.2"/>
      <rect x="12.7" y="23" width="0.8" height="7" fill="#2196F3" opacity="0.6" rx="1.2"/>
      <!-- Boots with detail -->
      <ellipse cx="10.25" cy="29.5" rx="2.2" ry="1.6" fill="#0D47A1"/>
      <ellipse cx="13.75" cy="29.5" rx="2.2" ry="1.6" fill="#1565C0"/>
      <ellipse cx="10.25" cy="29.3" rx="1.8" ry="1.2" fill="#1565C0" opacity="0.5"/>
      <ellipse cx="13.75" cy="29.3" rx="1.8" ry="1.2" fill="#1976D2" opacity="0.5"/>
      <!-- Body with gradient and muscle definition -->
      <ellipse cx="12" cy="16" rx="8" ry="10" fill="url(#bodyGrad)" stroke="#2E7D32" stroke-width="1.5"/>
      <ellipse cx="10" cy="15" rx="2.5" ry="4" fill="#2E7D32" opacity="0.3"/>
      <ellipse cx="14" cy="15" rx="2.5" ry="4" fill="#2E7D32" opacity="0.3"/>
      <!-- Belt with pouches -->
      <rect x="7" y="20" width="10" height="2.2" fill="#8D6E63" rx="0.5"/>
      <line x1="7" y1="21" x2="17" y2="21" stroke="#6D4C41" stroke-width="0.5"/>
      <rect x="11" y="20" width="2" height="2.5" fill="#FFD700" rx="0.3"/>
      <rect x="11.2" y="20.2" width="1.6" height="2.1" fill="#FFA000" opacity="0.6" rx="0.2"/>
      <!-- Utility pouches -->
      <rect x="8" y="20.5" width="1.5" height="1.5" fill="#5D4037" rx="0.3"/>
      <rect x="14.5" y="20.5" width="1.5" height="1.5" fill="#5D4037" rx="0.3"/>
      <!-- Arms with detail -->
      <ellipse cx="5" cy="16" rx="2.5" ry="5" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <ellipse cx="19" cy="16" rx="2.5" ry="5" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>
      <ellipse cx="5.5" cy="15" rx="1.2" ry="3" fill="#66BB6A" opacity="0.5"/>
      <ellipse cx="18.5" cy="15" rx="1.2" ry="3" fill="#66BB6A" opacity="0.5"/>
      <!-- Hands with detail -->
      <circle cx="5" cy="20" r="2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.5"/>
      <circle cx="19" cy="20" r="2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.5"/>
      <circle cx="5.3" cy="19.7" r="1.5" fill="#FFECB3" opacity="0.6"/>
      <circle cx="18.7" cy="19.7" r="1.5" fill="#FFECB3" opacity="0.6"/>
      <!-- Tactical vest with enhanced details -->
      <path d="M 8 14 L 8 22 L 16 22 L 16 14" fill="#37474F" opacity="0.85"/>
      <path d="M 8.5 14.5 L 8.5 21.5 L 15.5 21.5 L 15.5 14.5" fill="#455A64" opacity="0.4"/>
      <!-- Vest straps and details -->
      <line x1="9" y1="16" x2="15" y2="16" stroke="#FFC107" stroke-width="0.7"/>
      <line x1="9" y1="18" x2="15" y2="18" stroke="#FFC107" stroke-width="0.7"/>
      <line x1="9.2" y1="16" x2="14.8" y2="16" stroke="#FFD54F" stroke-width="0.3" opacity="0.6"/>
      <!-- Magazine pouches -->
      <rect x="9" y="19" width="1.8" height="2.5" fill="#263238" rx="0.3"/>
      <rect x="13.2" y="19" width="1.8" height="2.5" fill="#263238" rx="0.3"/>
      <line x1="9.9" y1="19.5" x2="9.9" y2="21" stroke="#37474F" stroke-width="0.3"/>
      <line x1="14.1" y1="19.5" x2="14.1" y2="21" stroke="#37474F" stroke-width="0.3"/>
      <!-- Buttons/fasteners -->
      <circle cx="10" cy="15" r="0.8" fill="#546E7A"/>
      <circle cx="14" cy="15" r="0.8" fill="#546E7A"/>
      <circle cx="10" cy="15" r="0.5" fill="#78909C"/>
      <circle cx="14" cy="15" r="0.5" fill="#78909C"/>
      <!-- Radio/equipment -->
      <rect x="14.5" y="14.5" width="1.2" height="1.8" fill="#263238" rx="0.2"/>
      <circle cx="15.1" cy="15" r="0.3" fill="#00E676" opacity="0.8"/>
      <!-- Head with gradient and better shading -->
      <circle cx="12" cy="8" r="6" fill="url(#headGrad)" stroke="#D7CCC8" stroke-width="1.5"/>
      <ellipse cx="11" cy="7.5" rx="4" ry="3" fill="#FFECB3" opacity="0.4"/>
      <!-- Enhanced hair with volume and highlights -->
      <path d="M 7 7 Q 6 5 8 4 Q 12 3 16 4 Q 18 5 17 7" fill="url(#hairGrad)" stroke="#3E2723" stroke-width="0.5"/>
      <path d="M 7.5 6.5 Q 7 5 9 4.5 Q 12 3.5 15 4.5 Q 17 5 16.5 6.5" fill="#5D4037" opacity="0.6"/>
      <!-- Hair strands for detail -->
      <path d="M 8 5 Q 8.5 4 9 5" stroke="#4E342E" stroke-width="0.4" fill="none"/>
      <path d="M 10 4 Q 10.5 3.5 11 4" stroke="#4E342E" stroke-width="0.4" fill="none"/>
      <path d="M 13 4 Q 13.5 3.5 14 4" stroke="#4E342E" stroke-width="0.4" fill="none"/>
      <path d="M 15 5 Q 15.5 4 16 5" stroke="#4E342E" stroke-width="0.4" fill="none"/>
      <!-- Hair highlights -->
      <path d="M 10 4.5 Q 11 4 12 4.5" stroke="#8D6E63" stroke-width="0.5" opacity="0.5" fill="none"/>
      <!-- Eyes with enhanced detail -->
      <ellipse cx="10" cy="8" rx="1.6" ry="1.7" fill="#FFF"/>
      <ellipse cx="14" cy="8" rx="1.6" ry="1.7" fill="#FFF"/>
      <circle cx="10" cy="8" r="1.1" fill="#1976D2"/>
      <circle cx="14" cy="8" r="1.1" fill="#1976D2"/>
      <circle cx="10" cy="8" r="0.7" fill="#0D47A1"/>
      <circle cx="14" cy="8" r="0.7" fill="#0D47A1"/>
      <circle cx="10.3" cy="7.6" r="0.45" fill="#FFF"/>
      <circle cx="14.3" cy="7.6" r="0.45" fill="#FFF"/>
      <circle cx="10.1" cy="8.2" r="0.2" fill="#FFF" opacity="0.6"/>
      <circle cx="14.1" cy="8.2" r="0.2" fill="#FFF" opacity="0.6"/>
      <!-- Eyebrows -->
      <path d="M 8.5 6.5 Q 10 6 11 6.2" stroke="#4E342E" stroke-width="0.6" fill="none" stroke-linecap="round"/>
      <path d="M 13 6.2 Q 14 6 15.5 6.5" stroke="#4E342E" stroke-width="0.6" fill="none" stroke-linecap="round"/>
      <!-- Nose -->
      <path d="M 12 9 L 12 10" stroke="#D7CCC8" stroke-width="0.5" stroke-linecap="round"/>
      <circle cx="11.5" cy="10" r="0.3" fill="#D7CCC8"/>
      <circle cx="12.5" cy="10" r="0.3" fill="#D7CCC8"/>
      <!-- Enhanced smile -->
      <path d="M 9 10.5 Q 12 11.5 15 10.5" stroke="#D7CCC8" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      <path d="M 9.5 10.7 Q 12 11.3 14.5 10.7" stroke="#FFF" stroke-width="0.3" fill="none" opacity="0.5"/>
      <!-- Ears -->
      <ellipse cx="6.5" cy="8.5" rx="0.8" ry="1.2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.3"/>
      <ellipse cx="17.5" cy="8.5" rx="0.8" ry="1.2" fill="#FFE0B2" stroke="#D7CCC8" stroke-width="0.3"/>
      <ellipse cx="6.8" cy="8.5" rx="0.4" ry="0.6" fill="#FFECB3"/>
      <ellipse cx="17.2" cy="8.5" rx="0.4" ry="0.6" fill="#FFECB3"/>
    </g>
  `;
}
