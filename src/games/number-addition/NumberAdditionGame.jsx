import React, { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import StatsTracker from '../../components/StatsTracker';
import GameSetup from '../../components/GameSetup';
import useNumberAddition from '../../hooks/useNumberAddition';

const NumberAdditionGame = () => {
  // Local state to track game UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const initRef = useRef(false);
  
  const { gameStarted, showSummary, stats, actions } = useGameContext();
  
  // Use our custom game hook
  const {
    currentProblem,
    options,
    isCorrect,
    waitingForCorrection,
    timer,
    showWarning,
    handleAnswer,
    initGame
  } = useNumberAddition();
  
  // Game setup configuration
  const setupFields = [
    {
      type: 'number',
      name: 'maxNumber',
      label: 'Choose a maximum number:',
      emoji: '🎯',
      min: 5,
      max: 20,
      placeholder: 'Enter a number (5-20)',
      hint: 'Recommended: 5-10 for younger children, 10-20 for more challenge',
      required: true
    },
    {
      type: 'optionCount',
      name: 'optionCount',
      label: 'Number of answer choices:',
      emoji: '🔢'
    }
  ];
  
  // Initial values
  const initialValues = {
    maxNumber: '10',
    optionCount: 3
  };
  
  // Handle game start
  const handleStartGame = (values) => {
    console.log('Starting Number Addition game with values:', values);
    
    // Convert string values to appropriate types
    const gameSettings = {
      maxNumber: parseInt(values.maxNumber) || 10,
      optionCount: parseInt(values.optionCount) || 3
    };
    
    console.log('Game settings prepared:', gameSettings);
    
    // Start the game with these settings
    actions.startGame(gameSettings);
    
    // Set local playing state
    setIsPlaying(true);
    
    // Reset initialization ref
    initRef.current = false;
  };
  
  // Explicit initialization of the game
  useEffect(() => {
    if (gameStarted && !initRef.current) {
      console.log('Explicitly initializing the Number Addition game');
      // Add a slight delay to ensure context is updated
      setTimeout(() => {
        try {
          initGame();
          initRef.current = true;
          console.log('Number Addition game initialized');
        } catch (error) {
          console.error('Error initializing game:', error);
        }
      }, 50);
    }
  }, [gameStarted, initGame]);
  
  // Handle showing game summary
  const handleFinish = () => {
    actions.showGameSummary();
  };
  
  // Handle resuming game
  const handleResume = () => {
    actions.hideGameSummary();
  };
  
  // Handle restarting game
  const handleRestart = () => {
    setIsPlaying(false);
    actions.endGame();
    initRef.current = false;
  };
  
  // Sync our local playing state with gameStarted
  useEffect(() => {
    if (!gameStarted && isPlaying) {
      setIsPlaying(false);
    } else if (gameStarted && !isPlaying) {
      setIsPlaying(true);
    }
  }, [gameStarted, isPlaying]);
  
  // Log the current state for debugging
  useEffect(() => {
    console.log('Number Addition Game state:', {
      gameStarted,
      showSummary,
      hasProblem: Boolean(currentProblem),
      hasOptions: Boolean(options) && options.length > 0
    });
  }, [gameStarted, showSummary, currentProblem, options]);
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      {!isPlaying ? (
        <GameSetup
          title="Number Addition Challenge"
          logoEmoji="🧮"
          fields={setupFields}
          initialValues={initialValues}
          onStart={handleStartGame}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">🧮 Number Addition Challenge!</h1>
          
          {/* Stats Tracker Component */}
          <StatsTracker 
            stats={stats}
            showSummary={showSummary}
            onFinish={handleFinish}
            onResume={handleResume}
            onRestart={handleRestart}
          />
          
          {!showSummary && currentProblem && options && options.length > 0 ? (
            <>
              {/* Problem display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">
                  {currentProblem.num1} + {currentProblem.num2} = ?
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
              
              {/* Answer options - Always using 3 columns */}
              <div className="grid grid-cols-3 gap-3">
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
          ) : !showSummary && (
            <div className="flex justify-center items-center h-40">
              <div className="text-blue-500 text-lg">Loading game...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberAdditionGame;