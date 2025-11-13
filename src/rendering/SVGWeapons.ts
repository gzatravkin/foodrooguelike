/**
 * SVG Art Generator - Weapon Graphics
 * Includes unique designs for all weapons in the game
 */

export function createMeleeSVG(): string {
  return `
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#E0E0E0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9E9E9E;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="gemGrad">
        <stop offset="0%" style="stop-color:#FFE082;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1" />
      </radialGradient>
    </defs>
    <g class="melee-icon">
      <!-- Blade shadows for depth -->
      <path d="M 1.6 1.6 L 4.6 4.6" stroke="#757575" stroke-width="2.2" stroke-linecap="round" opacity="0.3"/>
      <path d="M 0.6 4.6 L 4.6 0.6" stroke="#757575" stroke-width="2.2" stroke-linecap="round" opacity="0.3"/>
      <!-- Main blades -->
      <path d="M 1.5 1.5 L 4.5 4.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0.5 4.5 L 4.5 0.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <!-- Blade highlights -->
      <line x1="1.5" y1="1.5" x2="4.5" y2="4.5" stroke="#FFF" stroke-width="0.6" opacity="0.7"/>
      <line x1="0.5" y1="4.5" x2="4.5" y2="0.5" stroke="#FFF" stroke-width="0.6" opacity="0.7"/>
      <line x1="2" y1="2" x2="4" y2="4" stroke="#FFF" stroke-width="0.3" opacity="0.5"/>
      <line x1="1" y1="4" x2="4" y2="1" stroke="#FFF" stroke-width="0.3" opacity="0.5"/>
      <!-- Center gem/guard -->
      <circle cx="3" cy="3" r="1" fill="#B8860B" opacity="0.6"/>
      <circle cx="3" cy="3" r="0.85" fill="url(#gemGrad)"/>
      <circle cx="2.7" cy="2.7" r="0.35" fill="#FFF" opacity="0.8"/>
      <!-- Decorative notches -->
      <circle cx="2.2" cy="2.2" r="0.2" fill="#616161" opacity="0.6"/>
      <circle cx="3.8" cy="3.8" r="0.2" fill="#616161" opacity="0.6"/>
    </g>
  `;
}

