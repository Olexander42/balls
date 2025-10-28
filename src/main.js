import { ballsFactory } from "./helpers.js";
import { balls, mainCanvas, mainCtx, FPS } from "./constants.js";

ballsFactory(2);

/*
document.querySelector('html').addEventListener('keydown', (e) => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  if (e.code === 'Space') {
    ball.move();
    ball2.move();
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

  ball._drawDirectionVector();
  ball2._draw();
}
*/


setInterval(() => { // rewrite in RAF, but first make it work as it is
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  for (let i = 1; i <= balls.length; i++) {
    balls[i].move();
  }
}, (1000 / FPS));   

 