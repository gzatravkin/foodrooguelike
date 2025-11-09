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
