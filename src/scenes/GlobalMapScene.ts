/**
 * GlobalMapScene - World map scene using Phaser 3
 */

import Phaser from 'phaser';
import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';

export class GlobalMapScene extends Phaser.Scene {
  private selectedBiome: string | null = null;

  constructor() {
    super({ key: 'GlobalMapScene' });
  }

  create(): void {
    console.log('GlobalMapScene created');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x1a4d2e, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 50, 'World Map', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#FFD700',
    }).setOrigin(0.5);

    // Create biome buttons
    const biomes = [
      { name: 'Forest', color: 0x2d5016, x: 200, y: 200 },
      { name: 'Desert', color: 0xc2b280, x: 400, y: 200 },
      { name: 'Mountains', color: 0x808080, x: 600, y: 200 },
      { name: 'Swamp', color: 0x2f4f2f, x: 200, y: 350 },
      { name: 'Volcano', color: 0x8b0000, x: 400, y: 350 },
      { name: 'Ice', color: 0x87ceeb, x: 600, y: 350 },
    ];

    biomes.forEach((biome) => {
      const circle = this.add.circle(biome.x, biome.y, 50, biome.color);
      circle.setInteractive();
      circle.setStrokeStyle(3, 0xffffff);

      const text = this.add.text(biome.x, biome.y + 70, biome.name, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0.5);

      circle.on('pointerover', () => {
        circle.setScale(1.1);
      });

      circle.on('pointerout', () => {
        circle.setScale(1.0);
      });

      circle.on('pointerdown', () => {
        this.selectedBiome = biome.name.toLowerCase();
        // Store selected biome in expedition state
        gameState.setScreen('expedition');
      });
    });

    // Back button
    const backButton = this.add.text(width / 2, height - 50, 'Back to Base', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerover', () => {
      backButton.setScale(1.1);
    });

    backButton.on('pointerout', () => {
      backButton.setScale(1.0);
    });

    backButton.on('pointerdown', () => {
      gameState.setScreen('restaurant');
    });

    // Listen to screen changes
    eventBus.on('screen:changed', this.handleScreenChange.bind(this));
  }

  private handleScreenChange(screenName: string): void {
    if (screenName !== 'worldmap') {
      this.scene.pause();
    } else {
      this.scene.resume();
    }
  }
}
