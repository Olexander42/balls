import Ball from "./Ball.js";
import { availableSpaces, balls, mainCanvas, mainCtx, R, borderCoords } from "./constants.js";
import { choose, getDistance, getAngleBetween, noiseFilter } from "./utils.js";

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

function findAvailableSpace() { //it's currently one-dimensional - upgrade it to two-dimensional
    const availableSpace = choose(availableSpaces);

    const x = getRandomInt(availableSpace.xMin, availableSpace.xMax); 
    const y = mainCanvas.height - getRandomInt(R, mainCanvas.height - R); 

    updateAvailableSpaces(x);
}

function updateAvailableSpaces(x, y) {
  for (let i = 0; i < availableSpaces.length; i++) {
    const availableSpace = availableSpaces[i];

    if (x >= availableSpace.xMin && x <= availableSpace.xMax) { // find the space the ball is currently in
      if (x - availableSpace.xMin < 2 * R && availableSpace.xMax - x < 3 * R) { // there's no room for another ball
        availableSpaces.splice(i, 1); 

      } else if (x - availableSpace.xMin < 2 * R) { // there's no room to the left
        availableSpaces[i].xMin = x + 2 * R;  // cut off the space to the left
      } else if (availableSpace.xMax - x < 2 * R) { // there's no room to the right
        availableSpaces[i].xMax = x - 2 * R; // cut off the space to the right

      } else { // there's room for another ball on both sides
        const newAvailableSpaceLeft = { xMin: availableSpace.xMin, xMax: x - 2 * R }; 
        const newAvailableSpaceRight = { xMin: x + 2 * R, xMax: availableSpace.xMax };

        availableSpaces.splice(i, 1, newAvailableSpaceLeft, newAvailableSpaceRight); // replace the current space with two new spaces
      }
    }

    break;
  }
}

function handleCollisions() {
  // border
  for (let i = 0; i < balls.length; i++) { 
    const ball = balls[i]; 
    const collisionPoints = [];

    for (let i = 0; i < borderCoords.length; i++) {
      const point = borderCoords[i];
      const distToPoint = getDistance(ball.center, point);
      
      if (distToPoint <= R) { 
        collisionPoints.push(point); // at some point ball goes from zero collision points to one or more
      }
    }

    if (collisionPoints.length > 1) {
      console.log(ball.color)
      const validCollisionPoint = findValidCollisionPoint(collisionPoints);
      //console.log("validCollisionPoint:", validCollisionPoint);
      ball.updateVelocities(validCollisionPoint);

      const displcBall = getCollisionDisplacement(ball, validCollisionPoint);
      possitionCorrection(ball, displcBall);

      ball.updateDirectionEndpoint();
    }
  }

  // balls
  for (let i = 0; i < balls.length - 1; i++) { 
    const ballA = balls[i]; 

    for (let j = i + 1; j < balls.length; j++) { 
      const ballB = balls[j];
        
      const distanceBetweenCenters = getDistance(ballA.center, ballB.center);

      if (distanceBetweenCenters <= R * 2) {
 
        ballA.getCollisionVelocity(ballB.center);
        ballB.getCollisionVelocity(ballA.center);

        /*
        console.log(ballA.color, "velocity before collision", ballA.velocity);
        console.log(ballB.color, "velocity before collision", ballB.velocity);
        */

        const displcBallA = getCollisionDisplacement(ballA, ballB.center);
        const displcBallB = getCollisionDisplacement(ballB, ballA.center);

        possitionCorrection(ballA, displcBallA);
        possitionCorrection(ballB, displcBallB);


        ballA.velocity = {
          x: ballA.velocity.x - ballA.collVel.x + ballB.collVel.x,
          y: ballA.velocity.y - ballA.collVel.y + ballB.collVel.y,
        }

        ballB.velocity = {
          x: ballB.velocity.x - ballB.collVel.x + ballA.collVel.x,
          y: ballB.velocity.y - ballB.collVel.y + ballA.collVel.y,
        }

        ballA.updateDirectionEndpoint();
        ballB.updateDirectionEndpoint();
        /*
        console.log(ballA.color, "velocity after collision", ballA.velocity);
        console.log(ballB.color, "velocity after collision", ballB.velocity);
        */
      }
    }
  }
}

function findValidCollisionPoint(collisionPoints) {
  // relevant collision point is exactly in the middle of the array
  const middlePoint = {};

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < collisionPoints.length; i++) {
    sumX += collisionPoints[i].x;
    sumY += collisionPoints[i].y;
  }

  middlePoint.x = sumX / collisionPoints.length;
  middlePoint.y = sumY / collisionPoints.length;
  
  return middlePoint;
}

function normalizePoint(point, ball) {
  return { x: point.x - ball.center.x, y: point.y - ball.center.y };
}

function getCollisionDisplacement(ball, collisionPoint) {
  let absDisplc = R - getDistance(ball.center, collisionPoint);
  console.log(ball.color, "distance:", getDistance(ball.center, collisionPoint));
  if (absDisplc < 0) absDisplc = (absDisplc + R) / 2; // collision between balls 
  
  const absDisplcVelocity = {
    x: absDisplc * noiseFilter(ball.absCollAngle).cos,
    y: absDisplc * noiseFilter(ball.absCollAngle).sin,
  }  

  const relDisplc = Math.abs(noiseFilter(ball.absCollAngle).cos) >= Math.abs(noiseFilter(ball.dirAngle).sin) // horizontal or vertical collision?
    ? absDisplcVelocity.x / noiseFilter(ball.dirAngle).cos // vertical collision
    : absDisplcVelocity.y / noiseFilter(ball.dirAngle).sin; // horizontal collison
  
  const relDisplcVelocity = {
    x: relDisplc * noiseFilter(ball.dirAngle).cos,
    y: relDisplc * noiseFilter(ball.dirAngle).sin,
  }  

  console.log("absDisplc:", absDisplc, "|", "absDisplcVelocity:", absDisplcVelocity);
  console.log("relDisplc:", relDisplc, "|", "relDisplcVelocity:", relDisplcVelocity);

  return relDisplcVelocity;
}

function possitionCorrection(ball, displc) {
  ball.center.x -= displc.x;
  ball.center.y -= displc.y;
}


export { ballsFactory, handleCollisions, normalizePoint, findValidCollisionPoint }