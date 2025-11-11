/**
 * MapInteractionManager - Handles location interactions, unlocking, and expedition starting
 */

import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { MapLocation, MapLocationManager } from './MapLocationManager';
import expeditionsData from '../data/expeditions.json';

export class MapInteractionManager {
  private locationManager: MapLocationManager | null = null;

  setLocationManager(manager: MapLocationManager): void {
    this.locationManager = manager;
  }
  private messageText: string = '';
  private messageTimer: number = 0;
  private readonly messageDuration: number = 3000; // 3 seconds
  private interactionCooldown: number = 0;
  private readonly interactionCooldownTime: number = 500; // 500ms between interactions

  update(deltaTime: number): void {
    // Update message timer
    if (this.messageTimer > 0) {
      this.messageTimer -= deltaTime * 1000;
      if (this.messageTimer <= 0) {
        this.messageText = '';
      }
    }

    // Update interaction cooldown
    if (this.interactionCooldown > 0) {
      this.interactionCooldown -= deltaTime * 1000;
    }
  }

  canInteract(): boolean {
    return this.interactionCooldown <= 0;
  }

  resetCooldown(): void {
    this.interactionCooldown = this.interactionCooldownTime;
  }

  showMessage(msg: string): void {
    this.messageText = msg;
    this.messageTimer = this.messageDuration;
  }

  getMessage(): string {
    return this.messageText;
  }

  interactWithLocation(location: MapLocation, onSave: () => void): void {
    if (!location.isUnlocked) {
      // Check if location can be unlocked (level requirements)
      if (this.locationManager) {
        const unlockCheck = this.locationManager.canUnlockLocation(location);
        if (!unlockCheck.canUnlock) {
          this.showMessage(unlockCheck.reason || 'Cannot unlock this location yet.');
          return;
        }
      }

      // Try to unlock with gold
      const currentGold = gameState.getState().gold;
      if (currentGold >= location.unlockCost) {
        const requirementText = this.locationManager?.getUnlockRequirementText(location) || `${location.unlockCost} gold`;
        if (confirm(`Unlock ${location.name}?\nRequires: ${requirementText}`)) {
          gameState.spendGold(location.unlockCost);
          location.isUnlocked = true;
          onSave();
          eventBus.emit('location:unlocked', location.name);
          this.showMessage(`${location.name} unlocked!`);
        }
      } else {
        this.showMessage(`Not enough gold! Need ${location.unlockCost} gold to unlock ${location.name}.`);
      }
    } else {
      // Start expedition
      this.startExpedition(location.expeditionId);
    }
  }

  private startExpedition(expeditionId: string): void {
    const expedition = expeditionsData[expeditionId as keyof typeof expeditionsData];

    if (expedition) {
      // Check if player has enough gold for expedition cost
      const currentGold = gameState.getState().gold;
      if (currentGold >= expedition.cost) {
        // Store expedition data and switch to expedition selection screen
        // (which will show food buffs, then start the expedition)
        localStorage.setItem('preselectedExpedition', JSON.stringify(expedition));
        gameState.setScreen('expedition');
      } else {
        this.showMessage(`Not enough gold! This expedition costs ${expedition.cost} gold.`);
      }
    } else {
      console.error('Expedition not found:', expeditionId);
      this.showMessage('Expedition not found. Please try again.');
    }
  }
}
