/**
 * InteractionSystem - Centralized system for handling all building interactions
 * Provides consistent interaction behavior with cooldowns to prevent multiple triggers
 */

import { Player } from '../entities/Player';
import { MapSystem, TileType } from './MapSystem';
import { BuildingRegistry } from '../plugins/BuildingRegistry';
import { TileTypeMapper } from '../plugins/TileTypeMapper';
import { TileRegistry } from '../plugins/tiles/TileRegistry';
import { gameState } from '../core/GameState';

export class InteractionSystem {
    private lastInteractionTime: number = 0;
    private readonly INTERACTION_COOLDOWN: number = 300; // 300ms cooldown to prevent double-triggers

    /**
     * Handle interaction with the world (E key press)
     * Returns true if an interaction was handled
     */
    handleInteraction(
        player: Player,
        mapSystem: MapSystem,
        mode: 'base' | 'expedition',
        onLog?: (text: string, color: string) => void
    ): boolean {
        // Check cooldown
        const now = Date.now();
        if (now - this.lastInteractionTime < this.INTERACTION_COOLDOWN) {
            return false;
        }

        const tileType = mapSystem.getTileAt(player.x, player.y);
        if (!tileType) {
            return false;
        }

        let handled = false;

        // BASE MODE - Buildings and special tiles
        if (mode === 'base') {
            handled = this.handleBaseCampInteraction(tileType, onLog);
        }
        // EXPEDITION MODE - Interactive tiles and stairs
        else if (mode === 'expedition') {
            handled = this.handleExpeditionInteraction(player, mapSystem, tileType, onLog);
        }

        // Update cooldown if interaction was handled
        if (handled) {
            this.lastInteractionTime = now;
        }

        return handled;
    }

    /**
     * Handle base camp interactions (buildings and tiles)
     */
    private handleBaseCampInteraction(
        tileType: TileType,
        onLog?: (text: string, color: string) => void
    ): boolean {
        // Get tile/building ID from tile type
        const tileId = TileTypeMapper.getTileIdFromType(tileType);
        if (!tileId) {
            return false;
        }

        // First, check if it's a building
        const building = BuildingRegistry.getBuilding(tileId);
        if (building) {
            // If building has a screen, open it
            if (building.screen) {
                gameState.setScreen(building.screen.id as any);
                return true;
            }

            // If building has custom interaction, execute it
            if (building.interaction.onInteract) {
                // Note: This path is for buildings without screens but with custom interactions
                // Currently all buildings have screens, but this supports future custom interactions
                return false;
            }
        }

        // If not a building, check if it's an interactive tile
        const tilePlugin = TileRegistry.getTileById(tileId);
        if (tilePlugin?.interaction?.canInteract) {
            // Check if we can interact with this tile
            // For base camp, we don't have specific tile coordinates, so we use basic check
            if (tilePlugin.interaction.canInteract(
                {} as any, // player (not used in basic canInteract checks)
                0, 0, // tile coordinates (not used in base camp)
                {} as any // mapSystem (not used in basic canInteract checks)
            )) {
                // Call the tile's interaction
                tilePlugin.interaction.onInteract(
                    {} as any, // player
                    0, 0, // tile coordinates
                    {} as any, // mapSystem
                    onLog || ((text, color) => {})
                );
                return true;
            }
        }

        return false;
    }

