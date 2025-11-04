import { availableSpaces, balls, mainCanvas, COLLISION_LOSS, mainCtx, FRICTION_LOSS, G, MAX_SPEED, R, SIDE_VIEW, borderCoords } from "./constants.js";
import { choose, getRandomInt, getDistance, roundTo, getAngleBetween, getDotProduct } from "./utils.js";
import { normalizePoint, findValidCollisionPoint } from "./helpers.js";



class Ball {
  constructor(name, color, center, velocity) {
    this.name = name;
    this.color = color;

    this.center = center;
    this.velocity = velocity;

    this._updateDirectionEndpoint();
    this._updateSteps();
    this.action();
  }

  action() {
    this.move()

    this._updateDirectionEndpoint();
    this._checkBorderCollision();

    this._drawBall();
    this._drawDirectionVector(); 
  }

  move() {
    this.center.x = this.center.x + this.velocity.x * 0.2;
    this.center.y = this.center.y + this.velocity.y * 0.2; 
  }

  _drawBall() {
    mainCtx.fillStyle = this.color;
    mainCtx.beginPath();
    mainCtx.arc(this.center.x, this.center.y, R, 0, Math.PI * 2);
    mainCtx.fill(); 
  }

  _updateDirectionEndpoint() {
    this.directionEndpoint = { x: this.center.x + this.velocity.x, y: this.center.y + this.velocity.y};
    this.linearMomentum = getDistance(this.center, this.directionEndpoint);
    this.angle = Math.atan2(this.directionEndpoint.y - this.center.y, this.directionEndpoint.x - this.center.x);
  }

  _drawDirectionVector() {
    mainCtx.strokeStyle = 'black';
    mainCtx.beginPath();
    mainCtx.moveTo(this.center.x, this.center.y);
    mainCtx.lineTo(this.directionEndpoint.x, this.directionEndpoint.y);
    mainCtx.stroke();
  }

  _updateSteps() {
    this.step = {};
    this.step.x = roundTo(this.velocity.x / (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)), 3); // .abs to preserve negative values AND to avoid zero values
    this.step.y = roundTo(this.velocity.y / (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)), 3);
  }

  getCollisionVelocity(collisionPoint) {
    this.collVel = {x: 0, y: 0};

    const dotProduct = getDotProduct(this.velocity, normalizePoint(collisionPoint, this));
    console.log(this.name, "dotProduct:", dotProduct);
    if (dotProduct > 0) {
      this._getCollisionAngles(collisionPoint);
      this._updateDirectionEndpoint();
      this.collLinMom = this.linearMomentum * Math.cos(this.relCollAngle);
      console.log(this.name, "collLinMom:", this.collLinMom);
      this.collVel = {
        x: this.collLinMom * Math.cos(this.absCollAngle),
        y: this.collLinMom * Math.sin(this.absCollAngle)
      }
    }  
    console.log(this.name, "collVel:", this.collVel, "relCollAngle:", this.relCollAngle);
  }

  _getCollisionAngles(collisionPoint) {
    this.absCollAngle = Math.atan2(collisionPoint.y - this.center.y, collisionPoint.x - this.center.x);
    this.relCollAngle = this.absCollAngle - this.angle; // we don't use dot product because then we lose information about the direction 
  }

  _checkBorderCollision() {
    const collisionPoints = [];

    for (let i = 0; i < borderCoords.length; i++) {
      const point = borderCoords[i];
      const distToPoint = getDistance(this.center, point);
      
      // at some point ball goes from zero collision points to one or more
      if (distToPoint <= R) { // point inside ball — collision
        collisionPoints.push(point); 
      }
    }

    // handle border collision
    if (collisionPoints.length > 1) {
      const validCollisionPoint = findValidCollisionPoint(collisionPoints);

      this._updateVelocities(validCollisionPoint);

      this._updateSteps();
      this._updateDirectionEndpoint();

      //bounce
      this.move();
 
    }
  }

  _updateVelocities(collisionPoint) {
    this._getCollisionAngles(collisionPoint);
    const newDirAngle = this.absCollAngle - Math.PI + this.relCollAngle;

    this.velocity.x = roundTo(this.linearMomentum * Math.cos(newDirAngle), 4);
    this.velocity.y = roundTo(this.linearMomentum * Math.sin(newDirAngle), 4);
  }   
}


export default Ball;