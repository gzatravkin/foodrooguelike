/**
 * Common button components
 */

import { ComponentChildren } from 'preact';
import { gameState } from '../../core/GameState';
import { colors } from '../../styles/theme';

interface CloseButtonProps {
    position?: 'top-right' | 'bottom';
    style?: string;
}

/**
 * Standard close button that returns to game
 */
export function CloseButton({ position = 'bottom', style = '' }: CloseButtonProps) {
    const positionStyles = position === 'top-right'
        ? `position: absolute; top: 20px; right: 20px; min-width: 100px; background: ${colors.textDarker}; padding: 10px 20px;`
        : `margin-top: 30px;`;

    return (
        <button
            class="button"
            onClick={() => gameState.setScreen('game')}
            style={`${positionStyles} ${style}`}
        >
            ✕ CLOSE
        </button>
    );
}

interface NavButtonProps {
    emoji?: string;
    label: string;
    gradient: string;
    shadowColor: string;
    onClick: () => void;
    style?: string;
}

/**
 * Navigation button for main menu
 */
export function NavButton({ emoji, label, gradient, shadowColor, onClick, style = '' }: NavButtonProps) {
    return (
        <button
            class="button"
            onClick={onClick}
            style={`height: 70px; font-size: 16px; background: ${gradient}; border: none; box-shadow: 0 4px 15px ${shadowColor}; ${style}`}
        >
            {emoji && <>{emoji}<br /></>}
            {label}
        </button>
    );
}

interface ActionButtonProps {
    children: ComponentChildren;
    onClick: () => void;
    disabled?: boolean;
    style?: string;
    className?: string;
}

/**
 * Generic action button
 */
export function ActionButton({ children, onClick, disabled = false, style = '', className = 'button' }: ActionButtonProps) {
    return (
        <button
            class={className}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
}
