import { useCallback, useMemo, useState } from 'react'
import { useMinesweeper } from './useMinesweeper'
import { type Cell } from './game'
import './minesweeper.css'

const DEFAULT_CONFIG = { rows: 9, cols: 9, mines: 10 }

function cellLabel(cell: Cell): string {
  if (cell.state === 'flagged') return '🚩'
  if (cell.state !== 'revealed') return ''
  if (cell.isMine) return '💣'
  return cell.adjacentMines === 0 ? '' : String(cell.adjacentMines)
}

function numberClass(cell: Cell): string {
  if (cell.state !== 'revealed' || cell.isMine || cell.adjacentMines === 0) return ''
  return `ms-number ms-number-${cell.adjacentMines}`
}

export function MinesweeperGame() {
  const { state, minesLeft, reset, reveal, toggleFlag } = useMinesweeper(DEFAULT_CONFIG)
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null)

  const statusText = useMemo(() => {
    switch (state.status) {
      case 'ready':
        return 'Click a cell to start'
      case 'playing':
        return 'Good luck'
      case 'won':
        return '🎉 You won!'
      case 'lost':
        return '💥 Boom. Try again.'
      default:
        return ''
    }
  }, [state.status])

  const onReset = useCallback(() => {
    setClickedCell(null)
    reset()
  }, [reset])

  const handleCellClick = useCallback((row: number, col: number) => {
    setClickedCell({ row, col })
    reveal({ row, col })
    setTimeout(() => setClickedCell(null), 200)
  }, [reveal])

  const handleFlagClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    toggleFlag({ row, col })
  }, [toggleFlag])

  return (
    <div className="ms-root">
      <header className="ms-header">
        <div>
          <h1 className="ms-title">Minesweeper</h1>
          <p className="ms-subtitle">{statusText}</p>
        </div>

        <div className="ms-controls">
          <div className="ms-counter">
            <span className="ms-counter-label">Mines</span>
            <span className="ms-counter-value">{minesLeft}</span>
          </div>
          <button className="ms-reset" onClick={onReset}>
            Reset
          </button>
        </div>
      </header>

      <div
        className="ms-board"
        style={{
          gridTemplateColumns: `repeat(${state.config.cols}, var(--cell-size))`,
        }}
      >
        {state.board.flat().map((cell) => {
          const isRevealed = cell.state === 'revealed'
          const label = cellLabel(cell)
          const isClicked = clickedCell?.row === cell.row && clickedCell?.col === cell.col
          const isMineExploded = state.status === 'lost' && cell.isMine && isRevealed

          return (
            <button
              key={`${cell.row}-${cell.col}`}
              className={[
                'ms-cell',
                isRevealed ? 'ms-cell--revealed' : 'ms-cell--hidden',
                cell.state === 'flagged' ? 'ms-cell--flagged' : '',
                numberClass(cell),
                isClicked ? 'ms-cell--clicked' : '',
                isMineExploded ? 'ms-cell--exploded' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              aria-label={`cell ${cell.row + 1}, ${cell.col + 1}`}
              onClick={() => handleCellClick(cell.row, cell.col)}
              onContextMenu={(e) => handleFlagClick(e, cell.row, cell.col)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <footer className="ms-footer">
        <p>
          Left click: reveal · Right click: flag
          {state.status === 'lost' || state.status === 'won' ? ' · Reset to play again' : ''}
        </p>
      </footer>
    </div>
  )
}
