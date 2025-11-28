/**
 * PreloadScene - Handles preloading of all game assets
 */

import Phaser from 'phaser';
import { SVGAssetLoader } from '../screens/SVGAssetLoader';
import { createPlayerSVG, createSlimeSVG, createGoblinSVG, createSkeletonSVG, createBulletSVG, createMagicBoltSVG, createFireBallSVG } from '../rendering/SVGArt';

export class PreloadScene extends Phaser.Scene {
  private svgAssetLoader: SVGAssetLoader;

  constructor() {
    super({ key: 'PreloadScene' });
    this.svgAssetLoader = new SVGAssetLoader();
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5, 0.5);

    // Update loading bar
    this.load.on('progress', (value: number) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x4caf50, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Preload SVG assets as textures
    this.loadSVGAssets();
  }

  private loadSVGAssets(): void {
    // Convert SVG strings to data URIs and load as images
    const svgAssets = [
      { key: 'player', svg: createPlayerSVG() },
      { key: 'slime', svg: createSlimeSVG() },
      { key: 'goblin', svg: createGoblinSVG() },
      { key: 'skeleton', svg: createSkeletonSVG() },
      { key: 'bullet', svg: createBulletSVG() },
      { key: 'arrow', svg: createMagicBoltSVG() },
      { key: 'fireball', svg: createFireBallSVG() },
    ];

    svgAssets.forEach(({ key, svg }) => {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      this.load.image(key, url);
    });
  }

  create(): void {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}
