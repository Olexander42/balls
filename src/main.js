import Ball from "./Ball.js";
import Data from "./Data.js";
import { ballsFactory, handleCollisions } from "./helpers.js";
import { balls, datas, FPS, mainCanvas, mainCtx, totalVelocity } from "./constants.js";


// balls escape the playground
balls.push(new Ball("ball1", 'green', { x:300, y:250 }, { x: -31, y: 0 }));
balls.push(new Ball("ball2", 'red', { x:160, y:200 }, { x: -1, y: 0}));
balls.push(new Ball("ball4", 'orange', { x:300, y:350 }, {x:24, y:15 })); 

for (let i = 0; i < balls.length; i++) {
  datas.push(new Data(balls[i]));
}

document.querySelector('html').addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    action();
  }
})

let count = 0;
const action = () => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  let KE = 0;
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    ball.action();
    datas[i].update();
    //balls[i].draw();

    KE += 0.5 * (ball.velocity.x ** 2 + ball.velocity.y ** 2);
  }

  handleCollisions();

  for (let i = 0; i < balls.length; i++) { // only draw after all calculations are done
   balls[i].draw();
  }

  count++; 
  console.log(count);

  //requestAnimationFrame(action);
}

//requestAnimationFrame(action);

 


    
 