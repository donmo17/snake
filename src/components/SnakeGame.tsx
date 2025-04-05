import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;  // La taille de la grille
const CELL_SIZE = 20;  // La taille d'une cellule dans la grille
const INITIAL_SNAKE = [{ x: 10, y: 10 }];  // Position initiale du serpent
const INITIAL_DIRECTION = { x: 1, y: 0 };  // Direction initiale (vers la droite)
const INITIAL_FOOD = { x: 15, y: 15 };  // Position initiale de la nourriture
const GAME_SPEED = 150;  // Vitesse du jeu (plus bas = plus rapide)

type Position = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);  // Corps du serpent
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);  // Direction du serpent
  const [food, setFood] = useState<Position>(INITIAL_FOOD);  // Nourriture
  const [gameOver, setGameOver] = useState<boolean>(false);  // Etat de la partie (si terminée ou pas)
  const [score, setScore] = useState<number>(0);  // Score du joueur

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Vérification des collisions
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);  // Ajouter la tête du serpent

      // Vérifier si le serpent mange la nourriture
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 1);
        setFood(getRandomFood(newSnake));  // Générer une nouvelle nourriture
      } else {
        newSnake.pop();  // Retirer la dernière partie du serpent
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);  // Nettoyer l'intervalle quand le composant est démonté
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });  // Haut
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });  // Bas
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });  // Gauche
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });  // Droite
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);  // Retirer l'écouteur de l'événement
  }, []);

  const getRandomFood = (snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));  // Eviter que la nourriture apparaisse sur le serpent
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-green-500">Snake Game</h1>
      <div className="mb-4 text-white">Score: {score}</div>

      {/* Grille du jeu */}
      <div
        className="grid bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: '1px',
          height: `${GRID_SIZE * CELL_SIZE + 1}px`,  // Ajuster la hauteur
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-5 h-5 ${isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-700'}`}
              style={{ border: '1px solid #333' }}  // Bordure de la cellule pour mieux voir
            />
          );
        })}
      </div>

      {/* Message de fin de jeu */}
      {gameOver && (
        <div className="mt-4 text-red-500 text-2xl font-bold">Game Over!</div>
      )}

      {/* Bouton pour redémarrer */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        {gameOver ? 'Play Again' : 'Reset Game'}
      </button>

      {/* Flèches directionnelles pour contrôler le serpent */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 0, y: -1 })}>
          ↑
        </button>
        <div>
          <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: -1, y: 0 })}>
            ←
          </button>
          <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 1, y: 0 })}>
            →
          </button>
        </div>
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 0, y: 1 })}>
          ↓
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
