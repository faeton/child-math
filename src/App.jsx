import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './routes/index'
import GamePage from './routes/GamePage'
import NotFound from './routes/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/:gameId" element={<GamePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App