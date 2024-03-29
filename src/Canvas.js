import React, {useRef, useEffect} from 'react';
import setup, {controller} from './GameLogic.js';

function Canvas({
  gamePause,
  toggleGamePause,
  gameOver,
  gameOverState,
  handleGameOver,
  score,
  updateScore
  }){

  const canvasRef = useRef(null);

  useEffect(() => {
    if(gameOver.current){
      controller.controller.abort();
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const drawUpdate = setup(ctx, gamePause, toggleGamePause, handleGameOver, score, updateScore);

    let animFrameId;
    let fps = 60;
    let now;
    let then = Date.now();
    let interval = 1000/fps;
    let delta;

    const render = () => {
      if(!gameOver.current){
        animFrameId = window.requestAnimationFrame(render);
      }
      now = Date.now();
      delta = now - then;

      if( !gamePause.current && delta >= interval ){
        then = now - (delta % interval);
        // updating the game frame
        drawUpdate();
      }
    }

    render();

    return (
      () => {
        window.cancelAnimationFrame(animFrameId)
      }
    );
  }, [gameOverState]);

  return(
    <canvas ref={canvasRef} />
  );
};

export default Canvas;
