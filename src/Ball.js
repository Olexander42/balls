import { availableSpaces, balls, mainCanvas, mainCtx, MAX_SPEED, R, borderCoords } from "./constants.js";
import { choose, getDistance, getRandomInt, roundTo, noiseFilter } from "./utils.js";
import { normalizePoint, findValidCollisionPoint } from "./helpers.js";


class Ball {
  constructor(name, color, center, velocity) {
    this.name = name;
    this.color = color;

    this.center = center;
    this.velocity = velocity;

    this.draw()
  }

  action() {
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
    console.log(this.color, "center:", this.center);
  }

  updateDirectionEndpoint() {
    this.directionEndpoint = { x: this.center.x + this.velocity.x, y: this.center.y + this.velocity.y};
    this.linearMomentum = getDistance(this.center, this.directionEndpoint);
    this.dirAngle = Math.atan2(this.directionEndpoint.y - this.center.y, this.directionEndpoint.x - this.center.x);
  }

  draw() {
    // ball
    mainCtx.fillStyle = this.color;
    mainCtx.beginPath();
    mainCtx.arc(this.center.x, this.center.y, R, 0, Math.PI * 2);
    mainCtx.fill(); 

    // direction 
    this.updateDirectionEndpoint();
    mainCtx.strokeStyle = 'black';
    mainCtx.beginPath();
    mainCtx.moveTo(this.center.x, this.center.y);
    mainCtx.lineTo(this.directionEndpoint.x, this.directionEndpoint.y);
    mainCtx.stroke();
  }

  getCollisionVelocity(collisionPoint) {
    this.collVel = {x: 0, y: 0};
    this.collLinMom = null;

    this._getCollisionAngles(collisionPoint);

    this.updateDirectionEndpoint();

    this.collLinMom = this.linearMomentum * Math.cos(this.relCollAngle);

    this.collVel = {
      x: this.collLinMom * noiseFilter(this.absCollAngle).cos,
      y: this.collLinMom * noiseFilter(this.absCollAngle).sin,
    }

    console.log(this.color, "absCollAngle:", this.absCollAngle, "relCollAngle:", this.relCollAngle, "linearMomentum:", this.linearMomentum, "|", "collLinMom:", this.collLinMom, "|", "collVel:", this.collVel);
  }

  updateVelocities(collisionPoint) {
    this._getCollisionAngles(collisionPoint);
  
    const newDirAngle = this.absCollAngle - Math.PI + this.relCollAngle;
  
    const newVelocity = {
      x: this.linearMomentum * noiseFilter(newDirAngle).cos,
      y: this.linearMomentum * noiseFilter(newDirAngle).sin,
    }

    this.velocity.x = newVelocity.x;
    this.velocity.y = newVelocity.y;

    console.log("velocity:", this.velocity);
  }   

  _getCollisionAngles(collisionPoint) {
    this.absCollAngle = Math.atan2(collisionPoint.y - this.center.y, collisionPoint.x - this.center.x);
    this.relCollAngle = this.absCollAngle - this.dirAngle; // we don't use dot product because then we lose information about the direction 
  }
}


export default Ball;