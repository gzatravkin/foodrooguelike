/**
 * CharacterCustomizationScreen - Preact component for Character Customization
 */

import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { gameState, CharacterCustomization } from '../../core/GameState';
import { ScreenContainer, ScreenHeader, GridLayout, FlexRow } from '../common/Layout';
import { CloseButton } from '../common/Button';
import { eventBus } from '../../core/EventBus';

interface CustomizationOption {
  label: string;
  value: string;
  bonuses: string[];
}

const GENDER_OPTIONS: CustomizationOption[] = [
  {
    label: 'Male',
    value: 'male',
    bonuses: ['+2 Attack', '+10 Max Health']
  },
  {
    label: 'Female',
    value: 'female',
    bonuses: ['+2 Defense', '+1 Attack']
  },
  {
    label: 'Other',
    value: 'other',
    bonuses: ['+5 Max Health', '+1 Defense', '+1 Attack']
  },
];

const HAIR_STYLE_OPTIONS: CustomizationOption[] = [
  { label: 'Bald', value: 'bald', bonuses: ['+1 Defense (Streamlined)'] },
  { label: 'Short', value: 'short', bonuses: ['+1 Attack (Practical)'] },
  { label: 'Long', value: 'long', bonuses: ['+5 Max Health (Flowing)'] },
  { label: 'Ponytail', value: 'ponytail', bonuses: ['+1 Attack', '+1 Defense (Focused)'] },
  { label: 'Mohawk', value: 'mohawk', bonuses: ['+2 Attack (Intimidating)'] },
];

const HAIR_COLOR_OPTIONS: CustomizationOption[] = [
  { label: 'Black', value: 'black', bonuses: ['+1 Defense (Shadow)'] },
  { label: 'Brown', value: 'brown', bonuses: ['+5 Max Health (Earth)'] },
  { label: 'Blonde', value: 'blonde', bonuses: ['+1 Attack (Light)'] },
  { label: 'Red', value: 'red', bonuses: ['+2 Attack (Fire)'] },
  { label: 'White', value: 'white', bonuses: ['+2 Defense (Ice)'] },
  { label: 'Blue', value: 'blue', bonuses: ['+5 Max Health (Water)'] },
  { label: 'Green', value: 'green', bonuses: ['+10 Max Health (Nature)'] },
];

const SKIN_TONE_OPTIONS: CustomizationOption[] = [
  { label: 'Pale', value: 'pale', bonuses: ['+5 Max Health'] },
  { label: 'Light', value: 'light', bonuses: ['+1 Defense'] },
  { label: 'Medium', value: 'medium', bonuses: ['+1 Attack', '+1 Defense'] },
  { label: 'Tan', value: 'tan', bonuses: ['+1 Attack', '+5 Max Health'] },
  { label: 'Dark', value: 'dark', bonuses: ['+10 Max Health'] },
];

const EYE_COLOR_OPTIONS: CustomizationOption[] = [
  { label: 'Brown', value: 'brown', bonuses: ['+1 Defense'] },
  { label: 'Blue', value: 'blue', bonuses: ['+1 Attack'] },
  { label: 'Green', value: 'green', bonuses: ['+5 Max Health'] },
  { label: 'Gray', value: 'gray', bonuses: ['+2 Defense'] },
  { label: 'Hazel', value: 'hazel', bonuses: ['+1 Attack', '+1 Defense'] },
];

interface CustomizationSectionProps {
  title: string;
  options: CustomizationOption[];
  currentValue: string;
  onSelect: (value: string) => void;
}

function CustomizationSection({ title, options, currentValue, onSelect }: CustomizationSectionProps) {
  return (
    <div class="customization-section">
      <h3 style="margin: 0.5rem 0; font-size: 1.1rem; color: #FFD700;">{title}</h3>
      <div class="customization-options">
        {options.map(option => (
          <button
            key={option.value}
            class={`customization-button ${currentValue === option.value ? 'selected' : ''}`}
            onClick={() => onSelect(option.value)}
            style={{
              padding: '0.5rem 1rem',
              margin: '0.25rem',
              background: currentValue === option.value ? '#4CAF50' : '#333',
              border: currentValue === option.value ? '2px solid #FFD700' : '2px solid #555',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            <div style="font-weight: bold;">{option.label}</div>
            <div style="font-size: 0.75rem; color: #aaa; margin-top: 0.25rem;">
              {option.bonuses.join(', ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CharacterCustomizationScreen() {
  const [customization, setCustomization] = useState<CharacterCustomization>(
    gameState.getCharacterCustomization()
  );

  useEffect(() => {
    const handleCustomized = () => {
      setCustomization(gameState.getCharacterCustomization());
    };
    eventBus.on('character:customized', handleCustomized);
    return () => eventBus.off('character:customized', handleCustomized);
  }, []);

  const updateCustomization = (field: keyof CharacterCustomization, value: string) => {
    gameState.updateCharacterCustomization({ [field]: value });
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="CHARACTER CUSTOMIZATION"
        emoji="✨"
        subtitle="Customize your character's appearance and gain stat bonuses!"
      />

      <div style="max-width: 800px; margin: 0 auto; padding: 1rem;">
        <CustomizationSection
          title="Gender"
          options={GENDER_OPTIONS}
          currentValue={customization.gender}
          onSelect={(value) => updateCustomization('gender', value)}
        />

        <CustomizationSection
          title="Hair Style"
          options={HAIR_STYLE_OPTIONS}
          currentValue={customization.hairStyle}
          onSelect={(value) => updateCustomization('hairStyle', value)}
        />

        <CustomizationSection
          title="Hair Color"
          options={HAIR_COLOR_OPTIONS}
          currentValue={customization.hairColor}
          onSelect={(value) => updateCustomization('hairColor', value)}
        />

        <CustomizationSection
          title="Skin Tone"
          options={SKIN_TONE_OPTIONS}
          currentValue={customization.skinTone}
          onSelect={(value) => updateCustomization('skinTone', value)}
        />

        <CustomizationSection
          title="Eye Color"
          options={EYE_COLOR_OPTIONS}
          currentValue={customization.eyeColor}
          onSelect={(value) => updateCustomization('eyeColor', value)}
        />

        <div style="margin-top: 2rem; padding: 1rem; background: rgba(255, 215, 0, 0.1); border: 2px solid #FFD700; border-radius: 8px;">
          <h3 style="margin: 0 0 0.5rem 0; color: #FFD700;">Current Stats Preview</h3>
          <p style="margin: 0.25rem 0; color: #aaa; font-size: 0.9rem;">
            Your character customization provides permanent stat bonuses that stack with other upgrades and training!
          </p>
        </div>
      </div>

      <CloseButton />
    </ScreenContainer>
  );
}
