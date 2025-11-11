/**
 * CookingState - Manages cooking screen state
 */

export type Section = 'ingredients' | 'methods' | 'time' | 'quickselect';

export class CookingState {
    private selectedIngredients: string[] = [];
    private selectedMethod: string = '';
    private cookingTime: number = 60;
    private lastDish: any = null;

    private currentSection: Section = 'ingredients';
    private ingredientCursor: number = 0;
    private methodCursor: number = 0;
    private timeCursor: number = 3; // Default to 60s (index 3)
    private quickSelectCursor: number = 0;

    public readonly timePresets: number[] = [15, 30, 45, 60, 90, 120, 150, 180];

    // Getters
    getSelectedIngredients(): string[] {
        return this.selectedIngredients;
    }

    getSelectedMethod(): string {
        return this.selectedMethod;
    }

    getCookingTime(): number {
        return this.cookingTime;
    }

    getLastDish(): any {
        return this.lastDish;
    }

    getCurrentSection(): Section {
        return this.currentSection;
    }

    getIngredientCursor(): number {
        return this.ingredientCursor;
    }

    getMethodCursor(): number {
        return this.methodCursor;
    }

    getTimeCursor(): number {
        return this.timeCursor;
    }

    getQuickSelectCursor(): number {
        return this.quickSelectCursor;
    }

    // Setters
    setSelectedMethod(method: string): void {
        this.selectedMethod = method;
    }

    setCookingTime(time: number): void {
        this.cookingTime = time;
    }

    setLastDish(dish: any): void {
        this.lastDish = dish;
    }

    setCurrentSection(section: Section): void {
        this.currentSection = section;
    }

    setIngredientCursor(cursor: number): void {
        this.ingredientCursor = cursor;
    }

    setMethodCursor(cursor: number): void {
        this.methodCursor = cursor;
    }

    setTimeCursor(cursor: number): void {
        this.timeCursor = cursor;
    }

    setQuickSelectCursor(cursor: number): void {
        this.quickSelectCursor = cursor;
    }

    // State operations
    toggleIngredient(id: string): void {
        const index = this.selectedIngredients.indexOf(id);
        if (index > -1) {
            this.selectedIngredients.splice(index, 1);
        } else {
            this.selectedIngredients.push(id);
        }
        this.lastDish = null;
    }

    canCook(): boolean {
        return this.selectedIngredients.length > 0 && this.selectedMethod !== '';
    }

    reset(): void {
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;
        this.lastDish = null;
        this.currentSection = 'ingredients';
        this.ingredientCursor = 0;
        this.methodCursor = 0;
        this.timeCursor = 3;
        this.quickSelectCursor = 0;
    }

    clearSelection(): void {
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;
        this.timeCursor = 3;
    }

    loadRecipeConfig(ingredientTemplates: string[], methodId: string, cookingTime: number, availableIngredients: string[]): boolean {
        // Clear current selection
        this.selectedIngredients = [];

        // Try to find actual ingredient instances for each template
        const { entityFactory } = require('../entities/EntityFactory');
        for (const templateId of ingredientTemplates) {
            const found = availableIngredients.find(id => {
                const template = entityFactory.getTemplate(id);
                return template && template.id === templateId && !this.selectedIngredients.includes(id);
            });
            if (found) {
                this.selectedIngredients.push(found);
            } else {
                // Missing ingredient, can't load recipe
                this.selectedIngredients = [];
                return false;
            }
        }

        // Set method and time
        this.selectedMethod = methodId;
        this.cookingTime = cookingTime;

        // Update time cursor to match
        const timeIndex = this.timePresets.indexOf(cookingTime);
        if (timeIndex >= 0) {
            this.timeCursor = timeIndex;
        }

        return true;
    }
}
