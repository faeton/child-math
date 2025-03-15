## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── GameCard.jsx      # Card for displaying a game on the home page
│   ├── Header.jsx        # Application header
│   └── Footer.jsx        # Application footer
├── config/               # Configuration files
│   └── games.js          # Platform-wide configuration
├── games/                # Individual games
│   ├── index.js          # Games registry
│   └── math-game/        # Math Equations Game
│       ├── MathGame.jsx  # Game component
│       └── index.js      # Game exports
├── layouts/              # Layout components
│   └── MainLayout.jsx    # Main application layout
├── routes/               # Route components
│   ├── index.jsx         # Home page (game chooser)
│   ├── GamePage.jsx      # Individual game page
│   └── NotFound.jsx      # 404 page
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

2. **Create the main game component**:
   
   Create your main game component file:
   ```
   src/games/your-new-game/YourNewGame.jsx
   ```

3. **Create an index.js file**:
   
   Create an index.js file that exports your game:
   ```javascript
   // src/games/your-new-game/index.js
   import YourNewGame from './YourNewGame';
   export default YourNewGame;
   ```

4. **Register the game in the games index**:
   
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

1. **Self-contained components**: Each game should be a self-contained component that manages its own state.

2. **Responsive design**: All games should be responsive and work well on various screen sizes.

3. **Consistent UI**: Use the platform's color scheme and UI components when possible for a consistent user experience.

4. **Educational focus**: Games should have clear educational objectives and provide feedback to users.

5. **Accessibility**: Ensure games are accessible to users with disabilities.

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

## Future Enhancements

Planned enhancements for the platform include:

1. User accounts and progress tracking
2. Achievement system
3. Difficulty settings
4. Analytics to track game usage
5. Dark mode support
6. Additional educational games

## Troubleshooting

If you encounter issues with the platform, check the following:

1. Ensure all dependencies are installed with `npm install`
2. Verify that your game component is properly exported and registered
3. Check browser console for any JavaScript errors
4. Ensure the routes are correctly defined in `App.jsx`