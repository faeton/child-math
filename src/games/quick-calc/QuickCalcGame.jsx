import React, { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import StatsTracker from '../../components/StatsTracker';
import GameSetup from '../../components/GameSetup';
import useQuickCalc from '../../hooks/useQuickCalc';
import './QuickCalc.css'; // Import CSS instead of using inline styles

const QuickCalcGame = () => {
  // Local state to track game UI state
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { gameStarted, showSummary, stats, actions } = useGameContext();
  
  // Create a local ref for the input to avoid undefined issues
  const localInputRef = useRef(null);
  
  // Use our custom game hook
  const {
    currentProblem,
    userInput,
    answerStatus,
    timer,
    showWarning,
    initGame,
    handleInputChange,
    handleSubmitAnswer,
    handleKeyPress,
    inputRef
  } = useQuickCalc();
  
  // Game setup configuration
  const setupFields = [
    {
      type: 'number',
      name: 'maxNumber',
      label: 'Maximum number in problems:',
      emoji: '🔢',
      min: 5,
      max: 100,
      placeholder: 'Enter a number (5-100)',
      hint: 'Higher numbers create more challenging problems',
      required: true
    },
    {
      type: 'radio',
      name: 'operationType',
      label: 'Choose operation type:',
      emoji: '🧮',
      options: [
        { value: 'addition', label: 'Addition only', icon: '➕' },
        { value: 'subtraction', label: 'Subtraction only', icon: '➖' },
        { value: 'multiplication', label: 'Multiplication only', icon: '✖️' },
        { value: 'division', label: 'Division only', icon: '➗' },
        { value: 'mixed', label: 'Mixed operations', icon: '🔣' }
      ]
    }
  ];
  
  // Initial values
  const initialValues = {
    maxNumber: '20',
    operationType: 'addition'
  };
  
  // Handle game start
  const handleStartGame = (values) => {
    // Convert string values to appropriate types and ensure required values are present
    const gameSettings = {
      maxNumber: parseInt(values.maxNumber) || 20,
      operationType: values.operationType || 'addition',
      minNumber: 1
    };
    
    // Start the game with these settings
    actions.startGame(gameSettings);
    
    // Set local playing state
    setIsPlaying(true);
    
    // Initialize the game after settings are available
    setTimeout(() => {
      try {
        const success = initGame();
        console.log('Game initialization success:', success);
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    }, 100);
  };
  
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
    
    // Give time for the state to reset before allowing start again
    setTimeout(() => {
      console.log('Ready to start new game');
    }, 100);
  };
  
  // Focus the input field when currentProblem changes
  useEffect(() => {
    if (isPlaying && !showSummary && currentProblem && localInputRef.current) {
      localInputRef.current.focus();
    }
  }, [isPlaying, showSummary, currentProblem]);
  
  // Sync our local playing state with gameStarted
  useEffect(() => {
    if (!gameStarted && isPlaying) {
      setIsPlaying(false);
    } else if (gameStarted && !isPlaying) {
      setIsPlaying(true);
    }
  }, [gameStarted, isPlaying]);
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      {!isPlaying ? (
        <GameSetup
          title="Quick Calc Challenge"
          logoEmoji="🧮"
          fields={setupFields}
          initialValues={initialValues}
          onStart={handleStartGame}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">🧮 Quick Calc Challenge!</h1>
          
          {/* Stats Tracker Component */}
          <StatsTracker 
            stats={stats}
            showSummary={showSummary}
            onFinish={handleFinish}
            onResume={handleResume}
            onRestart={handleRestart}
          />
          
          {!showSummary && currentProblem ? (
            <>
              {/* Problem display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold my-4">
                  {currentProblem.equation} = ?
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
              </div>
              
              {/* Answer input */}
              <div className="flex flex-col items-center">
                <div className={`relative w-full max-w-xs mb-4 ${
                  answerStatus === 'correct' ? 'input-correct' : 
                  answerStatus === 'wrong' ? 'input-wrong' : ''
                }`}>
                  <input
                    ref={localInputRef}
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className={`w-full text-center py-4 px-6 text-4xl font-bold rounded-lg border-4 ${
                      answerStatus === 'correct' ? 'border-green-500 bg-green-100' : 
                      answerStatus === 'wrong' ? 'border-red-500 bg-red-100' : 
                      'border-blue-300 focus:border-blue-500 focus:outline-none'
                    }`}
                    placeholder="?"
                    autoComplete="off"
                  />
                  
                  {/* Feedback animations */}
                  {answerStatus === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-green-500 text-5xl animate-bounce">✓</span>
                    </div>
                  )}
                  
                  {answerStatus === 'wrong' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-red-500 text-5xl animate-bounce">✗</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSubmitAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
                >
                  Submit Answer
                </button>
              </div>
              
              {/* Hint text */}
              <p className="text-gray-600 text-center mt-6">
                Type your answer using the number pad. The answer will automatically submit when you enter all digits!
              </p>
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

export default QuickCalcGame;