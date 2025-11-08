import { R, EPSILON }  from "./constants.js";


function choose(array) {
  return array[Math.floor(Math.random() * (array.length))];
}

function getRandomInt(min, max) { 
  while (true) {
    const result = Math.floor(Math.random() * ((max - min) + 1) + min);
    if (result !== 0) return result;
  }
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getDistance(point1, point2) {
  const a = point1.x - point2.x; 
  const b = point1.y - point2.y; 
  const c = Math.sqrt(a * a + b * b); 

  return c;
} 

function getDotProduct(point1, point2) {
  return (point1.x * point2.x + point1.y * point2.y);
}

function getAngleBetween(point1, point2) {
  const dotProduct = getDotProduct(point1, point2);
  const length1 = getDistance({ x: 0, y: 0 }, point1);
  const length2 = getDistance({ x: 0, y: 0 }, point2);
  const angle = Math.acos(dotProduct / (length1 * length2));
  
  return angle;
}

function noiseFilter(angle) {
  const output = {
    cos: Math.abs(Math.cos(angle)) > EPSILON ? Math.cos(angle) : 0, 
    sin: Math.abs(Math.sin(angle)) > EPSILON ? Math.sin(angle) : 0
  }

  return output;
}

export { choose, getRandomInt, roundTo, getDistance, getAngleBetween, getDotProduct, noiseFilter }