/**
 * App - Root Preact component that manages screen routing
 */

import { useCurrentScreen } from '../hooks/useGameState';
import { BuildingRegistry } from '../plugins/BuildingRegistry';
import { TrainingScreen } from './screens/TrainingScreen';
import { ShopScreen } from './screens/ShopScreen';
import { CookingScreen } from './screens/CookingScreen';
import { RecipeBookScreen } from './screens/RecipeBookScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { UpgradesScreen } from './screens/UpgradesScreen';
import { ExpeditionSelectionScreen } from './screens/ExpeditionSelectionScreen';
import { InGameMenuScreen } from './screens/InGameMenuScreen';
import { DiningRoomScreen } from './screens/DiningRoomScreen';

export function App() {
    const currentScreen = useCurrentScreen();

    // Check if screen is from a building (auto-registered!)
    const screenComponent = BuildingRegistry.getScreenComponent(currentScreen);
    if (screenComponent) {
        const Component = screenComponent;
        return <Component />;
    }

    // Fallback for hardcoded screens (menu, non-building screens, etc.)
    switch (currentScreen) {
        case 'menu':
            return <InGameMenuScreen />;
        case 'training':
            return <TrainingScreen />;
        case 'shop':
            return <ShopScreen />;
        case 'cooking':
            return <CookingScreen />;
        case 'recipebook':
            return <RecipeBookScreen />;
        case 'settings':
            return <SettingsScreen />;
        case 'upgrades':
            return <UpgradesScreen />;
        case 'expedition':
            return <ExpeditionSelectionScreen />;
        case 'diningroom':
            return <DiningRoomScreen />;
        default:
            return null; // No UI overlay for game/worldmap screens
    }
}
