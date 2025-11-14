/**
 * MapLocationManager - Manages map locations, their unlock states, and persistence
 */

import { gameState } from '../core/GameState';

export interface MapLocation {
  id: string;
  name: string;
  x: number; // World coordinates
  y: number;
  expeditionId: string;
  unlockCost: number;
  isUnlocked: boolean;
  radius: number;
  color: string;
  icon: string;
  requiredPreviousLevel?: number; // Level required in previous expedition to unlock
  previousExpeditionId?: string; // Previous expedition to check
}

export class MapLocationManager {
  private locations: MapLocation[] = [];

  constructor() {
    this.initializeLocations();
    this.loadUnlockedState();
  }

  private initializeLocations(): void {
    // Create map locations based on expeditions
    // Each location requires completing level 1 of the previous expedition
    this.locations = [
      {
        id: 'forest_outskirts',
        name: 'Forest Outskirts',
        x: 400,
        y: 300,
        expeditionId: 'forest_outskirts',
        unlockCost: 0, // Starting location, free
        isUnlocked: true,
        radius: 50,
        color: '#4CAF50',
        icon: '🌲'
      },
      {
        id: 'dark_cave',
        name: 'Dark Cave',
        x: 650,
        y: 250,
        expeditionId: 'dark_cave',
        unlockCost: 50,
        isUnlocked: false,
        radius: 50,
        color: '#5D4037',
        icon: '🕳️',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'forest_outskirts'
      },
      {
        id: 'goblin_camp',
        name: 'Goblin Camp',
        x: 300,
        y: 500,
        expeditionId: 'goblin_camp',
        unlockCost: 100,
        isUnlocked: false,
        radius: 55,
        color: '#8B4513',
        icon: '⛺',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'dark_cave'
      },
      {
        id: 'orc_stronghold',
        name: 'Orc Stronghold',
        x: 850,
        y: 400,
        expeditionId: 'orc_stronghold',
        unlockCost: 200,
        isUnlocked: false,
        radius: 60,
        color: '#424242',
        icon: '🏰',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'goblin_camp'
      },
      {
        id: 'frozen_wasteland',
        name: 'Frozen Wasteland',
        x: 600,
        y: 650,
        expeditionId: 'frozen_wasteland',
        unlockCost: 350,
        isUnlocked: false,
        radius: 60,
        color: '#81D4FA',
        icon: '❄️',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'orc_stronghold'
      },
      {
        id: 'volcano_depths',
        name: 'Volcano Depths',
        x: 1100,
        y: 500,
        expeditionId: 'volcano_depths',
        unlockCost: 500,
        isUnlocked: false,
        radius: 65,
        color: '#FF5722',
        icon: '🌋',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'frozen_wasteland'
      },
      {
        id: 'demon_realm',
        name: 'Demon Realm',
        x: 950,
        y: 800,
        expeditionId: 'demon_realm',
        unlockCost: 800,
        isUnlocked: false,
        radius: 70,
        color: '#9C27B0',
        icon: '👹',
        requiredPreviousLevel: 1,
        previousExpeditionId: 'volcano_depths'
      }
    ];
  }

  private loadUnlockedState(): void {
    const saved = localStorage.getItem('unlockedLocations');
    if (saved) {
      const unlocked = JSON.parse(saved) as string[];
      unlocked.forEach(id => {
        const location = this.locations.find(loc => loc.id === id);
        if (location) {
          location.isUnlocked = true;
        }
      });
    }
  }

  saveUnlockedState(): void {
    const unlocked = this.locations
      .filter(loc => loc.isUnlocked)
      .map(loc => loc.id);
    localStorage.setItem('unlockedLocations', JSON.stringify(unlocked));
  }

  getLocations(): MapLocation[] {
    return this.locations;
  }

  findLocationById(id: string): MapLocation | undefined {
    return this.locations.find(loc => loc.id === id);
  }

  canUnlockLocation(location: MapLocation): { canUnlock: boolean; reason?: string } {
    // Already unlocked
    if (location.isUnlocked) {
      return { canUnlock: true };
    }

    // Check if previous expedition level requirement is met
    if (location.requiredPreviousLevel && location.previousExpeditionId) {
      const previousProgress = gameState.getExpeditionProgress(location.previousExpeditionId);

      if (previousProgress.highestLevelCompleted < location.requiredPreviousLevel) {
        return {
          canUnlock: false,
          reason: `Complete level ${location.requiredPreviousLevel} of the previous location first`
        };
      }
    }

    return { canUnlock: true };
  }

  getUnlockRequirementText(location: MapLocation): string {
    if (location.isUnlocked) {
      return 'Unlocked';
    }

    const parts: string[] = [];

    if (location.unlockCost > 0) {
      parts.push(`${location.unlockCost} gold`);
    }

    if (location.requiredPreviousLevel && location.previousExpeditionId) {
      const prevLocation = this.locations.find(loc => loc.expeditionId === location.previousExpeditionId);
      if (prevLocation) {
        parts.push(`Level ${location.requiredPreviousLevel} in ${prevLocation.name}`);
      }
    }

    return parts.join(' + ');
  }
}
