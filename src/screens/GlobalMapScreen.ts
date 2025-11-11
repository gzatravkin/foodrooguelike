/**
 * GlobalMapScreen - Interactive world map where players can explore and select expeditions
 * Features camera following, unlockable locations, and immersive exploration
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { InputManager } from '../core/InputManager';
import { gameState } from '../core/GameState';
import { MapLocationManager, MapLocation } from './MapLocationManager';
import { MapCameraManager } from './MapCameraManager';
import { MapPlayerManager } from './MapPlayerManager';
import { MapInteractionManager } from './MapInteractionManager';
import { MapRenderHelper } from './MapRenderHelper';

export class GlobalMapScreen {
  private renderer: CanvasRenderer;
  private input: InputManager;
  private locationManager: MapLocationManager;
  private cameraManager: MapCameraManager;
  private playerManager: MapPlayerManager;
  private interactionManager: MapInteractionManager;
  private renderHelper: MapRenderHelper;
  private selectedLocation: MapLocation | null = null;

  constructor(renderer: CanvasRenderer, input: InputManager) {
    this.renderer = renderer;
    this.input = input;

    // Initialize managers
    this.locationManager = new MapLocationManager();
    this.playerManager = new MapPlayerManager(400, 300);
    this.cameraManager = new MapCameraManager(
      this.playerManager.getX(),
      this.playerManager.getY()
    );
    this.interactionManager = new MapInteractionManager();
    this.interactionManager.setLocationManager(this.locationManager);
    this.renderHelper = new MapRenderHelper(renderer);
  }

  update(deltaTime: number): void {
    // Update player position
    this.playerManager.update(deltaTime, this.input);

    // Update camera to follow player
    this.cameraManager.setTarget(this.playerManager.getX(), this.playerManager.getY());
    this.cameraManager.update(deltaTime);

    // Check for nearby locations
    this.selectedLocation = this.playerManager.findNearbyLocation(
      this.locationManager.getLocations()
    );

    // Update interaction manager (message timer, cooldown)
    this.interactionManager.update(deltaTime);

    // Handle interaction input
    this.handleInteractionInput();

    // Handle escape key
    if (this.input.isKeyJustPressed('Escape')) {
      gameState.setScreen('game');
    }
  }

  private handleInteractionInput(): void {
    if (this.input.isKeyJustPressed('e') || this.input.isKeyJustPressed(' ')) {
      if (this.selectedLocation && this.interactionManager.canInteract()) {
        this.interactionManager.interactWithLocation(
          this.selectedLocation,
          () => this.locationManager.saveUnlockedState()
        );
        this.interactionManager.resetCooldown();
      }
    }
  }

  render(): void {
    const canvas = this.renderer.getCanvas();
    const offsetX = this.cameraManager.getOffsetX(canvas.width);
    const offsetY = this.cameraManager.getOffsetY(canvas.height);

    this.renderHelper.renderAll(
      offsetX,
      offsetY,
      this.locationManager.getLocations(),
      this.playerManager.getX(),
      this.playerManager.getY(),
      this.playerManager.getAngle(),
      this.playerManager.getRadius(),
      this.selectedLocation,
      this.interactionManager.getMessage()
    );
  }

  destroy(): void {
    // Cleanup if needed
  }
}