export function createPistolSVG(): string {
  return `
    <defs>
      <linearGradient id="gunMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#607D8B;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#546E7A;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="muzzleFlash">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:0.9" />
        <stop offset="40%" style="stop-color:#FFD700;stop-opacity:0.7" />
        <stop offset="100%" style="stop-color:#FF9800;stop-opacity:0.3" />
      </radialGradient>
    </defs>
    <g class="pistol-icon">
      <!-- Barrel with shading -->
      <rect x="1" y="2" width="4.5" height="1.5" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <rect x="1.1" y="2.1" width="4.3" height="0.6" fill="#78909C" opacity="0.4" rx="0.2"/>
      <!-- Slide serrations -->
      <line x1="2" y1="2.2" x2="2" y2="3.3" stroke="#263238" stroke-width="0.2"/>
      <line x1="2.5" y1="2.2" x2="2.5" y2="3.3" stroke="#263238" stroke-width="0.2"/>
      <line x1="3" y1="2.2" x2="3" y2="3.3" stroke="#263238" stroke-width="0.2"/>
      <line x1="3.5" y1="2.2" x2="3.5" y2="3.3" stroke="#263238" stroke-width="0.2"/>
      <line x1="4" y1="2.2" x2="4" y2="3.3" stroke="#263238" stroke-width="0.2"/>
      <!-- Front sight -->
      <rect x="4.5" y="2.3" width="0.8" height="0.9" fill="#37474F"/>
      <rect x="4.6" y="2.4" width="0.6" height="0.4" fill="#546E7A"/>
      <!-- Enhanced muzzle flash -->
      <circle cx="5.8" cy="2.75" r="0.9" fill="url(#muzzleFlash)"/>
      <circle cx="5.8" cy="2.75" r="0.6" fill="#FFD700" opacity="0.8"/>
      <circle cx="5.8" cy="2.75" r="0.35" fill="#FFF" opacity="0.7"/>
      <!-- Flash particles -->
      <circle cx="6.3" cy="2.5" r="0.2" fill="#FFD700" opacity="0.6"/>
      <circle cx="6.2" cy="3" r="0.15" fill="#FF9800" opacity="0.5"/>
      <!-- Trigger guard -->
      <path d="M 2.8 3.5 Q 2.8 4.2 3.2 4.2 L 3.5 4.2" stroke="#263238" stroke-width="0.3" fill="none"/>
      <!-- Trigger -->
      <rect x="3" y="3.8" width="0.3" height="0.5" fill="#FFD700" rx="0.1"/>
      <!-- Handle with grip texture -->
      <rect x="2" y="3.5" width="1.5" height="2.2" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.4"/>
      <rect x="2.3" y="4" width="0.9" height="0.4" fill="#5D4037" rx="0.2"/>
      <rect x="2.3" y="4.6" width="0.9" height="0.4" fill="#5D4037" rx="0.2"/>
      <rect x="2.3" y="5.2" width="0.9" height="0.4" fill="#5D4037" rx="0.2"/>
      <!-- Grip stippling -->
      <circle cx="2.5" cy="4.2" r="0.08" fill="#4E342E"/>
      <circle cx="2.8" cy="4.2" r="0.08" fill="#4E342E"/>
      <circle cx="2.5" cy="4.8" r="0.08" fill="#4E342E"/>
      <circle cx="2.8" cy="4.8" r="0.08" fill="#4E342E"/>
      <circle cx="2.5" cy="5.4" r="0.08" fill="#4E342E"/>
      <circle cx="2.8" cy="5.4" r="0.08" fill="#4E342E"/>
      <!-- Magazine -->
      <rect x="2.5" y="5.6" width="0.8" height="0.3" fill="#37474F" rx="0.1"/>
      <!-- Barrel highlight -->
      <line x1="1.5" y1="2.4" x2="4.5" y2="2.4" stroke="#90A4AE" stroke-width="0.25" opacity="0.6"/>
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
      <radialGradient id="rifleMuzzleFlash">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#FFEB3B;stop-opacity:0.9" />
        <stop offset="70%" style="stop-color:#FFD700;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#FF9800;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="rifle-icon">
      <!-- Long barrel with details -->
      <rect x="0" y="2.2" width="6.5" height="1.2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.2"/>
      <rect x="0.1" y="2.3" width="6.3" height="0.5" fill="#607D8B" opacity="0.4" rx="0.1"/>
      <!-- Barrel vents/cooling slots -->
      <line x1="1" y1="2.5" x2="1" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="1.5" y1="2.5" x2="1.5" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="2" y1="2.5" x2="2" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="2.5" y1="2.5" x2="2.5" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="3" y1="2.5" x2="3" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="3.5" y1="2.5" x2="3.5" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <line x1="4" y1="2.5" x2="4" y2="3.1" stroke="#263238" stroke-width="0.25"/>
      <!-- Front sight assembly -->
      <rect x="5.5" y="1.8" width="1.2" height="2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <rect x="5.7" y="2" width="0.8" height="0.6" fill="#546E7A" rx="0.2"/>
      <!-- Muzzle brake -->
      <rect x="6.6" y="2.3" width="0.5" height="0.9" fill="#37474F" stroke="#263238" stroke-width="0.2"/>
      <line x1="6.7" y1="2.5" x2="7" y2="2.5" stroke="#263238" stroke-width="0.15"/>
      <line x1="6.7" y1="3" x2="7" y2="3" stroke="#263238" stroke-width="0.15"/>
      <!-- Enhanced muzzle flash with blast pattern -->
      <ellipse cx="7.5" cy="2.8" rx="1" ry="0.8" fill="url(#rifleMuzzleFlash)"/>
      <ellipse cx="7.5" cy="2.8" rx="0.7" ry="0.5" fill="#FFD700" opacity="0.9"/>
      <circle cx="7.5" cy="2.8" r="0.4" fill="#FFF" opacity="0.8"/>
      <!-- Flash particles -->
      <circle cx="8.2" cy="2.8" r="0.2" fill="#FFEB3B" opacity="0.7"/>
      <circle cx="8" cy="2.4" r="0.15" fill="#FFD700" opacity="0.6"/>
      <circle cx="8" cy="3.2" r="0.15" fill="#FFD700" opacity="0.6"/>
      <!-- Receiver details -->
      <rect x="4" y="2.4" width="1.5" height="0.8" fill="#455A64" stroke="#263238" stroke-width="0.2" rx="0.1"/>
      <circle cx="4.5" cy="2.8" r="0.15" fill="#263238"/>
      <rect x="4.8" y="2.6" width="0.3" height="0.4" fill="#263238" rx="0.05"/>
      <!-- Stock with detail -->
      <rect x="0" y="2.5" width="1.5" height="1.1" fill="#6D4C41" rx="0.3"/>
      <rect x="0.1" y="2.6" width="1.3" height="0.9" fill="#5D4037" rx="0.2"/>
      <line x1="0.4" y1="2.7" x2="1.2" y2="2.7" stroke="#8D6E63" stroke-width="0.15"/>
      <line x1="0.4" y1="3.2" x2="1.2" y2="3.2" stroke="#8D6E63" stroke-width="0.15"/>
      <!-- Scope mount -->
      <rect x="3" y="1.8" width="1.2" height="0.4" fill="#37474F" stroke="#263238" stroke-width="0.15" rx="0.1"/>
      <!-- Barrel highlight -->
      <line x1="0.5" y1="2.4" x2="6" y2="2.4" stroke="#90A4AE" stroke-width="0.2" opacity="0.5"/>
    </g>
  `;
}

