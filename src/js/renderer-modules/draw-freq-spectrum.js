const {
  FREQ_RES,
  FREQ_MIN,
  FREQ_MAX,
  FREQ_UNITS,
  NUM_FREQ_UNITS,
} = require("./../utils/global-variables");

function drawSpectrum(fftData, usedFFT) {
  const canvas = document.getElementById(`${usedFFT}PlotCanvas`);
  ctx = canvas.getContext("2d");
  numBins = fftData.length / 2;

  const canvasUnitWidth = canvas.width / (NUM_FREQ_UNITS - 1);

  let hzWidthPerUnit = [];
  for (let i = 0; i < NUM_FREQ_UNITS - 1; i++) {
    let unitRange = FREQ_UNITS[i + 1] - FREQ_UNITS[i];
    hzWidthPerUnit.push(canvasUnitWidth / unitRange);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.beginPath();

  let currFreq = FREQ_RES;

  for (let i = 0; i < numBins; i++) {
    if (currFreq < FREQ_MIN) {
      currFreq += FREQ_RES;
    } else if (currFreq > FREQ_MAX) {
      break;
    } else {
      for (let j = 0; j < FREQ_UNITS.length; j++) {
        if (currFreq >= FREQ_UNITS[j] && currFreq < FREQ_UNITS[j + 1]) {
          let x =
            (currFreq - FREQ_UNITS[j]) * hzWidthPerUnit[j] +
            j * canvasUnitWidth;
          let y = canvas.height - (fftData[i] + 300); // to do : scale y to db

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          break;
        }
      }
      currFreq += FREQ_RES;
    }
  }
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();
}

module.exports = drawSpectrum;
