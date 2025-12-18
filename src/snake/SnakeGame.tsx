import { useMemo } from 'react'
import { useSnake } from './useSnake'
import './snake.css'

export function SnakeGame() {
  const { state, start, reset, changeDirection } = useSnake()

  const statusText = useMemo(() => {
    switch (state.status) {
      case 'ready':
        return 'Press any arrow key to start'
      case 'playing':
        return 'Use arrow keys to move'
      case 'pause':
        return 'Paused - Press space to resume'
      case 'gameOver':
        return `Game Over! Score: ${state.score} - Press space to restart`
      default:
        return ''
    }
  }, [state.status, state.score])

  const cellSize = useMemo(() => {
    // Calculate cell size based on available space
    const maxWidth = 600
    const cellSize = Math.floor(maxWidth / state.config.cols)
    return Math.max(20, Math.min(cellSize, 30))
  }, [state.config.cols])

  return (
    <div className="snake-root">
      <header className="snake-header">
        <div>
          <h1 className="snake-title">Snake</h1>
          <p className="snake-subtitle">{statusText}</p>
        </div>

        <div className="snake-controls">
          <div className="snake-counter">
            <span className="snake-counter-label">Score</span>
            <span className="snake-counter-value">{state.score}</span>
          </div>
          <button className="snake-reset" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <div className="snake-board-container">
        <div
          className="snake-board"
          style={{
            gridTemplateColumns: `repeat(${state.config.cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${state.config.rows}, ${cellSize}px)`,
          }}
        >
          {Array.from({ length: state.config.rows * state.config.cols }, (_, i) => {
            const x = i % state.config.cols
            const y = Math.floor(i / state.config.cols)
            const isSnakeHead = state.snake[0]?.x === x && state.snake[0]?.y === y
            const isSnakeBody = state.snake.slice(1).some((seg) => seg.x === x && seg.y === y)
            const isFood = state.food.x === x && state.food.y === y

            let className = 'snake-cell'
            if (isSnakeHead) {
              className += ' snake-cell--head'
            } else if (isSnakeBody) {
              className += ' snake-cell--body'
            } else if (isFood) {
              className += ' snake-cell--food'
            } else {
              className += ' snake-cell--empty'
            }

            return <div key={`${x}-${y}`} className={className} />
          })}
        </div>
      </div>

      <div className="snake-control-buttons">
        <button
          className="snake-direction-btn"
          onClick={() => changeDirection('up')}
          aria-label="Move up"
        >
          ↑
        </button>
        <div className="snake-direction-row">
          <button
            className="snake-direction-btn"
            onClick={() => changeDirection('left')}
            aria-label="Move left"
          >
            ←
          </button>
          <button
            className="snake-direction-btn snake-direction-btn--center"
            onClick={() => start()}
            aria-label="Start/Pause"
          >
            ⏸
          </button>
          <button
            className="snake-direction-btn"
            onClick={() => changeDirection('right')}
            aria-label="Move right"
          >
            →
          </button>
        </div>
        <button
          className="snake-direction-btn"
          onClick={() => changeDirection('down')}
          aria-label="Move down"
        >
          ↓
        </button>
      </div>

      <footer className="snake-footer">
        <p>
          Arrow keys or WASD to move · Space to pause/resume
        </p>
      </footer>
    </div>
  )
}

