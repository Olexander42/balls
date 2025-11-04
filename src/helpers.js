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

function checkBallsCollisions() {
  for (let i = 0; i < balls.length - 1; i++) { 
    const ballA = balls[i]; 

    for (let j = i + 1; j < balls.length; j++) { 
      const ballB = balls[j];
        
      const distanceBetweenCenters = getDistance(ballA.center, ballB.center);

      if (distanceBetweenCenters <= R * 2) {
        console.log(`| ${i + 1} pair |`)
 
        ballA.getCollisionVelocity(ballB.center);
        ballB.getCollisionVelocity(ballA.center);

        const ball1preVel = ballA.velocity;
        const ball2preVel = ballB.velocity;
   
        console.log("____before______")
        console.table(`${ballA.name}.velocity`, ballA.velocity);
        console.table(`${ballB.name}.velocity`, ballB.velocity);

        ballA.velocity = {
          x: ball1preVel.x - ballA.collVel.x + ballB.collVel.x,
          y: ball1preVel.y - ballA.collVel.y + ballB.collVel.y,
        }

        ballB.velocity = {
          x: ball2preVel.x - ballB.collVel.x + ballA.collVel.x,
          y: ball2preVel.y - ballB.collVel.y + ballA.collVel.y,
        }

        // bounce 
        ballA.move();
        ballB.move();

        console.log("_____after_____");
        console.table(`${ballA.name}.velocity`, ballA.velocity);
        console.table(`${ballB.name}.velocity`, ballB.velocity);
        console.log("____end of exachange___");
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