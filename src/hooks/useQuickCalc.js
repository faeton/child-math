import { useState, useCallback, useEffect, useRef } from 'react';
import useGameEngine from './useGameEngine';
import { useGameContext } from '../context/GameContext';

/**
 * Custom hook for the Quick Calc game logic
 */
const useQuickCalc = () => {
  const { settings, gameStarted } = useGameContext();
  
  // Additional state specific to QuickCalc
  const [userInput, setUserInput] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); // null, 'correct', or 'wrong'
  const inputRef = useRef(null);
  
  // Generate a new math problem based on the operation type
  const generateProblem = useCallback(() => {
    // Use destructuring with defaults to avoid constant reassignment
    // Clone settings first to avoid issues with undefined
    const settingsCopy = settings ? {...settings} : {};
    
    const { 
      maxNumber = 20, 
      operationType = 'addition', 
      minNumber = 1 
    } = settingsCopy;
    
    // Create a proper problem with controlled answer size
    let num1, num2, operation, correctAnswer;
    
    // Generate numbers and ensure the ANSWER stays within maxNumber
    switch (operationType) {
      case 'addition':
        // Generate two numbers and compute their sum
        num1 = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
        // Ensure adding the second number won't exceed maxNumber
        const maxForNum2 = maxNumber - num1;
        num2 = minNumber + Math.floor(Math.random() * Math.max(1, maxForNum2));
        correctAnswer = num1 + num2;
        operation = '+';
        break;
        
      case 'subtraction':
        // Generate the answer first (has to be at least minNumber)
        correctAnswer = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
        // Generate the subtrahend (second number)
        num2 = minNumber + Math.floor(Math.random() * Math.min(10, maxNumber - minNumber));
        // Calculate the minuend (first number)
        num1 = correctAnswer + num2;
        operation = '-';
        break;
        
      case 'multiplication':
        // Simple multiplication that stays within maxNumber
        const maxFactor = Math.floor(Math.sqrt(maxNumber));
        num1 = minNumber + Math.floor(Math.random() * Math.max(1, maxFactor - minNumber));
        num2 = minNumber + Math.floor(Math.random() * Math.max(1, maxFactor - minNumber));
        correctAnswer = num1 * num2;
        operation = '×';
        break;
        
      case 'division':
        // Start with the quotient (answer)
        correctAnswer = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
        // Choose a small divisor
        num2 = minNumber + Math.floor(Math.random() * Math.min(5, maxNumber/2));
        if (num2 < 1) num2 = 1; // Avoid division by zero
        // Calculate the dividend (first number)
        num1 = correctAnswer * num2;
        operation = '÷';
        break;
        
      case 'mixed':
        // Randomly choose an operation
        const operations = ['+', '-', '×'];
        const randomOpIndex = Math.floor(Math.random() * operations.length);
        operation = operations[randomOpIndex];
        
        if (operation === '+') {
          num1 = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
          const maxForNum2 = maxNumber - num1;
          num2 = minNumber + Math.floor(Math.random() * Math.max(1, maxForNum2));
          correctAnswer = num1 + num2;
        } else if (operation === '-') {
          correctAnswer = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
          num2 = minNumber + Math.floor(Math.random() * Math.min(10, maxNumber - minNumber));
          num1 = correctAnswer + num2;
        } else if (operation === '×') {
          const maxFactor = Math.floor(Math.sqrt(maxNumber));
          num1 = minNumber + Math.floor(Math.random() * Math.max(1, maxFactor - minNumber));
          num2 = minNumber + Math.floor(Math.random() * Math.max(1, maxFactor - minNumber));
          correctAnswer = num1 * num2;
        }
        break;
        
      default:
        // Fallback to addition
        num1 = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
        const maxForNum2Default = maxNumber - num1;
        num2 = minNumber + Math.floor(Math.random() * Math.max(1, maxForNum2Default));
        correctAnswer = num1 + num2;
        operation = '+';
    }
    
    // Ensure all values are at least minNumber
    if (num1 < minNumber) num1 = minNumber;
    if (num2 < minNumber) num2 = minNumber;
    if (correctAnswer < minNumber) correctAnswer = minNumber;
    
    // Double-check that the answer is correct
    let verifiedAnswer;
    switch (operation) {
      case '+': 
        verifiedAnswer = num1 + num2;
        break;
      case '-': 
        verifiedAnswer = num1 - num2;
        break;
      case '×': 
        verifiedAnswer = num1 * num2;
        break;
      case '÷': 
        verifiedAnswer = num1 / num2;
        break;
      default:
        verifiedAnswer = num1 + num2;
    }
    
    // If there's a mismatch, correct it and log a warning
    if (verifiedAnswer !== correctAnswer) {
      console.warn(`Answer mismatch detected! ${num1} ${operation} ${num2} = ${verifiedAnswer}, not ${correctAnswer}`);
      correctAnswer = verifiedAnswer;
    }
    
    const equation = `${num1} ${operation} ${num2}`;
    
    // Reset the user input for the new problem
    setUserInput('');
    setAnswerStatus(null);
    
    console.log(`Generated problem ${equation} = ${correctAnswer}`);
    return { num1, num2, operation, correctAnswer, equation };
  }, [settings]);
  
  // Check if the user's answer is correct
  const checkAnswer = useCallback((problem, answer) => {
    if (!problem) return false;
    
    // For numeric input, we need to parse the answer as a number
    const numericAnswer = parseInt(answer, 10);
    
    // Log the check
    console.log(`Checking answer: user input ${answer}, correct answer ${problem.correctAnswer}`);
    
    // Compare with the correct answer
    return !isNaN(numericAnswer) && numericAnswer === problem.correctAnswer;
  }, []);
  
  // Use the base game engine
  const gameEngine = useGameEngine({
    generateProblem,
    checkAnswer,
    autoAdvance: true,
    autoAdvanceDelay: 1000, // 1 second to show feedback before advancing
    slowResponseTime: 8, // Consider slow response after 8 seconds
  });
  
  // Get the currentProblem and handleAnswer from gameEngine
  const { currentProblem, handleAnswer } = gameEngine;
  
  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setUserInput(value);
      
      // If the expected digit count matches, check the answer automatically
      // and the current problem exists
      if (currentProblem && value.length === currentProblem.correctAnswer.toString().length) {
        // Call handleSubmitAnswer via setTimeout to avoid circular reference
        setTimeout(() => {
          if (value) {
            const isCorrect = checkAnswer(currentProblem, value);
            setAnswerStatus(isCorrect ? 'correct' : 'wrong');
            handleAnswer(value);
          }
        }, 0);
      }
    }
  }, [currentProblem, checkAnswer, handleAnswer]);
  
  // Handle answer submission
  const handleSubmitAnswer = useCallback(() => {
    if (!userInput || !currentProblem) return;
    
    const isCorrect = checkAnswer(currentProblem, userInput);
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');
    
    // Process the answer through the game engine
    handleAnswer(userInput);
  }, [userInput, currentProblem, checkAnswer, handleAnswer]);
  
  // Reset user input when advancing to next problem
  useEffect(() => {
    if (currentProblem) {
      setUserInput('');
      setAnswerStatus(null);
    }
  }, [currentProblem]);
  
  // Handle keypresses (Enter to submit)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  }, [handleSubmitAnswer]);
  
  return {
    ...gameEngine,
    userInput,
    setUserInput,
    answerStatus,
    handleInputChange,
    handleSubmitAnswer,
    handleKeyPress,
    inputRef,
  };
};

export default useQuickCalc;