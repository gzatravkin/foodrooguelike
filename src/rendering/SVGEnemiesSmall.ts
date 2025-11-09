/**
 * SVG Art Generator - Small Enemy Characters
 * Includes: Rat, Bat, Spider
 */

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
