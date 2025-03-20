import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';

/**
 * Base hook for game logic implementation
 * 
 * @param {Object} options Configuration options for the game
 * @returns {Object} Game state and methods
 */
const useGameEngine = (options = {}) => {
  const { 
    generateProblem, // Function to generate a new problem
    checkAnswer,     // Function to check if an answer is correct
    onCorrect,       // Optional callback when answer is correct
    onIncorrect,     // Optional callback when answer is incorrect
    onRoundComplete, // Optional callback when a round is complete
    autoAdvance = true, // Whether to automatically advance to the next problem
    autoAdvanceDelay = 1000, // Delay before auto-advancing (ms)
    slowResponseTime = 10, // Time in seconds considered "slow"
  } = options;
  
  // Access the central game context
  const { 
    gameStarted, 
    showSummary,
    stats,
    settings, 
    actions 
  } = useGameContext();
  
  // Track if initialization has been attempted
  const hasInitialized = useRef(false);
  
  // Local state for current problem - explicitly initialize as null
  const [currentProblem, setCurrentProblem] = useState(null);
  
  // Answer tracking
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [waitingForCorrection, setWaitingForCorrection] = useState(false);
  
  // Timer for slow response warning
  const [timer, setTimer] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // Initialize a new problem
  const initProblem = useCallback(() => {
    console.log('initProblem called. Settings:', settings);
    
    if (typeof generateProblem === 'function') {
      try {
        const problem = generateProblem(settings);
        console.log('Problem generated:', problem);
        
        // Ensure the problem is valid before setting state
        if (problem) {
          setCurrentProblem(problem);
          setIsCorrect(null);
          setSelectedAnswer(null);
          setWaitingForCorrection(false);
          setTimer(0);
          setShowWarning(false);
          console.log('Problem state updated successfully');
          return true;
        } else {
          console.error('Problem generation returned null or undefined');
          return false;
        }
      } catch (error) {
        console.error('Error generating problem:', error);
        return false;
      }
    } else {
      console.error('generateProblem is not a function');
      return false;
    }
  }, [generateProblem, settings]);
  
  // Start a new round (updates stats)
  const startNewRound = useCallback(() => {
    actions.incrementTotalRounds();
    initProblem();
  }, [actions, initProblem]);
  
  // Handle answer selection
  const handleAnswer = useCallback((answer) => {
    // Don't process if game is paused or already answered correctly
    if (showSummary || (isCorrect === true && !waitingForCorrection)) {
      return;
    }
    
    // Don't process if no current problem
    if (!currentProblem) {
      return;
    }
    
    // If waiting for correction, only allow selecting the correct answer
    if (waitingForCorrection) {
      if (typeof checkAnswer === 'function' && checkAnswer(currentProblem, answer)) {
        setIsCorrect(true);
        
        // Move to next problem after a delay
        if (autoAdvance) {
          setTimeout(() => {
            startNewRound();
          }, autoAdvanceDelay / 2); // Faster for correction clicks
        }
      }
      return;
    }
    
    // Normal answer processing
    setSelectedAnswer(answer);
    
    if (typeof checkAnswer === 'function') {
      const correct = checkAnswer(currentProblem, answer);
      setIsCorrect(correct);
      
      if (correct) {
        // Record correct answer
        actions.recordCorrectAnswer();
        
        // Call the optional callback
        if (typeof onCorrect === 'function') {
          onCorrect(currentProblem, answer);
        }
        
        // Move to next problem automatically if enabled
        if (autoAdvance) {
          setTimeout(() => {
            startNewRound();
          }, autoAdvanceDelay);
        }
      } else {
        // Record wrong answer
        actions.recordWrongAnswer();
        
        // Call the optional callback
        if (typeof onIncorrect === 'function') {
          onIncorrect(currentProblem, answer);
        }
        
        // Set waiting for correction if not auto-advancing
        setWaitingForCorrection(true);
      }
    }
  }, [
    showSummary, isCorrect, waitingForCorrection, checkAnswer, 
    currentProblem, autoAdvance, startNewRound, 
    autoAdvanceDelay, actions, onCorrect, onIncorrect
  ]);
  
  // Initialize game - called when game is first started
  const initGame = useCallback(() => {
    console.log('initGame called, gameStarted:', gameStarted);
    hasInitialized.current = true;
    return initProblem();
  }, [initProblem, gameStarted]);
  
  // Start timer for slow response detection
  useEffect(() => {
    if (!gameStarted || isCorrect !== null || showSummary || !currentProblem) return;
    
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        const newTimer = prevTimer + 1;
        
        // Check if time exceeds the slow response threshold
        if (newTimer >= slowResponseTime && !showWarning) {
          setShowWarning(true);
          actions.recordSlowResponse();
        }
        
        return newTimer;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameStarted, isCorrect, showSummary, slowResponseTime, showWarning, actions, currentProblem]);
  
  // Check if round is complete (custom logic can be provided)
  useEffect(() => {
    if (!gameStarted || !currentProblem || showSummary) return;
    
    // Call the optional round complete callback if provided and if isCorrect is true
    if (isCorrect === true && typeof onRoundComplete === 'function') {
      onRoundComplete(currentProblem);
    }
  }, [gameStarted, currentProblem, isCorrect, showSummary, onRoundComplete]);
  
  // Automatically initialize the first problem when the game starts
  // This effect runs only once when the component mounts and whenever gameStarted changes
  useEffect(() => {
    console.log('Auto-init effect. gameStarted:', gameStarted, 'hasInitialized:', hasInitialized.current);
    
    if (gameStarted && !hasInitialized.current) {
      console.log('Auto-initializing game');
      initProblem();
      hasInitialized.current = true;
    }
    
    // Reset initialization flag when game ends
    if (!gameStarted) {
      console.log('Resetting initialization flag');
      hasInitialized.current = false;
    }
  }, [gameStarted, initProblem]);
  
  return {
    // State
    currentProblem,
    isCorrect,
    selectedAnswer,
    waitingForCorrection,
    timer,
    showWarning,
    
    // Methods
    handleAnswer,
    initGame,
    startNewRound,
  };
};

export default useGameEngine;