export function createStaffSVG(): string {
  return `
    <defs>
      <radialGradient id="magicGem">
        <stop offset="0%" style="stop-color:#E1BEE7;stop-opacity:1" />
        <stop offset="40%" style="stop-color:#CE93D8;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#9C27B0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="magicGlow">
        <stop offset="0%" style="stop-color:#F3E5F5;stop-opacity:0.9" />
        <stop offset="50%" style="stop-color:#E1BEE7;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.2" />
      </radialGradient>
      <linearGradient id="woodGrain" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#A1887F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8D6E63;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="staff-icon">
      <!-- Enhanced glow aura with layers -->
      <circle cx="2" cy="1" r="2.5" fill="url(#magicGlow)" opacity="0.4"/>
      <circle cx="2" cy="1" r="2" fill="url(#magicGlow)" opacity="0.6"/>
      <circle cx="2" cy="1" r="1.6" fill="url(#magicGlow)"/>
      <!-- Staff shaft with wood grain -->
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="#8D6E63" stroke-width="1.3" stroke-linecap="round"/>
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="url(#woodGrain)" stroke-width="1" stroke-linecap="round"/>
      <line x1="1.8" y1="2.7" x2="1.8" y2="5.8" stroke="#A1887F" stroke-width="0.3" opacity="0.6"/>
      <!-- Wood texture marks -->
      <line x1="1.6" y1="3" x2="2.4" y2="3" stroke="#6D4C41" stroke-width="0.1" opacity="0.4"/>
      <line x1="1.6" y1="4.2" x2="2.4" y2="4.2" stroke="#6D4C41" stroke-width="0.1" opacity="0.4"/>
      <line x1="1.6" y1="5.5" x2="2.4" y2="5.5" stroke="#6D4C41" stroke-width="0.1" opacity="0.4"/>
      <!-- Decorative golden rings with detail -->
      <circle cx="2" cy="3.5" r="0.7" fill="none" stroke="#FFD700" stroke-width="0.35"/>
      <circle cx="2" cy="3.5" r="0.55" fill="none" stroke="#FFC107" stroke-width="0.2"/>
      <circle cx="2" cy="3.5" r="0.3" fill="#FFD700" opacity="0.3"/>
      <circle cx="2" cy="5" r="0.6" fill="none" stroke="#FFD700" stroke-width="0.35"/>
      <circle cx="2" cy="5" r="0.45" fill="none" stroke="#FFC107" stroke-width="0.2"/>
      <circle cx="2" cy="5" r="0.25" fill="#FFD700" opacity="0.3"/>
      <!-- Rune engravings -->
      <path d="M 2 4 L 2 4.5" stroke="#9C27B0" stroke-width="0.15" opacity="0.5"/>
      <circle cx="2" cy="4.2" r="0.15" fill="#9C27B0" opacity="0.4"/>
      <!-- Ornate top cap -->
      <path d="M 1.4 2.3 L 2 2.5 L 2.6 2.3" stroke="#FFD700" stroke-width="0.3" fill="none"/>
      <circle cx="2" cy="2.4" r="0.2" fill="#FFC107"/>
      <!-- Enhanced magic gem with depth -->
      <circle cx="2" cy="1" r="1.4" fill="url(#magicGem)" stroke="#6A1B9A" stroke-width="0.35"/>
      <circle cx="2" cy="1" r="1.1" fill="#BA68C8" opacity="0.6"/>
      <circle cx="2" cy="1" r="0.8" fill="#CE93D8" opacity="0.5"/>
      <ellipse cx="1.5" cy="0.6" rx="0.4" ry="0.35" fill="#FFF" opacity="0.9"/>
      <circle cx="2.3" cy="1.3" r="0.15" fill="#FFF" opacity="0.6"/>
      <!-- Gem facets -->
      <path d="M 1.2 0.8 L 2 0.4 L 2.8 0.8" stroke="#E1BEE7" stroke-width="0.2" fill="none" opacity="0.5"/>
      <path d="M 1.2 1.2 L 2 1.6 L 2.8 1.2" stroke="#9C27B0" stroke-width="0.2" fill="none" opacity="0.4"/>
      <!-- Enhanced energy wisps with more detail -->
      <path d="M 1.2 1 Q 0.7 0.4 0.9 0.2" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.8"/>
      <path d="M 2.8 1 Q 3.3 0.4 3.1 0.2" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.8"/>
      <path d="M 1.5 0.3 Q 1.2 -0.1 1.4 -0.2" stroke="#CE93D8" stroke-width="0.3" fill="none" opacity="0.6"/>
      <path d="M 2.5 0.3 Q 2.8 -0.1 2.6 -0.2" stroke="#CE93D8" stroke-width="0.3" fill="none" opacity="0.6"/>
      <!-- Magic particles floating -->
      <circle cx="0.8" cy="1.5" r="0.15" fill="#E1BEE7" opacity="0.7"/>
      <circle cx="3.2" cy="1.2" r="0.12" fill="#BA68C8" opacity="0.6"/>
      <circle cx="1" cy="0.5" r="0.1" fill="#FFF" opacity="0.8"/>
      <circle cx="3" cy="0.7" r="0.1" fill="#FFF" opacity="0.8"/>
    </g>
  `;
}

