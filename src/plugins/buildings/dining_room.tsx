/**
 * Dining Room Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { useGold, useDishes } from '../../hooks/useGameState';
import { useMessage } from '../../hooks/useCommon';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import type { Dish } from '../../entities/types';
import { ScreenContainer, ContentWrapper } from '../../components/common/Layout';
import { GoldDisplay, MessageDisplay, SectionTitle } from '../../components/common/Display';
import { CloseButton, ActionButton } from '../../components/common/Button';
import { Card, CardTitle, CardEffect } from '../../components/common/Card';
import { formatDishEffects } from '../../utils/formatting';
import { TileType } from '../../systems/MapSystem';

// =============================================================================
// SCREEN COMPONENT
// =============================================================================

export function DiningRoomScreen() {
    const gold = useGold();
    const dishIds = useDishes();
    const { message, showMessage } = useMessage();

    const dishes = dishIds
        .map(id => entityFactory.getTemplate(id))
        .filter(item => item != null) as Dish[];

    const eatDish = (dish: Dish) => {
        const player = gameState.getState().player;
        const healthBonus = dish.effects?.health || 0;
        const newHealth = Math.min(player.maxHealth, player.health + healthBonus);
        gameState.updatePlayer({ health: newHealth });
        gameState.removeDish(dish.id);
        showMessage(`Ate ${dish.name}! Restored ${healthBonus} HP!`);
    };

    const sellDish = (dish: Dish) => {
        // Calculate sell value based on dish effects
        const totalValue = (dish.effects?.health || 0) + (dish.effects?.attack || 0) + (dish.effects?.defense || 0);
        const sellPrice = Math.max(10, Math.floor(totalValue * 2));

        gameState.removeDish(dish.id);
        gameState.addGold(sellPrice);
        showMessage(`Sold ${dish.name} for ${sellPrice} gold!`);
    };

    return (
        <ScreenContainer>
            <h1 style="font-size: 28px; margin-bottom: 15px;">🍽️ DINING ROOM</h1>
            <p style="color: #90EE90; margin-bottom: 15px; font-size: 14px;">
                A cozy dining area where patrons enjoy their meals. Eat or sell your dishes here.
            </p>
            <GoldDisplay />
            <MessageDisplay message={message} />

            <ContentWrapper style="max-width: 900px;">
                {dishes.length > 0 ? (
                    <>
                        <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Your Dishes</SectionTitle>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 15px;">
                            {dishes.map(dish => {
                                const dishIcon = dish.buffType === 'health' ? '🍜' :
                                                dish.buffType === 'attack' ? '🍖' :
                                                dish.buffType === 'defense' ? '🛡️' : '🍽️';
                                const ingredientIcons = dish.ingredients
                                    .map(ingId => entityFactory.getTemplate(ingId))
                                    .filter(ing => ing && 'icon' in ing)
                                    .map(ing => (ing as any).icon)
                                    .filter(Boolean)
                                    .slice(0, 3)
                                    .join('');

                                const totalValue = (dish.effects?.health || 0) + (dish.effects?.attack || 0) + (dish.effects?.defense || 0);
                                const sellPrice = Math.max(10, Math.floor(totalValue * 2));

                                return (
                                    <Card key={dish.id} style="padding: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                                            <span style="font-size: 24px;">{dishIcon}</span>
                                            <CardTitle style="font-size: 15px; margin: 0;">{dish.name}</CardTitle>
                                        </div>
                                        {ingredientIcons && (
                                            <div style="font-size: 16px; margin: 5px 0;">{ingredientIcons}</div>
                                        )}
                                        <p style="font-size: 12px; margin: 5px 0; line-height: 1.3;">{dish.description}</p>
                                        <CardEffect style="font-size: 11px;">{formatDishEffects(dish.effects)}</CardEffect>

                                        <div style="display: flex; gap: 8px; margin-top: 10px;">
                                            <ActionButton
                                                onClick={() => eatDish(dish)}
                                                style="padding: 8px 12px; font-size: 12px; flex: 1; background: #4CAF50;"
                                            >
                                                Eat ({dish.effects?.health || 0} HP)
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => sellDish(dish)}
                                                style="padding: 8px 12px; font-size: 12px; flex: 1; background: #FFD700; color: #000;"
                                            >
                                                Sell ({sellPrice}g)
                                            </ActionButton>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div style="text-align: center; padding: 40px; color: #888;">
                        <p style="font-size: 18px; margin-bottom: 10px;">No dishes available</p>
                        <p style="font-size: 14px;">Cook some dishes at the Cooking Station!</p>
                    </div>
                )}
            </ContentWrapper>

            <CloseButton />
        </ScreenContainer>
    );
}

// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const DiningRoomBuilding: BuildingPlugin = {
  id: 'dining_room',
  name: 'Dining Room',
  description: 'Eat your cooked dishes to restore health or sell them for gold',

  tileType: TileType.DINING_ROOM,

  tile: {
    color: '#8B4513',
    walkable: true,
    blocksLight: false,
  },

  interaction: {
    prompt: 'Press E to enter Dining Room',
    interactKey: 'E',
  },

  screen: {
    id: 'diningroom',
    component: DiningRoomScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 12, y: 27 },
    size: { width: 4, height: 4 },
    priority: 80,
  },
};
