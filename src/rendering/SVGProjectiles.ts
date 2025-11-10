/**
 * SVG Art Generator - Projectile Graphics
 * Includes: Bullet, Magic Bolt, Fire Ball, Plasma Bolt
 */

export function createBulletSVG(color: string = '#FFD700'): string {
  return `
    <defs>
      <radialGradient id="bulletGrad">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
      </radialGradient>
      <radialGradient id="bulletGlow">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
      </radialGradient>
    </defs>
    <g class="bullet">
      <!-- Motion blur trail -->
      <ellipse rx="6" ry="2.5" fill="${color}" opacity="0.15"/>
      <ellipse rx="5" ry="2" fill="${color}" opacity="0.2"/>
      <!-- Outer glow -->
      <circle r="4.5" fill="url(#bulletGlow)"/>
      <circle r="4" fill="${color}" opacity="0.35"/>
      <!-- Core -->
      <circle r="3.2" fill="url(#bulletGrad)"/>
      <circle r="2" fill="${color}"/>
      <ellipse rx="1.8" ry="2.2" fill="#FFF" opacity="0.7"/>
      <circle r="1" fill="#FFF" opacity="0.5"/>
      <!-- Tracer streak -->
      <ellipse cx="-2" cy="0" rx="3" ry="1" fill="${color}" opacity="0.3"/>
      <ellipse cx="-3.5" cy="0" rx="2" ry="0.7" fill="${color}" opacity="0.2"/>
    </g>
  `;
}