export function createRustySwordSVG(): string {
  return `
    <defs>
      <linearGradient id="rustyBlade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#B0B0B0;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#8B7355;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6D4C41;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="rusty-sword-icon">
      <!-- Blade with rust -->
      <path d="M 1 4.5 L 3 1 L 3.5 1.5 L 1.5 5" fill="url(#rustyBlade)" stroke="#6D4C41" stroke-width="0.25"/>
      <!-- Rust spots -->
      <circle cx="2" cy="3" r="0.15" fill="#A0522D" opacity="0.7"/>
      <circle cx="2.5" cy="2" r="0.12" fill="#8B4513" opacity="0.6"/>
      <circle cx="1.8" cy="3.8" r="0.1" fill="#A0522D" opacity="0.5"/>
      <!-- Guard -->
      <rect x="0.8" y="4.3" width="1.5" height="0.3" fill="#654321" rx="0.1"/>
      <!-- Handle with worn grip -->
      <rect x="1.3" y="4.6" width="0.5" height="1.2" fill="#8D6E63" rx="0.15"/>
      <line x1="1.3" y1="5" x2="1.8" y2="5" stroke="#5D4037" stroke-width="0.1"/>
      <line x1="1.3" y1="5.4" x2="1.8" y2="5.4" stroke="#5D4037" stroke-width="0.1"/>
      <!-- Pommel -->
      <circle cx="1.55" cy="5.9" r="0.2" fill="#654321"/>
    </g>
  `;
}

