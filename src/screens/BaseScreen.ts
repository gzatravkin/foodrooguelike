/**
 * BaseScreen - Main hub where players manage their restaurant
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';

export class BaseScreen extends Screen {
    private buttons: Array<{ element: SVGElement; action: () => void }> = [];

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();
        this.buttons = [];

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'BASE CAMP', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Player stats
        this.renderStats(50, 120);

        // Navigation buttons
        this.createNavButton(vb.width / 2 - 150, 400, 250, 60, 'COOKING', () => {
            gameState.setScreen('cooking');
        });

        this.createNavButton(vb.width / 2 + 150, 400, 250, 60, 'SHOP', () => {
            gameState.setScreen('shop');
        });

        // Restaurant info
        this.renderRestaurantInfo(50, 600);

        // Settings button
        this.createNavButton(vb.width - 180, vb.height - 80, 150, 50, 'SETTINGS', () => {
            gameState.setScreen('settings');
        });
    }

    private renderStats(x: number, y: number): void {
        const state = gameState.getState();

        const statsGroup = this.renderer.createGroup();

        // Background
        const bg = this.renderer.createRect(x, y, 900, 150, '#2a2a2a');
        bg.setAttribute('rx', '10');
        statsGroup.appendChild(bg);

        // Stats text
        const texts = [
            `Health: ${state.player.health}/${state.player.maxHealth}`,
            `Attack: ${state.player.attack}`,
            `Defense: ${state.player.defense}`,
            `Gold: ${state.gold}`
        ];

        texts.forEach((text, i) => {
            const t = this.renderer.createText(x + 30 + (i * 220), y + 50, text, 20);
            statsGroup.appendChild(t);
        });

        this.renderer.append(statsGroup);
    }

    private renderRestaurantInfo(x: number, y: number): void {
        const state = gameState.getState();

        const info = this.renderer.createText(
            x,
            y,
            `Discovered Recipes: ${state.discoveredRecipes.length}`,
            18,
            '#aaa'
        );

        this.renderer.append(info);
    }

    private createNavButton(x: number, y: number, w: number, h: number, label: string, action: () => void): void {
        const btn = this.renderer.createButton(x, y, w, h, label, action);
        this.buttons.push({ element: btn, action });
        this.renderer.append(btn);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Input handled by button event listeners
    }

    cleanup(): void {
        this.buttons = [];
    }
}
