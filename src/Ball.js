import { choose, getRandomInt, getDistance, roundTo } from "./utils.js";
import { availableSpaces, balls, mainCanvas, COLLISION_LOSS, mainCtx, FRICTION_LOSS, G, MAX_SPEED, R, SIDE_VIEW, borderCoords } from "./constants.js";


class Ball {
  constructor(name, color) {
    this.name = name;
    this.color = color;

    this.center = {};
    this.velocity = { x: 25, y: 3 };

    this._spawn();
    this._createDataCanvas();
    this._draw()
    this._updateData();
    this._findSteps()
    this._updateCirclePoints()

    this.IsMoving = true;
  }


  move() {
    if (this.IsMoving === true) {
      //this.velocity.x *= FRICTION_LOSS;
      //SIDE_VIEW ? this.velocity.y += G : this.velocity.y *= FRICTION_LOSS;

      this.center.x = roundTo(this.center.x + this.step.x, 2);
      this.center.y = roundTo(this.center.y + this.step.y, 2);

      this.dataCanvas.style.left = `${this.center.x - R / 2}px`;
      this.dataCanvas.style.top = `${this.center.y - R / 2}px`;

      this._checkBorderCollision();
      this._checkBallCollision();

      this._updateData(); 

      //if (SIDE_VIEW) this._checkRolling(); 
      //if (Math.abs(this.velocity.y) < 0.1 || Math.abs(this.velocity.y) < 0.1 ) this.IsMoving = false; 
    } 

    this._draw(); 
    this._updateCirclePoints();
  }
  
  _updateCirclePoints() {
    const ballCircumference =  2 * Math.PI * R;
    const angleStep = 2 * Math.PI / ballCircumference; // angle step between each pixel
    this.circlePoints = [];

    let angle = 0;
    while (angle <= Math.PI * 2) {
      const x = roundTo(this.center.x + R * Math.cos(angle), 2);
      const y = roundTo(this.center.y + R * Math.sin(angle), 2);

      this.circlePoints.push({ x, y });
      angle += angleStep;
    }
  }

  _findSteps() {
    this.step = {};
    this.step.x = this.velocity.x / (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)); // .abs to preserve negative values AND to avoid zero values
    this.step.y = this.velocity.y / (Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
  }

  _draw() {
    this._drawDirectionVector();
    this._drawBall();
  }

  _spawn() {
    const availableSpace = choose(availableSpaces);
    this.center.x = getRandomInt(availableSpace.xMin, availableSpace.xMax); 
    this.center.y = mainCanvas.height - getRandomInt(R, mainCanvas.height - R); 

    this._updateAvailableSpaces();
  }

  _createDataCanvas() {
    this.dataCanvas = document.createElement('canvas');
    this.dataCanvas.width = 100;
    this.dataCanvas.height = 50;
    this.dataCanvas.classList.add("data");

    this.dataCtx = this.dataCanvas.getContext('2d'); 
    this.dataCtx.fillStyle = 'white';
    this.dataCtx.font = '10px Monospace'; 
    this.dataCtx.textAlign = 'left';
    this.dataCtx.textBaseline = 'bottom'; 

    document.getElementById("container").appendChild(this.dataCanvas);
  }

  _updateData() {
    this.dataCtx.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);

    this.directionAngle = roundTo(Math.atan2(this.directionEndpoint.y - this.center.y, this.directionEndpoint.x - this.center.x), 2);
    