export function createIronSwordSVG(): string {
  return `
    <defs>
      <linearGradient id="ironBlade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#E0E0E0;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#B0B0B0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#808080;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="iron-sword-icon">
      <!-- Blade with clean steel -->
      <path d="M 1 5 L 3.5 0.5 L 4 1 L 1.5 5.5" fill="url(#ironBlade)" stroke="#757575" stroke-width="0.3"/>
      <!-- Blade edge highlight -->
      <line x1="3.5" y1="0.8" x2="1.3" y2="5.2" stroke="#FFF" stroke-width="0.2" opacity="0.7"/>
      <!-- Fuller (blood groove) -->
      <line x1="2.8" y1="1.5" x2="1.5" y2="4.5" stroke="#909090" stroke-width="0.15" opacity="0.6"/>
      <!-- Cross-guard -->
      <rect x="0.5" y="4.8" width="2" height="0.4" fill="#616161" rx="0.15"/>
      <rect x="0.6" y="4.85" width="1.8" height="0.15" fill="#808080" opacity="0.5"/>
      <!-- Handle with leather wrap -->
      <rect x="1.2" y="5.2" width="0.6" height="1.4" fill="#6D4C41" rx="0.2"/>
      <line x1="1.2" y1="5.5" x2="1.8" y2="5.5" stroke="#5D4037" stroke-width="0.1"/>
      <line x1="1.2" y1="5.9" x2="1.8" y2="5.9" stroke="#5D4037" stroke-width="0.1"/>
      <line x1="1.2" y1="6.3" x2="1.8" y2="6.3" stroke="#5D4037" stroke-width="0.1"/>
      <!-- Pommel -->
      <circle cx="1.5" cy="6.7" r="0.25" fill="#757575" stroke="#616161" stroke-width="0.1"/>
      <circle cx="1.5" cy="6.7" r="0.15" fill="#909090"/>
    </g>
  `;
}

export function createCrossbowSVG(): string {
  return `
    <defs>
      <linearGradient id="woodBow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#A1887F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6D4C41;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="crossbow-icon">
      <!-- Bow arms -->
      <path d="M 0.5 1.5 Q 1.5 1 3 1.8" stroke="#8D6E63" stroke-width="0.5" fill="none"/>
      <path d="M 0.5 4.5 Q 1.5 5 3 4.2" stroke="#8D6E63" stroke-width="0.5" fill="none"/>
      <!-- Bow string -->
      <line x1="0.6" y1="1.6" x2="0.6" y2="4.4" stroke="#E0E0E0" stroke-width="0.15"/>
      <!-- Stock -->
      <rect x="2.5" y="2.5" width="3" height="1" fill="url(#woodBow)" rx="0.3"/>
      <rect x="2.6" y="2.6" width="2.8" height="0.4" fill="#A1887F" opacity="0.4" rx="0.2"/>
      <!-- Trigger mechanism -->
      <rect x="3.5" y="3.3" width="0.4" height="0.5" fill="#757575" rx="0.1"/>
      <circle cx="3.7" cy="3.5" r="0.12" fill="#616161"/>
      <!-- Bolt loaded -->
      <rect x="1.5" y="2.85" width="1.8" height="0.15" fill="#8D6E63"/>
      <path d="M 1.3 2.9 L 1.5 2.75 L 1.5 3.05 Z" fill="#757575"/>
      <!-- Sight -->
      <rect x="3" y="2.3" width="0.15" height="0.3" fill="#616161"/>
      <!-- Details -->
      <line x1="3" y1="2.7" x2="5" y2="2.7" stroke="#6D4C41" stroke-width="0.1" opacity="0.5"/>
    </g>
  `;
}

