import Ball from "./Ball.js";
import { R, balls, availableSpaces } from "./constants.js";
import { choose, getDistance } from "./utils.js";


function findCollisionPoint(ballA, ballB) {
  const circlePoints = ballB.points;

  for (let i = 0; i < circlePoints.length; i++) {
    const point = circlePoints[i];  
    const distance = getDistance(ballA.x, ballA.y, point.x, point.y);
    if (distance <= R) {  
      return point; 
    }
  }

  return null;
}

function reactToBallsCollision() { 
  for (let i = 1; i < Object.keys(balls).length; i++) { 
    const ballA = balls[`ball${i.toString()}`]; 

    for (let j = i + 1; j <= numOfBalls; j++) { 
      const ballB = balls[`ball${j.toString()}`];

      const point = findCollisionPoint(ballA, ballB);
      if (point !== null) {
        // 
        }
      }
    }
  }


function ballsFactory(num) {
  const colors = ["red", "blue", "orange", "yellow", "green", "indigo", "violet", "silver"];
  let n = 1;

  while (num > 0 && availableSpaces.length > 0) { 
    const name = `ball${n.toString()}`;
    balls[name] = new Ball(name, choose(colors)); 
    n++;
    num--;
  } 
}

export { findCollisionPoint, ballsFactory }