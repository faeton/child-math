import { useState, useCallback } from 'react';
import useGameEngine from './useGameEngine';
import { useGameContext } from '../context/GameContext';

/**
 * Custom hook for the Number Addition game logic
 */
const useNumberAddition = () => {
  const { settings } = useGameContext();
  
  // Additional state specific to the Number Addition game
  const [options, setOptions] = useState([]);
  
  // Generate a new math problem
  const generateProblem = useCallback(() => {
    // Use destructuring with defaults for safety
    const settingsCopy = settings ? {...settings} : {};
    const { maxNumber = 10, optionCount = 3 } = settingsCopy;
    
    console.log("Generating number addition problem with settings:", settingsCopy);
    
    // Generate two numbers that add up to at most maxNumber
    const num1 = 1 + Math.floor(Math.random() * (maxNumber - 1));
    const num2 = 1 + Math.floor(Math.random() * Math.min(maxNumber - num1, maxNumber - 1));
    const correctAnswer = num1 + num2;
    
    console.log(`Generated addition: ${num1} + ${num2} = ${correctAnswer}`);
    
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
    const neededOptions = Math.max(1, optionCount - 1); // Ensure at least 1 wrong option
    
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
    
    // Set the options for the UI
    setOptions(allOptions);
    
    // Return the problem object
    return { num1, num2, correctAnswer };
  }, [settings]);
  
  // Check if an answer is correct
  const checkAnswer = useCallback((problem, selectedAnswer) => {
    if (!problem) return false;
    
    const numericAnswer = parseInt(selectedAnswer, 10);
    
    console.log(`Checking answer: ${numericAnswer} against correct: ${problem.correctAnswer}`);
    
    return !isNaN(numericAnswer) && numericAnswer === problem.correctAnswer;
  }, []);
  
  // Use the base game engine
  const gameEngine = useGameEngine({
    generateProblem,
    checkAnswer,
    autoAdvance: true,
    autoAdvanceDelay: 800, // Slightly faster transitions for simpler game
    slowResponseTime: 8, // Consider slow response after 8 seconds
  });
  
  return {
    ...gameEngine,
    options, // Return the options for rendering
  };
};

export default useNumberAddition;