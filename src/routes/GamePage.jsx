import React, { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import gamesList from '../games';
import { useGameContext } from '../context/GameContext';

const GamePage = () => {
  const { gameId } = useParams();
  const { gameStarted, actions } = useGameContext();
  
  // Find the game by ID
  const game = gamesList.find(g => g.id === gameId);
  
  // Use a ref to track the current gameId to prevent unnecessary resets
  const currentGameIdRef = useRef(gameId);
  
  // Only run once on component mount
  useEffect(() => {
    // Don't reset on mount - we'll actually let the game component handle its own initialization
    console.log('GamePage mounted with gameId:', gameId);
    
    // Store the initial gameId
    currentGameIdRef.current = gameId;
    
    // No reset on mount
    
    // Cleanup only when truly unmounting (not just effect cleanup)
    return () => {
      console.log('GamePage unmounting completely');
      // Only reset if a game is actually started
      if (gameStarted) {
        actions.endGame();
      }
    };
  }, []); // Empty dependency array = only run on mount/unmount
  
  // If game doesn't exist, redirect to home
  if (!game) {
    return <Navigate to="/" replace />;
  }
  
  const GameComponent = game.component;
  
  return (
    <MainLayout>
      <GameComponent />
    </MainLayout>
  );
};

export default GamePage;