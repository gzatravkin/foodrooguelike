/**
 * VolumeControl - Volume slider component for settings screen
 * Handles rendering and interaction for volume adjustment
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import { settingsManager } from '../../core/SettingsManager';

export class VolumeControl {
    private sliderHandle: SVGElement | null = null;
    private volumeText: SVGTextElement | null = null;

    constructor(private renderer: SVGRenderer) {}

    render(x: number, y: number): void {
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

        this.setupDragHandlers(trackX, trackWidth, trackY, trackHeight);

        group.appendChild(this.sliderHandle);
        this.renderer.append(group);
    }

    private setupDragHandlers(trackX: number, trackWidth: number, trackY: number, trackHeight: number): void {
        if (!this.sliderHandle) return;

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
            this.updateUI(volume, trackX, trackWidth, trackY, trackHeight);
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
    }

    private updateUI(volume: number, trackX: number, trackWidth: number, trackY: number, trackHeight: number): void {
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

    cleanup(): void {
        this.sliderHandle = null;
        this.volumeText = null;
    }
}
