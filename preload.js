Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)]
}

function randomInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

/**
 * 
 * @param {number} n 
 * @param {number} low 
 * @param {number} high 
 * @returns 
 */
function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low)
}

/**
 * 
 * @param {number} n 
 * @param {number} start1 
 * @param {number} stop1 
 * @param {number} start2 
 * @param {number} stop2 
 * @param {boolean} withinBounds 
 * @returns 
 */
function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2)
  } else {
    return constrain(newval, stop2, start2)
  }
}