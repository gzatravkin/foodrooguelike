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
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <ActionButton
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
            >
                Previous
            </ActionButton>
            <ActionButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={(currentPage + 1) * itemsPerPage >= totalItems}
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

    const weapons = entityFactory.getAllOfType('weapon') as Weapon[];
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
            <h1>🛒 SHOP</h1>
            <GoldDisplay />
            <MessageDisplay message={message} />

            <ContentWrapper>
                {/* Weapons Section */}
                <SectionTitle>Weapons</SectionTitle>
                <GridLayout>
                    {weapons.slice(weaponStart, weaponStart + itemsPerPage).map((weapon: Weapon) => (
                        <Card key={weapon.id}>
                            <FlexRow>
                                <div>
                                    <CardTitle>{weapon.name}</CardTitle>
                                    <p>{weapon.description}</p>
                                    <CardEffect>Damage: {weapon.damage}</CardEffect>
                                    <p style={`color: ${colors.gold};`}>Price: {formatGold(weapon.cost)}</p>
                                </div>
                                <ActionButton
                                    onClick={() => buyWeapon(weapon)}
                                    disabled={gold < weapon.cost}
                                >
                                    Buy
                                </ActionButton>
                            </FlexRow>
                        </Card>
                    ))}
                </GridLayout>
                <Pagination
                    currentPage={weaponPage}
                    totalItems={weapons.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setWeaponPage}
                />

                {/* Equipment Section */}
                <SectionTitle>Equipment</SectionTitle>
                <GridLayout>
                    {equipment.slice(equipmentStart, equipmentStart + itemsPerPage).map((equip: Equipment) => (
                        <Card key={equip.id}>
                            <FlexRow>
                                <div>
                                    <CardTitle>{equip.name}</CardTitle>
                                    <p>{equip.description}</p>
                                    <CardEffect>
                                        {equip.stats.defense && `Defense: +${equip.stats.defense}`}
                                        {equip.stats.attack && `Attack: +${equip.stats.attack}`}
                                        {equip.stats.health && `Health: +${equip.stats.health}`}
                                    </CardEffect>
                                    <p style={`color: ${colors.gold};`}>Price: {formatGold(equip.cost)}</p>
                                </div>
                                <ActionButton
                                    onClick={() => buyEquipment(equip)}
                                    disabled={gold < equip.cost}
                                >
                                    Buy
                                </ActionButton>
                            </FlexRow>
                        </Card>
                    ))}
                </GridLayout>
                <Pagination
                    currentPage={equipmentPage}
                    totalItems={equipment.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setEquipmentPage}
                />

                {/* Dishes Section */}
                {dishes.length > 0 && (
                    <>
                        <SectionTitle>Your Dishes</SectionTitle>
                        <GridLayout>
                            {dishes.map(dish => {
                                const sellPrice = Math.floor(dish.value * 0.5);
                                return (
                                    <Card key={dish.id}>
                                        <CardTitle>{dish.name}</CardTitle>
                                        <p>{dish.description}</p>
                                        <CardEffect>{formatDishEffects(dish.effects)}</CardEffect>
                                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                                            <ActionButton onClick={() => eatDish(dish)}>
                                                Eat
                                            </ActionButton>
                                            <ActionButton onClick={() => sellDish(dish)}>
                                                Sell ({formatGold(sellPrice)})
                                            </ActionButton>
                                        </div>
                                    </Card>
                                );
                            })}
                        </GridLayout>
                    </>
                )}
            </ContentWrapper>

            <CloseButton />
        </ScreenContainer>
    );
}
