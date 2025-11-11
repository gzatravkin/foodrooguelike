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

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'SETTINGS', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Settings panel
        const panelY = 120;
        this.volumeControl.render(vb.width / 2 - 300, panelY);
        this.animationToggle.render(vb.width / 2 - 300, panelY + 120);
        this.soundToggle.render(vb.width / 2 - 300, panelY + 220);
        this.resetButton.render(vb.width / 2 - 150, panelY + 340);

        // ESC instruction
        const escText = this.renderer.createText(
            vb.width / 2,
            vb.height - 60,
            'Press ESC to close',
            18,
            '#AAA'
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
