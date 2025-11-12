/**
 * SettingsScreen - Game settings interface
 * Provides volume controls, animation toggles, and game reset
 */

import { Screen } from '../rendering/Screen';
import { settingsManager } from '../core/SettingsManager';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import { VolumeControl } from './components/VolumeControl';
import { ToggleControl } from './components/ToggleControl';
import { ResetButton } from './components/ResetButton';
import { SettingsKeyboardHandler } from './components/SettingsKeyboardHandler';

export class SettingsScreen extends Screen {
    private volumeControl: VolumeControl;
    private animationToggle: ToggleControl;
    private soundToggle: ToggleControl;
    private resetButton: ResetButton;
    private keyboardHandler: SettingsKeyboardHandler;

    constructor(renderer: SVGRenderer) {
        super(renderer);

        this.volumeControl = new VolumeControl(renderer);
        this.animationToggle = new ToggleControl(
            renderer,
            'Enable Animations',
            'anim-status',
            () => settingsManager.areAnimationsEnabled(),
            (value) => settingsManager.setAnimationsEnabled(value),
            () => this.render()
        );
        this.soundToggle = new ToggleControl(
            renderer,
            'Enable Sound',
            'sound-status',
            () => settingsManager.isSoundEnabled(),
            (value) => settingsManager.setSoundEnabled(value),
            () => this.render()
        );
        this.resetButton = new ResetButton(renderer, () => this.render());
        this.keyboardHandler = new SettingsKeyboardHandler();

        this.keyboardHandler.setup();
    }

    render(): void {
        this.renderer.clear();
        const vb = this.renderer.getViewBox();

        // Semi-transparent dark background overlay
        const bgOverlay = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(10, 15, 30, 0.95)');
        this.renderer.append(bgOverlay);

        // Title with shadow effect
        const titleShadow = this.renderer.createText(vb.width / 2 + 2, 62, '⚙️ SETTINGS', 38, 'rgba(255, 215, 0, 0.3)');
        titleShadow.setAttribute('text-anchor', 'middle');
        titleShadow.setAttribute('font-weight', 'bold');
        this.renderer.append(titleShadow);

        const title = this.renderer.createText(vb.width / 2, 60, '⚙️ SETTINGS', 38, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Main settings panel with background
        const panelY = 140;
        const panelWidth = 700;
        const panelHeight = 500;
        const panelX = vb.width / 2 - panelWidth / 2;

        // Panel shadow
        const panelShadow = this.renderer.createRect(panelX + 4, panelY + 4, panelWidth, panelHeight, 'rgba(0, 0, 0, 0.5)');
        panelShadow.setAttribute('rx', '15');
        this.renderer.append(panelShadow);

        // Panel background
        const panelBg = this.renderer.createRect(panelX, panelY, panelWidth, panelHeight, 'rgba(30, 35, 45, 0.95)');
        panelBg.setAttribute('rx', '15');
        panelBg.setAttribute('stroke', '#4FC3F7');
        panelBg.setAttribute('stroke-width', '2');
        this.renderer.append(panelBg);

        // Settings content
        const contentX = panelX + 50;
        const contentStartY = panelY + 60;
        this.volumeControl.render(contentX, contentStartY);
        this.animationToggle.render(contentX, contentStartY + 130);
        this.soundToggle.render(contentX, contentStartY + 240);
        this.resetButton.render(vb.width / 2 - 150, contentStartY + 360);

        // ESC instruction with better styling
        const escBg = this.renderer.createRect(vb.width / 2 - 120, vb.height - 80, 240, 35, 'rgba(30, 30, 40, 0.8)');
        escBg.setAttribute('rx', '8');
        this.renderer.append(escBg);

        const escText = this.renderer.createText(
            vb.width / 2,
            vb.height - 55,
            '⌨️ Press ESC to close',
            18,
            '#B0BEC5'
        );
        escText.setAttribute('text-anchor', 'middle');
        this.renderer.append(escText);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Input handled by element event listeners
    }

    cleanup(): void {
        this.keyboardHandler.cleanup();
        this.volumeControl.cleanup();
        this.animationToggle.cleanup();
        this.soundToggle.cleanup();
    }
}
