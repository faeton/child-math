## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── GameCard.jsx      # Card for displaying a game on the home page
│   ├── Header.jsx        # Application header
│   └── Footer.jsx        # Application footer
├── config/               # Configuration files
│   └── games.js          # Platform-wide configuration
├── context/              # React context providers
│   └── GameContext.jsx   # Shared game state management
├── games/                # Individual games
│   ├── index.js          # Games registry
│   ├── equation-finder/  # Equation Finder Game
│   │   ├── EquationFinderGame.jsx  # Game component
│   │   └── index.js      # Game exports
│   ├── number-addition/  # Number Addition Game  
│   │   ├── NumberAdditionGame.jsx  # Game component
│   │   └── index.js      # Game exports
│   └── quick-calc/       # Quick Calc Game
│       ├── QuickCalcGame.jsx  # Game component
│       └── index.js      # Game exports
├── hooks/                # Custom React hooks
│   ├── useGameEngine.js  # Shared game logic
│   ├── useEquationFinder.js  # Equation Finder game logic
│   ├── useNumberAddition.js  # Number Addition game logic
│   └── useQuickCalc.js   # Quick Calc game logic
├── layouts/              # Layout components
│   └── MainLayout.jsx    # Main application layout
├── routes/               # Route components
│   ├── index.jsx         # Home page (game chooser)
│   ├── GamePage.jsx      # Individual game page
│   └── NotFound.jsx      # 404 page
├── utils/                # Utility functions
│   └── game-timer-util.js # Timer utilities for games
├── App.jsx               # Main application component with routing
├── App.css               # Application-specific styles
├── index.css             # Global styles
└── main.jsx              # Application entry point
```

## How to Add a New Game

To add a new game to the platform, follow these steps:

1. **Create a folder for your game**:
   
   Create a new folder in the `src/games/` directory with your game's name.
   ```
   src/games/your-new-game/
   ```

2. **Create game-specific hook**:
   
   Create a hook for your game's logic in `src/hooks/`:
   ```
   src/hooks/useYourNewGame.js
   ```

3. **Create the main game component**:
   
   Create your main game component file:
   ```
   src/games/your-new-game/YourNewGame.jsx
   ```

4. **Create an index.js file**:
   
   Create an index.js file that exports your game:
   ```javascript
   // src/games/your-new-game/index.js
   import YourNewGame from './YourNewGame';
   export default YourNewGame;
   ```

5. **Register the game in the games index**:
   
   Add your game to the games list in `src/games/index.js`:
   ```javascript
   // src/games/index.js
   import MathGame from './math-game';
   import YourNewGame from './your-new-game';

   const gamesList = [
     {
       id: 'math-equations',
       title: 'Math Equations Game',
       // ... other properties
       component: MathGame,
     },
     {
       id: 'your-game-id',
       title: 'Your Game Title',
       description: 'Short description of your game',
       icon: '🎮', // Choose an appropriate emoji
       color: 'green', // Choose from: blue, green, yellow, red, purple
       difficulty: 2, // 1-4, where 4 is most difficult
       ageRange: '7-10', // Target age range
       component: YourNewGame,
     }
   ];

   export default gamesList;
   ```

## Game Development Guidelines

When creating a new game, follow these guidelines:

1. **Shared State Management**: Use the GameContext for shared state like scores, settings, etc.

2. **Hooks-Based Logic**: Put game-specific logic in a custom hook (e.g., `useYourGame.js`)

3. **Self-contained components**: Each game should be a self-contained component that connects to the shared context.

4. **Responsive design**: All games should be responsive and work well on various screen sizes.

5. **Consistent UI**: Use the platform's color scheme and UI components when possible for a consistent user experience.

6. **Educational focus**: Games should have clear educational objectives and provide feedback to users.

7. **Accessibility**: Ensure games are accessible to users with disabilities.

## Cloudflare Pages Deployment

This project is configured to deploy to Cloudflare Pages with the following considerations:

1. All necessary configuration files for Cloudflare Pages are included:
   - `_headers`
   - `_redirects`
   - `_routes.json`

2. SPA routing is configured to handle client-side routing correctly.

3. The build process copies these files to the dist folder during build.

To deploy:
```bash
npm run deploy
```

## Known Issues & Future Enhancements

### Known Issues

1. **Equation Finder Game**: 
   - Option count inconsistency: First round sometimes ignores the selected number of options
   - Operations selection: Sometimes defaults to addition regardless of selected operation type

2. **Game Navigation**:
   - Occasional reset issues when navigating between games
   - Slow transition between game rounds

3. **Quick Calc Game**:
   - Input focus issues on mobile devices
   - Occasional incorrect answer validation

### Planned Enhancements

1. **User accounts and progress tracking**
2. **Achievement system**
3. **Difficulty settings that adapt to player performance**
4. **Analytics to track game usage**
5. **Dark mode support**
6. **Additional educational games:**
   - Multiplication Tables
   - Fraction Comparison
   - Shape Recognition
   - Pattern Completion
   - Word Problems

## Troubleshooting

If you encounter issues with the platform, check the following:

1. Ensure all dependencies are installed with `npm install`
2. Verify that your game component is properly exported and registered
3. Check browser console for any JavaScript errors
4. Ensure the routes are correctly defined in `App.jsx`
5. Verify that your game hook is properly handling state and game logic