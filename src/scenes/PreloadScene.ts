/**
 * PreloadScene - Handles preloading of all game assets
 */

import Phaser from 'phaser';
import { ENEMY_SVG_MAP } from '../rendering/SVGArt';
import { TilesetGenerator } from '../rendering/TilesetGenerator';
import {
  createPlayerSVG,
  createBulletSVG,
  createMagicBoltSVG,
  createFireBallSVG,
  createPlasmaBoltSVG,
  createCorpseSVG,
} from '../rendering/SVGArt';

export class PreloadScene extends Phaser.Scene {
  private tilesetGenerator: TilesetGenerator;

  constructor() {
    super({ key: 'PreloadScene' });
    this.tilesetGenerator = new TilesetGenerator();
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

    // Load tileset
    this.loadTileset();

    // Preload SVG assets as textures
    this.loadSpriteAssets();
  }

  private loadTileset(): void {
    // Generate tileset from tile plugins
    const tilesetDataURL = this.tilesetGenerator.generateTilesetDataURL();
    this.load.image('tileset', tilesetDataURL);
  }

  private loadSpriteAssets(): void {
    // Player
    this.loadSVGAsTexture('player', createPlayerSVG());

    // All enemies from the enemy SVG map
    Object.entries(ENEMY_SVG_MAP).forEach(([enemyId, svgGenerator]) => {
      this.loadSVGAsTexture(enemyId, svgGenerator());
    });

    // Projectiles
    this.loadSVGAsTexture('bullet', createBulletSVG());
    this.loadSVGAsTexture('magic_bolt', createMagicBoltSVG());
    this.loadSVGAsTexture('fireball', createFireBallSVG());
    this.loadSVGAsTexture('plasma_bolt', createPlasmaBoltSVG());

    // Environment
    this.loadSVGAsTexture('corpse', createCorpseSVG('default'));
  }

  private loadSVGAsTexture(key: string, svg: string): void {
    // Convert SVG string to base64 data URL
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    this.load.image(key, dataUrl);
  }

  create(): void {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}
