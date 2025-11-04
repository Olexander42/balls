import Ball from "./Ball.js";
import Data from "./Data.js";
import { ballsFactory, checkBallsCollisions } from "./helpers.js";
import { balls, datas, mainCanvas, mainCtx, FPS } from "./constants.js";

//ballsFactory(10);

balls.push(new Ball("ball1", 'orange', { x:75, y:200 }, { x: 10, y: 0 }));
//balls.push(new Ball("ball2", 'blue', { x:225, y:200 }, { x: 0, y: 0 }));
//balls.push(new Ball("ball3", 'green', {x:375, y:200}, {x: -10, y: 0 }));
//balls.push(new Ball("ball4", 'yellow', {x:400, y:100}, {x: -5, y: 10}));

for (let i = 0; i < balls.length; i++) {
  datas.push(new Data(balls[i]));
}

document.querySelector('html').addEventListener('keydown', (e) => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  if (e.code === 'Space') {
    let sumVelocityX = 0;
    let sumVelocityY = 0;
    for (let i = 0; i < balls.length; i++) {
      balls[i].action();
      datas[i].update();

      sumVelocityX += (balls[i].velocity.x);
      sumVelocityY += (balls[i].velocity.y);
    }

    console.log("sumVelocityX:", sumVelocityX, "|", "sumVelocityY:", sumVelocityY);

    checkBallsCollisions();
  }

  else if (e.code === 'Digit1' || e.code === 'Numpad1') {
    balls[0].action();
    balls[1]._draw();
  }

  else if (e.code === 'Digit2' || e.code === 'Numpad2') {
    balls[1].action();
    balls[0]._draw();
  }

  else if (e.code === 'ArrowUp') {
    ball.angle += 0.01;
  }

  else if (e.code === 'ArrowDown') {
    ball.angle -= 0.01;
  }

  else if (e.code === 'ArrowLeft') {
    ball.velocity.x -= 1;
  }

  else if (e.code === 'ArrowRight') {
    ball.velocity.x += 1;
  }

  else if (e.code === 'KeyI') {
    console.log(balls[0].velocity);
  }
})

const action = () => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].action();
  }

  checkBallsCollisions();

  requestAnimationFrame(action);
}

//requestAnimationFrame(action);

 

 