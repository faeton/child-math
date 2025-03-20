import React, { useEffect, useRef } from 'react';
import GameCard from '../components/GameCard';
import MainLayout from '../layouts/MainLayout';
import gamesList from '../games';
import { useGameContext } from '../context/GameContext';

const HomePage = () => {
  const { gameStarted, actions } = useGameContext();
  
  // Use a ref to track if we've already reset the game state
  const hasReset = useRef(false);
  
  // Reset game state when arriving at home page
  // but only do it once per page load
  useEffect(() => {
    if (!hasReset.current && gameStarted) {
      // End any existing game when landing on home page
      actions.endGame();
      hasReset.current = true;
    }
  }, [actions, gameStarted]);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Fun Math Games for Kids</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of interactive math games designed to make learning fun and engaging!
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesList.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
            
            {/* Coming Soon Placeholder Cards */}
            {gamesList.length < 3 && (
              <>
                <div className="h-full p-6 rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-100 mb-4">
                    <span className="text-2xl">🧩</span>
                  </div>
                  <h2 className="text-lg font-medium title-font mb-2">Coming Soon</h2>
                  <p className="leading-relaxed text-base text-center text-gray-500">
                    More fun math games are being developed. Check back soon!
                  </p>
                </div>
                
                <div className="h-full p-6 rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-100 mb-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h2 className="text-lg font-medium title-font mb-2">Coming Soon</h2>
                  <p className="leading-relaxed text-base text-center text-gray-500">
                    More educational games are on the way!
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;