export function createMagicBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="magicCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#E1BEE7;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#CE93D8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.7" />
      </radialGradient>
      <radialGradient id="magicAura">
        <stop offset="0%" style="stop-color:#F3E5F5;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.1" />
      </radialGradient>
    </defs>
    <g class="magic-bolt">
      <!-- Magical aura with layers -->
      <circle r="6.5" fill="url(#magicAura)"/>
      <circle r="5.5" fill="#9C27B0" opacity="0.2"/>
      <circle r="5" fill="#BA68C8" opacity="0.3"/>
      <circle r="4.5" fill="#CE93D8" opacity="0.4"/>
      <!-- Energy swirl trail -->
      <path d="M -4 0 Q -3 -2 -1 -1.5 Q 0 -1 1 -2" stroke="#BA68C8" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M -4 0 Q -3 2 -1 1.5 Q 0 1 1 2" stroke="#BA68C8" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M -5 0 Q -4 -1 -2 -0.8" stroke="#E1BEE7" stroke-width="0.6" fill="none" opacity="0.5"/>
      <path d="M -5 0 Q -4 1 -2 0.8" stroke="#E1BEE7" stroke-width="0.6" fill="none" opacity="0.5"/>
      <!-- Main bolt core -->
      <circle r="3.8" fill="url(#magicCore)"/>
      <circle r="2.8" fill="#E1BEE7"/>
      <circle r="2" fill="#F3E5F5"/>
      <circle r="1.3" fill="#FFF"/>
      <!-- Enhanced sparkles with variety -->
      <circle cx="3" cy="-2" r="0.7" fill="#FFF" opacity="0.9"/>
      <circle cx="-2.5" cy="2.5" r="0.6" fill="#E1BEE7" opacity="0.85"/>
      <circle cx="1.5" cy="3" r="0.5" fill="#FFF" opacity="0.95"/>
      <circle cx="-3" cy="-1.5" r="0.4" fill="#BA68C8" opacity="0.8"/>
      <circle cx="2.5" cy="1" r="0.4" fill="#F3E5F5" opacity="0.9"/>
      <circle cx="-1" cy="-3" r="0.35" fill="#FFF" opacity="0.85"/>
      <!-- Star-like sparkle shapes -->
      <path d="M 3.5 -2.5 L 3.7 -2.5 M 3.6 -2.7 L 3.6 -2.3" stroke="#FFF" stroke-width="0.3" opacity="0.8"/>
      <path d="M -3.2 -1.8 L -3.4 -1.8 M -3.3 -2 L -3.3 -1.6" stroke="#E1BEE7" stroke-width="0.25" opacity="0.7"/>
    </g>
  `;
}

export function createFireBallSVG(): string {
  return `
    <defs>
      <radialGradient id="fireballCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="20%" style="stop-color:#FFEB3B;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FF9800;stop-opacity:0.95" />
        <stop offset="80%" style="stop-color:#FF5722;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#D84315;stop-opacity:0.6" />
      </radialGradient>
      <radialGradient id="fireGlow">
        <stop offset="0%" style="stop-color:#FFD54F;stop-opacity:0.7" />
        <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.1" />
      </radialGradient>
    </defs>
    <g class="fireball">
      <!-- Intense heat distortion aura -->
      <circle r="7" fill="url(#fireGlow)" opacity="0.6"/>
      <circle r="6.5" fill="#FF5722" opacity="0.25"/>
      <circle r="6" fill="#FF9800" opacity="0.3"/>
      <circle r="5.5" fill="#FFA726" opacity="0.35"/>
      <!-- Flame trails streaming backward -->
      <ellipse cx="-4" cy="0" rx="3" ry="4" fill="#FF6F00" opacity="0.5"/>
      <ellipse cx="-5" cy="0.5" rx="2.5" ry="3.5" fill="#FF5722" opacity="0.4"/>
      <ellipse cx="-3.5" cy="-0.5" rx="2" ry="3" fill="#FF9800" opacity="0.5"/>
      <ellipse cx="3" cy="1.5" rx="2" ry="3" fill="#FF6F00" opacity="0.45"/>
      <ellipse cx="3.5" cy="-1" rx="1.8" ry="2.5" fill="#FF5722" opacity="0.4"/>
      <!-- Flame tongues -->
      <path d="M -6 -1 Q -5.5 -2.5 -5 -2 Q -4.5 -1.5 -4.5 -3" fill="#FF9800" opacity="0.6"/>
      <path d="M -6 1 Q -5.5 2.5 -5 2 Q -4.5 1.5 -4.5 3" fill="#FF5722" opacity="0.6"/>
      <path d="M 4 1 Q 4.5 2 4.2 3" fill="#FFA726" opacity="0.5"/>
      <path d="M 4 -1 Q 4.5 -2 4.2 -3" fill="#FFB74D" opacity="0.5"/>
      <!-- Core fireball -->
      <circle r="4.5" fill="url(#fireballCore)"/>
      <circle r="3.5" fill="#FFEB3B" opacity="0.9"/>
      <circle r="2.5" fill="#FFF" opacity="0.85"/>
      <circle r="1.6" fill="#FFF"/>
      <!-- Inner heat spots -->
      <circle cx="-0.8" cy="0.8" r="1.2" fill="#FF9800" opacity="0.4"/>
      <circle cx="1" cy="-0.5" r="1" fill="#FFA726" opacity="0.3"/>
      <!-- Enhanced ember particles -->
      <circle cx="4" cy="-2.5" r="0.7" fill="#FFD54F" opacity="0.85"/>
      <circle cx="-3.5" cy="3" r="0.8" fill="#FF9800" opacity="0.8"/>
      <circle cx="2.5" cy="3.5" r="0.6" fill="#FFEB3B" opacity="0.9"/>
      <circle cx="-2.5" cy="-3" r="0.7" fill="#FF5722" opacity="0.75"/>
      <circle cx="-5.5" cy="-1.5" r="0.5" fill="#FFA726" opacity="0.7"/>
      <circle cx="4.5" cy="2" r="0.5" fill="#FFD54F" opacity="0.8"/>
      <!-- Small ember trails -->
      <circle cx="-6.5" cy="0.5" r="0.35" fill="#FF5722" opacity="0.65"/>
      <circle cx="5" cy="-1" r="0.35" fill="#FFB74D" opacity="0.7"/>
      <circle cx="-4" cy="-3.5" r="0.3" fill="#FF6F00" opacity="0.6"/>
    </g>
  `;
}

export function createPlasmaBoltSVG(): string {
  return `
    <defs>
      <radialGradient id="plasmaCore">
        <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#80DEEA;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#00BCD4;stop-opacity:0.95" />
        <stop offset="85%" style="stop-color:#0097A7;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#006064;stop-opacity:0.6" />
      </radialGradient>
      <radialGradient id="plasmaGlow">
        <stop offset="0%" style="stop-color:#B2EBF2;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#00BCD4;stop-opacity:0.1" />
      </radialGradient>
    </defs>
    <g class="plasma-bolt">
      <!-- Electric field distortion -->
      <circle r="7" fill="url(#plasmaGlow)"/>
      <circle r="6.5" fill="#00E5FF" opacity="0.2"/>
      <circle r="6" fill="#00BCD4" opacity="0.25"/>
      <circle r="5.5" fill="#26C6DA" opacity="0.3"/>
      <!-- Complex lightning arcs -->
      <path d="M -5 -0.5 Q -4 -2.5 -2.5 -2 Q -1 -1.5 0 -2.5 Q 1 -3 2 -1.5 Q 3 0 4 -1" stroke="#80DEEA" stroke-width="0.9" fill="none" opacity="0.8"/>
      <path d="M -5 0.5 Q -4 2.5 -2.5 2 Q -1 1.5 0 2.5 Q 1 3 2 1.5 Q 3 0 4 1" stroke="#80DEEA" stroke-width="0.9" fill="none" opacity="0.8"/>
      <path d="M 5 1.5 Q 3.5 2 2.5 0.5 Q 1.5 -0.5 1 1" stroke="#B2EBF2" stroke-width="0.7" fill="none" opacity="0.7"/>
      <path d="M -4.5 -1 Q -3 -0.5 -1.5 -1.5 Q 0 -2 1 -0.5" stroke="#B2EBF2" stroke-width="0.7" fill="none" opacity="0.7"/>
      <path d="M -5.5 1 Q -4.5 0 -3 0.8" stroke="#80DEEA" stroke-width="0.6" fill="none" opacity="0.6"/>
      <path d="M 4.5 -0.5 Q 3.5 -1.5 2 -1" stroke="#B2EBF2" stroke-width="0.6" fill="none" opacity="0.6"/>
      <!-- Energy crackling forks -->
      <path d="M -3 -2 L -2.5 -3 L -2 -2.5" stroke="#00E5FF" stroke-width="0.5" fill="none" opacity="0.7"/>
      <path d="M 3 2 L 3.5 3 L 4 2.5" stroke="#00E5FF" stroke-width="0.5" fill="none" opacity="0.7"/>
      <path d="M -4 1.5 L -4.5 2.5 L -4 2.8" stroke="#80DEEA" stroke-width="0.4" fill="none" opacity="0.6"/>
      <!-- Core plasma ball -->
      <circle r="4.2" fill="url(#plasmaCore)"/>
      <circle r="3.2" fill="#80DEEA"/>
      <circle r="2.3" fill="#B2EBF2"/>
      <circle r="1.6" fill="#FFF" opacity="0.95"/>
      <!-- Energy pulses -->
      <circle cx="-1" cy="1" r="1.2" fill="#00BCD4" opacity="0.4"/>
      <circle cx="0.8" cy="-0.8" r="1" fill="#26C6DA" opacity="0.3"/>
      <!-- Enhanced electric particles with glow -->
      <circle cx="3.5" cy="-3" r="0.7" fill="#00E5FF" opacity="0.95"/>
      <circle cx="3.5" cy="-3" r="1.2" fill="#00E5FF" opacity="0.3"/>
      <circle cx="-4" cy="2" r="0.8" fill="#80DEEA" opacity="0.9"/>
      <circle cx="-4" cy="2" r="1.3" fill="#80DEEA" opacity="0.25"/>
      <circle cx="3" cy="3.5" r="0.6" fill="#FFF" opacity="0.95"/>
      <circle cx="3" cy="3.5" r="1" fill="#B2EBF2" opacity="0.3"/>
      <circle cx="-2.5" cy="-3.5" r="0.7" fill="#00BCD4" opacity="0.85"/>
      <circle cx="-2.5" cy="-3.5" r="1.2" fill="#00BCD4" opacity="0.2"/>
      <!-- Smaller sparkles -->
      <circle cx="4.5" cy="1" r="0.4" fill="#00E5FF" opacity="0.9"/>
      <circle cx="-5" cy="-1.5" r="0.4" fill="#80DEEA" opacity="0.85"/>
      <circle cx="2" cy="-4" r="0.35" fill="#B2EBF2" opacity="0.8"/>
      <circle cx="-3" cy="4" r="0.35" fill="#00E5FF" opacity="0.8"/>
      <!-- Energy burst lines -->
      <line x1="-4.5" y1="-2" x2="-5.5" y2="-2.5" stroke="#80DEEA" stroke-width="0.4" opacity="0.6"/>
      <line x1="4" y1="2.5" x2="5" y2="3" stroke="#00E5FF" stroke-width="0.4" opacity="0.7"/>
    </g>
  `;
}
