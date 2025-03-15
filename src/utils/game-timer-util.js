import { useState, useEffect } from 'react';

/**
 * Custom hook for handling game timing with pause/resume functionality
 * @param {boolean} isActive - Whether the timer should be active
 * @param {boolean} isPaused - Whether the timer is paused (e.g., when showing stats)
 * @returns {Object} - Timer state and controls
 */
export const useGameTimer = (isActive = false, isPaused = false) => {
  const [timerState, setTimerState] = useState({
    elapsedTime: 0,        // Total elapsed time in seconds
    startTime: Date.now(), // Reference point for calculations
    pausedAt: null,        // When the timer was paused
    isPaused: false        // Current pause state
  });

  // Effect to handle timer updates
  useEffect(() => {
    // Don't run timer if game is not active or is explicitly paused
    if (!isActive || isPaused) {
      // If we're pausing now but weren't paused before
      if (isPaused && !timerState.isPaused) {
        setTimerState(prev => ({
          ...prev,
          isPaused: true,
          pausedAt: prev.elapsedTime // Store the exact time when paused
        }));
      }
      return;
    }

    // If we're resuming from a pause
    if (!isPaused && timerState.isPaused) {
      setTimerState(prev => ({
        ...prev,
        startTime: Date.now() - (prev.pausedAt * 1000), // Adjust start time
        isPaused: false,
        pausedAt: null
      }));
      return;
    }

    // Normal timer operation
    const interval = setInterval(() => {
      setTimerState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, timerState.isPaused]);

  // Reset the timer
  const resetTimer = () => {
    setTimerState({
      elapsedTime: 0,
      startTime: Date.now(),
      pausedAt: null,
      isPaused: false
    });
  };

  return {
    elapsedTime: timerState.elapsedTime,
    resetTimer
  };
};

/**
 * Format seconds into minutes:seconds format
 * @param {number} seconds - Total seconds
 * @returns {string} - Formatted time string (e.g., "2:45")
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate average time per answer
 * @param {number} totalTime - Total time in seconds
 * @param {number} totalAnswers - Number of answers
 * @returns {string} - Formatted average time with one decimal place
 */
export const calculateAverageTime = (totalTime, totalAnswers) => {
  if (totalAnswers === 0) return "0.0";
  return (totalTime / totalAnswers).toFixed(1);
};