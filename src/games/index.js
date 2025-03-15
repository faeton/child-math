// Import games
import MathGame from './math-game';

// Define game metadata
const gamesList = [
  {
    id: 'math-equations',
    title: 'Math Equations Game',
    description: 'Find all equations that equal the target number. Great for practicing addition and subtraction skills.',
    icon: '🔢',
    color: 'blue',
    difficulty: 2,
    ageRange: '5-10',
    component: MathGame,
  },
  // More games will be added here in the future
];

export default gamesList;