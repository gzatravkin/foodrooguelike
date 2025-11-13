/**
 * Card components for consistent styling
 */

import { ComponentChildren } from 'preact';
import { colors } from '../../styles/theme';

interface CardProps {
    children: ComponentChildren;
    isMaxLevel?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    style?: string;
    className?: string;
}

/**
 * Generic card component
 */
export function Card({
    children,
    isMaxLevel = false,
    isSelected = false,
    onClick,
    style = '',
    className = 'card'
}: CardProps) {
    const additionalClass = isMaxLevel ? 'max-level' : '';
    const selectionStyle = isSelected ? `border-color: ${colors.success}; background: #1a3a1a;` : '';
    const clickableStyle = onClick ? 'cursor: pointer;' : '';

    return (
        <div
            class={`${className} ${additionalClass}`.trim()}
            onClick={onClick}
            style={`${selectionStyle}${clickableStyle}${style}`}
        >
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ComponentChildren;
    level?: { current: number; max: number };
    style?: string;
}

/**
 * Card title with optional level display
 */
export function CardTitle({ children, level, style = '' }: CardTitleProps) {
    const levelText = level ? ` (Lv ${level.current}/${level.max})` : '';
    return <h3 style={style}>{children}{levelText}</h3>;
}

interface CardEffectProps {
    children: ComponentChildren;
    style?: string;
}

/**
 * Card effect display (green text)
 */
export function CardEffect({ children, style = '' }: CardEffectProps) {
    return <p class="effect" style={style}>{children}</p>;
}
