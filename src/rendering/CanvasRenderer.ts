/**
 * CanvasRenderer - Handles 2D canvas rendering
 */

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera = { x: 0, y: 0 };
  private svgImageCache: Map<string, HTMLImageElement> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    this.setupCanvas();
  }

  private setupCanvas(): void {
    // Set canvas to fill window
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  setCamera(x: number, y: number): void {
    this.camera.x = x;
    this.camera.y = y;
  }

  getCamera(): { x: number; y: number } {
    return { ...this.camera };
  }

  clear(): void {
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw a tile (simple colored rectangle for now)
  drawTile(x: number, y: number, size: number, color: string): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenX, screenY, size, size);
  }

  // Draw a tile with border
  drawTileWithBorder(x: number, y: number, size: number, fillColor: string, borderColor: string = '#000'): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(screenX, screenY, size, size);

    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(screenX, screenY, size, size);
  }

  // Draw a circle (for player/enemies)
  drawCircle(x: number, y: number, radius: number, color: string): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Draw a circle with border
  drawCircleWithBorder(x: number, y: number, radius: number, fillColor: string, borderColor: string = '#000', borderWidth: number = 2): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.stroke();
  }

  // Draw text
  drawText(text: string, x: number, y: number, color: string = '#fff', fontSize: number = 16, align: CanvasTextAlign = 'left'): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, screenX, screenY);
  }

  // Draw UI text (not affected by camera)
  drawUIText(text: string, x: number, y: number, color: string = '#fff', fontSize: number = 16, align: CanvasTextAlign = 'left'): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }

  // Draw a rectangle
  drawRect(x: number, y: number, width: number, height: number, color: string): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenX, screenY, width, height);
  }

  // Draw a rectangle with border
  drawRectWithBorder(x: number, y: number, width: number, height: number, fillColor: string, borderColor: string = '#000', borderWidth: number = 2): void {
    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(screenX, screenY, width, height);

    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeRect(screenX, screenY, width, height);
  }

  // Draw UI rectangle (not affected by camera)
  drawUIRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  // Draw UI rectangle with border
  drawUIRectWithBorder(x: number, y: number, width: number, height: number, fillColor: string, borderColor: string = '#000', borderWidth: number = 2): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y, width, height);

    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  // Draw a line
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number = 1): void {
    const screenX1 = x1 - this.camera.x;
    const screenY1 = y1 - this.camera.y;
    const screenX2 = x2 - this.camera.x;
    const screenY2 = y2 - this.camera.y;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(screenX1, screenY1);
    this.ctx.lineTo(screenX2, screenY2);
    this.ctx.stroke();
  }

  // World to screen coordinates
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.camera.x,
      y: worldY - this.camera.y,
    };
  }

  // Screen to world coordinates
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.camera.x,
      y: screenY + this.camera.y,
    };
  }

  // Create an image from SVG string (with caching)
  private createSVGImage(svgString: string, cacheKey: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (this.svgImageCache.has(cacheKey)) {
        resolve(this.svgImageCache.get(cacheKey)!);
        return;
      }

      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        this.svgImageCache.set(cacheKey, img);
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    });
  }

  // Draw SVG sprite (world coordinates, affected by camera)
  async drawSVG(
    svgString: string,
    cacheKey: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number = 0
  ): Promise<void> {
    try {
      const img = await this.createSVGImage(svgString, cacheKey);

      const screenX = x - this.camera.x;
      const screenY = y - this.camera.y;

      this.ctx.save();
      this.ctx.translate(screenX, screenY);
      this.ctx.rotate(rotation);
      this.ctx.drawImage(img, -width / 2, -height / 2, width, height);
      this.ctx.restore();
    } catch (error) {
      console.error('Error drawing SVG:', error);
    }
  }

  // Synchronous version - assumes SVG is already cached
  drawCachedSVG(
    cacheKey: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number = 0
  ): void {
    const img = this.svgImageCache.get(cacheKey);
    if (!img) return;

    const screenX = x - this.camera.x;
    const screenY = y - this.camera.y;

    this.ctx.save();
    this.ctx.translate(screenX, screenY);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(img, -width / 2, -height / 2, width, height);
    this.ctx.restore();
  }

  // Preload SVG into cache
  async preloadSVG(svgString: string, cacheKey: string): Promise<void> {
    await this.createSVGImage(svgString, cacheKey);
  }
}
