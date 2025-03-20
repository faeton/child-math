import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useGameTimer } from '../utils/game-timer-util';

// Create Context
const GameContext = createContext();

// Initial state for any game
const initialState = {
  gameStarted: false,
  showSummary: false,
  stats: {
    correct: 0,
    wrong: 0,
    total: 0,
    slow: 0,
    timeSpent: 0
  },
  settings: {},
  initialized: false,
};

// Action types
const actions = {
  START_GAME: 'START_GAME',
  END_GAME: 'END_GAME',
  SHOW_SUMMARY: 'SHOW_SUMMARY',
  HIDE_SUMMARY: 'HIDE_SUMMARY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RECORD_CORRECT: 'RECORD_CORRECT',
  RECORD_WRONG: 'RECORD_WRONG',
  RECORD_SLOW: 'RECORD_SLOW',
  INCREMENT_TOTAL: 'INCREMENT_TOTAL',
  RESET_STATS: 'RESET_STATS',
  SET_TIME_SPENT: 'SET_TIME_SPENT',
  SET_INITIALIZED: 'SET_INITIALIZED',
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case actions.START_GAME:
      return {
        ...state,
        gameStarted: true,
        showSummary: false,
        initialized: true,
      };
    case actions.END_GAME:
      return {
        ...initialState,  // Reset to initial state completely
      };
    case actions.SHOW_SUMMARY:
      return {
        ...state,
        showSummary: true,
      };
    case actions.HIDE_SUMMARY:
      return {
        ...state,
        showSummary: false,
      };
    case actions.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case actions.RECORD_CORRECT:
      return {
        ...state,
        stats: {
          ...state.stats,
          correct: state.stats.correct + 1,
        },
      };
    case actions.RECORD_WRONG:
      return {
        ...state,
        stats: {
          ...state.stats,
          wrong: state.stats.wrong + 1,
        },
      };
    case actions.RECORD_SLOW:
      return {
        ...state,
        stats: {
          ...state.stats,
          slow: state.stats.slow + 1,
        },
      };
    case actions.INCREMENT_TOTAL:
      return {
        ...state,
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
        },
      };
    case actions.RESET_STATS:
      return {
        ...state,
        stats: {
          correct: 0,
          wrong: 0,
          total: 0,
          slow: 0,
          timeSpent: 0,
        },
      };
    case actions.SET_TIME_SPENT:
      return {
        ...state,
        stats: {
          ...state.stats,
          timeSpent: action.payload,
        },
      };
    case actions.SET_INITIALIZED:
      return {
        ...state,
        initialized: action.payload,
      };
    default:
      return state;
  }
};

// Provider Component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { gameStarted, showSummary } = state;
  
  // Use the timer hook
  const { elapsedTime, resetTimer } = useGameTimer(gameStarted, showSummary);
  
  // Update time spent - only when game is actively running
  useEffect(() => {
    if (gameStarted && !showSummary) {
      const timeoutId = setTimeout(() => {
        dispatch({ 
          type: actions.SET_TIME_SPENT, 
          payload: elapsedTime 
        });
      }, 1000); // Only update once per second to reduce renders
      
      return () => clearTimeout(timeoutId);
    }
  }, [elapsedTime, gameStarted, showSummary]);
  
  // Memoize action creators to prevent recreation on each render
  const startGame = useCallback((settings = {}) => {
    console.log('GameContext: startGame with settings', settings);
    
    // Update settings first
    dispatch({ 
      type: actions.UPDATE_SETTINGS, 
      payload: settings 
    });
    
    // Reset stats
    dispatch({ type: actions.RESET_STATS });
    
    // Start the game
    dispatch({ type: actions.START_GAME });
    
    // Reset timer
    resetTimer();
  }, [resetTimer]);
  
  const endGame = useCallback(() => {
    console.log('GameContext: endGame');
    resetTimer();
    dispatch({ type: actions.END_GAME });
  }, [resetTimer]);
  
  const showGameSummary = useCallback(() => {
    dispatch({ type: actions.SHOW_SUMMARY });
  }, []);
  
  const hideGameSummary = useCallback(() => {
    dispatch({ type: actions.HIDE_SUMMARY });
  }, []);
  
  const recordCorrectAnswer = useCallback(() => {
    dispatch({ type: actions.RECORD_CORRECT });
  }, []);
  
  const recordWrongAnswer = useCallback(() => {
    dispatch({ type: actions.RECORD_WRONG });
  }, []);
  
  const recordSlowResponse = useCallback(() => {
    dispatch({ type: actions.RECORD_SLOW });
  }, []);
  
  const incrementTotalRounds = useCallback(() => {
    dispatch({ type: actions.INCREMENT_TOTAL });
  }, []);
  
  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: actions.UPDATE_SETTINGS, payload: newSettings });
  }, []);
  
  const resetGameStats = useCallback(() => {
    dispatch({ type: actions.RESET_STATS });
    resetTimer();
  }, [resetTimer]);
  
  const setInitialized = useCallback((value) => {
    dispatch({ type: actions.SET_INITIALIZED, payload: value });
  }, []);
  
  // Value to be provided - memoize actions object to prevent recreating on each render
  const actionCreators = {
    startGame,
    endGame,
    showGameSummary,
    hideGameSummary,
    recordCorrectAnswer,
    recordWrongAnswer,
    recordSlowResponse,
    incrementTotalRounds,
    updateSettings,
    resetGameStats,
    resetTimer,
    setInitialized
  };
  
  return (
    <GameContext.Provider value={{...state, actions: actionCreators}}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export default GameContext;