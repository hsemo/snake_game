let canvas;
let ctx;

let defaultFillStyle = 'black';

// direction variables
let xmove = 1;
let ymove = 0;

// snake head x and y
let hx = 0;
let hy = 0;
// snake body with head at 0 index
let snake = [[0, 0]];

// snake head width height
let hw = 20;
let hh = 20;

// steps in pixels, how much pixels the snake will move in the any direction
let st = 2;

// keypress detection
let key;
// let keyQueue = [];
let keyPress = false;

// pausing and resuming the game
let gamePause = false;

// game over indicator
let gameOver = false;

let score = 0;

// frame rate calculations
let fps = 100;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;


function clearRect(x,y){
  // clearing rectangle starting from x, y coords
  ctx.clearRect(x, y, hw, hh);
}

function moveSnakeBody(){

  for (let i=snake.length-1; i>0; i--){
    snake[i][0] = snake[i-1][0];
    snake[i][1] = snake[i-1][1];
  }
}

function drawSnake(){
  for(let i=0; i<snake.length; i++){
    ctx.beginPath();
    ctx.rect(snake[i][0], snake[i][1], hw, hh);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  // changing snake head's color by drawing it again
  ctx.beginPath();
  ctx.rect(snake[0][0], snake[0][1], hw, hh);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function clearFruit(){
  // clearRect(fx, fy);
  ctx.beginPath();
  ctx.arc(fx, fy, 10, 0 * Math.PI, 2 * Math.PI);
  ctx.fillStyle = defaultFillStyle;
  ctx.fill();
}

function newFruit(){
  // random location for fruits
  do{
    fx = Math.floor(Math.random() * canvas.width);
    fy = Math.floor(Math.random() * canvas.height);
  } while(snake.some(({bx,by}) => (fx > bx && fx < bx + hw) && (fy > by && fy < by + hh)))
}

function drawFruit(){
  ctx.beginPath();
  // ctx.rect(fx, fy, hw, hh);
  ctx.arc(fx, fy, 8, 0 * Math.PI, 2 * Math.PI);
  ctx.fillStyle = 'green';
  ctx.fill();
}

function snakeToSnakeCollision(){
  let head = "" + [hx, hy];
  for (const body of snake.slice(1)) {
    if(head == body){
      gameOver = true;
    }
  }
}

function updateScore(){
  score++;
  document.getElementById('score').innerHTML = 'Score: ' + score;
  // increasing speed according to score
  if(score % 10 == 0){
    st++;
  }
}

function snakeToFruitCollision(){
  // let cof = [fx + (hw/2), fy + (hh/2)];
  let cof = [fx, fy];
  if((cof[0] > hx && cof[0] < hx + hw) && (cof[1] > hy && cof[1] < hy + hh)){
    newFruit();

    // hw/st times so the snake grows according tho it's width and moves smoothly
    for(let i=0; i<Math.floor(hw/st); i++){
      snake.push([hx, hy]);
    }

    updateScore();
  }
}

function update(){
  // clearing the whole canvas
  // clearFruit();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // changing the snake head's coords hypothetically
  // for collision detection
  hx += xmove * st;
  hy += ymove * st;

  // collision detection with walls
  if(hx + hw <= 0) {
    hx = canvas.width - hw;
  } else if(hy + hh <= 0) {
    hy = canvas.height - hh;
  } else if(hx > canvas.width) {
    hx = 0;
  } else if(hy > canvas.height) {
    hy = 0;
  }

  snakeToSnakeCollision();
  snakeToFruitCollision();

  // moving snake body before the head
  moveSnakeBody();

  // changing snake head's coords and direction
  snake[0] = [hx, hy];

  drawFruit();
  drawSnake();
}

function detectKeyPress(){
  if (keyPress){
    if(key == 'a'){
      snake.push([hx, hy])
      keyPress = false;
      return;
    }
    else if(key == ' '){
      gamePause = !gamePause;
      keyPress = false;
      return;
    }
    else if(key == 'ArrowUp' && ymove != 1){
      ymove = -1;
      xmove = 0;
    } else if(key == 'ArrowDown' && ymove != -1){
      ymove = 1;
      xmove = 0;
    } else if(key == 'ArrowLeft' && xmove != 1){
      ymove = 0;
      xmove = -1;
    } else if(key == 'ArrowRight' && xmove != -1){
      ymove = 0;
      xmove = 1;
    }

    keyPress = false;

  }
}

function main(){
  if(!gameOver) {
    window.requestAnimationFrame(main);
  }

  now = Date.now();
  delta = now - then;

  // detecting a keypress
  detectKeyPress();

  if( !gamePause && delta > interval ){
    then = now - (delta % interval);

    // updating the game frame
    update();
  }

}

function setup(){
  canvas = document.getElementById('canvas');
  canvas.width = 600;
  canvas.height = 600;
  ctx = canvas.getContext('2d');

  // filling the canvas to defaultFillStyle
  ctx.fillStyle = defaultFillStyle;
  ctx.beginPath();
  // ctx.strokeStyle = 'black';
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  // adding keyboard event handling
  document.addEventListener('keydown', (event) => {
    key = event.key;
    keyPress = true;
  });

  newFruit();
}

// initialize the canvas and context when the document is ready
$(document).ready(function(){
  setup();
  main();
});
