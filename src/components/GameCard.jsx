import React from 'react';
import { Link } from 'react-router-dom';
import platformConfig from '../config/games';

const GameCard = ({ game }) => {
  const { id, title, description, icon, color, difficulty, ageRange } = game;

  const cardColors = {
    blue: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    green: 'bg-green-100 border-green-300 hover:bg-green-200',
    yellow: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    red: 'bg-red-100 border-red-300 hover:bg-red-200',
    purple: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
  };

  const cardColor = cardColors[color] || cardColors.blue;
  const difficultyText = platformConfig.difficultyLevels[difficulty] || 'Medium';
  const ageRangeText = platformConfig.ageRanges[ageRange] || ageRange;

  return (
    <Link to={`/games/${id}`} className="block">
      <div className={`game-card h-full p-6 rounded-lg border-2 ${cardColor} transition-colors flex flex-col`}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-white mb-4 flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: difficulty }, (_, i) => (
              <span key={i} className="w-3 h-3 rounded-full bg-gray-500"></span>
            ))}
          </div>
        </div>
        <h2 className="text-lg font-medium title-font mb-2">{title}</h2>
        <p className="leading-relaxed text-base flex-grow">{description}</p>
        <div className="mt-3 flex items-center">
          <p className="text-sm text-gray-500">Ages {ageRange}</p>
          <span className="ml-auto bg-white py-1 px-3 rounded-full text-sm">Play</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;