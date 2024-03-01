let canvas;
let ctx;

let defaultFillStyle = 'black';

// snake head x and y
let hx = 0;
let hy = 0;
// snake body with head at 0 index
let snake = [[0,0]]

// snake head width height
let hw = 20;
let hh = 20

// direction variables
let xmove = 1;
let ymove = 0;
// steps in pixels, how much pixels the snake will move in the any direction
let steps = 2;

// fruit x and y
// let fx = Math.random() * canvas.width;
// let fy = Math.random() * canvas.height;

// keypress detection
let key;
let keyPress = false;

// frame rate calculations
let fps = 30;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;

function clearHead(x,y){
  // clearing previous head
  ctx.beginPath();
  ctx.rect(x, y, hw, hh);
  ctx.fillStyle = defaultFillStyle;
  ctx.fill();
}

function update(){
  if (keyPress){
    if(key == 'ArrowUp' && ymove != 1){
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
    } else if(key == 'a'){
      snake.push([hx,hy])
    }
    keyPress = false;
  }

  for (let i=snake.length-1; i>0; i--){
    clearHead(snake[i][0], snake[i][1]);
    snake[i][0] = snake[i-1][0];
    snake[i][1] = snake[i-1][1];
  }
  clearHead(snake[0][0], snake[0][1]);
  // clearHead(hx, hy);

  hx += xmove * steps;
  hy += ymove * steps;

  snake[0][0] = hx;
  snake[0][1] = hy;

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

  for(let i=0; i<snake.length; i++){
    ctx.beginPath();
    ctx.rect(snake[i][0], snake[i][1], hw, hh);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

function main(){
  window.requestAnimationFrame(main);

  now = Date.now();
  delta = now - then;
  if(delta > interval){
    then = now - (delta % interval);
    update();
  }
}

function setup(){
  canvas = document.getElementById('root');
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
}

// initialize the canvas and context when the document is ready
$(document).ready(function(){
  setup();
  main();
});
