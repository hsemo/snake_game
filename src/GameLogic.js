
function moveSnakeBody(snakeBody){
  let newSnakeBody = [...snakeBody];
  for (let i=newSnakeBody.length-1; i>0; i--){
    newSnakeBody[i][0] = newSnakeBody[i-1][0];
    newSnakeBody[i][1] = newSnakeBody[i-1][1];
  }

  return newSnakeBody;
}

function drawSnake(ctx, snakeBody, hw, hh){
  for(let i=1; i<snakeBody.length; i++){
    ctx.beginPath();
    ctx.rect(snakeBody[i][0], snakeBody[i][1], hw, hh);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  // changing snakeBody head's color by drawing it again
  ctx.beginPath();
  ctx.rect(snakeBody[0][0], snakeBody[0][1], hw, hh);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function newFruitLocationAndColor(canvas, snakeBody, hw, hh){
  let colors = ['green', 'yellow', 'white', 'blue', 'lightgreen'];
  // random location and color for fruit
  let [nfx, nfy] = [0, 0];
  let nfcolor = colors[Math.floor(Math.random()*5)];
  do{
    nfx = Math.floor(Math.random() * canvas.width);
    nfy = Math.floor(Math.random() * canvas.height);
  } while(snakeBody.some(({bx,by}) => (nfx > bx && nfx < bx + hw) && (nfy > by && nfy < by + hh)))

  return {fx: nfx, fy: nfy, fcolor: nfcolor};
}

function drawFruit(ctx, fx, fy, fcolor){
  ctx.beginPath();
  // ctx.rect(fx, fy, hw, hh);
  ctx.arc(fx, fy, 8, 0 * Math.PI, 2 * Math.PI);
  ctx.fillStyle = fcolor;
  ctx.fill();
}

function snakeToSnakeCollision(hx, hy, snakeBody){
  let head = "" + [hx, hy];
  for (const body of snakeBody.slice(1)) {
    if(head == body){
      // game over
      return true;
    }
  }
  return false;
}

function updateScoreAndStep(score, step){
  let newScore = score.current + 1;
  let newStep = step;
  // document.getElementById('score').innerHTML = 'Score: ' + score;
  // increasing speed according to score
  if(newScore % 10 == 0){
    newStep = step + 1;
  }

  return {newScore, newStep};
}

function snakeToFruitCollision(fx, fy, hx, hy, hw, hh){
  // let cof = [fx + (hw/2), fy + (hh/2)];
  // let cof = [fx, fy];
  if((fx > hx && fx < hx + hw) && (fy > hy && fy < hy + hh)){
    return true;
  }

  return false;
}

function snakeToWallCollision(hx, hy, hw, hh, canvas){
  let [newHx, newHy] = [hx, hy];
  if(hx + hw <= 0) {
    newHx = canvas.width - hw;
  } else if(hy + hh <= 0) {
    newHy = canvas.height - hh;
  } else if(hx > canvas.width) {
    newHx = 0;
  } else if(hy > canvas.height) {
    newHy = 0;
  }

  return {hx: newHx, hy: newHy};
}

function growSnake(snakeBody, step, hx, hy, hw){
  let newSnakeBody = [...snakeBody];
  // hw/st times so the snake grows according to it's width and moves smoothly
  for(let i=0; i<Math.floor(hw/step); i++){
    newSnakeBody.push([hx, hy]);
  }

  return newSnakeBody;
}

function update({ctx, hx, hy, hw, hh, xmove, ymove, snakeBody, step, fx, fy, fcolor, handleGameOver, score, updateScore}){
  let canvas = ctx.canvas;
  // clearing the whole canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // changing the snake head's coords hypothetically
  // for collision detection
  hx += xmove * step;
  hy += ymove * step;

  // collision detection with walls
  // if it collides then it will teleport to the other direction
  ({hx, hy} = snakeToWallCollision(hx, hy, hw, hh, canvas));

  if(snakeToSnakeCollision(hx, hy, snakeBody)){
    handleGameOver(true);
  }

  if(snakeToFruitCollision(fx, fy, hx, hy, hw, hh)){
    snakeBody = growSnake(snakeBody, step, hx, hy, hw);

    let {newScore, newStep} = updateScoreAndStep(score, step);
    step = newStep;
    updateScore(newScore);

    ({fx, fy, fcolor} = newFruitLocationAndColor(canvas, snakeBody, hw, hh));
  }

  // moving snake body before the head
  snakeBody = moveSnakeBody(snakeBody);

  // changing snake head's coords
  snakeBody[0] = [hx, hy];

  drawFruit(ctx, fx, fy, fcolor);
  drawSnake(ctx, snakeBody, hw, hh);

  return {hx, hy, hw, hh, xmove, ymove, snakeBody, step, fx, fy, fcolor};
}

const controller = {controller: null};

function setup(ctx, gamePause, toggleGamePause, handleGameOver, score, updateScore){
  let props = {};

  // direction variables
  props.xmove = 1;
  props.ymove = 0;

  // snake head x and y
  props.hx = 0;
  props.hy = 0;
  // snake body with head at 0 index
  props.snakeBody = [[0, 0]];

  // snake head width height
  props.hw = 20;
  props.hh = 20;

  // steps in pixels, how much pixels the snake will move in the any direction
  props.step = 2;

  let f = newFruitLocationAndColor(ctx.canvas, props.snakeBody);
  props.fx = f.fx;
  props.fy = f.fy;
  props.fcolor = f.fcolor;

  controller.controller = new AbortController();
  // adding keyboard event handling
  document.addEventListener('keydown', (event) => {
    let key = event.key;

    if(key == 'a'){
      props.snakeBody = growSnake(props.snakeBody, props.step, props.hx, props.hy, props.hw);
    } else
    if(key == ' '){
      event.preventDefault();
      toggleGamePause();
    } else if(key == 'ArrowUp' && props.ymove != 1){
      event.preventDefault();
      props.ymove = -1;
      props.xmove = 0;
    } else if(key == 'ArrowDown' && props.ymove != -1){
      event.preventDefault();
      props.ymove = 1;
      props.xmove = 0;
    } else if(key == 'ArrowLeft' && props.xmove != 1){
      event.preventDefault();
      props.ymove = 0;
      props.xmove = -1;
    } else if(key == 'ArrowRight' && props.xmove != -1){
      event.preventDefault();
      props.ymove = 0;
      props.xmove = 1;
    }
  }, {signal: controller.controller.signal});

  return(
    () => {
      let tempProps = update({...props, ctx, handleGameOver, score, updateScore});

      for(const key of Object.keys(tempProps)){
        props[key] = tempProps[key];
      }
    }
  );
}

export default setup;
export {controller};
