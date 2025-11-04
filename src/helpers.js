import Ball from "./Ball.js";
import { availableSpaces, balls, mainCanvas, mainCtx, R, borderCoords } from "./constants.js";
import { choose, getDistance, getAngleBetween } from "./utils.js";

function ballsFactory(num) {
  const colors = ["red", "blue", "orange", "yellow", "green", "indigo", "violet", "silver"];
  let n = 1;

  while (num > 0 && availableSpaces.length > 0) { 
    const name = `ball${n.toString()}`;
    balls.push(new Ball(name, choose(colors))); 
    n++;
    num--;
  } 
}

function checkBallsCollisions() {
  for (let i = 0; i < balls.length - 1; i++) { 
    const ball1 = balls[i]; 

    for (let j = i + 1; j < balls.length; j++) { 
      const ball2 = balls[j];
        
      const distanceBetweenCenters = getDistance(ballA.center, ballB.center);

      if (distanceBetweenCenters <= R * 2) {
        console.log(`| ${i + 1} pair |`)
 
        ball1.getCollisionVelocity(ball2.center);
        ball2.getCollisionVelocity(ball1.center);

        const ball1preVel = ball1.velocity;
        const ball2preVel = ball2.velocity;
   
        console.log("____before______")
        console.table(`${ball1.name}.velocity`, ball1.velocity);
        console.table(`${ball2.name}.velocity`, ball2.velocity);

        ball1.velocity = {
          x: ball1preVel.x - ball1.collVel.x + ball2.collVel.x,
          y: ball1preVel.y - ball1.collVel.y + ball2.collVel.y,
        }

        ball2.velocity = {
          x: ball2preVel.x - ball2.collVel.x + ball1.collVel.x,
          y: ball2preVel.y - ball2.collVel.y + ball1.collVel.y,
        }

        // bounce 
        ball1.move();
        ball2.move();

        console.log("_____after_____");
        console.table(`${ball1.name}.velocity`, ball1.velocity);
        console.table(`${ball2.name}.velocity`, ball2.velocity);
        console.log("____end of exachange___");

        // show the collision point 
        mainCtx.fillStyle = 'black';
        mainCtx.beginPath();
        mainCtx.arc(validCollisionPoint.x, validCollisionPoint.y, 2, 0, Math.PI * 2);
        mainCtx.fill();
        }
      }
  }
}

function findValidCollisionPoint(collisionPoints) {
  // relevant collision point is exactly in the middle
  const middlePoint = {};

  middlePoint.x = (collisionPoints[0].x + collisionPoints[collisionPoints.length - 1].x) / 2;
  middlePoint.y = (collisionPoints[0].y + collisionPoints[collisionPoints.length - 1].y) / 2;

  return middlePoint;
}

function normalizePoint(point, ball) {
  return { x: point.x - ball.center.x, y: point.y - ball.center.y }
}


export { ballsFactory, checkBallsCollisions, normalizePoint, findValidCollisionPoint }