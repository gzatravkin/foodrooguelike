/**
 * SVGAssetLoader - Handles preloading of SVG assets
 */
import { CanvasRenderer } from '../rendering/CanvasRenderer';
import * as SVGArt from '../rendering/SVGArt';

export class SVGAssetLoader {
  private svgsLoaded: boolean = false;

  async preloadAssets(canvasRenderer: CanvasRenderer): Promise<void> {
    const wrapSVG = (content: string, viewBox: string = "0 0 24 30") =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`;

    try {
      // Player
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlayerSVG()), 'player');

      // Patron NPC
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPatronSVG()), 'patron');

      // All unique enemy sprites
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'slime');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createGoblinSVG()), 'goblin');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'skeleton');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'orc');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'dragon');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createWolfSVG()), 'wolf');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'rat');

      // Missing enemies - using appropriate sprites
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createRatSVG()), 'bat');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'troll');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSlimeSVG()), 'spider');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createSkeletonSVG()), 'ice_golem');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'fire_elemental');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createOrcSVG()), 'giant_crab');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createDragonSVG()), 'demon_lord');

      // Projectile sprites
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createBulletSVG(), "0 0 6 6"), 'bullet');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createMagicBoltSVG(), "0 0 8 8"), 'magic-bolt');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createFireBallSVG(), "0 0 10 10"), 'fireball');
      await canvasRenderer.preloadSVG(wrapSVG(SVGArt.createPlasmaBoltSVG(), "0 0 10 10"), 'plasma');

      this.svgsLoaded = true;
      console.log('All SVG assets preloaded successfully');
    } catch (error) {
      console.error('Failed to preload SVG assets:', error);
      throw error;
    }
  }

  isLoaded(): boolean {
    return this.svgsLoaded;
  }
}
