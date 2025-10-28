import { ballsFactory, drawSlope } from "./helpers.js";
import { balls, mainCanvas, mainCtx, FPS } from "./constants.js";

ballsFactory(1);

const ball = balls.ball1;

document.querySelector('html').addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    ball.move();
  }

  else if (e.code === 'ArrowUp') {
    ball.directionAngle += 0.01;
  }

  else if (e.code === 'ArrowDown') {
    ball.directionAngle -= 0.01;
  }

  else if (e.code === 'ArrowLeft') {
    ball.velocity.x -= 1;
  }

  else if (e.code === 'ArrowRight') {
    ball.velocity.x += 1;
  }

  //mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  ball._drawDirectionVector();
  drawSlope();

})

/*
setInterval(() => { // rewrite in RAF, but first make it work as it is
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  for (let i = 1; i <= Object.keys(balls).length; i++) {
    const name = `ball${i.toString()}`;
    balls[name].move();
  }
 //checkBallsCollision(); 
}, (1000 / FPS));   
*/
 