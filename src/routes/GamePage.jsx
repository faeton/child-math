import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import gamesList from '../games';

const GamePage = () => {
  const { gameId } = useParams();
  
  // Find the game by ID
  const game = gamesList.find(g => g.id === gameId);
  
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