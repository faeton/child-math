// Import games
import EquationFinderGame from './equation-finder';
import NumberAdditionGame from './number-addition';

// Define game metadata
const gamesList = [
  {
    id: 'equation-finder',
    title: 'Equation Finder Challenge',
    description: 'Find all equations that equal the target number. Great for practicing addition and subtraction skills.',
    icon: '🔢',
    color: 'blue',
    difficulty: 2,
    ageRange: '5-10',
    component: EquationFinderGame,
  },
  {
    id: 'number-addition',
    title: 'Number Addition Challenge',
    description: 'Practice addition with multiple choice answers. Race against the clock to improve your math skills!',
    icon: '🧮',
    color: 'green',
    difficulty: 1,
    ageRange: '3-7',
    component: NumberAdditionGame,
  },
  // More games will be added here in the future
];

export default gamesList;