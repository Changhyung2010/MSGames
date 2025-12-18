import { useState } from 'react'
import './App.css'
import { MinesweeperGame } from './minesweeper/MinesweeperGame'
import { SnakeGame } from './snake/SnakeGame'

type GameType = 'minesweeper' | 'snake'

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('minesweeper')

  return (
    <div className="app-container">
      <nav className="game-nav">
        <button
          className={`game-nav-btn ${currentGame === 'minesweeper' ? 'active' : ''}`}
          onClick={() => setCurrentGame('minesweeper')}
        >
          Minesweeper
        </button>
        <button
          className={`game-nav-btn ${currentGame === 'snake' ? 'active' : ''}`}
          onClick={() => setCurrentGame('snake')}
        >
          Snake
        </button>
      </nav>
      {currentGame === 'minesweeper' ? <MinesweeperGame /> : <SnakeGame />}
    </div>
  )
}
