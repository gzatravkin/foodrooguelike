/**
 * ResetButton - Danger zone reset game button component
 * Handles rendering and interaction for game reset
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import { gameState } from '../../core/GameState';
import { settingsManager } from '../../core/SettingsManager';

export class ResetButton {
    constructor(private renderer: SVGRenderer, private onReset: () => void) {}

    render(x: number, y: number): void {
        const group = this.renderer.createGroup();

        // Warning text
        const warning = this.renderer.createText(x + 150, y - 20, 'Danger Zone', 18, '#ff5555');
        warning.setAttribute('text-anchor', 'middle');
        group.appendChild(warning);

        // Reset game button
        const resetBtn = this.renderer.createButton(x, y, 300, 60, 'RESET GAME', () => {
            if (confirm('Are you sure you want to reset all game progress? This cannot be undone!')) {
                gameState.reset();
                settingsManager.resetSettings();
                this.onReset();
            }
        });

        // Make it red to indicate danger
        const rect = resetBtn.querySelector('rect');
        if (rect) rect.setAttribute('fill', '#d32f2f');

        group.appendChild(resetBtn);
        this.renderer.append(group);
    }
}
