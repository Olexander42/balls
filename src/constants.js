const mainCanvas = document.querySelector('canvas');
const mainCtx = mainCanvas.getContext('2d');

const SIDE_VIEW = false; 

const G = 1; 

const FPS = 1; 
const FRICTION_LOSS = 1 - 0.2 / (1000 / FPS); 
const COLLISION_LOSS = 0.5;
const R = 100;
const MAX_SPEED = 10;

const balls = {};
const availableSpaces = [{ xMin: R, xMax: mainCanvas.width - R }]; 

export { mainCanvas, mainCtx, SIDE_VIEW, G, FPS, FRICTION_LOSS, COLLISION_LOSS, R, MAX_SPEED, balls, availableSpaces }