/**
 * App - Root Preact component that manages screen routing
 */

import { useCurrentScreen } from '../hooks/useGameState';
import { TrainingScreen } from './screens/TrainingScreen';
import { ShopScreen } from './screens/ShopScreen';
import { CookingScreen } from './screens/CookingScreen';
import { RecipeBookScreen } from './screens/RecipeBookScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { UpgradesScreen } from './screens/UpgradesScreen';
import { ExpeditionSelectionScreen } from './screens/ExpeditionSelectionScreen';
import { InGameMenuScreen } from './screens/InGameMenuScreen';

export function App() {
    const currentScreen = useCurrentScreen();

    // Render the appropriate screen based on currentScreen
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
        default:
            return null; // No UI overlay for game/worldmap screens
    }
}
