/**
 * Common display components for stats and info
 */

import { ComponentChildren } from 'preact';
import { useGold } from '../../hooks/useGameState';
import { colors, fontSize } from '../../styles/theme';
import { formatGold } from '../../utils/formatting';

/**
 * Gold display component
 */
export function GoldDisplay() {
    const gold = useGold();
    return <p>Gold: {formatGold(gold)}</p>;
}

interface MessageDisplayProps {
    message: string;
    type?: 'success' | 'error' | 'info';
}

/**
 * Message/toast display
 */
export function MessageDisplay({ message, type = 'success' }: MessageDisplayProps) {
    if (!message) return null;

    const colorMap = {
        success: colors.successLight,
        error: colors.dangerLight,
        info: colors.info,
    };

    return (
        <p style={`color: ${colorMap[type]}; font-size: 10px; margin: 5px 0;`}>
            {message}
        </p>
    );
}

interface StatDisplayProps {
    label: string;
    value: string | number;
    color?: string;
}

/**
 * Single stat display (label + value)
 */
export function StatDisplay({ label, value, color = colors.textPrimary }: StatDisplayProps) {
    return (
        <div>
            <p style={`color: ${colors.textDark}; font-size: ${fontSize.xs}; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;`}>
                {label}
            </p>
            <p style={`color: ${color}; font-size: ${fontSize.xl}; font-weight: bold;`}>
                {value}
            </p>
        </div>
    );
}

interface StatsGridProps {
    children: ComponentChildren;
    columns?: number;
}

/**
 * Grid container for stats
 */
export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
    return (
        <div style={`display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 10px; text-align: center;`}>
            {children}
        </div>
    );
}

interface StatsPanelProps {
    children: ComponentChildren;
}

/**
 * Panel container for stats display
 */
export function StatsPanel({ children }: StatsPanelProps) {
    return (
        <div style={`background: ${colors.bgMedium}; border: 1px solid ${colors.borderDark}; border-radius: 6px; padding: 12px; margin: 10px 0; max-width: 400px; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.5);`}>
            {children}
        </div>
    );
}

interface SectionTitleProps {
    children: ComponentChildren;
    emoji?: string;
    style?: string;
}

/**
 * Section title with optional emoji
 */
export function SectionTitle({ children, emoji, style = '' }: SectionTitleProps) {
    return (
        <h2 style={`color: ${colors.gold}; margin-top: 15px; ${style}`}>
            {emoji && `${emoji} `}{children}
        </h2>
    );
}
