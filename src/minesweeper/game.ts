export type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

export type GameConfig = {
  rows: number
  cols: number
  mines: number
}

export type CellState = 'hidden' | 'revealed' | 'flagged'

export type Cell = {
  row: number
  col: number
  isMine: boolean
  adjacentMines: number
  state: CellState
}

export type Board = Cell[][]

export type Coord = { row: number; col: number }

export function clampConfig(config: GameConfig): GameConfig {
  const rows = Math.max(1, Math.floor(config.rows))
  const cols = Math.max(1, Math.floor(config.cols))
  const maxMines = rows * cols - 1

  return {
    rows,
    cols,
    mines: Math.max(1, Math.min(Math.floor(config.mines), maxMines)),
  }
}

export function inBounds(board: Board, coord: Coord): boolean {
  return (
    coord.row >= 0 &&
    coord.row < board.length &&
    coord.col >= 0 &&
    coord.col < board[0]!.length
  )
}

export function getNeighborCoords(board: Board, coord: Coord): Coord[] {
  const res: Coord[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const next = { row: coord.row + dr, col: coord.col + dc }
      if (inBounds(board, next)) res.push(next)
    }
  }
  return res
}

function coordKey({ row, col }: Coord): string {
  return `${row},${col}`
}

function createEmptyBoard(config: GameConfig): Board {
  return Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      adjacentMines: 0,
      state: 'hidden' as const,
    })),
  )
}

function shuffleInPlace<T>(arr: T[]): void {
  // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }
}

function computeAdjacents(board: Board): void {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0]!.length; c++) {
      const cell = board[r]![c]!
      if (cell.isMine) {
        cell.adjacentMines = 0
        continue
      }

      const neighbors = getNeighborCoords(board, { row: r, col: c })
      let count = 0
      for (const n of neighbors) {
        if (board[n.row]![n.col]!.isMine) count++
      }
      cell.adjacentMines = count
    }
  }
}

function deepCopyBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

export type NewGameOptions = {
  safeCoord?: Coord
  safeRadius?: 0 | 1
}

export function createBoard(config: GameConfig, options: NewGameOptions = {}): Board {
  const cfg = clampConfig(config)
  const board = createEmptyBoard(cfg)

  const excluded = new Set<string>()
  if (options.safeCoord) {
    excluded.add(coordKey(options.safeCoord))
    if (options.safeRadius === 1) {
      for (const n of getNeighborCoords(board, options.safeCoord)) excluded.add(coordKey(n))
    }
  }

  const candidates: Coord[] = []
  for (let r = 0; r < cfg.rows; r++) {
    for (let c = 0; c < cfg.cols; c++) {
      const k = coordKey({ row: r, col: c })
      if (!excluded.has(k)) candidates.push({ row: r, col: c })
    }
  }

  shuffleInPlace(candidates)
  const minesToPlace = Math.min(cfg.mines, candidates.length)

  for (let i = 0; i < minesToPlace; i++) {
    const { row, col } = candidates[i]!
    board[row]![col]!.isMine = true
  }

  computeAdjacents(board)
  return board
}

export type RevealResult = {
  board: Board
  hitMine: boolean
  newlyRevealed: number
}

export function revealAt(board: Board, coord: Coord): RevealResult {
  const next = deepCopyBoard(board)
  const cell = next[coord.row]?.[coord.col]
  if (!cell) return { board: next, hitMine: false, newlyRevealed: 0 }

  if (cell.state === 'flagged' || cell.state === 'revealed') {
    return { board: next, hitMine: false, newlyRevealed: 0 }
  }

  if (cell.isMine) {
    // reveal all mines
    for (const row of next) {
      for (const c of row) {
        if (c.isMine) c.state = 'revealed'
      }
    }
    cell.state = 'revealed'
    return { board: next, hitMine: true, newlyRevealed: 1 }
  }

  // BFS flood fill for 0-adjacent cells
  let newlyRevealed = 0
  const queue: Coord[] = [coord]
  const seen = new Set<string>([coordKey(coord)])

  while (queue.length > 0) {
    const current = queue.shift()!
    const curCell = next[current.row]![current.col]!

    if (curCell.state === 'flagged' || curCell.state === 'revealed') continue
    if (curCell.isMine) continue

    curCell.state = 'revealed'
    newlyRevealed++

    if (curCell.adjacentMines === 0) {
      for (const n of getNeighborCoords(next, current)) {
        const k = coordKey(n)
        if (seen.has(k)) continue
        seen.add(k)
        queue.push(n)
      }
    }
  }

  return { board: next, hitMine: false, newlyRevealed }
}

export function toggleFlagAt(board: Board, coord: Coord): Board {
  const next = deepCopyBoard(board)
  const cell = next[coord.row]?.[coord.col]
  if (!cell) return next

  if (cell.state === 'revealed') return next
  cell.state = cell.state === 'flagged' ? 'hidden' : 'flagged'
  return next
}

export function countFlags(board: Board): number {
  let count = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'flagged') count++
    }
  }
  return count
}

export function countRevealedNonMines(board: Board): number {
  let count = 0
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && cell.state === 'revealed') count++
    }
  }
  return count
}

export function totalNonMines(board: Board): number {
  let mines = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.isMine) mines++
    }
  }

  const total = board.length * board[0]!.length
  return total - mines
}
