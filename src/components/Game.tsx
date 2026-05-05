import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Point {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const CELL_SIZE = 20
const BOARD_WIDTH = 20
const BOARD_HEIGHT = 15
const CANVAS_WIDTH = CELL_SIZE * BOARD_WIDTH
const CANVAS_HEIGHT = CELL_SIZE * BOARD_HEIGHT
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 3

function randomFood(snake: Point[]): Point {
  let food: Point
  do {
    food = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    }
  } while (snake.some((s) => s.x === food.x && s.y === food.y))
  return food
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const directionRef = useRef<Direction>('RIGHT')
  const nextDirectionRef = useRef<Direction>('RIGHT')

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('snake-highscore')) || 0
    } catch {
      return 0
    }
  })

  const snakeRef = useRef<Point[]>([
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
  ])
  const foodRef = useRef<Point>(randomFood(snakeRef.current))
  const scoreRef = useRef(0)
  const speedRef = useRef(INITIAL_SPEED)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Read theme colors from CSS variables
    const style = getComputedStyle(document.documentElement)
    const primaryColor = style.getPropertyValue('--accent-primary').trim() || '#6c63ff'
    const secondaryColor = style.getPropertyValue('--accent-secondary').trim() || '#00d4ff'
    const tertiaryColor = style.getPropertyValue('--accent-tertiary').trim() || '#ff6b9d'

    // Parse hex to RGB helper
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 108, g: 99, b: 255 }
    }

    const primary = hexToRgb(primaryColor)
    const secondary = hexToRgb(secondaryColor)
    const food_color = tertiaryColor

    // Clear
    ctx.fillStyle = '#0d0d24'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Grid lines (very subtle)
    ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.05)`
    ctx.lineWidth = 0.5
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL_SIZE, 0)
      ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL_SIZE)
      ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE)
      ctx.stroke()
    }

    // Food
    const food = foodRef.current
    const glow = ctx.createRadialGradient(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      2,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE
    )
    glow.addColorStop(0, food_color)
    glow.addColorStop(1, 'rgba(255, 107, 157, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(
      food.x * CELL_SIZE - CELL_SIZE / 2,
      food.y * CELL_SIZE - CELL_SIZE / 2,
      CELL_SIZE * 2,
      CELL_SIZE * 2
    )
    ctx.fillStyle = food_color
    ctx.beginPath()
    ctx.roundRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4,
      4
    )
    ctx.fill()

    // Snake
    const snake = snakeRef.current
    snake.forEach((segment, i) => {
      const isHead = i === 0
      const progress = i / snake.length

      // Gradient from primary to secondary (theme-aware)
      const r = Math.round(primary.r + (secondary.r - primary.r) * progress)
      const g = Math.round(primary.g + (secondary.g - primary.g) * progress)
      const b = Math.round(primary.b + (secondary.b - primary.b) * progress)

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      if (isHead) {
        // Head glow
        const headGlow = ctx.createRadialGradient(
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          2,
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE * 1.5
        )
        headGlow.addColorStop(0, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.3)`)
        headGlow.addColorStop(1, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0)`)
        ctx.fillStyle = headGlow
        ctx.fillRect(
          segment.x * CELL_SIZE - CELL_SIZE,
          segment.y * CELL_SIZE - CELL_SIZE,
          CELL_SIZE * 3,
          CELL_SIZE * 3
        )
        ctx.fillStyle = primaryColor
      }

      ctx.beginPath()
      ctx.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        isHead ? 6 : 4
      )
      ctx.fill()
    })
  }, [])

  const gameStep = useCallback(() => {
    directionRef.current = nextDirectionRef.current
    const snake = [...snakeRef.current]
    const head = { ...snake[0] }

    switch (directionRef.current) {
      case 'UP':    head.y -= 1; break
      case 'DOWN':  head.y += 1; break
      case 'LEFT':  head.x -= 1; break
      case 'RIGHT': head.x += 1; break
    }

    // Wall collision
    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
      setGameState('gameover')
      return
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameState('gameover')
      return
    }

    snake.unshift(head)

    // Food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      foodRef.current = randomFood(snake)
      speedRef.current = Math.max(50, INITIAL_SPEED - scoreRef.current * SPEED_INCREMENT / 10)
    } else {
      snake.pop()
    }

    snakeRef.current = snake
    draw()

    gameLoopRef.current = window.setTimeout(gameStep, speedRef.current)
  }, [draw])

  const startGame = useCallback(() => {
    snakeRef.current = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ]
    foodRef.current = randomFood(snakeRef.current)
    directionRef.current = 'RIGHT'
    nextDirectionRef.current = 'RIGHT'
    scoreRef.current = 0
    speedRef.current = INITIAL_SPEED
    setScore(0)
    setGameState('playing')
    draw()
    gameLoopRef.current = window.setTimeout(gameStep, speedRef.current)
  }, [draw, gameStep])

  // Update high score on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current)
      if (score > highScore) {
        setHighScore(score)
        try {
          localStorage.setItem('snake-highscore', String(score))
        } catch { /* ignore */ }
      }
    }
  }, [gameState, score, highScore])

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          startGame()
        }
        return
      }

      const dir = directionRef.current
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          if (dir !== 'DOWN') nextDirectionRef.current = 'UP'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          if (dir !== 'UP') nextDirectionRef.current = 'DOWN'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          if (dir !== 'RIGHT') nextDirectionRef.current = 'LEFT'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          if (dir !== 'LEFT') nextDirectionRef.current = 'RIGHT'
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameState, startGame])

  // Initial draw
  useEffect(() => {
    draw()
  }, [draw])

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current)
    }
  }, [])

  // Mobile direction handler
  const handleDirection = (dir: Direction) => {
    if (gameState !== 'playing') return
    const current = directionRef.current
    if (dir === 'UP' && current !== 'DOWN') nextDirectionRef.current = 'UP'
    if (dir === 'DOWN' && current !== 'UP') nextDirectionRef.current = 'DOWN'
    if (dir === 'LEFT' && current !== 'RIGHT') nextDirectionRef.current = 'LEFT'
    if (dir === 'RIGHT' && current !== 'LEFT') nextDirectionRef.current = 'RIGHT'
  }

  return (
    <section className="section" id="game">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-tag">🎮 Mini Game</div>
        <h2 className="section-title">
          Play{' '}
          <span className="gradient-text">Snake</span>
        </h2>
        <p className="section-subtitle">
          A classic Snake game built with HTML5 Canvas. Use arrow keys or WASD to control the snake. 
          Eat the pink food to grow and score points!
        </p>
      </motion.div>

      <motion.div
        className="game-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="game-wrapper">
          <div className="game-stats">
            <div className="game-stat">
              <div className="game-stat-label">Score</div>
              <div className="game-stat-value">{score}</div>
            </div>
            <div className="game-stat">
              <div className="game-stat-label">High Score</div>
              <div className="game-stat-value">{highScore}</div>
            </div>
          </div>

          <div className="game-board-container">
            <canvas
              ref={canvasRef}
              className="game-canvas"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />

            {gameState === 'idle' && (
              <div className="game-overlay">
                <div className="game-overlay-title">🐍 Snake</div>
                <p className="game-overlay-score">Press Start to Play!</p>
                <button className="btn btn-primary" onClick={startGame}>
                  Start Game
                </button>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="game-overlay">
                <div className="game-overlay-title">Game Over!</div>
                <p className="game-overlay-score">Final Score: {score}</p>
                {score > 0 && score >= highScore && (
                  <p style={{ color: '#00e676', fontWeight: 600, fontSize: '0.9rem' }}>
                    🏆 New High Score!
                  </p>
                )}
                <button className="btn btn-primary" onClick={startGame}>
                  Play Again
                </button>
              </div>
            )}
          </div>

          <div className="game-controls">
            {gameState === 'playing' && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (gameLoopRef.current) clearTimeout(gameLoopRef.current)
                  setGameState('gameover')
                }}
              >
                ⏹ End Game
              </button>
            )}
          </div>

          {/* Mobile touch controls */}
          <div className="mobile-controls">
            <div className="mobile-controls-grid">
              <div className="mobile-btn mobile-btn-empty" />
              <button className="mobile-btn" onTouchStart={() => handleDirection('UP')} onClick={() => handleDirection('UP')}>▲</button>
              <div className="mobile-btn mobile-btn-empty" />
              <button className="mobile-btn" onTouchStart={() => handleDirection('LEFT')} onClick={() => handleDirection('LEFT')}>◄</button>
              <button className="mobile-btn" onTouchStart={() => handleDirection('DOWN')} onClick={() => handleDirection('DOWN')}>▼</button>
              <button className="mobile-btn" onTouchStart={() => handleDirection('RIGHT')} onClick={() => handleDirection('RIGHT')}>►</button>
            </div>
          </div>

          <div className="game-instructions">
            <p>
              <strong>Controls:</strong> Arrow keys or <strong>W A S D</strong> to move.
              Eat the <span style={{ color: '#ff6b9d' }}>pink food</span> to grow.
              The snake speeds up as your score increases!
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
