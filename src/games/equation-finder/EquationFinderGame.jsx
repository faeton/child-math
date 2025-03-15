import React, { useState, useEffect } from 'react';
import StatsTracker from '../../components/StatsTracker';
import { useGameTimer } from '../../utils/game-timer-util';

const EquationFinderGame = () => {
  // Generate a random default number between 5 and 99
  const getRandomDefault = () => Math.floor(Math.random() * 95) + 5;
  
  const [targetNumber, setTargetNumber] = useState('');
  const [inputTarget, setInputTarget] = useState('');
  const [inputError, setInputError] = useState('');
  const [equations, setEquations] = useState([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [selectedEquations, setSelectedEquations] = useState([]);
  const [wrongEquations, setWrongEquations] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [operationType, setOperationType] = useState('addition');
  const [animatingCorrect, setAnimatingCorrect] = useState(false);
  const [randomDefault, setRandomDefault] = useState(getRandomDefault());
  const [showSummary, setShowSummary] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
    slow: 0,
    timeSpent: 0
  });
  
  // Use our custom timer hook
  const { elapsedTime, resetTimer } = useGameTimer(gameStarted, showSummary);
  
  // Set a new random default whenever game is reset
  useEffect(() => {
    if (!gameStarted) {
      setRandomDefault(getRandomDefault());
    }
  }, [gameStarted]);

  // Update gameStats with the current elapsed time
  useEffect(() => {
    setGameStats(prev => ({
      ...prev,
      timeSpent: elapsedTime
    }));
  }, [elapsedTime]);
  
  // Generate random equation
  const generateEquation = (targetSum) => {
    if (operationType === 'addition') {
      // Ensure we avoid trivial equations with +0 by setting a minimum of 1 for each number
      const min = 1;
      const max = targetSum - 1;
      // Handle edge case for very small target sums
      if (min >= max) {
        return { equation: `${min} + ${targetSum - min}`, sum: targetSum, id: Math.random() };
      }
      const num1 = min + Math.floor(Math.random() * (max - min));
      const num2 = targetSum - num1;
      return { equation: `${num1} + ${num2}`, sum: targetSum, id: Math.random() };
    } else if (operationType === 'subtraction') {
      // For subtraction, make sure we don't have trivial equations with -0
      const min = targetSum + 1; // Ensure first number is at least target+1
      const max = targetSum + 10; // Limit how high we go
      const num1 = min + Math.floor(Math.random() * (max - min));
      const num2 = num1 - targetSum;
      return { equation: `${num1} - ${num2}`, sum: targetSum, id: Math.random() };
    } else {
      // Both operations
      if (Math.random() > 0.5) {
        // Addition with non-zero operands
        const min = 1;
        const max = targetSum - 1;
        if (min >= max) {
          return { equation: `${min} + ${targetSum - min}`, sum: targetSum, id: Math.random() };
        }
        const num1 = min + Math.floor(Math.random() * (max - min));
        const num2 = targetSum - num1;
        return { equation: `${num1} + ${num2}`, sum: targetSum, id: Math.random() };
      } else {
        // Subtraction with non-zero results
        const min = targetSum + 1;
        const max = targetSum + 10;
        const num1 = min + Math.floor(Math.random() * (max - min));
        const num2 = num1 - targetSum;
        return { equation: `${num1} - ${num2}`, sum: targetSum, id: Math.random() };
      }
    }
  };
  
  // Generate wrong equation that's more challenging
  const generateWrongEquation = (targetSum) => {
    // Create a wrong sum that's closer to the target for more challenge
    // We'll generate sums that are +/- 1-3 from the target
    let wrongSum;
    const offset = Math.floor(Math.random() * 3) + 1;
    
    // 50% chance to be above or below the target
    if (Math.random() > 0.5) {
      wrongSum = targetSum + offset;
    } else {
      wrongSum = Math.max(1, targetSum - offset); // Ensure we don't go below 1
    }
    
    if (operationType === 'addition') {
      // Make the equation look plausible by using numbers close to what might be in correct equations
      const num1 = Math.floor(Math.random() * (targetSum + 2));
      const num2 = wrongSum - num1;
      return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
    } else if (operationType === 'subtraction') {
      const num1 = wrongSum + Math.floor(Math.random() * 5) + 5; // More varied first number
      const num2 = num1 - wrongSum;
      return { equation: `${num1} - ${num2}`, sum: wrongSum, id: Math.random() };
    } else {
      // Both operations
      if (Math.random() > 0.5) {
        const num1 = Math.floor(Math.random() * (targetSum + 2));
        const num2 = wrongSum - num1;
        return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
      } else {
        const num1 = wrongSum + Math.floor(Math.random() * 5) + 5;
        const num2 = num1 - wrongSum;
        return { equation: `${num1} - ${num2}`, sum: wrongSum, id: Math.random() };
      }
    }
  };
  
  // Calculate appropriate number of equations based on target
  const calculateEquationCounts = (target) => {
    // Default minimum is 1 correct answer and 4 total options for number 5
    // Then scale up based on the target number
    
    if (target < 5) {
      return { correctCount: 1, totalCount: 4 };
    }
    
    // For numbers 5-7
    if (target <= 7) {
      return { correctCount: 1, totalCount: 4 };
    }
    
    // For numbers 8-9
    if (target <= 9) {
      return { correctCount: 2, totalCount: 6 };
    }
    
    // For numbers 10-15
    if (target <= 15) {
      return { correctCount: 3, totalCount: 8 };
    }
    
    // For numbers 16+
    return { correctCount: 4, totalCount: 12 };
  };
  
  // Start a new game
  const startGame = () => {
    // Use input value if provided, otherwise use the random default
    const targetInput = inputTarget.trim() === '' ? randomDefault : parseInt(inputTarget);
    
    // Validate input is a number and at least 5
    if (isNaN(targetInput)) {
      setInputError('Please enter a valid number');
      return;
    }
    
    if (targetInput < 5) {
      setInputError('Number must be at least 5');
      return;
    }
    
    setInputError('');
    setTargetNumber(targetInput);
    
    // Calculate appropriate counts
    const { correctCount, totalCount } = calculateEquationCounts(targetInput);
    const wrongCount = totalCount - correctCount;
    
    // Generate correct equations
    const correctEquations = Array(correctCount).fill().map(() => generateEquation(targetInput));
    
    // Generate wrong equations
    const wrongEquations = Array(wrongCount).fill().map(() => generateWrongEquation(targetInput));
    
    // Combine and shuffle more thoroughly
    const allEquations = [...correctEquations, ...wrongEquations];
    
    // Fisher-Yates shuffle algorithm for better randomization
    for (let i = allEquations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allEquations[i], allEquations[j]] = [allEquations[j], allEquations[i]];
    }
    
    setEquations(allEquations);
    setSelectedEquations([]);
    setWrongEquations([]);
    setGameStarted(true);
    setGameComplete(false);
    setAnimatingCorrect(false);
    setShowSummary(false);
    setGameStats({
      correct: 0,
      wrong: 0,
      total: 0,
      slow: 0,
      timeSpent: 0
    });
    
    // Reset the timer
    resetTimer();
  };
  
  // Reset animatingCorrect when starting a new round
  const startNewRound = () => {
    setAnimatingCorrect(false);
    setInputTarget(''); // Clear the input for the next round
    // Update stats before starting a new round
    setGameStats(prev => ({
      ...prev,
      total: prev.total + 1
    }));
    startGame(); // This will use a new random default
  };
  
  // Handle equation selection
  const handleEquationClick = (id, sum) => {
    if (selectedEquations.includes(id) || wrongEquations.includes(id)) return;
    
    if (sum === targetNumber) {
      // Correct!
      setSelectedEquations(prev => [...prev, id]);
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setGameStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }));
    } else {
      // Wrong!
      setWrongEquations(prev => [...prev, id]);
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      setGameStats(prev => ({
        ...prev,
        wrong: prev.wrong + 1
      }));
      
      // Remove from wrongEquations after a delay
      setTimeout(() => {
        setWrongEquations(prev => prev.filter(eqId => eqId !== id));
      }, 1000);
    }
  };
  
  // Reset the game completely
  const resetGame = () => {
    setInputTarget('');
    setTargetNumber('');
    setEquations([]);
    setSelectedEquations([]);
    setWrongEquations([]);
    setScore({ correct: 0, wrong: 0 });
    setGameStarted(false);
    setGameComplete(false);
    setShowSummary(false);
    setGameStats({
      correct: 0,
      wrong: 0,
      total: 0,
      slow: 0,
      timeSpent: 0
    });
    resetTimer();
    // This will trigger the useEffect to set a new random default
  };

  // Handle finish button click
  const handleFinish = () => {
    setShowSummary(true);
  };

  // Handle resume game
  const handleResume = () => {
    setShowSummary(false);
    // Timer will automatically resume due to the useGameTimer hook
  };

  // Handle restart game
  const handleRestart = () => {
    resetGame();
  };
  
  // Check if all correct equations are found
  useEffect(() => {
    if (!gameStarted || showSummary) return;
    
    const correctEquationsCount = equations.filter(eq => eq.sum === targetNumber).length;
    if (selectedEquations.length === correctEquationsCount && correctEquationsCount > 0) {
      setGameComplete(true);
      setCountdown(2);
      setAnimatingCorrect(true);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 500);
      
      // Auto-proceed to next round after 2 seconds
      const timer = setTimeout(() => {
        startNewRound();
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [selectedEquations, equations, targetNumber, gameStarted, showSummary]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {!gameStarted ? (
          <>
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">🔢 Equation Finder Challenge 🧠</h1>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-medium">
                Choose a target number: 🎯
                <input
                  type="number"
                  min="5"
                  value={inputTarget}
                  onChange={(e) => {
                    setInputTarget(e.target.value);
                    setInputError('');
                  }}
                  className={`w-full p-2 mt-2 border-2 ${inputError ? 'border-red-500' : 'border-blue-300'} rounded-lg text-xl`}
                  placeholder={`Enter a number (default: ${randomDefault})`}
                />
              </label>
              {inputError && (
                <p className="text-red-500 text-sm mt-1">{inputError}</p>
              )}
              
              <div className="mt-4">
                <p className="text-lg font-medium mb-2">Choose operation type: 🧮</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="operationType"
                      value="addition"
                      checked={operationType === 'addition'}
                      onChange={() => setOperationType('addition')}
                      className="mr-2"
                    />
                    <span className="text-lg">➕ Addition only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="operationType"
                      value="subtraction"
                      checked={operationType === 'subtraction'}
                      onChange={() => setOperationType('subtraction')}
                      className="mr-2"
                    />
                    <span className="text-lg">➖ Subtraction only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="operationType"
                      value="both"
                      checked={operationType === 'both'}
                      onChange={() => setOperationType('both')}
                      className="mr-2"
                    />
                    <span className="text-lg">🔣 Both operations</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors mt-4"
              >
                Start Game 🚀
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl text-center mb-4">
              Find all equations that equal <span className="font-bold text-2xl text-blue-700">🎯 {targetNumber}</span>
            </h2>
            
            {/* Stats Tracker Component */}
            <StatsTracker 
              stats={gameStats}
              showSummary={showSummary}
              onFinish={handleFinish}
              onResume={handleResume}
              onRestart={handleRestart}
            />
            
            {!showSummary && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {equations.map((eq) => (
                    <button
                      key={eq.id}
                      onClick={() => handleEquationClick(eq.id, eq.sum)}
                      className={`p-3 rounded-lg text-lg font-medium ${
                        selectedEquations.includes(eq.id)
                          ? 'bg-green-500 text-white'
                          : wrongEquations.includes(eq.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-200 hover:bg-blue-300'
                      }`}
                      style={{
                        transform: !selectedEquations.includes(eq.id) && animatingCorrect ? 'scale(0)' : 'scale(1)',
                        opacity: !selectedEquations.includes(eq.id) && animatingCorrect ? 0 : 1,
                        transition: 'transform 0.5s ease, opacity 0.5s ease, background-color 0.3s ease'
                      }}
                      disabled={selectedEquations.includes(eq.id)}
                    >
                      {eq.equation}
                    </button>
                  ))}
                </div>
                
                {gameComplete && (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                      <p className="text-lg font-bold text-green-700">🎉 Great job! You found all equations! 🌟</p>
                    </div>
                    <button
                      onClick={startNewRound}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors relative overflow-hidden"
                    >
                      <span>⏭️ Next Round ({countdown})</span>
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-yellow-300" 
                        style={{ 
                          width: `${(countdown / 2) * 100}%`,
                          transition: 'width 0.5s linear'
                        }}
                      ></div>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EquationFinderGame;