    this.dataCtx.fillText(`angle: ${roundTo(this.directionAngle, 2)}rad`, 0, 10);
    this.dataCtx.fillText(`V: ${roundTo(this.directionMagnitude, 2)}`, 0, 20);
    this.dataCtx.fillText(`Vx: ${roundTo(this.velocity.x, 2)}`, 0, 30);
    this.dataCtx.fillText(`Vy: ${roundTo(this.velocity.y, 2)}`, 0, 40);
    this.dataCtx.fillText(`tan: ${roundTo(Math.tan(this.directionAngle), 2)}`, 0, 50);
  }

  _updateAvailableSpaces() {
    for (let i = 0; i < availableSpaces.length; i++) {
      const availableSpace = availableSpaces[i];

      if (this.center.x >= availableSpace.xMin && this.center.x <= availableSpace.xMax) { // find the space the ball is currently in
        if (this.center.x - availableSpace.xMin < 2 * R && availableSpace.xMax - this.center.x < 3 * R) { // there's no room for another ball
          availableSpaces.splice(i, 1); 

        } else if (this.center.x - availableSpace.xMin < 2 * R) { // there's no room to the left
          availableSpaces[i].xMin = this.center.x + 2 * R;  // cut off the space to the left
        } else if (availableSpace.xMax - this.center.x < 2 * R) { // there's no room to the right
          availableSpaces[i].xMax = this.center.x - 2 * R; // cut off the space to the right

        } else { // there's room for another ball on both sides
          const newAvailableSpaceLeft = { xMin: availableSpace.xMin, xMax: this.center.x - 2 * R }; 
          const newAvailableSpaceRight = { xMin: this.center.x + 2 * R, xMax: availableSpace.xMax };

          availableSpaces.splice(i, 1, newAvailableSpaceLeft, newAvailableSpaceRight); // replace the current space with two new spaces
        }
      }

      break;
    }
  }    

  _drawBall() {
    mainCtx.fillStyle = this.color;
    mainCtx.beginPath();
    mainCtx.arc(this.center.x, this.center.y, R, 0, Math.PI * 2);
    mainCtx.fill(); 
  }

  _updateDirectionEndpoint() {
    this.directionEndpoint = { x: this.center.x + this.velocity.x, y: this.center.y + this.velocity.y};
    this.directionMagnitude = getDistance(this.center.x, this.center.y, this.directionEndpoint.x, this.directionEndpoint.y);
  }

  _drawDirectionVector() {
    this._updateDirectionEndpoint();

    mainCtx.strokeStyle = "red";
    mainCtx.beginPath();
    mainCtx.moveTo(this.center.x, this.center.y);
    mainCtx.lineTo(this.directionEndpoint.x, this.directionEndpoint.y);
    mainCtx.stroke();
  }

  _checkBorderCollision() {
    const collisionPoints = [];

    for (let i = 0; i < borderCoords.length; i++) {
      const point = borderCoords[i];
      const distanceToPoint = getDistance(this.center.x, this.center.y, point.x, point.y);

      // at some point ball goes from zero collision points to more than one
      if (distanceToPoint <= R) { 
        collisionPoints.push(point); 
      }
    }

    if (collisionPoints.length > 1) {
      // relevant collision point is exactly in the middle
      const middlePoint = {};
      middlePoint.x = roundTo((collisionPoints[0].x + collisionPoints[collisionPoints.length - 1].x) / 2, 2);
      middlePoint.y = roundTo((collisionPoints[0].y + collisionPoints[collisionPoints.length - 1].y) / 2, 2);

      this._calculateCollisionAngle(middlePoint);

      this._findSteps();

      this.center.x = roundTo(this.center.x + this.step.x, 2);
      this.center.y = roundTo(this.center.y + this.step.y, 2);

      /*
      mainCtx.fillStyle = 'red';
      mainCtx.beginPath();
      mainCtx.arc(middlePoint.x, middlePoint.y, 2, 0, Math.PI * 2);
      mainCtx.fill(); 
      */
    }
  }

  _checkBallCollision() {
    this._getOtherCirclePoints();

    for (let i = 0; i < this.otherCirclePoints.length; i++) {
      const circlePoint = this.otherCirclePoints[i];
      const distanceToPoint = getDistance(this.center.x, this.center.y, circlePoint.x, circlePoint.y);


     if (distanceToPoint <= R) { 
        this._calculateCollisionAngle(circlePoint);

        this._findSteps();

        this.center.x = roundTo(this.center.x + this.step.x, 2);
        this.center.y = roundTo(this.center.y + this.step.y, 2);
      }
    }
  }

  _calculateCollisionAngle(collisionPoint) {
    const collAngle = roundTo(Math.atan2(collisionPoint.y - this.center.y, collisionPoint.x - this.center.x), 3);
    const relCollAngle = collAngle - this.directionAngle;
    const newDirAngle = collAngle + relCollAngle - Math.PI;

    this.velocity.x = this.directionMagnitude * Math.cos(newDirAngle);
    this.velocity.y = this.directionMagnitude * Math.sin(newDirAngle);
  }

  _getOtherCirclePoints() {
    this.otherCirclePoints = [];

    for (let i = 0; i < balls.length; i++) {
      if (balls[i].name !== this.name) {
        const otherBallCirclePoints = balls[i].circlePoints;
        this.otherCirclePoints.push(...otherBallCirclePoints);
      }
    }
  }

  _checkRolling() { // ball rolls on the ground | for side view only!
    if (this.center.y >= mainCanvas.height - R && Math.abs(this.velocity.y) <= this.g) { 
      this.g = 0;
      this.velocity.y = 0;
      this.velocity.y *= FRICTION_LOSS; 
    }
  }
}


export default Ball;