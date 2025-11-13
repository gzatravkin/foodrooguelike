/**
 * MapPlayerManager - Handles player position, movement, and proximity detection
 */

import { InputManager } from '../core/InputManager';
import { MapLocation } from './MapLocationManager';

export class MapPlayerManager {
  private x: number;
  private y: number;
  private angle: number = 0;
  private readonly speed: number = 200; // pixels per second
  private readonly radius: number = 16;
  private readonly mapWidth: number = 1600;
  private readonly mapHeight: number = 1200;

  constructor(initialX: number, initialY: number) {
    this.x = initialX;
    this.y = initialY;
  }

  update(deltaTime: number, input: InputManager): void {
    // Get movement from keyboard or virtual joystick (mobile)
    const movement = input.getMovementVector();
    const dx = movement.x;
    const dy = movement.y;

    // Update player angle for visual
    if (dx !== 0 || dy !== 0) {
      this.angle = Math.atan2(dy, dx);
    }

    // Move player
    const newX = this.x + dx * this.speed * deltaTime;
    const newY = this.y + dy * this.speed * deltaTime;

    // Keep player within map bounds
    this.x = Math.max(100, Math.min(this.mapWidth - 100, newX));
    this.y = Math.max(100, Math.min(this.mapHeight - 100, newY));
  }

  findNearbyLocation(locations: MapLocation[]): MapLocation | null {
    for (const location of locations) {
      const dx = this.x - location.x;
      const dy = this.y - location.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if player is close enough to interact
      if (distance < location.radius + this.radius + 20) {
        return location;
      }
    }
    return null;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getAngle(): number {
    return this.angle;
  }

  getRadius(): number {
    return this.radius;
  }
}
