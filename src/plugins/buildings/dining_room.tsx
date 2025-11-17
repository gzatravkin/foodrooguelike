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

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#8B4513',
    walkable: true,
    blocksLight: false,

    // Custom rendering - Dining table with place settings
    render: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => {
      // Draw floor background
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(worldX, worldY, size, size);

      // Dining table (wooden)
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(worldX + size * 0.15, worldY + size * 0.4, size * 0.7, size * 0.35);

      // Table legs
      ctx.fillStyle = '#654321';
      ctx.fillRect(worldX + size * 0.18, worldY + size * 0.7, size * 0.08, size * 0.15);
      ctx.fillRect(worldX + size * 0.74, worldY + size * 0.7, size * 0.08, size * 0.15);

      // Plate (ceramic)
      ctx.fillStyle = '#f5f5dc';
      ctx.beginPath();
      ctx.ellipse(worldX + size * 0.35, worldY + size * 0.5, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plate rim
      ctx.strokeStyle = '#d3d3d3';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(worldX + size * 0.35, worldY + size * 0.5, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Fork (left side of plate)
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = size * 0.02;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.22, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.22, worldY + size * 0.62);
      ctx.stroke();

      // Fork prongs
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(worldX + size * (0.2 + i * 0.02), worldY + size * 0.5);
        ctx.lineTo(worldX + size * (0.2 + i * 0.02), worldY + size * 0.46);
        ctx.stroke();
      }

      // Knife (right side of plate)
      ctx.lineWidth = size * 0.02;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.48, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.48, worldY + size * 0.62);
      ctx.stroke();

      // Knife blade
      ctx.fillStyle = '#C0C0C0';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.48, worldY + size * 0.46);
      ctx.lineTo(worldX + size * 0.485, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.475, worldY + size * 0.5);
      ctx.closePath();
      ctx.fill();

      // Wine glass
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = size * 0.03;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.65, worldY + size * 0.45);
      ctx.lineTo(worldX + size * 0.65, worldY + size * 0.52);
      ctx.lineTo(worldX + size * 0.62, worldY + size * 0.56);
      ctx.lineTo(worldX + size * 0.68, worldY + size * 0.56);
      ctx.stroke();

      // Wine glass bowl
      ctx.beginPath();
      ctx.arc(worldX + size * 0.65, worldY + size * 0.4, size * 0.05, 0, Math.PI * 2);
      ctx.stroke();

      // Candle (centerpiece)
      ctx.fillStyle = '#FFE5B4';
      ctx.fillRect(worldX + size * 0.73, worldY + size * 0.48, size * 0.04, size * 0.12);

      // Candle flame
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.75, worldY + size * 0.48);
      ctx.lineTo(worldX + size * 0.73, worldY + size * 0.44);
      ctx.lineTo(worldX + size * 0.77, worldY + size * 0.44);
      ctx.closePath();
      ctx.fill();

      // Flame glow
      ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.75, worldY + size * 0.44, size * 0.06, 0, Math.PI * 2);
      ctx.fill();
    },
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
    position: { x: 27, y: 12 },  // Fixed: was swapped
    size: { width: 2, height: 3 },  // Fixed: was 4x4, should be 2x3
    priority: 80,
  },
};
