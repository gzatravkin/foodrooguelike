/**
 * Renderer for the expedition list panel
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import type { ExpeditionLocation } from './expeditionTypes';
import { getExpeditionCost } from './expeditionUtils';

export class ExpeditionListRenderer {
    constructor(
        private renderer: SVGRenderer,
        private expeditions: Record<string, ExpeditionLocation>,
        private gold: number
    ) {}

    render(
        x: number,
        y: number,
        selectedExpedition: string | null,
        onSelect: (expeditionId: string) => void
    ): void {
        const listTitle = this.renderer.createText(x, y - 10, 'Available Expeditions:', 18, '#FFF');
        listTitle.setAttribute('font-weight', 'bold');
        this.renderer.append(listTitle);

        const expeditions = Object.values(this.expeditions);
        expeditions.forEach((expedition, index) => {
            this.renderExpeditionItem(
                expedition,
                x,
                y + 20 + index * 90,
                selectedExpedition === expedition.id,
                onSelect
            );
        });
    }

    private renderExpeditionItem(
        expedition: ExpeditionLocation,
        x: number,
        yPos: number,
        isSelected: boolean,
        onSelect: (expeditionId: string) => void
    ): void {
        const cost = getExpeditionCost(expedition);
        const canAfford = this.gold >= cost;

        // Background
        const bgColor = isSelected ? '#3a3a3a' : '#2a2a2a';
        const bg = this.renderer.createRect(x, yPos, 400, 80, bgColor);
        bg.setAttribute('rx', '8');
        bg.setAttribute('stroke', isSelected ? '#FFD700' : canAfford ? '#4CAF50' : '#555');
        bg.setAttribute('stroke-width', isSelected ? '3' : '2');

        if (canAfford && !isSelected) {
            bg.style.cursor = 'pointer';
            bg.addEventListener('click', () => {
                onSelect(expedition.id);
            });
        }

        this.renderer.append(bg);

        // Expedition name
        const nameColor = canAfford ? '#FFF' : '#888';
        const nameText = this.renderer.createText(x + 15, yPos + 25, expedition.name, 18, nameColor);
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Difficulty stars
        const difficultyText = this.renderer.createText(
            x + 15,
            yPos + 48,
            `${'★'.repeat(expedition.difficulty)}${'☆'.repeat(7 - expedition.difficulty)}`,
            14,
            '#FFD700'
        );
        this.renderer.append(difficultyText);

        // Cost
        const costColor = canAfford ? '#4CAF50' : '#F44336';
        const costText = this.renderer.createText(x + 320, yPos + 40, `${cost}g`, 20, costColor);
        costText.setAttribute('font-weight', 'bold');
        this.renderer.append(costText);

        // Lock icon if can't afford
        if (!canAfford) {
            const lockText = this.renderer.createText(x + 365, yPos + 40, '🔒', 20);
            this.renderer.append(lockText);
        }
    }
}
