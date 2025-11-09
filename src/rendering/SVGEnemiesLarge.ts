/**
 * SVG Art Generator - Large Enemy Characters
 * Includes: Dragon, Wolf, Troll
 */

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
