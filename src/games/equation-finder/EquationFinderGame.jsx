import React, { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import StatsTracker from '../../components/StatsTracker';
import GameSetup from '../../components/GameSetup';
import useEquationFinder from '../../hooks/useEquationFinder';

const EquationFinderGame = () => {
  // Local state to track game UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const initRef = useRef(false);
  
  const { gameStarted, showSummary, stats, actions } = useGameContext();
  
  // Use our custom game hook
  const {
    currentProblem,
    equations,
    selectedEquations,
    wrongEquations,
    gameComplete,
    animatingCorrect,
    countdown,
    initGame,
    handleEquationClick,
    setCountdown,
    startNewRound
  } = useEquationFinder();
  
  // Advanced handling for game round transitions
  const handleNextRound = () => {
    setIsTransitioning(true);
    actions.incrementTotalRounds();
    
    // Use timeout to ensure UI update before next round
    setTimeout(() => {
      startNewRound();
      setIsTransitioning(false);
    }, 200);
  };
  
  // Setup countdown effect
  useEffect(() => {
    if (gameComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 500);
      
      // Auto-proceed to next round when countdown reaches 0
      if (countdown === 1) {
        setTimeout(() => {
          handleNextRound();
        }, 500);
      }
      
      return () => clearTimeout(timer);
    }
  }, [gameComplete, countdown, setCountdown]);
  
  // Game setup config
  const setupFields = [
    {
      type: 'number',
      name: 'targetNumber',
      label: 'Choose a target number:',
      emoji: '🎯',
      min: 5,
      max: 50,
      placeholder: 'Enter a number (5-50)',
      hint: 'Recommended: 5-10 for younger children, 10-20 for more challenge',
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
        { value: 'both', label: 'Both operations', icon: '🔣' }
      ]
    },
    {
      type: 'optionCount',
      name: 'optionCount',
      label: 'Number of equations:',
      emoji: '🔢'
    }
  ];
  
  // Initial values
  const initialValues = {
    targetNumber: '10',
    operationType: 'addition',
    optionCount: 6
  };
  
  // Handle game start
  const handleStartGame = (values) => {
    console.log('Starting Equation Finder game with values:', values);
    
    // Convert string values to appropriate types and ensure required values are present
    const gameSettings = {
      targetNumber: parseInt(values.targetNumber) || 10,
      operationType: values.operationType || 'addition',
      optionCount: parseInt(values.optionCount) || 6
    };
    
    console.log('Game settings prepared:', gameSettings);
    
    // Start the game with these settings
    actions.startGame(gameSettings);
    
    // Set local playing state
    setIsPlaying(true);
    
    // Reset initialization ref
    initRef.current = false;
    
    // Initialize the game after settings are available
    setTimeout(() => {
      try {
        const success = initGame();
        console.log('Equation Finder game initialization success:', success);
        initRef.current = true;
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
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      {!isPlaying ? (
        <GameSetup
          title="Equation Finder Challenge"
          logoEmoji="🔢"
          fields={setupFields}
          initialValues={initialValues}
          onStart={handleStartGame}
        />
      ) : (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl text-center mb-4">
            {currentProblem ? (
              <span>Find all equations that equal <span className="font-bold text-2xl text-blue-700">🎯 {currentProblem.targetNumber}</span></span>
            ) : (
              <span className="text-gray-400">Preparing your game...</span>
            )}
          </h2>
          
          {/* Stats Tracker Component */}
          <StatsTracker 
            stats={stats}
            showSummary={showSummary}
            onFinish={handleFinish}
            onResume={handleResume}
            onRestart={handleRestart}
          />
          
          {!showSummary && equations && equations.length > 0 && !isTransitioning ? (
            <>
              {/* Grid layout for equations */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {equations.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => handleEquationClick(eq.id)}
                    className={`p-3 rounded-lg text-md font-medium ${
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
                  <div
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors relative overflow-hidden text-center"
                  >
                    <span>⏭️ Next Round ({countdown})</span>
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-yellow-300" 
                      style={{ 
                        width: `${(countdown / 2) * 100}%`,
                        transition: 'width 0.5s linear'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          ) : !showSummary && (
            <div className="flex justify-center items-center h-40">
              <div className="text-blue-500 text-lg animate-pulse">
                {isTransitioning ? "Loading next round..." : "Loading game..."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquationFinderGame;