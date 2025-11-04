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
      const collisionPoints = checkCirclePoints(ball1, ball2);

      if (collisionPoints.length > 1) {
        console.log(`| ${i + 1} pair |`)
        const validCollisionPoint = findValidCollisionPoint(collisionPoints);

        ball1.getCollisionVelocity(validCollisionPoint);
        ball2.getCollisionVelocity(validCollisionPoint);

        // sum up collVels.x and collVels.y

        // balln.velocity.x - sumCollVels.x and balln.velocity.y - sumCollVels.y 

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

function checkCirclePoints(ballA, ballB) {
  const collisionPoints = []
  const circlePoints = ballB.circlePoints;

  for (let i = 0; i < circlePoints.length; i++) {
    const point = circlePoints[i];  
    const distance = getDistance(ballA.center, point);

    if (distance <= R) {  
      collisionPoints.push(point)
    }
  }

  return collisionPoints;
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