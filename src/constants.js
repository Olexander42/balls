const mainCanvas = document.querySelector('canvas');
const mainCtx = mainCanvas.getContext('2d');

const FPS = 1; 
const R = 50;
const MAX_SPEED = 10;
const EPSILON = 10 ** (-10);

const availableSpaces = [{ xMin: R, xMax: mainCanvas.width - R }]; 
const balls = [];
const datas = [];
const totalVelocity = {x: 0, y: 0};


let borderCoords = () => {
  const borderCoords = [];
  const pixelStep = 1;

  // left-right border
  for (let i = 0; i <= mainCanvas.height; i += pixelStep) {
    const y = i;
    
    borderCoords.push({x: 0, y});
    borderCoords.push({x: mainCanvas.width, y});
  }

 // top-botton border 
  for (let i = 0; i <= mainCanvas.width; i += pixelStep) {
    const x = i;

    borderCoords.push({x, y: 0});
    borderCoords.push({x, y: mainCanvas.height});
  }

  return borderCoords;
};

borderCoords = borderCoords();

export { mainCanvas, mainCtx, FPS, R, MAX_SPEED, EPSILON, availableSpaces, balls, datas, totalVelocity, borderCoords }