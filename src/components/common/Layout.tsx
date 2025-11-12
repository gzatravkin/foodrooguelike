/**
 * Layout components for consistent screen structure
 */

import { ComponentChildren } from 'preact';
import { useEscapeToClose } from '../../hooks/useCommon';

interface ScreenContainerProps {
    children: ComponentChildren;
    style?: string;
}

/**
 * Main screen container with ESC key handler
 */
export function ScreenContainer({ children, style = '' }: ScreenContainerProps) {
    useEscapeToClose();

    return (
        <div class="screen" style={style}>
            {children}
        </div>
    );
}

interface ScreenHeaderProps {
    title: string;
    emoji?: string;
    subtitle?: string;
}

/**
 * Screen header with title and optional subtitle
 */
export function ScreenHeader({ title, emoji, subtitle }: ScreenHeaderProps) {
    return (
        <>
            <h1>{emoji && `${emoji} `}{title}{emoji && ` ${emoji}`}</h1>
            {subtitle && (
                <p style="color: #AAA; margin-bottom: 20px;">{subtitle}</p>
            )}
        </>
    );
}

interface GridLayoutProps {
    children: ComponentChildren;
    columns?: number;
    minColumnWidth?: string;
}

/**
 * Responsive grid layout
 */
export function GridLayout({ children, columns = 2, minColumnWidth = '450px' }: GridLayoutProps) {
    return (
        <div class="grid-2col" style={`grid-template-columns: repeat(auto-fit, minmax(${minColumnWidth}, 1fr));`}>
            {children}
        </div>
    );
}

interface FlexRowProps {
    children: ComponentChildren;
    style?: string;
}

/**
 * Flex row layout
 */
export function FlexRow({ children, style = '' }: FlexRowProps) {
    return (
        <div class="flex-row" style={style}>
            {children}
        </div>
    );
}

interface ContentWrapperProps {
    children: ComponentChildren;
    maxWidth?: string;
}

/**
 * Wrapper for main content area
 */
export function ContentWrapper({ children, maxWidth = '1200px' }: ContentWrapperProps) {
    return (
        <div style={`width: 100%; max-width: ${maxWidth};`}>
            {children}
        </div>
    );
}
