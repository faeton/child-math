import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center">
          <span className="mr-2">🧩</span>
          <span>Kids Math Games</span>
        </Link>

        <nav>
          {!isHome && (
            <Link to="/" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Back to Games
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;