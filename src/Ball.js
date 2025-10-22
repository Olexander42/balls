import { choose, getRandomInt, getDistance, roundTo } from "./utils.js";
import { availableSpaces, mainCanvas, COLLISION_LOSS, mainCtx, FRICTION_LOSS, G, MAX_SPEED, R, SIDE_VIEW } from "./constants.js";


class Ball {
  constructor(name, color) {
    this.name = name;
    this.color = color;

    this.x = 100; 
    this.y = 300; 

    this.angle = 0.785;
    this.momentum = 100; //getDistance(this.x, this.y, this.x + this.comp.x, this.y + this.comp.y);

    this.comp = {};

    this.IsMoving = true;
    //this._spawn();
    this._createDataCanvas();
    this._draw()
    this._updateData();
  }


  move() {
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (this.IsMoving === true) {
      //this.comp.x *= FRICTION_LOSS;
      //SIDE_VIEW ? this.comp.y += G : this.comp.y *= FRICTION_LOSS;
   
      this.x += this.comp.x * 0.01;
      this.y += this.comp.y * 0.01;

      this.dataCanvas.style.left = `${this.x - R / 2}px`;
      this.dataCanvas.style.top = `${this.y - R / 2}px`;
      this._updateData(); 
      
      this._checkBorderCollision();

      //if (SIDE_VIEW) this._checkRolling(); 
      //if (Math.abs(this.comp.y) < 0.1 || Math.abs(this.comp.y) < 0.1 ) this.IsMoving = false; 
    } 
    this._draw(); 
  }

  _draw() {
    //this._drawBall();
    this._drawDirectionVector();
  }

  _spawn() {
    const availableSpace = choose(availableSpaces);
    //this.x = getRandomInt(availableSpace.xMin, availableSpace.xMax); 
    //this.y = mainCanvas.height - getRandomInt(R, mainCanvas.height - R); 

    this._updateAvailableSpaces();
  }

  _createDataCanvas() {
    this.dataCanvas = document.createElement('canvas');
    this.dataCanvas.width = 100;
    this.dataCanvas.height = 50;
    this.dataCanvas.classList.add("data");

    this.dataCtx = this.dataCanvas.getContext('2d'); 
    this.dataCtx.fillStyle = 'black';
    this.dataCtx.font = '10px Monospace'; 
    this.dataCtx.textAlign = 'left';
    this.dataCtx.textBaseline = 'bottom'; 

    document.getElementById("container").appendChild(this.dataCanvas);
  }

  _updateData() {
    this.dataCtx.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);

    this.comp.x = this.momentum * Math.cos(this.angle);
    this.comp.y = this.momentum * Math.sin(this.angle);
    
    this.dataCtx.fillText(`angle: ${roundTo(this.angle, 3)}rad`, 0, 10);
    this.dataCtx.fillText(`V: ${roundTo(this.momentum, 3)}`, 0, 20);
    this.dataCtx.fillText(`Vx: ${roundTo(this.comp.x, 3)}`, 0, 30);
    this.dataCtx.fillText(`Vy: ${roundTo(this.comp.y, 3)}`, 0, 40);

    console.log(this.vector.x, this.vector.y);
  }

  _updateAvailableSpaces() {
    for (let i = 0; i < availableSpaces.length; i++) {
      const availableSpace = availableSpaces[i];

      if (this.x >= availableSpace.xMin && this.x <= availableSpace.xMax) { // find the space the ball is currently in
        if (this.x - availableSpace.xMin < 2 * R && availableSpace.xMax - this.x < 3 * R) { // there's no room for another ball
          availableSpaces.splice(i, 1); 

        } else if (this.x - availableSpace.xMin < 2 * R) { // there's no room to the left
          availableSpaces[i].xMin = this.x + 2 * R;  // cut off the space to the left
        } else if (availableSpace.xMax - this.x < 2 * R) { // there's no room to the right
          availableSpaces[i].xMax = this.x - 2 * R; // cut off the space to the right

        } else { // there's room for another ball on both sides
          const newAvailableSpaceLeft = { xMin: availableSpace.xMin, xMax: this.x - 2 * R }; 
          const newAvailableSpaceRight = { xMin: this.x + 2 * R, xMax: availableSpace.xMax };

          availableSpaces.splice(i, 1, newAvailableSpaceLeft, newAvailableSpaceRight); // replace the current space with two new spaces
        }
      }

      break;
    }
  }    

  _drawBall() {
    mainCtx.fillStyle = "black" // this.color;
    mainCtx.beginPath();
    mainCtx.arc(this.x, this.y, this.momentum, 0, Math.PI * 2);
    mainCtx.fill(); 
  }

  _drawDirectionVector() {
    //this._updateDirectionVector();
    this.vector = { x: this.x + this.comp.x, y: this.y + this.comp.y };

    mainCtx.strokeStyle = "red";
    mainCtx.beginPath();
    mainCtx.moveTo(this.x, this.y);
    mainCtx.lineTo(this.vector.x, this.vector.y);
    mainCtx.stroke();
  }


/*
  _updateDirectionVector() {
    this.vector.x = this.x;
    this.vector.y = this.y;

    let vectorLength = 0;

    while (true) {
      this.vector.x += this.comp.x * 0.01;
      this.vector.y += this.comp.y * 0.01;

      vectorLength = getDistance(this.x, this.y, this.vector.x, this.vector.y);
      console.log(vectorLength);
      if (vectorLength >= R) {
        break;
      }
    }
  }
*/

  _checkBorderCollision() {
    if (this.vector.y >= mainCanvas.height) console.log("bottom border hit");
  };

  _checkRolling() { // ball rolls on the ground | for side view only!
    if (this.y >= mainCanvas.height - R && Math.abs(this.comp.y) <= this.g) { 
      this.g = 0;
      this.comp.y = 0;
      this.comp.y *= FRICTION_LOSS; 
    }
  }
}


export default Ball;