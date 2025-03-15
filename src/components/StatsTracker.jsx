import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime, calculateAverageTime } from '../utils/game-timer-util';

const StatsTracker = ({ stats, showSummary, onFinish, onResume, onRestart }) => {
  const { correct, wrong, total, slow, timeSpent } = stats;
  
  // Calculate percentage score
  const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  // Generate a performance message
  const getPerformanceMessage = () => {
    if (total < 5) return "Keep going to see your performance!";
    if (scorePercentage >= 90) return "Excellent work! You're a math superstar! 🌟";
    if (scorePercentage >= 75) return "Great job! You're doing well! 👍";
    if (scorePercentage >= 60) return "Good effort! Keep practicing! 💪";
    return "Keep practicing, you'll improve! 📚";
  };

  return (
    <div className="mb-6">
      {/* Regular stats bar shown during gameplay */}
      {!showSummary && (
        <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded-lg">
          <div className="text-green-600 font-semibold">
            ✅ {correct}
          </div>
          <div className="text-red-600 font-semibold">
            ❌ {wrong}
          </div>
          <div className="text-blue-600 font-semibold">
            📊 {total}
          </div>
          <div className="text-orange-600 font-semibold">
            ⏱️ {formatTime(timeSpent)}
          </div>
          <button
            onClick={onFinish}
            className="ml-2 w-8 h-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
            title="Show Summary"
          >
            📈
          </button>
        </div>
      )}
      
      {/* Detailed summary stats */}
      {showSummary && (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Game Summary</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="text-center mb-2">
              <span className="text-4xl font-bold text-blue-600">{scorePercentage}%</span>
            </div>
            <p className="text-center text-gray-700 font-medium">{getPerformanceMessage()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{correct}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Wrong Answers</p>
              <p className="text-2xl font-bold text-red-600">{wrong}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Attempted</p>
              <p className="text-2xl font-bold text-yellow-600">{total}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Slow Responses</p>
              <p className="text-2xl font-bold text-orange-600">{slow}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Avg. Time per Answer</p>
              <p className="text-2xl font-bold text-blue-600">{calculateAverageTime(timeSpent, total)}s</p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-between">
            <button 
              onClick={onRestart} 
              className="flex-grow bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Restart 🔄
            </button>
            <button 
              onClick={onResume} 
              className="flex-grow bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Continue ▶️
            </button>
            <Link 
              to="/" 
              className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors"
            >
              Exit 🚪
            </Link>
          </div>
        </div>
      )}
      
      {/* Finish button at the bottom of the game */}
      {/* Removed full-width button since we now have the emoji button in the stats bar */}
    </div>
  );
};

export default StatsTracker;