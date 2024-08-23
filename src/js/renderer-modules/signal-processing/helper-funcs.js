const { FFT_SIZE } = require("../../utils/global-variables");

function applyWindowFunc(signal, type) {
  numSamples = signal.length;

  if (type === "none") {
    return signal;
  }
  const window = new Float32Array(numSamples);
  if (type === "hann") {
    for (let n = 0; n < numSamples; n++) {
      window[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (numSamples - 1)));
      signal[n] *= window[n];
    }
    return signal;
  } else if (type === "hamming") {
    for (let n = 0; n < numSamples; n++) {
      window[n] = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (numSamples - 1));
      signal[n] *= window[n];
    }
    return signal;
  } else {
    throw new Error("Invalid window type");
  }
}

function applyWindowOverlap(prevChunk, currChunk, overlapSize) {
  if (overlapSize === 0) return;
  const combinedChunk = new Float32Array(FFT_SIZE);

  for (let i = 0; i < overlapSize; i++) {
    combinedChunk[i] = prevChunk[i] + currChunk[i];
  }

  combinedChunk.set(currChunk.slice(overlapSize), overlapSize);
  return combinedChunk;
}

module.exports = { applyWindowFunc, applyWindowOverlap };