    /**
     * Handle expedition interactions (tiles, stairs, etc.)
     */
    private handleExpeditionInteraction(
        player: Player,
        mapSystem: MapSystem,
        tileType: TileType,
        onLog?: (text: string, color: string) => void
    ): boolean {
        // Special case for stairs on exact tile
        if (tileType === TileType.STAIRS_DOWN) {
            // Return to base camp
            if (onLog) {
                onLog('Returning to base camp...', '#90EE90');
            }
            // The actual loadBaseCamp() is called by the caller (GameScreen)
            return true;
        }

        // Check nearby tiles for interactive elements (increased interaction range)
        const map = mapSystem.getCurrentMap();
        if (!map) {
            return false;
        }

        const playerTileX = Math.floor(player.x / map.tileSize);
        const playerTileY = Math.floor(player.y / map.tileSize);
        const interactionRadius = 1; // Check 1 tile in each direction

        // Check tiles in a 3x3 grid around the player
        for (let dy = -interactionRadius; dy <= interactionRadius; dy++) {
            for (let dx = -interactionRadius; dx <= interactionRadius; dx++) {
                const checkX = playerTileX + dx;
                const checkY = playerTileY + dy;
                const checkTileType = mapSystem.getTileAt(
                    checkX * map.tileSize + map.tileSize / 2,
                    checkY * map.tileSize + map.tileSize / 2
                );

                if (checkTileType !== null) {
                    const tileId = TileTypeMapper.getTileIdFromType(checkTileType);
                    if (tileId) {
                        const tilePlugin = TileRegistry.getTileById(tileId);
                        if (tilePlugin?.interaction) {
                            if (tilePlugin.interaction.canInteract(player, checkX, checkY, mapSystem)) {
                                tilePlugin.interaction.onInteract(
                                    player,
                                    checkX,
                                    checkY,
                                    mapSystem,
                                    onLog || ((text, color) => {})
                                );
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * Get interaction prompt for current player position
     * Returns null if no interaction available
     */
    getInteractionPrompt(
        player: Player,
        mapSystem: MapSystem,
        mode: 'base' | 'expedition'
    ): string | null {
        const tileType = mapSystem.getTileAt(player.x, player.y);
        if (!tileType) {
            return null;
        }

        // BASE MODE
        if (mode === 'base') {
            const tileId = TileTypeMapper.getTileIdFromType(tileType);
            if (tileId) {
                // First check if it's a building
                const building = BuildingRegistry.getBuilding(tileId);
                if (building?.interaction.prompt) {
                    return building.interaction.prompt;
                }

                // Then check if it's an interactive tile
                const tilePlugin = TileRegistry.getTileById(tileId);
                if (tilePlugin?.interaction) {
                    // Return a generic prompt for tiles (or could be customized per tile)
                    if (tileType === TileType.EXPEDITION_PORTAL) {
                        return 'Press E to view World Map';
                    }
                    return 'Press E to interact';
                }
            }
        }
        // EXPEDITION MODE
        else if (mode === 'expedition') {
            if (tileType === TileType.STAIRS_DOWN) {
                return 'Press E to return to base';
            }

            // Check nearby tiles for interactive elements
            const map = mapSystem.getCurrentMap();
            if (map) {
                const playerTileX = Math.floor(player.x / map.tileSize);
                const playerTileY = Math.floor(player.y / map.tileSize);
                const interactionRadius = 1;

                for (let dy = -interactionRadius; dy <= interactionRadius; dy++) {
                    for (let dx = -interactionRadius; dx <= interactionRadius; dx++) {
                        const checkX = playerTileX + dx;
                        const checkY = playerTileY + dy;
                        const checkTileType = mapSystem.getTileAt(
                            checkX * map.tileSize + map.tileSize / 2,
                            checkY * map.tileSize + map.tileSize / 2
                        );

                        if (checkTileType !== null) {
                            const tileId = TileTypeMapper.getTileIdFromType(checkTileType);
                            if (tileId) {
                                const tilePlugin = TileRegistry.getTileById(tileId);
                                if (tilePlugin?.interaction?.canInteract(player, checkX, checkY, mapSystem)) {
                                    return 'Press E to interact';
                                }
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Reset cooldown (useful for testing or special cases)
     */
    resetCooldown(): void {
        this.lastInteractionTime = 0;
    }

    /**
     * Check if interaction is on cooldown
     */
    isOnCooldown(): boolean {
        return Date.now() - this.lastInteractionTime < this.INTERACTION_COOLDOWN;
    }
}
