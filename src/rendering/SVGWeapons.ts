/**
 * SVG Art Generator - Weapon Graphics
 * Includes: Melee, Pistol, Rifle, Staff
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
