import Ball from "./Ball.js";
import Data from "./Data.js";
import { ballsFactory, handleCollisions } from "./helpers.js";
import { balls, datas, FPS, mainCanvas, mainCtx, totalVelocity } from "./constants.js";


// balls escape the playground
balls.push(new Ball("ball1", 'green', { x:300, y:200 }, { x: -25, y: 0 }));
balls.push(new Ball("ball2", 'red', { x:159, y:200 }, { x: 40, y: 23}));
balls.push(new Ball("ball4", 'orange', { x:300, y:350 }, {x:24, y:15 })); 

for (let i = 0; i < balls.length; i++) {
  datas.push(new Data(balls[i]));
}

document.querySelector('html').addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    action();
  }
})

const action = () => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  let KE = 0;

  for (let i = 0; i < balls.length; i++) {
    console.log("________");
    const ball = balls[i];

    ball.action();
    datas[i].update();
    //balls[i].draw();

    KE += 0.5 * (ball.velocity.x ** 2 + ball.velocity.y ** 2);
  }

  handleCollisions();
  console.log("KE:", KE);

  for (let i = 0; i < balls.length; i++) { // only draw after all calculations are done
   balls[i].draw();
  }

  requestAnimationFrame(action);
}

//requestAnimationFrame(action);

 


    
 