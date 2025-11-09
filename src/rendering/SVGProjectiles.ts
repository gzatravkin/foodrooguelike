/**
 * SVG Art Generator - Projectile Graphics
 * Includes: Bullet, Magic Bolt, Fire Ball, Plasma Bolt
 */

export function createBulletSVG(color: string = '#FFD700'): string {
  return `
    <defs>
      <radialGradient id="bulletGrad">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="40%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="bullet">
      <circle r="4" fill="${color}" opacity="0.3"/>
      <circle r="3" fill="url(#bulletGrad)"/>
      <ellipse rx="1.5" ry="2" fill="#FFF" opacity="0.6"/>
    </g>
  `;
}

export function createMagicBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="magicCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="40%" style="stop-color:#E1BEE7;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.8" />
      </radialGradient>
    </defs>
    <g class="magic-bolt">
      <!-- Outer glow -->
      <circle r="5" fill="#9C27B0" opacity="0.3"/>
      <circle r="4.5" fill="#BA68C8" opacity="0.5"/>
      <!-- Main bolt -->
      <circle r="3.5" fill="url(#magicCore)"/>
      <circle r="2" fill="#E1BEE7"/>
      <circle r="1.2" fill="#FFF"/>
      <!-- Sparkles -->
      <circle cx="2.5" cy="-1.5" r="0.5" fill="#FFF" opacity="0.8"/>
      <circle cx="-2" cy="2" r="0.4" fill="#E1BEE7" opacity="0.8"/>
      <circle cx="1" cy="2.5" r="0.3" fill="#FFF" opacity="0.9"/>
    </g>
  `;
}

export function createFireBallSVG(): string {
  return `
    <defs>
      <radialGradient id="fireballCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#FFEB3B;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#FF9800;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="fireball">
      <!-- Outer flames -->
      <circle r="6" fill="#FF5722" opacity="0.3"/>
      <circle r="5.5" fill="#FF9800" opacity="0.4"/>
      <!-- Fire trails -->
      <ellipse cx="-3" cy="0" rx="2" ry="3" fill="#FF6F00" opacity="0.5"/>
      <ellipse cx="3" cy="1" rx="1.5" ry="2.5" fill="#FF6F00" opacity="0.5"/>
      <!-- Core -->
      <circle r="4" fill="url(#fireballCore)"/>
      <circle r="2.5" fill="#FFEB3B" opacity="0.9"/>
      <circle r="1.5" fill="#FFF" opacity="0.8"/>
      <!-- Ember particles -->
      <circle cx="3.5" cy="-2" r="0.5" fill="#FFD54F" opacity="0.8"/>
      <circle cx="-3" cy="2.5" r="0.6" fill="#FF9800" opacity="0.7"/>
      <circle cx="2" cy="3" r="0.4" fill="#FFEB3B" opacity="0.8"/>
      <circle cx="-2" cy="-2.5" r="0.5" fill="#FF5722" opacity="0.6"/>
    </g>
  `;
}

export function createPlasmaBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="plasmaCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#80DEEA;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#00BCD4;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.7" />
      </radialGradient>
    </defs>
    <g class="plasma-bolt">
      <!-- Electric aura -->
      <circle r="6" fill="#00E5FF" opacity="0.2"/>
      <circle r="5.5" fill="#00BCD4" opacity="0.3"/>
      <!-- Lightning arcs -->
      <path d="M -4 0 Q -3 -2 -1 -1 Q 0 0 1 -2" stroke="#80DEEA" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M 4 1 Q 2 2 1 0 Q 0 -1 -1 1" stroke="#80DEEA" stroke-width="0.8" fill="none" opacity="0.7"/>
      <!-- Core -->
      <circle r="4" fill="url(#plasmaCore)"/>
      <circle r="2.5" fill="#80DEEA"/>
      <circle r="1.5" fill="#FFF" opacity="0.9"/>
      <!-- Electric particles -->
      <circle cx="3" cy="-2.5" r="0.5" fill="#00E5FF" opacity="0.9"/>
      <circle cx="-3.5" cy="1.5" r="0.6" fill="#80DEEA" opacity="0.8"/>
      <circle cx="2.5" cy="3" r="0.4" fill="#FFF" opacity="0.9"/>
      <circle cx="-2" cy="-3" r="0.5" fill="#00BCD4" opacity="0.7"/>
    </g>
  `;
}

// Corpse SVG
export function createCorpseSVG(enemyType: string): string {
