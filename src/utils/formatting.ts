/**
 * Utility functions for formatting values and text
 */

/**
 * Map of stat/effect keys to display names
 */
export const statDisplayNames: Record<string, string> = {
    // Combat stats
    attack: 'Attack',
    defense: 'Defense',
    maxHealth: 'Max HP',
    health: 'Health',
    speed: 'Speed',

    // Cooking related
    bakingQualityBonus: 'Baking Quality',
    grillingQualityBonus: 'Grilling Quality',
    fryingQualityBonus: 'Frying Quality',
    globalQualityBonus: 'All Cooking Quality',
    cookingBonus: 'Cooking Quality',
    cookingTimeReduction: 'Cooking Time',

    // Economy
    lootChance: 'Loot Chance',
    sellBonus: 'Sell Value',
    sellPriceMultiplier: 'Sell Price',
    ingredientSaveChance: 'Save Ingredients',
    expeditionDiscount: 'Expedition Cost',

    // Restaurant
    reputationMultiplier: 'Reputation',
    rareDropRateBonus: 'Rare Drop Rate',

    // Perks
    maxHealthBonus: 'Max Health',
    attackBonus: 'Attack',
    defenseBonus: 'Defense',
    buffDurationMultiplier: 'Buff Duration',
    dropRateMultiplier: 'Drop Rate',
    dashCooldownReduction: 'Dash Cooldown',

    // Special
    unlockMethod: 'Unlocks Cooking Method',
};

/**
 * Format an effect object into a human-readable string
 * Handles both simple effects and complex upgrade effects
 */
export function formatEffect(effect: any): string {
    if (!effect) return '';

    // Handle simple effect object with stat and amount
    if (effect.stat && effect.amount !== undefined) {
        return formatSimpleEffect(effect.stat, effect.amount);
    }

    // Handle complex effects object (upgrade effects)
    if (typeof effect === 'object') {
        const entries = Object.entries(effect);
        if (entries.length === 0) return '';

        const [key, value] = entries[0];
        return formatSimpleEffect(key, value);
    }

    return String(effect);
}

/**
 * Format a single stat/effect with its value
 */
function formatSimpleEffect(stat: string, value: any): string {
    const statName = statDisplayNames[stat] || stat;

    // Special handling for unlock methods
    if (stat === 'unlockMethod') {
        return `Unlocks: ${value}`;
    }

    // Percentage-based stats (bonuses, multipliers, chances, reductions)
    if (
        stat.includes('Bonus') ||
        stat.includes('Multiplier') ||
        stat.includes('Chance') ||
        stat.includes('Reduction') ||
        stat.includes('Rate')
    ) {
        const sign = stat.includes('Reduction') ? '-' : '+';
        const percentage = (Number(value) * 100).toFixed(0);
        return `${sign}${percentage}% ${statName}`;
    }

    // Absolute value stats
    return `+${value} ${statName}`;
}

/**
 * Format multiple effects into a single string
 */
export function formatMultipleEffects(effects: Record<string, number>): string {
    return Object.entries(effects)
        .map(([key, value]) => formatSimpleEffect(key, value))
        .join(', ');
}

/**
 * Calculate upgrade cost with exponential scaling
 */
export function calculateUpgradeCost(
    baseCost: number,
    currentLevel: number,
    costMultiplier: number
): number {
    return Math.floor(baseCost * Math.pow(costMultiplier, currentLevel));
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format gold amount with 'g' suffix
 */
export function formatGold(amount: number): string {
    return `${formatNumber(amount)}g`;
}

/**
 * Format dish effects (HP, ATK, DEF)
 */
export function formatDishEffects(effects?: {
    health?: number;
    attack?: number;
    defense?: number;
}): string {
    if (!effects) return 'HP: +0, ATK: +0, DEF: +0';
    return `HP: +${effects.health || 0}, ATK: +${effects.attack || 0}, DEF: +${effects.defense || 0}`;
}
