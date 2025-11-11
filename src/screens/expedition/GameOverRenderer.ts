/**
 * Renderer for game over state in expedition selection
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import { gameState } from '../../core/GameState';

export class GameOverRenderer {
    constructor(private renderer: SVGRenderer) {}

    render(cx: number, cy: number): void {
        // Game over background
        const bg = this.renderer.createRect(cx - 300, cy - 150, 600, 300, '#1a1a1a');
        bg.setAttribute('rx', '10');
        bg.setAttribute('stroke', '#F44336');
        bg.setAttribute('stroke-width', '3');
        this.renderer.append(bg);

        // Game over text
        const gameOverText = this.renderer.createText(cx, cy - 80, 'GAME OVER', 48, '#F44336');
        gameOverText.setAttribute('text-anchor', 'middle');
        gameOverText.setAttribute('font-weight', 'bold');
        this.renderer.append(gameOverText);

        // Message
        const msgText = this.renderer.createText(
            cx,
            cy - 20,
            'You don\'t have enough gold for any expedition!',
            18,
            '#FFF'
        );
        msgText.setAttribute('text-anchor', 'middle');
        this.renderer.append(msgText);

        const msg2Text = this.renderer.createText(
            cx,
            cy + 10,
            'Sell dishes or restart the game.',
            18,
            '#AAA'
        );
        msg2Text.setAttribute('text-anchor', 'middle');
        this.renderer.append(msg2Text);

        // Restart button
        const restartBtn = this.renderer.createButton(
            cx - 100,
            cy + 60,
            200,
            50,
            'RESTART GAME',
            () => {
                if (confirm('Are you sure you want to restart? All progress will be lost.')) {
                    gameState.reset();
                    location.reload();
                }
            }
        );
        this.renderer.append(restartBtn);

        // Back to base button
        const backBtn = this.renderer.createButton(
            cx - 100,
            cy + 120,
            200,
            50,
            'BACK TO BASE',
            () => {
                gameState.setScreen('base');
            }
        );
        this.renderer.append(backBtn);
    }
}
