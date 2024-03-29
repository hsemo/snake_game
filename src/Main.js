import React, {useState, useRef} from 'react';
import './Main.css';

import Canvas from './Canvas.js';
import Score from './Score.js';
import GameOver from './GameOver.js';
import Menu from './Menu.js';

const Main = (props) => {
  const [gameOverState, setGameOverState] = useState(false);
  const gameOver = useRef(false);
  // need to create state and ref for score because setState does not
  // set the value of the score immediatly
  const [scoreState, setScoreState] = useState(0);
  const score = useRef(0);
  const gamePause = useRef(false);

  const updateScore = (newScore) => {
    score.current = newScore;
    setScoreState(newScore);
  };

  const handleGameOver = (isGameOver) => {
    gameOver.current = isGameOver;
    setGameOverState(isGameOver);
  };

  const restartGame = () => {
    handleGameOver(false);
    updateScore(0);
  };

  const toggleGamePause = () => {
    gamePause.current = !gamePause.current;
  };



  return (
    <div className="main">
      <Menu 
        gamePause={gamePause}
        gameOver={gameOver}
        gameOverState={gameOverState}
        toggleGamePause={toggleGamePause}
        handleGameOver={handleGameOver}
      />

      <Score
        score={scoreState}
      />

      <Canvas
        gamePause={gamePause}
        gameOver={gameOver}
        gameOverState={gameOverState}
        toggleGamePause={toggleGamePause}
        handleGameOver={handleGameOver}
        score={score}
        updateScore={updateScore}
      />

      <GameOver
        gameOver={gameOverState}
        restartGame={restartGame}
      />
    </div>
  );
}

export default Main;
