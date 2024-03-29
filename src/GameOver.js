import React from 'react';

const GameOver = ({gameOver, restartGame}) => {
  return(
    <div className={gameOver ? 'game-over' : 'not-game-over'}>
      <p>Game Over</p>
      <button className="restart-btn" onClick={restartGame}>Restart</button>
    </div>
  );
};

export default GameOver;
