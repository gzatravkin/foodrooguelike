/**
 * ShopScreen - Preact component for the shop
 */

import { useState } from 'preact/hooks';
import { useGold, useDishes } from '../../hooks/useGameState';
import { useMessage } from '../../hooks/useCommon';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import type { Weapon, Equipment, Dish } from '../../entities/types';
import { ScreenContainer, ContentWrapper, GridLayout, FlexRow } from '../common/Layout';
import { GoldDisplay, MessageDisplay, SectionTitle } from '../common/Display';
import { CloseButton, ActionButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { formatDishEffects, formatGold } from '../../utils/formatting';
import { colors } from '../../styles/theme';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    if (totalItems <= itemsPerPage) return null;

    return (
        <div style="display: flex; gap: 8px; margin-top: 8px; margin-bottom: 20px;">
            <ActionButton
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                style="padding: 6px 12px; font-size: 12px;"
            >
                Previous
            </ActionButton>
            <ActionButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                style="padding: 6px 12px; font-size: 12px;"
            >
                Next
            </ActionButton>
        </div>
    );
}

export function ShopScreen() {
    const gold = useGold();
    const dishIds = useDishes();
    const { message, showMessage } = useMessage();
    const [weaponPage, setWeaponPage] = useState(0);
    const [equipmentPage, setEquipmentPage] = useState(0);

    const dishes = dishIds
        .map(id => entityFactory.getTemplate(id))
        .filter(item => item != null) as Dish[];

    const allWeapons = entityFactory.getAllOfType('weapon') as Weapon[];
    const unlockedLocations = gameState.getUnlockedLocations();

    // Filter weapons based on unlocked locations
    const weapons = allWeapons.filter(weapon => {
        // Always show weapons without location requirement
        if (!weapon.requiredLocation) return true;
        // Show weapons for unlocked locations
        return unlockedLocations.includes(weapon.requiredLocation);
    });

    const equipment = entityFactory.getAllOfType('equipment') as Equipment[];

    const buyWeapon = (weapon: Weapon) => {
        if (gameState.spendGold(weapon.cost)) {
            gameState.addToInventory(weapon.id);
            showMessage(`Bought ${weapon.name} for ${formatGold(weapon.cost)}!`);
        } else {
            showMessage('Not enough gold!');
        }
    };

    const buyEquipment = (equip: Equipment) => {
        if (gameState.spendGold(equip.cost)) {
            gameState.addToInventory(equip.id);
            showMessage(`Bought ${equip.name} for ${formatGold(equip.cost)}!`);
        } else {
            showMessage('Not enough gold!');
        }
    };

    const sellDish = (dish: Dish) => {
        const sellPrice = Math.floor(dish.value * 0.5);
        gameState.addGold(sellPrice);
        gameState.removeDish(dish.id);
        showMessage(`Sold ${dish.name} for ${formatGold(sellPrice)}!`);
    };

    const eatDish = (dish: Dish) => {
        const player = gameState.getState().player;
        const healthBonus = dish.effects?.health || 0;
        const newHealth = Math.min(player.maxHealth, player.health + healthBonus);
        gameState.updatePlayer({ health: newHealth });
        gameState.removeDish(dish.id);
        showMessage(`Ate ${dish.name}! Restored ${healthBonus} HP!`);
    };

    const itemsPerPage = 4;
    const weaponStart = weaponPage * itemsPerPage;
    const equipmentStart = equipmentPage * itemsPerPage;

    return (
        <ScreenContainer>
            <h1 style="font-size: 28px; margin-bottom: 15px;">🛒 SHOP</h1>
            <GoldDisplay />
            <MessageDisplay message={message} />

            <ContentWrapper style="max-width: 900px;">
                {/* Weapons Section */}
                <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Weapons</SectionTitle>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 15px;">
                    {weapons.slice(weaponStart, weaponStart + itemsPerPage).map((weapon: Weapon) => (
                        <Card key={weapon.id} style="padding: 12px;">
                            <FlexRow style="gap: 10px;">
                                <div style="flex: 1; min-width: 0;">
                                    <CardTitle style="font-size: 15px; margin-bottom: 5px;">{weapon.name}</CardTitle>
                                    <p style="font-size: 12px; margin: 5px 0; line-height: 1.3;">{weapon.description}</p>
                                    <CardEffect style="font-size: 11px;">Damage: {weapon.damage}</CardEffect>
                                    <p style={`color: ${colors.gold}; font-size: 13px; margin-top: 5px; font-weight: bold;`}>
                                        {formatGold(weapon.cost)}
                                    </p>
                                </div>
                                <ActionButton
                                    onClick={() => buyWeapon(weapon)}
                                    disabled={gold < weapon.cost}
                                    style="padding: 8px 16px; font-size: 13px; min-width: 60px; align-self: flex-start;"
                                >
                                    Buy
                                </ActionButton>
                            </FlexRow>
                        </Card>
                    ))}
                </div>
                <Pagination
                    currentPage={weaponPage}
                    totalItems={weapons.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setWeaponPage}
                />

                {/* Equipment Section */}
                <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Equipment</SectionTitle>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 15px;">
                    {equipment.slice(equipmentStart, equipmentStart + itemsPerPage).map((equip: Equipment) => (
                        <Card key={equip.id} style="padding: 12px;">
                            <FlexRow style="gap: 10px;">
                                <div style="flex: 1; min-width: 0;">
                                    <CardTitle style="font-size: 15px; margin-bottom: 5px;">{equip.name}</CardTitle>
                                    <p style="font-size: 12px; margin: 5px 0; line-height: 1.3;">{equip.description}</p>
                                    <CardEffect style="font-size: 11px;">
                                        {equip.stats.defense && `DEF: +${equip.stats.defense} `}
                                        {equip.stats.attack && `ATK: +${equip.stats.attack} `}
                                        {equip.stats.health && `HP: +${equip.stats.health}`}
                                    </CardEffect>
                                    <p style={`color: ${colors.gold}; font-size: 13px; margin-top: 5px; font-weight: bold;`}>
                                        {formatGold(equip.cost)}
                                    </p>
                                </div>
                                <ActionButton
                                    onClick={() => buyEquipment(equip)}
                                    disabled={gold < equip.cost}
                                    style="padding: 8px 16px; font-size: 13px; min-width: 60px; align-self: flex-start;"
                                >
                                    Buy
                                </ActionButton>
                            </FlexRow>
                        </Card>
                    ))}
                </div>
                <Pagination
                    currentPage={equipmentPage}
                    totalItems={equipment.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setEquipmentPage}
                />

                {/* Dishes Section */}
                {dishes.length > 0 && (
                    <>
                        <SectionTitle style="font-size: 18px; margin-bottom: 10px;">Your Dishes</SectionTitle>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-bottom: 15px;">
                            {dishes.map(dish => {
                                const sellPrice = Math.floor(dish.value * 0.5);
                                // Get dish emoji based on buffType
                                const dishIcon = dish.buffType === 'health' ? '🍜' :
                                                dish.buffType === 'attack' ? '🍖' :
                                                dish.buffType === 'defense' ? '🛡️' : '🍽️';
                                // Get ingredient icons
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
                                        <div style="display: flex; gap: 8px; margin-top: 10px;">
                                            <ActionButton
                                                onClick={() => eatDish(dish)}
                                                style="padding: 6px 12px; font-size: 12px; flex: 1;"
                                            >
                                                Eat
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => sellDish(dish)}
                                                style="padding: 6px 12px; font-size: 12px; flex: 1;"
                                            >
                                                Sell ({formatGold(sellPrice)})
                                            </ActionButton>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </ContentWrapper>

            <CloseButton />
        </ScreenContainer>
    );
}
