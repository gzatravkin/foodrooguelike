/**
 * MapCameraManager - Handles camera positioning and smooth following behavior
 */

interface Camera {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  smoothing: number; // 0-1, lower = smoother
}

export class MapCameraManager {
  private camera: Camera;

  constructor(initialX: number, initialY: number) {
    this.camera = {
      x: initialX,
      y: initialY,
      targetX: initialX,
      targetY: initialY,
      smoothing: 0.1
    };
  }

  update(deltaTime: number): void {
    // Smooth camera following
    this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
    this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
  }

  setTarget(x: number, y: number): void {
    this.camera.targetX = x;
    this.camera.targetY = y;
  }

  getX(): number {
    return this.camera.x;
  }

  getY(): number {
    return this.camera.y;
  }

  getOffsetX(screenWidth: number): number {
    return screenWidth / 2 - this.camera.x;
  }

  getOffsetY(screenHeight: number): number {
    return screenHeight / 2 - this.camera.y;
  }
}
