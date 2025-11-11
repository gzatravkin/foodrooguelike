/**
 * ToggleControl - Reusable toggle button component for settings
 * Handles rendering and interaction for boolean settings
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';

export class ToggleControl {
    private toggleCircle: SVGCircleElement | null = null;

    constructor(
        private renderer: SVGRenderer,
        private label: string,
        private statusId: string,
        private getValue: () => boolean,
        private setValue: (value: boolean) => void,
        private onToggle: () => void
    ) {}

    render(x: number, y: number): void {
        const group = this.renderer.createGroup();
        const enabled = this.getValue();

        // Label
        const label = this.renderer.createText(x, y + 30, this.label, 24);
        group.appendChild(label);

        // Toggle button background
        const toggleBg = this.renderer.createRect(x + 400, y + 10, 80, 40, '#555');
        toggleBg.setAttribute('rx', '20');
        toggleBg.setAttribute('cursor', 'pointer');
        group.appendChild(toggleBg);

        // Toggle button slider
        this.toggleCircle = this.renderer.createCircle(
            x + 400 + (enabled ? 60 : 20),
            y + 30,
            15,
            enabled ? '#4CAF50' : '#888'
        );
        this.toggleCircle.setAttribute('cursor', 'pointer');
        group.appendChild(this.toggleCircle);

        // Status text
        const statusText = this.renderer.createText(x + 500, y + 30, enabled ? 'ON' : 'OFF', 20, enabled ? '#4CAF50' : '#888');
        statusText.setAttribute('id', this.statusId);
        group.appendChild(statusText);

        // Click handler
        const toggle = () => {
            const newState = !this.getValue();
            this.setValue(newState);
            this.onToggle();
        };

        toggleBg.addEventListener('click', toggle);
        if (this.toggleCircle) {
            this.toggleCircle.addEventListener('click', toggle);
        }

        this.renderer.append(group);
    }

    cleanup(): void {
        this.toggleCircle = null;
    }
}
