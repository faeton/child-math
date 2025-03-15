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
  
  // Stats state
  const [gameStats, setGameStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
    slow: 0,
    timeSpent: 0
  });
  
  // Use our custom timer hook
  const { elapsedTime, resetTimer } = useGameTimer(true, showSummary);

  // Update gameStats with the current elapsed time
  useEffect(() => {
    setGameStats(prev => ({
      ...prev,
      timeSpent: elapsedTime
    }));
  }, [elapsedTime]);

  // Generate a new math problem
  const generateProblem = () => {
    // For now just focus on addition with sum <= 10
    // Avoid trivial problems with +0 by ensuring num1 and num2 are at least 1
    const num1 = 1 + Math.floor(Math.random() * 9);
    const num2 = 1 + Math.floor(Math.random() * (9 - num1 + 1));
    const correctAnswer = num1 + num2;
    
    // Generate incorrect answers that aren't the same as num1 or num2
    let incorrectOptions = [];
    while (incorrectOptions.length < 3) {
      const wrongAnswer = Math.floor(Math.random() * 15);
      if (wrongAnswer !== correctAnswer && 
          wrongAnswer !== num1 && 
          wrongAnswer !== num2 && 
          !incorrectOptions.includes(wrongAnswer)) {
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

  // Start the app
  useEffect(() => {
    generateProblem();
    resetTimer();
  }, []);
  
  // Timer effect for the question timeout
  useEffect(() => {
    if (isCorrect !== null || showSummary) return;
    
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
  }, [showWarning, isCorrect, showSummary]);

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    // If already waiting for correction, only allow clicking the correct answer
    if (waitingForCorrection) {
      if (selectedAnswer === currentProblem.correctAnswer) {
        // Move to next question after clicking the correct answer
        setTimeout(() => {
          generateProblem();
        }, 500);
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
      
      // Move to next question automatically after delay
      setTimeout(() => {
        generateProblem();
      }, 1000);
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
    // Timer will automatically resume due to the useGameTimer hook
  };

  // Handle restart game
  const handleRestart = () => {
    setScore(0);
    setWrongAnswers(0);
    setTotalAttempted(0);
    setSlowResponses(0);
    setTimer(0);
    setShowSummary(false);
    setGameStats({
      correct: 0,
      wrong: 0,
      total: 0,
      slow: 0,
      timeSpent: 0
    });
    resetTimer();
    generateProblem();
  };

  // Main app rendering
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">🧮 Number Addition Challenge! 🧮</h1>
        
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
            <div className="grid grid-cols-2 gap-3">
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
      </div>
    </div>
  );
};

export default NumberAdditionGame;