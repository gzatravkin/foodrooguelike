/**
 * SVG Art Generator - Patron/Client NPC
 * A friendly dining patron character
 */

export function createPatronSVG(): string {
  return `
    <defs>
      <radialGradient id="patronSkin">
        <stop offset="0%" style="stop-color:#ffdbac;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f4c696;stop-opacity:1" />
      </radialGradient>
      <linearGradient id="patronClothes" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#388E3C;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="patron-sprite">
      <!-- Shadow -->
      <ellipse cx="12" cy="27" rx="7" ry="2.5" fill="#000" opacity="0.25"/>

      <!-- Body/Torso (simple robe/dress) -->
      <ellipse cx="12" cy="17" rx="6" ry="8" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.8"/>
      <ellipse cx="11.5" cy="16" rx="4.5" ry="6" fill="#66BB6A" opacity="0.3"/>

      <!-- Arms -->
      <ellipse cx="7" cy="16" rx="1.8" ry="5.5" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.7"/>
      <ellipse cx="17" cy="16" rx="1.8" ry="5.5" fill="url(#patronClothes)" stroke="#2E7D32" stroke-width="0.7"/>

      <!-- Hands (holding utensils) -->
      <circle cx="7" cy="20" r="1.8" fill="#ffdbac"/>
      <circle cx="17" cy="20" r="1.8" fill="#ffdbac"/>
      <circle cx="7.2" cy="19.8" r="1.5" fill="url(#patronSkin)"/>
      <circle cx="16.8" cy="19.8" r="1.5" fill="url(#patronSkin)"/>

      <!-- Fork (left hand) -->
      <line x1="6" y1="20" x2="5" y2="23" stroke="#C0C0C0" stroke-width="0.6"/>
      <line x1="4.5" y1="23" x2="4.5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>
      <line x1="5" y1="23" x2="5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>
      <line x1="5.5" y1="23" x2="5.5" y2="24" stroke="#C0C0C0" stroke-width="0.5"/>

      <!-- Knife (right hand) -->
      <line x1="18" y1="20" x2="19" y2="23" stroke="#C0C0C0" stroke-width="0.6"/>
      <path d="M 18.5 23 L 19.5 24 L 19 23.5 Z" fill="#D0D0D0"/>

      <!-- Neck -->
      <rect x="10.5" y="8.5" width="3" height="2.5" fill="#ffdbac" rx="0.5"/>

      <!-- Head -->
      <circle cx="12" cy="7" r="4.5" fill="url(#patronSkin)" stroke="#e0a374" stroke-width="0.6"/>
      <ellipse cx="11.5" cy="6.5" rx="3.5" ry="3.8" fill="#ffdbac" opacity="0.5"/>

      <!-- Hair (brown) -->
      <ellipse cx="12" cy="4" rx="4.8" ry="2.8" fill="#8B4513"/>
      <ellipse cx="11.8" cy="4" rx="4.2" ry="2.2" fill="#A0522D" opacity="0.6"/>
      <path d="M 7.5 5 Q 8 7 9 8" fill="#8B4513"/>
      <path d="M 16.5 5 Q 16 7 15 8" fill="#8B4513"/>

      <!-- Eyes -->
      <circle cx="10" cy="7" r="1.2" fill="#000"/>
      <circle cx="14" cy="7" r="1.2" fill="#000"/>
      <circle cx="10.3" cy="6.7" r="0.5" fill="#FFF"/>
      <circle cx="14.3" cy="6.7" r="0.5" fill="#FFF"/>

      <!-- Nose -->
      <ellipse cx="12" cy="8" rx="0.6" ry="1" fill="#e0a374" opacity="0.6"/>

      <!-- Smile -->
      <path d="M 10 9 Q 12 10 14 9" stroke="#8B4513" stroke-width="0.8" fill="none" stroke-linecap="round"/>

      <!-- Buttons on clothes -->
      <circle cx="12" cy="14" r="0.6" fill="#2E7D32"/>
      <circle cx="12" cy="16" r="0.6" fill="#2E7D32"/>
      <circle cx="12" cy="18" r="0.6" fill="#2E7D32"/>
    </g>
  `;
}
