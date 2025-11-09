# Screenshots Directory

This directory contains screenshots of the game to verify that features are working correctly.

## Purpose

- Verify game functionality after implementing new features
- Document visual changes and improvements
- Ensure game is still playable after code changes

## Naming Convention

Screenshots should be named descriptively:
- `feature-name-YYYY-MM-DD.png` - For feature implementations
- `bugfix-description-YYYY-MM-DD.png` - For bug fixes
- `baseline-YYYY-MM-DD.png` - For baseline game state

## How to Take Screenshots

When working on features locally:
1. Run `npm run dev`
2. Open the game in a browser
3. Navigate to the relevant screen
4. Take a screenshot using your OS tools
5. Save to this directory with a descriptive name

## Note

Screenshots are not required for CI/CD environments where browser automation is not available.
For automated builds, comprehensive unit and integration tests serve as verification.