export function createShotgunSVG(): string {
  return `
    <defs>
      <linearGradient id="shotgunMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#5D4037;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#4E342E;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3E2723;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="shotgunFlash">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#FF9800;stop-opacity:0.9" />
        <stop offset="70%" style="stop-color:#FF5722;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#D84315;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="shotgun-icon">
      <!-- Double barrel -->
      <rect x="0.5" y="2" width="5.5" height="0.7" fill="url(#shotgunMetal)" stroke="#3E2723" stroke-width="0.3" rx="0.2"/>
      <rect x="0.5" y="3.3" width="5.5" height="0.7" fill="url(#shotgunMetal)" stroke="#3E2723" stroke-width="0.3" rx="0.2"/>
      <!-- Barrel bands -->
      <rect x="2" y="1.9" width="0.3" height="2.2" fill="#6D4C41" rx="0.1"/>
      <rect x="4" y="1.9" width="0.3" height="2.2" fill="#6D4C41" rx="0.1"/>
      <!-- Muzzle -->
      <ellipse cx="6.2" cy="2.35" rx="0.4" ry="0.35" fill="#1A1A1A"/>
      <ellipse cx="6.2" cy="3.65" rx="0.4" ry="0.35" fill="#1A1A1A"/>
      <!-- Muzzle flash -->
      <ellipse cx="7" cy="3" rx="1.2" ry="1" fill="url(#shotgunFlash)"/>
      <ellipse cx="7" cy="3" rx="0.8" ry="0.6" fill="#FF9800" opacity="0.8"/>
      <circle cx="7" cy="3" r="0.4" fill="#FFF" opacity="0.7"/>
      <!-- Flash spread -->
      <circle cx="7.8" cy="2.5" r="0.2" fill="#FF9800" opacity="0.6"/>
      <circle cx="7.8" cy="3.5" r="0.2" fill="#FF9800" opacity="0.6"/>
      <circle cx="7.5" cy="3" r="0.15" fill="#FFF" opacity="0.5"/>
      <!-- Pump/fore-end -->
      <rect x="2.5" y="3.9" width="1.2" height="0.6" fill="#8D6E63" rx="0.2"/>
      <line x1="2.6" y1="4.2" x2="3.6" y2="4.2" stroke="#6D4C41" stroke-width="0.1"/>
      <!-- Stock -->
      <path d="M 0.5 2.3 L 0 2.3 L 0 3.7 L 0.5 3.7" fill="#8D6E63"/>
      <rect x="0" y="2.5" width="0.5" height="1" fill="#6D4C41" rx="0.1"/>
    </g>
  `;
}

export function createPlasmaCannonSVG(): string {
  return `
    <defs>
      <radialGradient id="plasmaGlow">
        <stop offset="0%" style="stop-color:#00E5FF;stop-opacity:1" />
        <stop offset="40%" style="stop-color:#00B8D4;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.3" />
      </radialGradient>
      <linearGradient id="plasmaMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#546E7A;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#37474F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#263238;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="plasma-cannon-icon">
      <!-- Main body -->
      <rect x="1" y="2" width="5" height="2" fill="url(#plasmaMetal)" stroke="#1A237E" stroke-width="0.3" rx="0.4"/>
      <!-- Energy core -->
      <circle cx="3" cy="3" r="0.8" fill="url(#plasmaGlow)"/>
      <circle cx="3" cy="3" r="0.5" fill="#00E5FF" opacity="0.8"/>
      <circle cx="2.7" cy="2.8" r="0.25" fill="#FFF" opacity="0.9"/>
      <!-- Cooling vents -->
      <line x1="2" y1="2.3" x2="2" y2="3.7" stroke="#0097A7" stroke-width="0.15" opacity="0.6"/>
      <line x1="2.5" y1="2.3" x2="2.5" y2="3.7" stroke="#0097A7" stroke-width="0.15" opacity="0.6"/>
      <line x1="3.5" y1="2.3" x2="3.5" y2="3.7" stroke="#0097A7" stroke-width="0.15" opacity="0.6"/>
      <line x1="4" y1="2.3" x2="4" y2="3.7" stroke="#0097A7" stroke-width="0.15" opacity="0.6"/>
      <!-- Barrel assembly -->
      <rect x="5.5" y="2.3" width="1" height="0.6" fill="#37474F" stroke="#263238" stroke-width="0.2" rx="0.2"/>
      <rect x="5.5" y="3.1" width="1" height="0.6" fill="#37474F" stroke="#263238" stroke-width="0.2" rx="0.2"/>
      <!-- Plasma discharge -->
      <ellipse cx="7.2" cy="3" rx="1.3" ry="1.1" fill="url(#plasmaGlow)" opacity="0.6"/>
      <ellipse cx="7.2" cy="3" rx="0.9" ry="0.7" fill="#00E5FF" opacity="0.8"/>
      <circle cx="7.2" cy="3" r="0.5" fill="#FFF" opacity="0.7"/>
      <!-- Energy particles -->
      <circle cx="8" cy="2.5" r="0.15" fill="#00E5FF" opacity="0.8"/>
      <circle cx="8.2" cy="3" r="0.2" fill="#00E5FF" opacity="0.7"/>
      <circle cx="8" cy="3.5" r="0.15" fill="#00E5FF" opacity="0.8"/>
      <circle cx="7.5" cy="2.2" r="0.1" fill="#FFF" opacity="0.9"/>
      <circle cx="7.5" cy="3.8" r="0.1" fill="#FFF" opacity="0.9"/>
      <!-- Tech details -->
      <circle cx="1.5" cy="2.5" r="0.15" fill="#00E5FF" opacity="0.6"/>
      <rect x="4.8" y="2.5" width="0.5" height="1" fill="#263238" rx="0.1"/>
      <line x1="4.9" y1="2.7" x2="5.2" y2="2.7" stroke="#00BCD4" stroke-width="0.08"/>
      <line x1="4.9" y1="3.3" x2="5.2" y2="3.3" stroke="#00BCD4" stroke-width="0.08"/>
      <!-- Handle -->
      <rect x="1" y="3.8" width="1.2" height="1" fill="#455A64" rx="0.3"/>
      <rect x="1.1" y="4" width="1" height="0.6" fill="#546E7A" opacity="0.4" rx="0.2"/>
    </g>
  `;
}

