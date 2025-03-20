import EquationFinderGame from './equation-finder';
import NumberAdditionGame from './number-addition';
import QuickCalcGame from './quick-calc';

const gamesList = [
  {
    id: 'equation-finder',
    title: 'Equation Finder',
    description: 'Find all equations that equal the target number',
    icon: '🔢',
    color: 'blue',
    difficulty: 3,
    ageRange: '8-12',
    component: EquationFinderGame,
  },
  {
    id: 'number-addition',
    title: 'Number Addition',
    description: 'Solve simple addition problems',
    icon: '➕',
    color: 'green',
    difficulty: 1,
    ageRange: '5-8',
    component: NumberAdditionGame,
  },
  {
    id: 'quick-calc',
    title: 'Quick Calc',
    description: 'Solve math problems by typing the answers',
    icon: '🧮',
    color: 'purple',
    difficulty: 2,
    ageRange: '7-12',
    component: QuickCalcGame,
  }
];

export default gamesList;