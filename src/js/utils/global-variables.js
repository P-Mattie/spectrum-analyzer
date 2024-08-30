const SAMPLE_RATE = 44100;
const NYQUIST_FREQ = SAMPLE_RATE / 2;
const BIT_DEPTH = 16;
const FFT_SIZE = 4096;
const CHUNK_SIZE = FFT_SIZE * 2;
const FREQ_MIN = 20;
const FREQ_MAX = 20000;
const FREQ_LOG_SCALES = [2.5, 2, 2];
const FREQ_RES = SAMPLE_RATE / (FFT_SIZE / 2); // divide by 2 for signal. dont for sine wave test
// keep multiples of 5
const MAX_DB_POST_FFT = 78.03677368164062;
const MIN_DB_POST_FFT = -200;
const DB_MIN = -60;
const DB_MAX = 0;

let freqUnitCounter = FREQ_MIN;
let freqUnits = [FREQ_MIN];
while (freqUnitCounter < FREQ_MAX) {
  for (let i = 0; i < FREQ_LOG_SCALES.length; i++) {
    freqUnitCounter = freqUnitCounter * FREQ_LOG_SCALES[i];
    freqUnits.push(freqUnitCounter);
  }
}

const FREQ_UNITS = freqUnits;
const NUM_FREQ_UNITS = freqUnits.length;

module.exports = {
  SAMPLE_RATE,
  NYQUIST_FREQ,
  BIT_DEPTH,
  CHUNK_SIZE,
  FFT_SIZE,
  FREQ_MIN,
  FREQ_MAX,
  FREQ_LOG_SCALES,
  MAX_DB_POST_FFT,
  MIN_DB_POST_FFT,
  DB_MIN,
  DB_MAX,
  FREQ_RES,
  NUM_FREQ_UNITS,
  FREQ_UNITS,
};
