/**
 * App - Root Preact component that manages screen routing
 */

import { useCurrentScreen } from '../hooks/useGameState';
import { BuildingRegistry } from '../plugins/BuildingRegistry';
import { RecipeBookScreen } from './screens/RecipeBookScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ExpeditionSelectionScreen } from './screens/ExpeditionSelectionScreen';
import { InGameMenuScreen } from './screens/InGameMenuScreen';

export function App() {
    const currentScreen = useCurrentScreen();

    // Check if screen is from a building (auto-registered!)
    const screenComponent = BuildingRegistry.getScreenComponent(currentScreen);
    if (screenComponent) {
        const Component = screenComponent;
        return <Component />;
    }

    // Fallback for non-building screens only
    switch (currentScreen) {
        case 'menu':
            return <InGameMenuScreen />;
        case 'recipebook':
            return <RecipeBookScreen />;
        case 'settings':
            return <SettingsScreen />;
        case 'expedition':
            return <ExpeditionSelectionScreen />;
        default:
            return null; // No UI overlay for game/worldmap screens
    }
}
