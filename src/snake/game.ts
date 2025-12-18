export type Direction = 'up' | 'down' | 'left' | 'right'

export type Coord = { x: number; y: number }

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver'

export type GameConfig = {
  rows: number
  cols: number
  initialLength: number
  speed: number // milliseconds per move
}

export type Snake = Coord[]

export type GameState = {
  snake: Snake
  food: Coord
  direction: Direction
  nextDirection: Direction
  score: number
  status: GameStatus
  config: GameConfig
}

const DEFAULT_CONFIG: GameConfig = {
  rows: 20,
  cols: 20,
  initialLength: 3,
  speed: 150,
}

export function createInitialState(config: Partial<GameConfig> = {}): GameState {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const centerX = Math.floor(cfg.cols / 2)
  const centerY = Math.floor(cfg.rows / 2)

  const snake: Snake = []
  for (let i = 0; i < cfg.initialLength; i++) {
    snake.push({ x: centerX - i, y: centerY })
  }

  return {
    snake,
    food: generateFood(cfg, snake),
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    status: 'ready',
    config: cfg,
  }
}

export function generateFood(config: GameConfig, snake: Snake): Coord {
  const maxAttempts = config.rows * config.cols
  for (let i = 0; i < maxAttempts; i++) {
    const food: Coord = {
      x: Math.floor(Math.random() * config.cols),
      y: Math.floor(Math.random() * config.rows),
    }

    if (!snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
      return food
    }
  }

  // Fallback (shouldn't happen)
  return { x: 0, y: 0 }
}

export function isValidDirection(
  current: Direction,
  next: Direction,
): boolean {
  const opposites: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  }
  return opposites[current] !== next
}

export function moveSnake(
  snake: Snake,
  direction: Direction,
  config: GameConfig,
): { snake: Snake; hitWall: boolean } {
  const head = snake[0]!
  let newHead: Coord

  switch (direction) {
    case 'up':
      newHead = { x: head.x, y: head.y - 1 }
      break
    case 'down':
      newHead = { x: head.x, y: head.y + 1 }
      break
    case 'left':
      newHead = { x: head.x - 1, y: head.y }
      break
    case 'right':
      newHead = { x: head.x + 1, y: head.y }
      break
  }

  // Check wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= config.cols ||
    newHead.y < 0 ||
    newHead.y >= config.rows
  ) {
    return { snake, hitWall: true }
  }

  // Check self collision
  if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
    return { snake, hitWall: true }
  }

  const newSnake = [newHead, ...snake]
  return { snake: newSnake, hitWall: false }
}

export function checkFoodCollision(snake: Snake, food: Coord): boolean {
  const head = snake[0]!
  return head.x === food.x && head.y === food.y
}

export function updateGame(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  const direction = isValidDirection(state.direction, state.nextDirection)
    ? state.nextDirection
    : state.direction

  const { snake: newSnake, hitWall } = moveSnake(state.snake, direction, state.config)

  if (hitWall) {
    return {
      ...state,
      status: 'gameOver',
      direction,
    }
  }

  const ateFood = checkFoodCollision(newSnake, state.food)

  if (ateFood) {
    const newFood = generateFood(state.config, newSnake)
    return {
      ...state,
      snake: newSnake,
      food: newFood,
      score: state.score + 1,
      direction,
    }
  }

  // Remove tail if didn't eat food
  const snakeWithoutTail = newSnake.slice(0, -1)

  return {
    ...state,
    snake: snakeWithoutTail,
    direction,
  }
}

