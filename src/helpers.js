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
      const validCollisionPoint = findValidCollisionPoint(collisionPoints);
      ball.updateVelocities(validCollisionPoint);

      correctPosition(ball, validCollisionPoint);

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

        correctPositions(ballA, ballB);

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

function correctPosition(ball, collisionPoint) {
  const absDisplc = R - getDistance(ball.center, collisionPoint);
  const relDisplc = getRelativeDisplacement(ball, absDisplc);

  moveBack(ball, relDisplc);
}


function correctPositions(ball1, ball2, type) {
  const totalCollMomentum = Math.abs(ball1.collLinMom) + Math.abs(ball2.collLinMom);
  console.log("totalCollMomentum:", totalCollMomentum);
  const totalAbsDisplc = 2 * R - getDistance(ball1.center, ball2.center);
  console.log("totalAbsDisplc:", totalAbsDisplc);

  // each ball's "share" in the overlap | displace equals momentum magnitude
  const k1 = Math.abs(ball1.collLinMom) / totalCollMomentum; 
  const k2 = Math.abs(ball2.collLinMom) / totalCollMomentum; 

  const absDisplc1 = totalAbsDisplc * k1;
  const absDisplc2 = totalAbsDisplc* k2;
  console.log(ball1.color, "absDisplc:", absDisplc1, "|", ball2.color, "absDisplc:", absDisplc2);

  // find displacement projection on ball direction
  const relDisplc1 = getRelativeDisplacement(ball1, absDisplc1);
  const relDisplc2 = getRelativeDisplacement(ball2, absDisplc2);
  console.log(ball1.color, "relDisplc:", relDisplc1, "|", ball2.color, "relDisplc:", relDisplc2 )

  /*
  const relDisplc1 = getRelativeDisplacement(ball1, absDisplc1);
  const relDisplc2 = getRelativeDisplacement(ball2, absDisplc2);
  */

  //console.log(ball1.color, "relDisplc:", relDisplc1, "|", ball2.color, "relDisplc:", relDisplc2);

  moveBack(ball1, relDisplc1);
  moveBack(ball2, relDisplc2);
}

function moveBack(ball, relDisplc) {
  const relDisplcVelocity = {
    x: relDisplc * noiseFilter(ball.dirAngle).cos,
    y: relDisplc * noiseFilter(ball.dirAngle).sin,
  }  
  console.log(ball.color, "center before correction:", ball.center);
  ball.center.x -= relDisplcVelocity.x;
  ball.center.y -= relDisplcVelocity.y;
  console.log(ball.color, "center after correction:", ball.center);
}

function getRelativeDisplacement(ball, absDisplc) {
  return absDisplc / Math.cos(ball.relCollAngle);
}

function normalizePoint(point, ball) {
  return { x: point.x - ball.center.x, y: point.y - ball.center.y };
}


export { ballsFactory, handleCollisions, normalizePoint, findValidCollisionPoint }