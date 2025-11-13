/**
 * DiningRoomScreen - Preact component for serving dishes to NPC customers
 */

import { useState } from 'preact/hooks';
import { useGold, useDishes } from '../../hooks/useGameState';
import { useMessage } from '../../hooks/useCommon';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import type { Dish } from '../../entities/types';
import { ScreenContainer, ContentWrapper } from '../common/Layout';
import { GoldDisplay, MessageDisplay, SectionTitle } from '../common/Display';
import { CloseButton, ActionButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { formatDishEffects, formatGold } from '../../utils/formatting';
import { colors } from '../../styles/theme';

export function DiningRoomScreen() {
    const gold = useGold();
    const dishIds = useDishes();
    const { message, showMessage } = useMessage();

    const dishes = dishIds
        .map(id => entityFactory.getTemplate(id))
        .filter(item => item != null) as Dish[];

    // Get NPC client data from game state
    const state = gameState.getState();
    const clients = state.diningRoomClients || [];

    const serveDish = (dish: Dish, clientIndex: number) => {
        if (clientIndex < 0 || clientIndex >= clients.length) {
            showMessage('No customer selected!');
            return;
        }

        const client = clients[clientIndex];
        if (!client.wantsFood) {
            showMessage(`${client.name} is already satisfied!`);
            return;
        }

        // Calculate payment
        let payment = client.goldReward;
        const matchesPreference = dish.buffType === client.preferredBuffType;

        if (matchesPreference) {
            payment = Math.floor(payment * 1.5);
        }

        // Remove dish from inventory and add gold
        gameState.removeDish(dish.id);
        gameState.addGold(payment);

        // Mark client as satisfied
        gameState.serveDishToClient(clientIndex);

        if (matchesPreference) {
            showMessage(`${client.name} loved it! +${formatGold(payment)} (Bonus!)`);
        } else {
            showMessage(`Served to ${client.name}! +${formatGold(payment)}`);
        }
    };

    const eatDish = (dish: Dish) => {
        const player = gameState.getState().player;
        const healthBonus = dish.effects?.health || 0;
        const newHealth = Math.min(player.maxHealth, player.health + healthBonus);
        gameState.updatePlayer({ health: newHealth });
        gameState.removeDish(dish.id);
        showMessage(`Ate ${dish.name}! Restored ${healthBonus} HP!`);
    };

    return (
        <ScreenContainer>
            <h1 style="font-size: 28px; margin-bottom: 15px;">🍽️ DINING ROOM</h1>
            <GoldDisplay />
            <MessageDisplay message={message} />

            <ContentWrapper style="max-width: 900px;">
                {/* Customers Section */}
                <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Current Customers</SectionTitle>
                {clients.length === 0 ? (
                    <p style="color: #90EE90; margin-bottom: 20px;">No customers right now. Complete expeditions to attract more!</p>
                ) : (
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px;">
                        {clients.map((client: any, index: number) => {
                            const preferenceIcon = client.preferredBuffType === 'health' ? '❤️' :
                                                   client.preferredBuffType === 'attack' ? '⚔️' :
                                                   client.preferredBuffType === 'defense' ? '🛡️' : '🍽️';
                            const tierStars = '⭐'.repeat(Math.min(client.locationTier, 5));

                            return (
                                <Card key={index} style="padding: 10px; text-align: center;">
                                    <div style={`font-size: 24px; margin-bottom: 5px; color: ${client.color};`}>👤</div>
                                    <CardTitle style="font-size: 14px; margin-bottom: 5px;">{client.name}</CardTitle>
                                    <p style="font-size: 11px; margin: 3px 0;">Prefers: {preferenceIcon}</p>
                                    <p style="font-size: 11px; margin: 3px 0;">Pays: {formatGold(client.goldReward)}</p>
                                    <p style="font-size: 10px; margin: 3px 0;">{tierStars}</p>
                                    {!client.wantsFood && (
                                        <p style="color: #90EE90; font-size: 10px; margin-top: 5px;">Satisfied ✓</p>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Dishes Section */}
                {dishes.length > 0 ? (
                    <>
                        <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Your Dishes</SectionTitle>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-bottom: 15px;">
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

                                        {/* Customer selection buttons */}
                                        {clients.filter((c: any) => c.wantsFood).length > 0 && (
                                            <div style="margin-top: 10px;">
                                                <p style="font-size: 11px; margin-bottom: 5px;">Serve to:</p>
                                                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                                    {clients.map((client: any, index: number) => {
                                                        if (!client.wantsFood) return null;
                                                        const matchesPreference = dish.buffType === client.preferredBuffType;
                                                        return (
                                                            <ActionButton
                                                                key={index}
                                                                onClick={() => serveDish(dish, index)}
                                                                style={`padding: 5px 10px; font-size: 11px; ${matchesPreference ? 'background: #FFD700; color: #000;' : ''}`}
                                                            >
                                                                {client.name.split(' ')[0]}{matchesPreference ? ' ⭐' : ''}
                                                            </ActionButton>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <ActionButton
                                            onClick={() => eatDish(dish)}
                                            style="padding: 6px 12px; font-size: 12px; width: 100%; margin-top: 8px;"
                                        >
                                            Eat Myself
                                        </ActionButton>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p style="color: #F44336; margin-top: 20px;">No dishes available. Cook some dishes first!</p>
                )}
            </ContentWrapper>

            <CloseButton />
        </ScreenContainer>
    );
}