export function createDemonBladeSVG(): string {
  return `
    <defs>
      <linearGradient id="demonBlade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FF5252;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#D32F2F;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#B71C1C;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="demonGlow">
        <stop offset="0%" style="stop-color:#FF5252;stop-opacity:0.9" />
        <stop offset="50%" style="stop-color:#F44336;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#C62828;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="demon-blade-icon">
      <!-- Demonic aura -->
      <ellipse cx="3" cy="2.5" rx="3" ry="2.5" fill="url(#demonGlow)" opacity="0.4"/>
      <!-- Jagged blade -->
      <path d="M 0.5 5.5 L 1.5 4 L 1 3.5 L 2 2 L 1.5 1.5 L 3 0.5 L 3.5 1 L 4 0.5 L 4.5 1.5 L 2 5.5 Z" fill="url(#demonBlade)" stroke="#B71C1C" stroke-width="0.25"/>
      <!-- Blade edge glow -->
      <path d="M 2.8 0.8 L 4 1.5" stroke="#FF5252" stroke-width="0.3" opacity="0.8"/>
      <path d="M 1.8 2 L 3.5 4" stroke="#FF5252" stroke-width="0.3" opacity="0.8"/>
      <!-- Serrated teeth -->
      <path d="M 1.8 3.5 L 2.2 3.2 L 2 3 L 2.4 2.7" stroke="#B71C1C" stroke-width="0.15"/>
      <!-- Demonic runes -->
      <circle cx="2" cy="3" r="0.15" fill="#FF5252" opacity="0.8"/>
      <path d="M 2.5 2 L 2.7 2.3" stroke="#FF5252" stroke-width="0.1" opacity="0.7"/>
      <!-- Skull guard -->
      <ellipse cx="1.2" cy="5.2" rx="0.5" ry="0.6" fill="#424242" stroke="#212121" stroke-width="0.15"/>
      <circle cx="1.1" cy="5.1" r="0.1" fill="#F44336"/>
      <circle cx="1.3" cy="5.1" r="0.1" fill="#F44336"/>
      <path d="M 1.2 5.3 L 1.2 5.4" stroke="#F44336" stroke-width="0.08"/>
      <!-- Cursed handle -->
      <rect x="0.9" y="5.5" width="0.6" height="1.3" fill="#212121" rx="0.2"/>
      <line x1="0.9" y1="5.8" x2="1.5" y2="5.8" stroke="#F44336" stroke-width="0.08" opacity="0.6"/>
      <line x1="0.9" y1="6.2" x2="1.5" y2="6.2" stroke="#F44336" stroke-width="0.08" opacity="0.6"/>
      <line x1="0.9" y1="6.6" x2="1.5" y2="6.6" stroke="#F44336" stroke-width="0.08" opacity="0.6"/>
      <!-- Flame wisps -->
      <path d="M 3.5 0.5 Q 4.2 0 4 -0.3" stroke="#FF5252" stroke-width="0.3" opacity="0.6" fill="none"/>
      <path d="M 4.3 1 Q 4.8 0.8 4.7 0.5" stroke="#FF9800" stroke-width="0.25" opacity="0.5" fill="none"/>
    </g>
  `;
}

