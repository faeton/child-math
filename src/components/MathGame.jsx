import React, { useState, useEffect } from 'react';

const MathGame = () => {
  const [targetNumber, setTargetNumber] = useState('');
  const [inputTarget, setInputTarget] = useState('');
  const [equations, setEquations] = useState([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [selectedEquations, setSelectedEquations] = useState([]);
  const [wrongEquations, setWrongEquations] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [operationType, setOperationType] = useState('addition');
  
  // Generate random equation
  const generateEquation = (targetSum) => {
    if (operationType === 'addition') {
      const num1 = Math.floor(Math.random() * targetSum);
      const num2 = targetSum - num1;
      return { equation: `${num1} + ${num2}`, sum: targetSum, id: Math.random() };
    } else if (operationType === 'subtraction') {
      const num1 = targetSum + Math.floor(Math.random() * 10) + 1;
      const num2 = num1 - targetSum;
      return { equation: `${num1} - ${num2}`, sum: targetSum, id: Math.random() };
    } else {
      // Both operations
      if (Math.random() > 0.5) {
        const num1 = Math.floor(Math.random() * targetSum);
        const num2 = targetSum - num1;
        return { equation: `${num1} + ${num2}`, sum: targetSum, id: Math.random() };
      } else {
        const num1 = targetSum + Math.floor(Math.random() * 10) + 1;
        const num2 = num1 - targetSum;
        return { equation: `${num1} - ${num2}`, sum: targetSum, id: Math.random() };
      }
    }
  };
  
  // Generate wrong equation
  const generateWrongEquation = (targetSum) => {
    let wrongSum = targetSum;
    while (wrongSum === targetSum) {
      wrongSum = Math.floor(Math.random() * 20) + 1;
    }
    
    if (operationType === 'addition') {
      const num1 = Math.floor(Math.random() * wrongSum);
      const num2 = wrongSum - num1;
      return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
    } else if (operationType === 'subtraction') {
      const num1 = wrongSum + Math.floor(Math.random() * 10) + 1;
      const num2 = num1 - wrongSum;
      return { equation: `${num1} - ${num2}`, sum: wrongSum, id: Math.random() };
    } else {
      // Both operations
      if (Math.random() > 0.5) {
        const num1 = Math.floor(Math.random() * wrongSum);
        const num2 = wrongSum - num1;
        return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
      } else {
        const num1 = wrongSum + Math.floor(Math.random() * 10) + 1;
        const num2 = num1 - wrongSum;
        return { equation: `${num1} - ${num2}`, sum: wrongSum, id: Math.random() };
      }
    }
  };
  
  // Start a new game
  const startGame = () => {
    const target = parseInt(inputTarget) || 10;
    setTargetNumber(target);
    
    // Adjust number of equations based on target value
    const correctCount = target <= 10 ? 3 : 4;
    const wrongCount = target <= 10 ? 5 : 8;
    
    // Generate correct equations
    const correctEquations = Array(correctCount).fill().map(() => generateEquation(target));
    
    // Generate wrong equations
    const wrongEquations = Array(wrongCount).fill().map(() => generateWrongEquation(target));
    
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
  };
  
  // Handle equation selection
  const handleEquationClick = (id, sum) => {
    if (selectedEquations.includes(id) || wrongEquations.includes(id)) return;
    
    if (sum === targetNumber) {
      // Correct!
      setSelectedEquations(prev => [...prev, id]);
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      // Wrong!
      setWrongEquations(prev => [...prev, id]);
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      
      // Remove from wrongEquations after a delay
      setTimeout(() => {
        setWrongEquations(prev => prev.filter(eqId => eqId !== id));
      }, 1000);
    }
  };
  
  // Start a new round with the same target
  const startNewRound = () => {
    startGame();
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
  };
  
  // Check if all correct equations are found
  useEffect(() => {
    if (!gameStarted) return;
    
    const correctEquationsCount = equations.filter(eq => eq.sum === targetNumber).length;
    if (selectedEquations.length === correctEquationsCount && correctEquationsCount > 0) {
      setGameComplete(true);
      setCountdown(2);
      
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
  }, [selectedEquations, equations, targetNumber, gameStarted]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">🔢 Math Equations Game 🧠</h1>
        
        {!gameStarted ? (
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium">
              Choose a target number: 🎯
              <input
                type="number"
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                className="w-full p-2 mt-2 border-2 border-blue-300 rounded-lg text-xl"
                placeholder="Enter a number (default: 10)"
              />
            </label>
            
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
        ) : (
          <>
            <div className="bg-blue-100 p-4 rounded-lg mb-4">
              <h2 className="text-xl text-center">
                Find all equations that equal <span className="font-bold text-2xl text-blue-700">🎯 {targetNumber}</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {equations.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleEquationClick(eq.id, eq.sum)}
                  className={`p-3 rounded-lg text-lg font-medium transition-colors ${
                    selectedEquations.includes(eq.id)
                      ? 'bg-green-500 text-white'
                      : wrongEquations.includes(eq.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                  disabled={selectedEquations.includes(eq.id)}
                >
                  {eq.equation}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg">
                <span className="font-bold text-green-600">✅ Correct: {score.correct}</span>
              </div>
              <div className="text-lg">
                <span className="font-bold text-red-600">❌ Wrong: {score.wrong}</span>
              </div>
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
            
            <button
              onClick={resetGame}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🔄 Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MathGame;
