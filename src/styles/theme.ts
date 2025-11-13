/**
 * Theme constants for consistent styling across components
 */

export const colors = {
    // Primary colors
    gold: '#FFD700',
    goldLight: '#FFA500',

    // Status colors
    success: '#4CAF50',
    successLight: '#90EE90',
    danger: '#D32F2F',
    dangerLight: '#FF6B6B',
    warning: '#FF8C42',
    info: '#4ECDC4',

    // Backgrounds
    bgDark: '#0f0f0f',
    bgMedium: '#2a2a2a',
    bgLight: '#1f1f1f',
    bgCard: '#2a2a2a',
    bgCardAlt: '#1f1f1f',

    // Borders
    border: '#3a3a3a',
    borderLight: '#4a4a4a',
    borderDark: '#444',

    // Text
    textPrimary: '#fff',
    textSecondary: '#ccc',
    textMuted: '#AAA',
    textDark: '#888',
    textDarker: '#666',
};

export const gradients = {
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    pastel: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    rose: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    card: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
    cardMax: 'linear-gradient(145deg, #2a2a2a 0%, #2d2416 100%)',
};

export const shadows = {
    small: '0 2px 10px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 15px rgba(0, 0, 0, 0.3)',
    large: '0 8px 25px rgba(0, 0, 0, 0.4)',
    xlarge: '0 4px 20px rgba(0, 0, 0, 0.5)',
    goldGlow: '0 4px 20px rgba(255, 215, 0, 0.2)',
    goldGlowHover: '0 8px 30px rgba(255, 215, 0, 0.3)',
    successGlow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    successGlowHover: '0 6px 20px rgba(76, 175, 80, 0.4)',
};

export const borderRadius = {
    small: '4px',
    medium: '6px',
    large: '8px',
};

export const spacing = {
    xs: '3px',
    sm: '5px',
    md: '8px',
    lg: '10px',
    xl: '15px',
    xxl: '20px',
};

export const fontSize = {
    xs: '7px',
    sm: '7px',
    base: '8px',
    md: '9px',
    lg: '10px',
    xl: '12px',
    xxl: '21px',
    xxxl: '24px',
};

/**
 * Common style objects for reuse
 */
export const commonStyles = {
    screenBackground: `background: rgba(0, 0, 0, 0.9);`,

    closeButton: `
        min-width: 50px;
        background: ${colors.textDarker};
        padding: 5px 10px;
    `,

    statsPanel: `
        background: ${colors.bgMedium};
        border: 1px solid ${colors.borderDark};
        border-radius: ${borderRadius.medium};
        padding: 12px;
        margin: 10px 0;
        max-width: 400px;
        width: 100%;
        box-shadow: ${shadows.xlarge};
    `,

    statLabel: `
        color: ${colors.textDark};
        font-size: ${fontSize.xs};
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `,

    statValue: (color: string) => `
        color: ${color};
        font-size: ${fontSize.xl};
        font-weight: bold;
    `,

    sectionTitle: `
        color: ${colors.gold};
        margin-top: ${spacing.xl};
    `,

    selectedCard: `
        border-color: ${colors.success};
        background: #1a3a1a;
    `,

    activeTab: `
        background: ${colors.gold};
        color: #000;
    `,

    navButton: (gradient: string, glowColor: string) => `
        height: 35px;
        font-size: 8px;
        background: ${gradient};
        border: none;
        box-shadow: 0 2px 8px ${glowColor};
    `,
};

/**
 * Helper to create inline style strings
 */
export function createStyle(styleObject: Record<string, string | number>): string {
    return Object.entries(styleObject)
        .map(([key, value]) => {
            const cssKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            return `${cssKey}: ${value}`;
        })
        .join('; ');
}
