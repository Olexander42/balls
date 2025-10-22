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

function getDistance(x1, y1, x2, y2) {
  const a = x1 - x2; 
  const b = y1 - y2; 
  const c = Math.floor(Math.sqrt(a * a + b * b)); 

  return c;
} 


export { choose, getRandomInt, roundTo, getDistance }