/**
 * SVG Art Generator - Weapon Graphics
 * Includes: Melee, Pistol, Rifle, Staff
 */

export function createMeleeSVG(): string {
  return `
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#E0E0E0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9E9E9E;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="melee-icon">
      <path d="M 1.5 1.5 L 4.5 4.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0.5 4.5 L 4.5 0.5" stroke="url(#bladeGrad)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="3" cy="3" r="0.8" fill="#FFD700" opacity="0.8"/>
      <line x1="1.5" y1="1.5" x2="4.5" y2="4.5" stroke="#FFF" stroke-width="0.5" opacity="0.6"/>
    </g>
  `;
}

export function createPistolSVG(): string {
  return `
    <defs>
      <linearGradient id="gunMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#546E7A;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="pistol-icon">
      <!-- Barrel -->
      <rect x="1" y="2" width="4.5" height="1.5" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <rect x="4.5" y="2.3" width="0.8" height="0.9" fill="#37474F"/>
      <!-- Muzzle flash hint -->
      <circle cx="5.5" cy="2.75" r="0.6" fill="#FFD700" opacity="0.7"/>
      <circle cx="5.5" cy="2.75" r="0.3" fill="#FFF" opacity="0.5"/>
      <!-- Handle -->
      <rect x="2" y="3.5" width="1.5" height="2.2" fill="url(#gunMetal)" stroke="#263238" stroke-width="0.3" rx="0.4"/>
      <!-- Details -->
      <rect x="2.3" y="4" width="0.9" height="0.4" fill="#5D4037" rx="0.2"/>
      <line x1="1.5" y1="2.5" x2="4.5" y2="2.5" stroke="#78909C" stroke-width="0.2"/>
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
    </defs>
    <g class="rifle-icon">
      <!-- Long barrel -->
      <rect x="0" y="2.2" width="6.5" height="1.2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.2"/>
      <rect x="5.5" y="1.8" width="1.2" height="2" fill="url(#rifleMetal)" stroke="#263238" stroke-width="0.3" rx="0.3"/>
      <!-- Muzzle flash -->
      <circle cx="7" cy="2.8" r="0.7" fill="#FFD700" opacity="0.8"/>
      <circle cx="7" cy="2.8" r="0.4" fill="#FFF" opacity="0.6"/>
      <!-- Barrel vents -->
      <line x1="1" y1="2.5" x2="1" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <line x1="2" y1="2.5" x2="2" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <line x1="3" y1="2.5" x2="3" y2="3.1" stroke="#263238" stroke-width="0.3"/>
      <!-- Stock -->
      <rect x="0" y="2.5" width="1.2" height="1" fill="#5D4037" rx="0.2"/>
      <line x1="1" y1="2.8" x2="6" y2="2.8" stroke="#78909C" stroke-width="0.2"/>
    </g>
  `;
}

export function createStaffSVG(): string {
  return `
    <defs>
      <radialGradient id="magicGem">
        <stop offset="0%" style="stop-color:#CE93D8;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#9C27B0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
      </radialGradient>
      <radialGradient id="magicGlow">
        <stop offset="0%" style="stop-color:#E1BEE7;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.2" />
      </radialGradient>
    </defs>
    <g class="staff-icon">
      <!-- Glow aura -->
      <circle cx="2" cy="1" r="2" fill="url(#magicGlow)"/>
      <!-- Staff shaft -->
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="#8D6E63" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="2" y1="2.5" x2="2" y2="6" stroke="#A1887F" stroke-width="0.6"/>
      <!-- Decorative rings -->
      <circle cx="2" cy="3.5" r="0.6" fill="none" stroke="#FFD700" stroke-width="0.3"/>
      <circle cx="2" cy="5" r="0.5" fill="none" stroke="#FFD700" stroke-width="0.3"/>
      <!-- Magic gem -->
      <circle cx="2" cy="1" r="1.2" fill="url(#magicGem)" stroke="#6A1B9A" stroke-width="0.3"/>
      <circle cx="2" cy="1" r="0.7" fill="#BA68C8" opacity="0.7"/>
      <circle cx="1.6" cy="0.7" r="0.3" fill="#FFF" opacity="0.8"/>
      <!-- Energy wisps -->
      <path d="M 1.2 1 Q 0.8 0.5 1 0.3" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.7"/>
      <path d="M 2.8 1 Q 3.2 0.5 3 0.3" stroke="#E1BEE7" stroke-width="0.4" fill="none" opacity="0.7"/>
    </g>
  `;
}
