import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, onScoreUpdate]);

  const generateFood = (currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood!.x && s.y === newFood!.y)) break;
    }
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case 'p': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const timer = setInterval(moveSnake, speed);
    return () => clearInterval(timer);
  }, [moveSnake, speed]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 400, 400);

    // Draw grid lines subtly
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (400 / GRID_SIZE), 0);
      ctx.lineTo(i * (400 / GRID_SIZE), 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * (400 / GRID_SIZE));
      ctx.lineTo(400, i * (400 / GRID_SIZE));
      ctx.stroke();
    }

    // Draw snake with neon glow
    ctx.shadowBlur = 10;
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00f2ff' : '#0066cc';
      ctx.shadowColor = i === 0 ? '#00f2ff' : '#0066cc';
      ctx.fillRect(
        segment.x * (400 / GRID_SIZE) + 1,
        segment.y * (400 / GRID_SIZE) + 1,
        (400 / GRID_SIZE) - 2,
        (400 / GRID_SIZE) - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    const centerX = food.x * (400 / GRID_SIZE) + (400 / GRID_SIZE) / 2;
    const centerY = food.y * (400 / GRID_SIZE) + (400 / GRID_SIZE) / 2;
    ctx.arc(centerX, centerY, (400 / GRID_SIZE) / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setSpeed(INITIAL_SPEED);
    onScoreUpdate(0);
    generateFood([{ x: 10, y: 10 }]);
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-black rounded-lg overflow-hidden border border-white/10">
        <div className="flex justify-between items-center p-4 bg-white/5 border-bottom border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-sm text-white/50 uppercase tracking-widest">Score: {score}</span>
          </div>
          <div className="font-mono text-sm text-white/50 uppercase tracking-widest">High: {highScore}</div>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="display-block"
        />

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
            >
              <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Game Over</h2>
              <p className="text-fuchsia-400 font-mono mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                <RefreshCcw className="w-4 h-4" />
                Restart Protocol
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
            >
              <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
                <p className="text-white font-mono uppercase tracking-[0.3em] font-bold text-xl">Paused</p>
                <p className="text-white/40 text-[10px] uppercase text-center mt-2">Press 'P' to resume</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
        <div>Arrows: Steering</div>
        <div className="text-right">P: Pause / Resume</div>
      </div>
    </div>
  );
};
