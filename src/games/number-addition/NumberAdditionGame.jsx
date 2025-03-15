import React, { useState, useEffect } from 'react';
import StatsTracker from '../../components/StatsTracker';
import { useGameTimer } from '../../utils/game-timer-util';

const NumberAdditionGame = () => {
  // Game state
  const [currentProblem, setCurrentProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [slowResponses, setSlowResponses] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [waitingForCorrection, setWaitingForCorrection] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // Setup state
  const [gameStarted, setGameStarted] = useState(false);
  const [maxNumberInput, setMaxNumberInput] = useState("10");
  const [maxNumber, setMaxNumber] = useState(10);
  const [setupError, setSetupError] = useState('');
  const [optionCount, setOptionCount] = useState(4);
  
  // Timing constants (in milliseconds)
  const CORRECT_ANSWER_DELAY = 500; // Reduced from 1000ms to 500ms
  const CORRECTION_CLICK_DELAY = 300; // Reduced from 500ms to 300ms
  
  // Stats state
  const [gameStats, setGameStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
    slow: 0,
    timeSpent: 0
  });
  
  // Use our custom timer hook
  const { elapsedTime, resetTimer } = useGameTimer(gameStarted, showSummary);

  // Update gameStats with the current elapsed time
  useEffect(() => {
    setGameStats(prev => ({
      ...prev,
      timeSpent: elapsedTime
    }));
  }, [elapsedTime]);

  // Get recommended option count based on max number
  const getRecommendedOptionCount = (maxNum) => {
    if (maxNum <= 10) return 4;
    if (maxNum <= 15) return 6;
    return 8;
  };

  // Update option count when max number changes
  useEffect(() => {
    const parsedMaxNumber = parseInt(maxNumberInput);
    if (!isNaN(parsedMaxNumber) && parsedMaxNumber >= 5 && parsedMaxNumber <= 20) {
      const recommended = getRecommendedOptionCount(parsedMaxNumber);
      setOptionCount(recommended);
    }
  }, [maxNumberInput]);

  // Generate a new math problem
  const generateProblem = () => {
    // Adjust range based on maxNumber setting
    // Avoid trivial problems with +0 by ensuring num1 and num2 are at least 1
    const num1 = 1 + Math.floor(Math.random() * (maxNumber - 1));
    const num2 = 1 + Math.floor(Math.random() * (maxNumber - num1));
    const correctAnswer = num1 + num2;
    
    // Create more challenging wrong answers that require more thought
    const generateChallengeOption = () => {
      // Different strategies to create plausible wrong answers
      const strategies = [
        // Off by 1 or 2 (common mistake)
        () => correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 1 : 2),
        // Swapped digits if answer is two digits
        () => {
          if (correctAnswer >= 10) {
            const tens = Math.floor(correctAnswer / 10);
            const ones = correctAnswer % 10;
            return ones * 10 + tens;
          } else {
            return correctAnswer + Math.floor(Math.random() * 5) + 1;
          }
        },
        // Using one of the operands as answer (common beginner mistake)
        () => Math.random() > 0.5 ? num1 : num2,
        // Wrong operation (subtraction instead of addition)
        () => Math.abs(num1 - num2),
        // Random but close to correct answer
        () => correctAnswer + Math.floor(Math.random() * 5) - 2
      ];
      
      // Pick random strategy
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      let wrongAnswer = strategy();
      
      // Ensure the wrong answer is positive and not the same as the correct answer
      if (wrongAnswer <= 0 || wrongAnswer === correctAnswer) {
        wrongAnswer = 1 + Math.floor(Math.random() * (maxNumber * 2 - 1));
        if (wrongAnswer === correctAnswer) wrongAnswer++;
      }
      
      return wrongAnswer;
    };
    
    // Generate wrong answers
    let incorrectOptions = [];
    const neededOptions = optionCount - 1; // -1 because we'll add the correct answer
    
    while (incorrectOptions.length < neededOptions) {
      const wrongAnswer = generateChallengeOption();
      if (!incorrectOptions.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
        incorrectOptions.push(wrongAnswer);
      }
    }
    
    // Combine correct and incorrect answers, then shuffle
    const allOptions = [correctAnswer, ...incorrectOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setCurrentProblem({ num1, num2, correctAnswer });
    setOptions(allOptions);
    setTimer(0);
    setShowWarning(false);
    setIsCorrect(null);
    setWaitingForCorrection(false);
  };

  // Start the game
  const startGame = () => {
    const parsedMaxNumber = parseInt(maxNumberInput);
    
    if (isNaN(parsedMaxNumber) || parsedMaxNumber < 5 || parsedMaxNumber > 20) {
      setSetupError('Please enter a number between 5 and 20');
      return;
    }
    
    setMaxNumber(parsedMaxNumber);
    setSetupError('');
    setGameStarted(true);
    setScore(0);
    setWrongAnswers(0);
    setTotalAttempted(0);
    setSlowResponses(0);
    setShowSummary(false);
    setGameStats({
      correct: 0,
      wrong: 0,
      total: 0,
      slow: 0,
      timeSpent: 0
    });
    
    generateProblem();
    resetTimer();
  };

  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setShowSummary(false);
  };
  
  // Timer effect for the question timeout
  useEffect(() => {
    if (!gameStarted || isCorrect !== null || showSummary) return;
    
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        const newTimer = prevTimer + 1;
        
        // Check if time is up (10 seconds)
        if (newTimer >= 10 && !showWarning) {
          setShowWarning(true);
          setSlowResponses(prev => prev + 1);
          setGameStats(prev => ({
            ...prev,
            slow: prev.slow + 1
          }));
        }
        
        return newTimer;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameStarted, showWarning, isCorrect, showSummary]);

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    // If already waiting for correction, only allow clicking the correct answer
    if (waitingForCorrection) {
      if (selectedAnswer === currentProblem.correctAnswer) {
        // Move to next question after clicking the correct answer - FASTER
        setTimeout(() => {
          generateProblem();
        }, CORRECTION_CLICK_DELAY);
      }
      return;
    }
    
    if (isCorrect !== null && !waitingForCorrection) return; // Prevent multiple answers
    
    const correct = selectedAnswer === currentProblem.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      // Correct answer
      setScore(prev => prev + 1);
      setTotalAttempted(prev => prev + 1);
      setGameStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
      
      // Move to next question automatically after delay - FASTER
      setTimeout(() => {
        generateProblem();
      }, CORRECT_ANSWER_DELAY);
    } else {
      // Wrong answer
      setWrongAnswers(prev => prev + 1);
      setGameStats(prev => ({
        ...prev,
        wrong: prev.wrong + 1
      }));
      setWaitingForCorrection(true);
      // Don't increment totalAttempted yet, wait for correct click
    }
  };

  // Handle finish button click
  const handleFinish = () => {
    setShowSummary(true);
  };

  // Handle resume game
  const handleResume = () => {
    setShowSummary(false);
  };

  // Handle restart game
  const handleRestart = () => {
    resetGame();
  };

  // Main app rendering
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {!gameStarted ? (
          // Setup Screen
          <>
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">🧮 Number Addition Challenge! 🧮</h1>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-medium">
                Choose a maximum number: 🎯
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={maxNumberInput}
                  onChange={(e) => {
                    setMaxNumberInput(e.target.value);
                    setSetupError('');
                  }}
                  className={`w-full p-2 mt-2 border-2 ${setupError ? 'border-red-500' : 'border-blue-300'} rounded-lg text-xl text-gray-700 bg-white`}
                  placeholder="Enter a number (5-20)"
                />
              </label>
              {setupError && (
                <p className="text-red-500 text-sm mt-1">{setupError}</p>
              )}
              <p className="text-sm text-gray-600 -mt-2">
                Recommended: 5-10 for younger children, 10-20 for more challenge
              </p>
              
              <div className="mt-4">
                <p className="text-lg font-medium mb-2">
                  Number of answer choices: 🔢 
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    (Recommended: {optionCount})
                  </span>
                </p>
                <div className="flex gap-3">
                  {[4, 6, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => setOptionCount(num)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                        optionCount === num 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
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
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">🧮 Number Addition Challenge!</h1>
            
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
                {/* Problem display */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">
                    {currentProblem?.num1} + {currentProblem?.num2} = ?
                  </div>
                  
                  {/* Timer display */}
                  <div className="mt-2 text-gray-500">
                    Time: {timer} seconds
                  </div>
                  
                  {/* Slow warning */}
                  {showWarning && (
                    <div className="mt-2 text-red-500 font-semibold animate-pulse">
                      Hurry up! You're taking too long!
                    </div>
                  )}
                  
                  {/* Waiting for correction instruction */}
                  {waitingForCorrection && (
                    <div className="mt-2 text-orange-500 font-semibold">
                      Find the correct answer!
                    </div>
                  )}
                </div>
                
                {/* Answer options */}
                <div className={`grid ${optionCount <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className={`py-4 text-xl font-bold rounded-lg shadow transition-colors duration-200 
                        ${waitingForCorrection
                          ? option === currentProblem.correctAnswer 
                            ? 'bg-green-500 text-white animate-pulse' 
                            : 'bg-red-200 text-gray-600' 
                          : isCorrect === true && option === currentProblem.correctAnswer
                            ? 'bg-green-500 text-white'
                            : isCorrect === false && option === currentProblem.correctAnswer
                              ? 'bg-green-500 text-white animate-pulse'
                              : isCorrect === false && option !== currentProblem.correctAnswer
                                ? 'bg-red-200 text-gray-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                      onClick={() => handleAnswer(option)}
                      disabled={isCorrect === true && !waitingForCorrection}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NumberAdditionGame;