const bufferForMinMax = new Array();

let globalMin = Infinity;
let globalMax = -Infinity;
let startTime = null;

function getMinMax(minMaxInput) {
  const min = Math.min(...minMaxInput);
  const max = Math.max(...minMaxInput);
  const minMax = [min, max];
  return minMax;
}

function minMaxUpdate() {
  if (bufferForMinMax.length > 0) {
    const minMaxInput = bufferForMinMax.shift();
    const currMinMax = getMinMax(minMaxInput);
    if (currMinMax[0] < globalMin) globalMin = currMinMax[0];
    if (currMinMax[1] > globalMax) globalMax = currMinMax[1];
  }
}

// call this func repetadley each time data is created
function bufferMinMaxData(data, testTimeMs) {
  if (!startTime) startTime = Date.now();
  if (Date.now() >= startTime + testTimeMs) {
    console.log(`min: ${globalMin}   max: ${globalMax}`);
    globalMin = Infinity;
    globalMax = -Infinity;
    startTime = null;
  }
  if (bufferForMinMax.length > 5) {
    bufferForMinMax.shift();
  }
  bufferForMinMax.push(data);
  // each time call this func to get min max of curr data
  minMaxUpdate();
}

module.exports = bufferMinMaxData;
