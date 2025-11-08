import Ball from "./Ball.js";
import Data from "./Data.js";
import { ballsFactory, handleCollisions } from "./helpers.js";
import { balls, datas, FPS, mainCanvas, mainCtx, totalVelocity } from "./constants.js";

//ballsFactory(10);
// what if they just touch one another aka relCollAngle === PI / 2 for both balls? // stop being fancy and simplify the border logic
//balls.push(new Ball("ball1", 'green', { x:300, y:150 }, { x: 10, y: 10 }));
balls.push(new Ball("ball2", 'red', { x:201, y:220 }, { x: 10, y:10 }));
balls.push(new Ball("ball4", 'orange', { x:300, y:350 }, {x:10, y:10 }));

for (let i = 0; i < balls.length; i++) {
  datas.push(new Data(balls[i]));
}

document.querySelector('html').addEventListener('keydown', (e) => {
  let KE = 0;
  if (e.code === 'Space') {
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    for (let i = 0; i < balls.length; i++) {
      console.log("________");
      const ball = balls[i];

      ball.action();
      datas[i].update();
      //balls[i].draw();


      KE += 0.5 * (ball.velocity.x ** 2 + ball.velocity.y ** 2);
    }
    console.log("KE:", KE);
    handleCollisions();

    for (let i = 0; i < balls.length; i++) { // only draw after all calculations are done
      balls[i].draw();
    }
  }

  else if (e.code === 'Digit1' || e.code === 'Numpad1') {
    balls[0].action();
    balls[1].draw();
  }

  else if (e.code === 'Digit2' || e.code === 'Numpad2') {
    balls[1].action();
    balls[0].draw();
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

  handleCollisions();

  requestAnimationFrame(action);
}

//requestAnimationFrame(action);

 

 