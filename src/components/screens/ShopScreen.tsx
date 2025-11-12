/**
 * ShopScreen - Preact component for the shop
 */

import { useState, useEffect } from 'preact/hooks';
import { useGold, useDishes, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import type { Weapon, Equipment, Dish } from '../../entities/types';

export function ShopScreen() {
    const gold = useGold();
    const dishIds = useDishes();
    const [message, setMessage] = useState('');
    const [weaponPage, setWeaponPage] = useState(0);
    const [equipmentPage, setEquipmentPage] = useState(0);

    // Handle escape key to close screen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                gameState.setScreen('game');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const dishes = dishIds
        .map(id => entityFactory.getTemplate(id))
        .filter(item => item != null) as Dish[];

    const weapons = entityFactory.getAllOfType('weapon') as Weapon[];
    const equipment = entityFactory.getAllOfType('equipment') as Equipment[];

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const buyWeapon = (weapon: Weapon) => {
        if (gameState.spendGold(weapon.cost)) {
            gameState.addToInventory(weapon.id);
            showMessage(`Bought ${weapon.name} for ${weapon.cost}g!`);
        } else {
            showMessage('Not enough gold!');
        }
    };

    const buyEquipment = (equip: Equipment) => {
        if (gameState.spendGold(equip.cost)) {
            gameState.addToInventory(equip.id);
            showMessage(`Bought ${equip.name} for ${equip.cost}g!`);
        } else {
            showMessage('Not enough gold!');
        }
    };

    const sellDish = (dish: Dish) => {
        const sellPrice = Math.floor(dish.value * 0.5);
        gameState.addGold(sellPrice);
        gameState.removeDish(dish.id);
        showMessage(`Sold ${dish.name} for ${sellPrice}g!`);
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
        <div class="screen">
            <h1>🛒 SHOP</h1>
            <p>Gold: {gold}</p>
            {message && <p style="color: #90EE90; font-size: 20px; margin: 10px 0;">{message}</p>}

            <div style="width: 100%; max-width: 1200px;">
                {/* Weapons Section */}
                <h2 style="color: #FFD700; margin-top: 30px;">Weapons</h2>
                <div class="grid-2col">
                    {weapons.slice(weaponStart, weaponStart + itemsPerPage).map((weapon: Weapon) => (
                        <div key={weapon.id} class="card">
                            <div class="flex-row">
                                <div>
                                    <h3>{weapon.name}</h3>
                                    <p>{weapon.description}</p>
                                    <p class="effect">Damage: {weapon.damage}</p>
                                    <p style="color: #FFD700;">Price: {weapon.cost}g</p>
                                </div>
                                <button
                                    class="button"
                                    onClick={() => buyWeapon(weapon)}
                                    disabled={gold < weapon.cost}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {weapons.length > itemsPerPage && (
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button
                            class="button"
                            onClick={() => setWeaponPage(Math.max(0, weaponPage - 1))}
                            disabled={weaponPage === 0}
                        >
                            Previous
                        </button>
                        <button
                            class="button"
                            onClick={() => setWeaponPage(weaponPage + 1)}
                            disabled={(weaponPage + 1) * itemsPerPage >= weapons.length}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Equipment Section */}
                <h2 style="color: #FFD700; margin-top: 30px;">Equipment</h2>
                <div class="grid-2col">
                    {equipment.slice(equipmentStart, equipmentStart + itemsPerPage).map((equip: Equipment) => (
                        <div key={equip.id} class="card">
                            <div class="flex-row">
                                <div>
                                    <h3>{equip.name}</h3>
                                    <p>{equip.description}</p>
                                    <p class="effect">
                                        {equip.stats.defense && `Defense: +${equip.stats.defense}`}
                                        {equip.stats.attack && `Attack: +${equip.stats.attack}`}
                                        {equip.stats.health && `Health: +${equip.stats.health}`}
                                    </p>
                                    <p style="color: #FFD700;">Price: {equip.cost}g</p>
                                </div>
                                <button
                                    class="button"
                                    onClick={() => buyEquipment(equip)}
                                    disabled={gold < equip.cost}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {equipment.length > itemsPerPage && (
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button
                            class="button"
                            onClick={() => setEquipmentPage(Math.max(0, equipmentPage - 1))}
                            disabled={equipmentPage === 0}
                        >
                            Previous
                        </button>
                        <button
                            class="button"
                            onClick={() => setEquipmentPage(equipmentPage + 1)}
                            disabled={(equipmentPage + 1) * itemsPerPage >= equipment.length}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Dishes Section */}
                {dishes.length > 0 && (
                    <>
                        <h2 style="color: #FFD700; margin-top: 30px;">Your Dishes</h2>
                        <div class="grid-2col">
                            {dishes.map(dish => {
                                const sellPrice = Math.floor(dish.value * 0.5);
                                return (
                                    <div key={dish.id} class="card">
                                        <h3>{dish.name}</h3>
                                        <p>{dish.description}</p>
                                        <p class="effect">
                                            HP: +{dish.effects?.health || 0}, ATK: +{dish.effects?.attack || 0}, DEF: +{dish.effects?.defense || 0}
                                        </p>
                                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                                            <button class="button" onClick={() => eatDish(dish)}>
                                                Eat
                                            </button>
                                            <button class="button" onClick={() => sellDish(dish)}>
                                                Sell ({sellPrice}g)
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <button
                class="button"
                onClick={() => gameState.setScreen('game')}
                style="margin-top: 30px;"
            >
                ✕ CLOSE
            </button>
        </div>
    );
}
