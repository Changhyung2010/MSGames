import { useState, useCallback, useEffect, useRef } from 'react'
import {
  createInitialState,
  updateGame,
  type GameState,
  type Direction,
  type GameConfig,
} from './game'

export function useSnake(config: Partial<GameConfig> = {}) {
  const [state, setState] = useState<GameState>(() => createInitialState(config))
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'playing' }))
  }, [])

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' }))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialState(config))
  }, [config])

  const changeDirection = useCallback((direction: Direction) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev
      return { ...prev, nextDirection: direction }
    })
  }, [])

  // Game loop
  useEffect(() => {
    if (state.status === 'playing') {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => updateGame(prev))
      }, state.config.speed)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.status, state.config.speed])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (state.status === 'ready') {
        start()
        return
      }

      if (state.status === 'gameOver') {
        if (e.key === ' ') {
          reset()
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          changeDirection('up')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          changeDirection('down')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          changeDirection('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          changeDirection('right')
          break
        case ' ':
          e.preventDefault()
          if (state.status === 'playing') {
            pause()
          } else if (state.status === 'paused') {
            start()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [state.status, start, pause, changeDirection, reset])

  return {
    state,
    start,
    pause,
    reset,
    changeDirection,
  }
}

