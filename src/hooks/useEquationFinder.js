import { useState, useCallback, useEffect, useRef } from 'react';
import useGameEngine from './useGameEngine';
import { useGameContext } from '../context/GameContext';

/**
 * Custom hook for the Equation Finder game logic
 */
const useEquationFinder = () => {
  const { settings } = useGameContext();
  
  // Store initial settings to use consistently across rounds
  const initialSettingsRef = useRef(null);
  
  // Additional local state
  const [equations, setEquations] = useState([]);
  const [selectedEquations, setSelectedEquations] = useState([]);
  const [wrongEquations, setWrongEquations] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [animatingCorrect, setAnimatingCorrect] = useState(false);
  const [countdown, setCountdown] = useState(2);
  
  // Store initial settings when first available
  useEffect(() => {
    if (settings && !initialSettingsRef.current) {
      initialSettingsRef.current = {
        optionCount: parseInt(settings.optionCount) || 6,
        operationType: settings.operationType || 'addition',
        targetNumber: parseInt(settings.targetNumber) || 10
      };
      console.log('Stored initial settings:', initialSettingsRef.current);
    }
  }, [settings]);
  
  // Generate a random equation based on operation type
  const generateEquation = useCallback((targetSum, operationType) => {
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
    } else if (operationType === 'both') {
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
    } else {
      // Default to addition if operation type is unknown
      const min = 1;
      const max = targetSum - 1;
      if (min >= max) {
        return { equation: `${min} + ${targetSum - min}`, sum: targetSum, id: Math.random() };
      }
      const num1 = min + Math.floor(Math.random() * (max - min));
      const num2 = targetSum - num1;
      return { equation: `${num1} + ${num2}`, sum: targetSum, id: Math.random() };
    }
  }, []);
  
  // Generate wrong equation
  const generateWrongEquation = useCallback((targetSum, operationType) => {
    // Create a wrong sum that's closer to the target for more challenge
    let wrongSum;
    const offset = Math.floor(Math.random() * 3) + 1;
    
    // 50% chance to be above or below the target
    if (Math.random() > 0.5) {
      wrongSum = targetSum + offset;
    } else {
      wrongSum = Math.max(1, targetSum - offset); // Ensure we don't go below 1
    }
    
    if (operationType === 'addition') {
      const num1 = Math.floor(Math.random() * (targetSum + 2));
      const num2 = wrongSum - num1;
      return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
    } else if (operationType === 'subtraction') {
      const num1 = wrongSum + Math.floor(Math.random() * 5) + 5;
      const num2 = num1 - wrongSum;
      return { equation: `${num1} - ${num2}`, sum: wrongSum, id: Math.random() };
    } else if (operationType === 'both') {
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
    } else {
      // Default to addition
      const num1 = Math.floor(Math.random() * (targetSum + 2));
      const num2 = wrongSum - num1;
      return { equation: `${num1} + ${num2}`, sum: wrongSum, id: Math.random() };
    }
  }, []);
  
  // Problem generator for the game engine
  const generateProblem = useCallback(() => {
    // Use stored initial settings to ensure consistency across rounds
    const storedSettings = initialSettingsRef.current || {};
    const currentSettings = settings || {};
    
    // Log the settings being used
    console.log("Current settings:", currentSettings);
    console.log("Stored initial settings:", storedSettings);
    
    // Use initial settings or fall back to current settings or defaults
    const targetNumber = storedSettings.targetNumber || parseInt(currentSettings.targetNumber) || 10;
    const operationType = storedSettings.operationType || currentSettings.operationType || 'addition';
    const optionCount = storedSettings.optionCount || parseInt(currentSettings.optionCount) || 6;
    
    console.log(`Using targetNumber=${targetNumber}, operationType=${operationType}, optionCount=${optionCount}`);
    
    // Calculate how many correct equations to include - approximately 1/3 of total
    const correctCount = Math.max(1, Math.ceil(optionCount / 3));
    const wrongCount = Math.max(1, optionCount - correctCount);
    
    console.log(`Generating ${correctCount} correct and ${wrongCount} wrong equations`);
    
    try {
      // Generate correct equations
      const correctEquations = Array(correctCount)
        .fill()
        .map(() => generateEquation(targetNumber, operationType));
      
      // Generate wrong equations
      const wrongEquations = Array(wrongCount)
        .fill()
        .map(() => generateWrongEquation(targetNumber, operationType));
      
      // Combine and shuffle
      const allEquations = [...correctEquations, ...wrongEquations];
      for (let i = allEquations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allEquations[i], allEquations[j]] = [allEquations[j], allEquations[i]];
      }
      
      // Set the equations
      setEquations(allEquations);
      setSelectedEquations([]);
      setWrongEquations([]);
      setGameComplete(false);
      setAnimatingCorrect(false);
      
      console.log("Successfully generated equations:", allEquations.length);
      
      // Return the problem (target number is the "problem")
      return { targetNumber };
    } catch (error) {
      console.error("Error generating equations:", error);
      // Return a default problem to avoid crashes
      return { targetNumber };
    }
  }, [settings, generateEquation, generateWrongEquation]);
  
  // Check if an answer (equation) is correct
  const checkAnswer = useCallback((problem, equationId) => {
    if (!problem || !equations.length) return false;
    
    const equation = equations.find(eq => eq.id === equationId);
    const targetNumber = initialSettingsRef.current?.targetNumber || problem.targetNumber || 10;
    
    return equation && equation.sum === targetNumber;
  }, [equations]);
  
  // Prepare the next round
  const startNewRound = useCallback(() => {
    console.log("Starting new equation finder round with stored settings:", initialSettingsRef.current);
    generateProblem();
  }, [generateProblem]);
  
  // Handle equation selection (this extends the basic handleAnswer from gameEngine)
  const handleEquationClick = useCallback((id) => {
    if (!equations.length) return;
    
    const equation = equations.find(eq => eq.id === id);
    
    if (!equation || selectedEquations.includes(id) || wrongEquations.includes(id)) {
      return;
    }
    
    // Use stored initial settings for consistency
    const targetNumber = initialSettingsRef.current?.targetNumber || settings?.targetNumber || 10;
    
    if (equation.sum === targetNumber) {
      // Correct!
      setSelectedEquations(prev => [...prev, id]);
      
      // Check if all correct equations are found
      const correctEquationsCount = equations.filter(eq => eq.sum === targetNumber).length;
      if (selectedEquations.length + 1 === correctEquationsCount) {
        setGameComplete(true);
        setCountdown(2);
        setAnimatingCorrect(true);
      }
    } else {
      // Wrong!
      setWrongEquations(prev => [...prev, id]);
      
      // Remove from wrongEquations after a delay
      setTimeout(() => {
        setWrongEquations(prev => prev.filter(eqId => eqId !== id));
      }, 1000);
    }
  }, [equations, selectedEquations, wrongEquations, settings]);
  
  // Use the base game engine
  const gameEngine = useGameEngine({
    generateProblem,
    checkAnswer,
    autoAdvance: false, // We'll handle this ourselves based on finding all equations
  });
  
  return {
    ...gameEngine,
    // Additional state
    equations,
    selectedEquations,
    wrongEquations,
    gameComplete,
    animatingCorrect,
    countdown,
    
    // Additional methods
    handleEquationClick,
    setCountdown,
    startNewRound
  };
};

export default useEquationFinder;