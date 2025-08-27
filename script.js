// some balls still get stuck after collision
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const ms = 17; 
const frictionLoss = 1 - 0.2 / (1000 / ms); 
const r = 50;

let g = 0; // 0 - gravity off (side view), 1 - gravity on(top view)

let balls = {};
let numOfBalls;
let ranges = [[r, canvas.width - r]]; 

function choice(array) { // randomly choose an element out of any array
  return array[Math.floor(Math.random() * (array.length))];
}

function getRandomInt(min, max) { // randomly pick a value from the range (except 0)
  while (true) {
    let result = Math.floor(Math.random() * ((max - min) +1) + min);
    if (result !== 0) return result;
  }
};      

class Ball {
  constructor(name, color, x, speed) {
    // ball
    this.name = name;
    this.color = color;
    this.r = r;
    this.range = choice(ranges)
    this.x = getRandomInt(this.range[0], this.range[1]); 
    this.y = canvas.height - getRandomInt(this.r, canvas.height - this.r); 
    this.xSpeed = getRandomInt(-10, 10);
    this.ySpeed = getRandomInt(-10, 10);
    this.moving = true;
    // this.direction = ?
    this.points = this._circlePoints();
    this._draw();
    this._updateRanges();
    //this.g = g;    
    }

  _draw() {
    // draw the ball
    ctx.fillStyle = "black" // this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill(); 
    // draw the circle points on the ball
    this.points = this._circlePoints(); // update points
    for (let i = 0; i < this.points.length; i++) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      let [pointX, pointY] = this.points[i];
      ctx.arc(pointX, pointY, 2, 0, Math.PI * 2)
      ctx.fill();
    }
    // draw direction vector
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.vectorX, this.vectorY);
    ctx.stroke();
  }

  move() {
    if (this.moving === true) {
      // this.ySpeed += this.g;
      this.xSpeed *= frictionLoss;
      this.ySpeed *= frictionLoss;
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      this._direction();
      this._checkBorderCollision();
      // this._checkRolling(); // works only for side view
      if (Math.abs(this.xSpeed) < 0.1) this.moving = false; 
    } 
    this._draw(); 
  }

  _updateRanges() {
    for (let i = 0; i < ranges.length; i++) { // pick one range after another
      let [rangeMin, rangeMax] = ranges[i]
      if (this.x >= rangeMin && this.x <= rangeMax) { // the ball has found the range 
        if (this.x - rangeMin < 2 * r && rangeMax - this.x < 3 * r) { // there's no space on either side anymore
          ranges.splice(i, 1); // delete the range altogether
        } else if (this.x - rangeMin < 2 * r) { // there's no space for another ball on the left
          ranges[i][0] = this.x + 2 * r// cut off that dead zone on the left
        } else if (rangeMax - this.x < 2 * r) { // there's no space for another ball on the right
          ranges[i][1] = this.x - 2 * r // cut off that dead zone on the right 
        } else { // there's enough space for a ball on both sides
          // split the current range into two new ranges 
          let newRangeLeft = [rangeMin, this.x - 2 * this.r]; 
          let newRangeRight = [this.x + 2 * this.r, rangeMax];
          ranges.splice(i, 1, newRangeLeft, newRangeRight); // replace the current range with the two new ranges
        }
        break;
      }
    }
  }    

  _circlePoints() {
    let points = [];
    let steps = 8; // the number of circle points
    let step = 2 * Math.PI / steps; // create equal gap
    for (let i = 0; i < steps; i++) {
      let rad = step * i; // radians to each circle point
      const sin = Math.sin(rad);
      const cos = Math.cos(rad); 
      const x = Math.floor(this.x - this.r * sin);
      const y = Math.floor(this.y - this.r * cos);
      points.unshift([x, y]); // add the x;y pair to the points array
    }
    return points; 
  }

  _direction() {
    this.vectorX = this.x;
    this.vectorY = this.y;
    let vectorLength = 0;
    while (true) {
      this.vectorX += this.xSpeed;
      this.vectorY += this.ySpeed;
      vectorLength = pythagoreanTheorem(this.x, this.vectorX, this.y, this.vectorY);
      if (vectorLength >= this.r) {
        break;
      }
    }
  }

  _checkBorderCollision() {
    if ((this.x > canvas.width - this.r && this.xSpeed > 0) || // right border
      (this.x < this.r  && this.xSpeed < 0)) { // left border
      this.x += this.xSpeed;
      this.xSpeed *= -0.5;
    }

    if ((this.y >= canvas.height - this.r && this.ySpeed >= 0) || // bottom border
        (this.y < this.r && this.ySpeed < 0)) { // top border
        this.y += this.ySpeed;
        this.ySpeed *= -0.5;
    } 
  };

  _checkRolling() { // ball rolls on the ground | side view only!
    if (this.y >= canvas.height - this.r && Math.abs(this.ySpeed) <= this.g) { 
      this.g = 0;
      this.ySpeed = 0;
      this.xSpeed *= frictionLoss; 
    }
  }
}

function ballNameGenerator(n) {
  let name = "ball" + n.toString();
  return name;
}

function ballGrabber(ballsArr, n) {
  let name = ballNameGenerator(n);  
  let ball = ballsArr[name];
  return ball;
}

function pythagoreanTheorem(x1, x2, y1, y2) {
  let a = x1 - x2; // first cathetus length
  let b = y1 - y2; // second cathetus length
  let c = Math.floor(Math.sqrt(a * a + b * b)); // hypothenuse length
  return c
}

function ballsCrossover(ball1, ball2) { // finds ball2 point inside ball1
  let circlePoints = ball2.points; // take circle points from balln+1
  for (let i = 0; i < circlePoints.length; i++) {
    let point = circlePoints[i];  
    let c = pythagoreanTheorem(ball1.x, point[0], ball1.y, point[1]);
    if (c <= ball1.r) { // ball2 point is inside ball1
      return point;
    }
  }
  return false;
}

//function reactToCollision(ball, point) collision behavior in 3D space

function checkBallsCollision() { 
  // pick two balls at a time, one after another
  for (let n1 = 1; n1 < numOfBalls; n1++) { 
    let ball1 = ballGrabber(balls, n1) // take balln
    for (let n2 = n1 + 1; n2 <= numOfBalls; n2++) { 
      let ball2 = ballGrabber(balls, n2); // then take balln+1
      let circlePoints2 = ball2.points; // take circle points from balln+1
      let point2 = ballsCrossover(ball1, ball2);
      if (point2 !== false ) {
        let point1 = ballsCrossover(ball2, ball1);
        }
      }
    }
  }


function ballsFactory(num) {
  let n = 1;
  let colors = ["red", "blue", "orange", "yellow", "green", "indigo", "violet", "silver"]
  while (num > 0 && ranges.length > 0) { // repeat the cycle as many times as you many balls you want
    let name = ballNameGenerator(n);
    balls[name] = new Ball(name, choice(colors)); // add a new Ball class instance with a new name
    n++;
    num--;
  } 
  numOfBalls = Object.keys(balls).length; // update the number of balls
}

ballsFactory(2);

const animationIntervalId = setInterval( () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 1; i <= numOfBalls; i++) {
    let name = "ball" + i.toString();
    balls[name].move();
  }
 checkBallsCollision(); 
}, ms);        