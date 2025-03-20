import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './routes/index'
import GamePage from './routes/GamePage'
import NotFound from './routes/NotFound'
import { GameProvider } from './context/GameContext'
import './App.css'

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:gameId" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GameProvider>
  )
}

export default App