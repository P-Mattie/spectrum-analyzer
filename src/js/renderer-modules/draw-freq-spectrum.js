const {
  FREQ_RES,
  FREQ_MIN,
  FREQ_MAX,
  FREQ_UNITS,
  NUM_FREQ_UNITS,
  MAX_DB_POST_FFT,
  MIN_DB_POST_FFT,
} = require("./../utils/global-variables");

function drawSpectrum(fftData, usedFFT, strokeClr) {
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

          const normalizedDbValue =
            (fftData[i] - MIN_DB_POST_FFT) /
            (MAX_DB_POST_FFT - MIN_DB_POST_FFT);
          let y = canvas.height * (1 - normalizedDbValue);

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
  ctx.strokeStyle = strokeClr;
  ctx.lineWidth = 1;
  ctx.stroke();
}

module.exports = drawSpectrum;
