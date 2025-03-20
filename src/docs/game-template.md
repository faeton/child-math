# Game Development Template

This document explains how to create a new game using our shared game architecture. The architecture separates game logic from rendering, providing reusable components for common functionality.

## Architecture Overview

```
src/
├── context/               # Context providers
│   └── GameContext.jsx    # Shared game state and methods
├── hooks/                 # Custom hooks
│   ├── useGameEngine.js   # Base game engine hook
│   └── useYourGame.js     # Game-specific logic
├── components/            # Reusable UI components
│   ├── StatsTracker.jsx   # Tracks and displays game stats
│   ├── GameSetup.jsx      # Generic game setup UI
├── games/                 # Individual games
│   └── your-game/         # Your new game
│       ├── YourGame.jsx   # Game component
│       └── index.js       # Game exports
```

## Step-by-Step Guide to Create a New Game

### 1. Create Game Directory Structure

```
mkdir -p src/games/your-game
touch src/games/your-game/YourGame.jsx
touch src/games/your-game/index.js
touch src/hooks/useYourGame.js
```

### 2. Create Game-Specific Hook

Create a custom hook in `src/hooks/useYourGame.js` that extends the base game engine:

```javascript
import { useState, useCallback } from 'react';
import useGameEngine from './useGameEngine';
import { useGameContext } from '../context/GameContext';

/**
 * Custom hook for Your Game logic
 */
const useYourGame = () => {
  const { settings } = useGameContext();
  
  // Additional state specific to your game
  const [yourGameState, setYourGameState] = useState(null);
  
  // Generate a new problem for your game
  const generateProblem = useCallback(() => {
    // Use settings to create a problem
    const { difficulty, otherSetting } = settings;
    
    // Your problem generation logic here
    const problem = {
      // Properties of the problem
    };
    
    // Return the problem object
    return problem;
  }, [settings]);
  
  // Check if an answer is correct
  const checkAnswer = useCallback((problem, answer) => {
    if (!problem) return false;
    // Your answer checking logic
    return answer === problem.correctAnswer;
  }, []);
  
  // Optional callbacks
  const onCorrect = useCallback((problem, answer) => {
    // Do something when the answer is correct
  }, []);
  
  const onIncorrect = useCallback((problem, answer) => {
    // Do something when the answer is incorrect
  }, []);
  
  // Use the base game engine
  const gameEngine = useGameEngine({
    generateProblem,
    checkAnswer,
    onCorrect,
    onIncorrect,
    autoAdvance: true, // Change based on your game's needs
    autoAdvanceDelay: 1000, // Milliseconds to wait before moving to next problem
    slowResponseTime: 10, // Time in seconds considered "slow"
  });
  
  return {
    ...gameEngine,
    // Additional state and methods specific to your game
    yourGameState,
    yourGameMethod: () => {
      // Your additional game methods
    }
  };
};

export default useYourGame;
```

### 3. Create Game Component

Create your game component in `src/games/your-game/YourGame.jsx`:

```jsx
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import StatsTracker from '../../components/StatsTracker';
import GameSetup from '../../components/GameSetup';
import useYourGame from '../../hooks/useYourGame';

const YourGame = () => {
  const { gameStarted, showSummary, stats, actions } = useGameContext();
  
  // Use your custom game hook
  const {
    currentProblem,
    isCorrect,
    timer,
    showWarning,
    handleAnswer,
    initGame,
    // Your additional game-specific state and methods
    yourGameState,
    yourGameMethod
  } = useYourGame();
  
  // Define your game's setup configuration
  const setupFields = [
    {
      type: 'number',
      name: 'difficulty',
      label: 'Choose difficulty level:',
      emoji: '🔢',
      min: 1,
      max: 5,
      placeholder: 'Enter difficulty (1-5)',
      hint: 'Higher numbers are more challenging',
      required: true
    },
    // Additional setup fields
  ];
  
  // Initial values for setup
  const initialValues = {
    difficulty: '3',
    // Other initial values
  };
  
  // Handle game start
  const handleStartGame = (values) => {
    // Convert string values to appropriate types
    const gameSettings = {
      ...values,
      difficulty: parseInt(values.difficulty)
      // Convert other values as needed
    };
    
    // Start the game with these settings
    actions.startGame(gameSettings);
    
    // Initialize the game
    initGame();
  };
  
  // Handle UI actions
  const handleFinish = () => actions.showGameSummary();
  const handleResume = () => actions.hideGameSummary();
  const handleRestart = () => actions.endGame();
  
  // Render your game
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      {!gameStarted ? (
        <GameSetup
          title="Your Amazing Game"
          logoEmoji="🎮"
          fields={setupFields}
          initialValues={initialValues}
          onStart={handleStartGame}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
            🎮 Your Amazing Game
          </h1>
          
          {/* Stats Tracker Component */}
          <StatsTracker 
            stats={stats}
            showSummary={showSummary}
            onFinish={handleFinish}
            onResume={handleResume}
            onRestart={handleRestart}
          />
          
          {!showSummary && currentProblem && (
            <>
              {/* Your game-specific UI here */}
              <div className="text-center mb-6">
                {/* Display problem */}
              </div>
              
              {/* Display interactive elements */}
              <div className="grid grid-cols-3 gap-3">
                {/* Your game's interactive elements */}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default YourGame;
```

### 4. Create Game Index File

Create `src/games/your-game/index.js`:

```javascript
import YourGame from './YourGame';
export default YourGame;
```

### 5. Register Your Game

Update `src/games/index.js` to include your game:

```javascript
// Import your game
import YourGame from './your-game';

// Add to games list
const gamesList = [
  // ... existing games
  {
    id: 'your-game',
    title: 'Your Amazing Game',
    description: 'Description of your game',
    icon: '🎮',
    color: 'purple', // Choose from: blue, green, yellow, red, purple
    difficulty: 3, // 1-4, where 4 is most difficult
    ageRange: '7-10', // Target age range
    component: YourGame,
  }
];

export default gamesList;
```

## Tips for Game Development

1. **Separation of Concerns**: Keep game logic in the hook, UI rendering in the component.

2. **Reuse Shared Components**: Use `GameSetup`, `StatsTracker`, etc. to maintain consistency.

3. **Keep Settings in Context**: Store game settings in the GameContext for easy access and state management.

4. **Prefer Pure Functions**: Make your problem generation and answer checking functions pure when possible.

5. **Handle Timing Carefully**: Use the timing utilities from the game engine for consistent player experience.

6. **Accessibility**: Ensure your game is accessible to users with disabilities.

7. **Responsive Design**: All games should work well on mobile, tablet, and desktop.

8. **Educational Focus**: Games should have clear educational objectives and provide feedback.

## Example Game Types

Here are some ideas for additional math games:

- **Multiplication Tables**: Practice multiplication facts
- **Fraction Comparison**: Compare fractions to determine which is larger
- **Shape Recognition**: Identify geometric shapes
- **Pattern Completion**: Complete number patterns
- **Word Problems**: Solve simple word problems
- **Measurement Conversion**: Convert between different units of measurement
- **Time Telling**: Practice reading analog clocks
- **Money Math**: Calculate change or total cost