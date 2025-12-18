import { useCallback, useMemo, useState } from 'react'
import {
  clampConfig,
  countFlags,
  countRevealedNonMines,
  createBoard,
  revealAt,
  toggleFlagAt,
  totalNonMines,
  type Board,
  type Coord,
  type GameConfig,
  type GameStatus,
} from './game'

export type MinesweeperState = {
  config: GameConfig
  board: Board
  status: GameStatus
}

function createReadyState(config: GameConfig): MinesweeperState {
  const cfg = clampConfig(config)
  return {
    config: cfg,
    board: createBoard(cfg),
    status: 'ready',
  }
}

export function useMinesweeper(initialConfig: GameConfig) {
  const [state, setState] = useState<MinesweeperState>(() => createReadyState(initialConfig))

  const flags = useMemo(() => countFlags(state.board), [state.board])
  const minesLeft = Math.max(0, state.config.mines - flags)

  const reset = useCallback((override?: Partial<GameConfig>) => {
    setState((prev) => {
      const cfg = clampConfig({ ...prev.config, ...(override ?? {}) })
      return createReadyState(cfg)
    })
  }, [])

  const reveal = useCallback((coord: Coord) => {
    setState((prev) => {
      if (prev.status === 'lost' || prev.status === 'won') return prev

      // Ensure the first click is safe and tends to open space.
      const board =
        prev.status === 'ready'
          ? createBoard(prev.config, { safeCoord: coord, safeRadius: 1 })
          : prev.board

      const res = revealAt(board, coord)
      if (res.hitMine) {
        return { ...prev, board: res.board, status: 'lost' }
      }

      const revealedNonMines = countRevealedNonMines(res.board)
      const needed = totalNonMines(res.board)
      const won = revealedNonMines >= needed

      return {
        ...prev,
        board: res.board,
        status: won ? 'won' : 'playing',
      }
    })
  }, [])

  const toggleFlag = useCallback((coord: Coord) => {
    setState((prev) => {
      if (prev.status === 'lost' || prev.status === 'won') return prev
      if (prev.status === 'ready') return prev

      return {
        ...prev,
        board: toggleFlagAt(prev.board, coord),
      }
    })
  }, [])

  return {
    state,
    flags,
    minesLeft,
    reset,
    reveal,
    toggleFlag,
  }
}