export function createDragonBreathSVG(): string {
  return `
    <defs>
      <radialGradient id="fireGlow">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#FFEB3B;stop-opacity:0.9" />
        <stop offset="60%" style="stop-color:#FF9800;stop-opacity:0.7" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.3" />
      </radialGradient>
      <linearGradient id="dragonScale" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#D32F2F;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#C62828;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#B71C1C;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="dragon-breath-icon">
      <!-- Fire blast -->
      <ellipse cx="6.5" cy="3" rx="2" ry="1.5" fill="url(#fireGlow)" opacity="0.6"/>
      <ellipse cx="6.5" cy="3" rx="1.5" ry="1" fill="#FF9800" opacity="0.8"/>
      <circle cx="6.5" cy="3" r="0.7" fill="#FFEB3B"/>
      <circle cx="6.5" cy="3" r="0.4" fill="#FFF" opacity="0.8"/>
      <!-- Flame tongues -->
      <path d="M 6 2 Q 6.5 1.5 7 1.8" stroke="#FF5722" stroke-width="0.4" opacity="0.7" fill="none"/>
      <path d="M 6 4 Q 6.5 4.5 7 4.2" stroke="#FF5722" stroke-width="0.4" opacity="0.7" fill="none"/>
      <path d="M 6.8 2.3 Q 7.5 2 8 2.2" stroke="#FF9800" stroke-width="0.3" opacity="0.6" fill="none"/>
      <path d="M 6.8 3.7 Q 7.5 4 8 3.8" stroke="#FF9800" stroke-width="0.3" opacity="0.6" fill="none"/>
      <!-- Fire particles -->
      <circle cx="7.8" cy="2.5" r="0.2" fill="#FFEB3B" opacity="0.8"/>
      <circle cx="8.2" cy="3" r="0.25" fill="#FF9800" opacity="0.7"/>
      <circle cx="7.8" cy="3.5" r="0.2" fill="#FFEB3B" opacity="0.8"/>
      <circle cx="7.2" cy="2" r="0.15" fill="#FFF" opacity="0.9"/>
      <circle cx="7.2" cy="4" r="0.15" fill="#FFF" opacity="0.9"/>
      <!-- Dragon head weapon -->
      <path d="M 2 3.5 Q 1.5 3 1.5 2.5 Q 1.5 2 2 1.5 L 5 2 L 5.5 2.5 L 5.5 3.5 L 5 4 L 2 4.5 Z" fill="url(#dragonScale)" stroke="#B71C1C" stroke-width="0.3"/>
      <!-- Dragon scales -->
      <circle cx="2.5" cy="2.5" r="0.15" fill="#F44336" opacity="0.6"/>
      <circle cx="3" cy="2.3" r="0.15" fill="#F44336" opacity="0.6"/>
      <circle cx="3.5" cy="2.2" r="0.15" fill="#F44336" opacity="0.6"/>
      <circle cx="2.5" cy="3.5" r="0.15" fill="#F44336" opacity="0.6"/>
      <circle cx="3" cy="3.7" r="0.15" fill="#F44336" opacity="0.6"/>
      <circle cx="3.5" cy="3.8" r="0.15" fill="#F44336" opacity="0.6"/>
      <!-- Dragon eye -->
      <circle cx="2.2" cy="2.8" r="0.25" fill="#FFD700"/>
      <circle cx="2.2" cy="2.8" r="0.15" fill="#212121"/>
      <circle cx="2.25" cy="2.75" r="0.08" fill="#FF5722"/>
      <!-- Dragon horns -->
      <path d="M 1.8 1.8 L 1.5 1.3 L 1.9 1.5" fill="#424242"/>
      <path d="M 1.8 4.2 L 1.5 4.7 L 1.9 4.5" fill="#424242"/>
      <!-- Dragon fangs -->
      <path d="M 5.3 2.7 L 5.7 2.8 L 5.4 2.9" fill="#FFF"/>
      <path d="M 5.3 3.3 L 5.7 3.2 L 5.4 3.1" fill="#FFF"/>
      <!-- Handle/grip -->
      <rect x="0.5" y="2.3" width="1" height="1.4" fill="#6D4C41" rx="0.3"/>
      <rect x="0.6" y="2.5" width="0.8" height="1" fill="#8D6E63" opacity="0.4" rx="0.2"/>
      <line x1="0.6" y1="2.8" x2="1.4" y2="2.8" stroke="#5D4037" stroke-width="0.08"/>
      <line x1="0.6" y1="3.2" x2="1.4" y2="3.2" stroke="#5D4037" stroke-width="0.08"/>
    </g>
  `;
}
