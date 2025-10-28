const mainCanvas = document.querySelector('canvas');
const mainCtx = mainCanvas.getContext('2d');

const SIDE_VIEW = false; 

const G = 1; 

const FPS = 1; 
const FRICTION_LOSS = 1 - 0.2 / (1000 / FPS); 
const COLLISION_LOSS = 0.5;
const R = 100;
const MAX_SPEED = 10;

const balls = [];
const availableSpaces = [{ xMin: R, xMax: mainCanvas.width - R }]; 

let borderCoords = () => {
  const borderCoords = [];

  // left border
  for (let i = 0; i <= mainCanvas.height; i++) {
    const y = i;
    const x = 0;

    borderCoords.push({x, y});
  }

 // top border 
  for (let i = 0; i <= mainCanvas.width; i++) {
    const y = 0;
    const x = i;

    borderCoords.push({x, y});
  }

  // right border
  for (let i = 0; i <= mainCanvas.height; i++) {
    const y = i;
    const x = mainCanvas.width;

    borderCoords.push({x, y});
  }

  // bottom corner
  for (let i = 0; i <= mainCanvas.width; i++) {
    const y = mainCanvas.height;
    const x = i;

    borderCoords.push({x, y});
  }

  return borderCoords;
};

borderCoords = borderCoords();


export { mainCanvas, mainCtx, SIDE_VIEW, G, FPS, FRICTION_LOSS, COLLISION_LOSS, R, MAX_SPEED, balls, availableSpaces, borderCoords }