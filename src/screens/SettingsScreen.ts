/**
 * SettingsScreen - Game settings interface
 * Provides volume controls, animation toggles, and game reset
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { settingsManager } from '../core/SettingsManager';
import type { SVGRenderer } from '../rendering/SVGRenderer';

export class SettingsScreen extends Screen {
    private sliderHandle: SVGElement | null = null;
    private volumeText: SVGTextElement | null = null;
    private animToggleCircle: SVGCircleElement | null = null;
    private soundToggleCircle: SVGCircleElement | null = null;
    private keyListener: ((e: KeyboardEvent) => void) | null = null;

    constructor(renderer: SVGRenderer) {
        super(renderer);
        this.setupKeyboardControls();
    }

    private setupKeyboardControls(): void {
        this.keyListener = (e: KeyboardEvent) => {
            const currentScreen = gameState.getState().currentScreen;
            if (currentScreen !== 'settings') return;

            if (e.key === 'Escape') {
                e.preventDefault();
                // Close settings and return to game
                (gameState as any).state.currentScreen = 'game';
                import('../core/EventBus').then(({ eventBus }) => {
                    eventBus.emit('screen:changed', 'game');
                });
            }
        };

        window.addEventListener('keydown', this.keyListener);
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
        this.renderVolumeControl(vb.width / 2 - 300, panelY);
        this.renderAnimationToggle(vb.width / 2 - 300, panelY + 120);
        this.renderSoundToggle(vb.width / 2 - 300, panelY + 220);
        this.renderResetButton(vb.width / 2 - 150, panelY + 340);

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

    private renderVolumeControl(x: number, y: number): void {
        const group = this.renderer.createGroup();
        const currentVolume = settingsManager.getVolume();

        // Label
        const label = this.renderer.createText(x, y + 30, 'Volume', 24);
        group.appendChild(label);

        // Volume percentage
        this.volumeText = this.renderer.createText(x + 500, y + 30, `${currentVolume}%`, 20, '#aaa');
        group.appendChild(this.volumeText);

        // Slider track
        const trackX = x;
        const trackY = y + 50;
        const trackWidth = 600;
        const trackHeight = 10;

        const track = this.renderer.createRect(trackX, trackY, trackWidth, trackHeight, '#555');
        track.setAttribute('rx', '5');
        group.appendChild(track);

        // Slider fill (shows volume level)
        const fillWidth = (currentVolume / 100) * trackWidth;
        const fill = this.renderer.createRect(trackX, trackY, fillWidth, trackHeight, '#4CAF50');
        fill.setAttribute('rx', '5');
        fill.setAttribute('id', 'volume-fill');
        group.appendChild(fill);

        // Slider handle
        const handleX = trackX + fillWidth;
        this.sliderHandle = this.renderer.createCircle(handleX, trackY + trackHeight / 2, 15, '#4CAF50');
        this.sliderHandle.setAttribute('cursor', 'pointer');
        this.sliderHandle.setAttribute('stroke', '#fff');
        this.sliderHandle.setAttribute('stroke-width', '2');

        // Make handle draggable
        let isDragging = false;

        const updateVolume = (clientX: number) => {
            const svg = (this.sliderHandle as any)?.ownerSVGElement;
            if (!svg) return;

            const pt = svg.createSVGPoint();
            pt.x = clientX;
            const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

            let newX = Math.max(trackX, Math.min(trackX + trackWidth, svgP.x));
            const volume = Math.round(((newX - trackX) / trackWidth) * 100);

            settingsManager.setVolume(volume);
            this.updateVolumeUI(volume, trackX, trackWidth, trackY, trackHeight);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging) updateVolume(e.clientX);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (isDragging && e.touches[0]) {
                e.preventDefault();
                updateVolume(e.touches[0].clientX);
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onTouchEnd = () => {
            isDragging = false;
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        this.sliderHandle.addEventListener('mousedown', () => {
            isDragging = true;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        this.sliderHandle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        });

        group.appendChild(this.sliderHandle);
        this.renderer.append(group);
    }

    private updateVolumeUI(volume: number, trackX: number, trackWidth: number, trackY: number, trackHeight: number): void {
        if (this.volumeText) {
            this.volumeText.textContent = `${volume}%`;
        }

        const fill = document.getElementById('volume-fill');
        if (fill) {
            fill.setAttribute('width', ((volume / 100) * trackWidth).toString());
        }

        if (this.sliderHandle) {
            const handleX = trackX + (volume / 100) * trackWidth;
            this.sliderHandle.setAttribute('cx', handleX.toString());
        }
    }

    private renderAnimationToggle(x: number, y: number): void {
        const group = this.renderer.createGroup();
        const enabled = settingsManager.areAnimationsEnabled();

        // Label
        const label = this.renderer.createText(x, y + 30, 'Enable Animations', 24);
        group.appendChild(label);

        // Toggle button background
        const toggleBg = this.renderer.createRect(x + 400, y + 10, 80, 40, '#555');
        toggleBg.setAttribute('rx', '20');
        toggleBg.setAttribute('cursor', 'pointer');
        group.appendChild(toggleBg);

        // Toggle button slider
        this.animToggleCircle = this.renderer.createCircle(
            x + 400 + (enabled ? 60 : 20),
            y + 30,
            15,
            enabled ? '#4CAF50' : '#888'
        );
        this.animToggleCircle.setAttribute('cursor', 'pointer');
        group.appendChild(this.animToggleCircle);

        // Status text
        const statusText = this.renderer.createText(x + 500, y + 30, enabled ? 'ON' : 'OFF', 20, enabled ? '#4CAF50' : '#888');
        statusText.setAttribute('id', 'anim-status');
        group.appendChild(statusText);

        // Click handler
        const toggle = () => {
            const newState = !settingsManager.areAnimationsEnabled();
            settingsManager.setAnimationsEnabled(newState);
            this.render(); // Re-render to update UI
        };

        toggleBg.addEventListener('click', toggle);
        if (this.animToggleCircle) {
            this.animToggleCircle.addEventListener('click', toggle);
        }

        this.renderer.append(group);
    }

    private renderSoundToggle(x: number, y: number): void {
        const group = this.renderer.createGroup();
        const enabled = settingsManager.isSoundEnabled();

        // Label
        const label = this.renderer.createText(x, y + 30, 'Enable Sound', 24);
        group.appendChild(label);

        // Toggle button background
        const toggleBg = this.renderer.createRect(x + 400, y + 10, 80, 40, '#555');
        toggleBg.setAttribute('rx', '20');
        toggleBg.setAttribute('cursor', 'pointer');
        group.appendChild(toggleBg);

        // Toggle button slider
        this.soundToggleCircle = this.renderer.createCircle(
            x + 400 + (enabled ? 60 : 20),
            y + 30,
            15,
            enabled ? '#4CAF50' : '#888'
        );
        this.soundToggleCircle.setAttribute('cursor', 'pointer');
        group.appendChild(this.soundToggleCircle);

        // Status text
        const statusText = this.renderer.createText(x + 500, y + 30, enabled ? 'ON' : 'OFF', 20, enabled ? '#4CAF50' : '#888');
        statusText.setAttribute('id', 'sound-status');
        group.appendChild(statusText);

        // Click handler
        const toggle = () => {
            const newState = !settingsManager.isSoundEnabled();
            settingsManager.setSoundEnabled(newState);
            this.render(); // Re-render to update UI
        };

        toggleBg.addEventListener('click', toggle);
        if (this.soundToggleCircle) {
            this.soundToggleCircle.addEventListener('click', toggle);
        }

        this.renderer.append(group);
    }

    private renderResetButton(x: number, y: number): void {
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
                this.render();
            }
        });

        // Make it red to indicate danger
        const rect = resetBtn.querySelector('rect');
        if (rect) rect.setAttribute('fill', '#d32f2f');

        group.appendChild(resetBtn);
        this.renderer.append(group);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Input handled by element event listeners
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        this.sliderHandle = null;
        this.volumeText = null;
        this.animToggleCircle = null;
        this.soundToggleCircle = null;
    }
}
