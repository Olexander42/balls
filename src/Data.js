import { R } from "./constants.js";
import { roundTo } from "./utils.js";


class Data {
  constructor(ball) {
    this.ball = ball;

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

  update() {
    this.dataCtx.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);

    // position
    this.dataCanvas.style.left = `${this.ball.center.x - R / 2}px`;
    this.dataCanvas.style.top = `${this.ball.center.y - R / 2}px`;

    // data
    this.dataCtx.fillText(`angle: ${roundTo(this.ball.dirAngle, 3)}rad`, 0, 10);
    this.dataCtx.fillText(`V: ${roundTo(this.ball.linearMomentum, 3)}`, 0, 20);
    this.dataCtx.fillText(`Vx: ${roundTo(this.ball.velocity.x, 3)}`, 0, 30);
    this.dataCtx.fillText(`Vy: ${roundTo(this.ball.velocity.y, 3)}`, 0, 40);
  }
}

export default Data;