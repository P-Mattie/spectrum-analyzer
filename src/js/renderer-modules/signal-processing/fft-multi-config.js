/*
TO DO:
if overlap === 0 { dont run applyWindowOverlap}
fix y axis db/ mag scaling

*/

const FFT = require("fft.js");
const { ipcRenderer } = require("electron");
const { applyWindowFunc, applyWindowOverlap } = require("./helper-funcs");
const { FFT_SIZE } = require("../../utils/global-variables");
const drawSpectrum = require("../draw-freq-spectrum");
const generateSineWav = require("../signal-processing/sine-wave");
const bufferMinMaxData = require("../../utils/get-min-max");

//-----------------------------------------------------------
function performFFT(signal) {
  if (signal.length !== FFT_SIZE) {
    console.warn("Input signal length does not match FFT size");
  }
  const fft = new FFT(FFT_SIZE);

  const complexArray = fft.createComplexArray();
  const fftOutput = fft.createComplexArray();

  for (let i = 0; i < signal.length; i++) {
    complexArray[2 * i] = signal[i];
    complexArray[2 * i + 1] = 0;
  }

  fft.transform(fftOutput, complexArray);

  let magnitudes = new Float32Array(fftOutput.length / 2);

  for (let i = 0; i < fftOutput.length / 2; i++) {
    const re = fftOutput[2 * i];
    const im = fftOutput[2 * i + 1];
    const magnitude = Math.sqrt(re * re + im * im);
    magnitudes[i] = magnitude / FFT_SIZE;
  }
  // find min max:
  // bufferMinMaxData(magnitudes, 3000);
  return magnitudes;
}
//-----------------------------------------------------------
function convertToDB(magnitudes) {
  const dbValues = new Float32Array(magnitudes.length);
  for (let i = 0; i < magnitudes.length; i++) {
    dbValues[i] = 20 * Math.log10(magnitudes[i] + 1e-10);
  }

  // log the minmax values for dbValues over time in ms
  // bufferMinMaxData(dbValues, 3000);

  // max: 78.03677368164062 (sinewave at max amp for 16bit)
  // min: -200              (running the fft in system silence)

  return dbValues;
}
//-----------------------------------------------------------
function runSpectrumAnalysis(paramsArray) {
  let signalBuffer = [];

  const analyzerStates = new Map();

  function initAnalyzerState(analyzerId, overlap) {
    const overlapFactor = overlap;
    const overlapSize = Math.floor(FFT_SIZE * overlapFactor);
    const normalizationFactor = 1 / (1 + overlapFactor);

    analyzerStates.set(analyzerId, {
      isFirstChunk: true,
      prevChunk: new Float32Array(overlapSize),
      overlapSize,
      normalizationFactor,
    });
  }

  function generateSpectrumData(
    signal,
    ampScale,
    windowType,
    overlap,
    analyzerId,
    strokeClr
  ) {
    if (!["db", "mag"].includes(ampScale)) {
      throw new Error("invalid ampScale. Use 'db', mag");
    }
    if (!["none", "hann", "hamming"].includes(windowType)) {
      throw new Error("invalid windowType. Use 'none', 'hann','hamming'");
    }
    if (overlap < 0 || overlap > 1) {
      throw new Error("invalid overlap. Use num between 0-1");
    }

    let state = analyzerStates.get(analyzerId);
    if (!state) {
      initAnalyzerState(analyzerId, overlap);
      state = analyzerStates.get(analyzerId);
    }
    const { isFirstChunk, prevChunk, overlapSize, normalizationFactor } = state;

    let processedSignal = applyWindowFunc(signal, windowType);

    if (overlap > 0) {
      if (!isFirstChunk) {
        processedSignal = applyWindowOverlap(
          prevChunk,
          processedSignal,
          overlapSize
        );
      }
    }

    magnitudes = performFFT(processedSignal);

    if (overlap > 0) {
      magnitudes = magnitudes.map((mag) => mag * normalizationFactor);
    }

    let spectrumData;
    if (ampScale === "db") {
      spectrumData = convertToDB(magnitudes);
    } else {
      spectrumData = magnitudes;
    }
    drawSpectrum(spectrumData, analyzerId, strokeClr);

    if (overlap > 0) {
      state.prevChunk.set(signal.slice(FFT_SIZE - overlapSize));
      state.isFirstChunk = false;
    }
  }

  //   update();
  function update() {
    if (signalBuffer.length > 0) {
      const signal = signalBuffer.shift();

      paramsArray.forEach((params) => {
        const { ampScale, windowType, overlap, analyzerId, strokeClr } = params;

        try {
          generateSpectrumData(
            signal,
            ampScale,
            windowType,
            overlap,
            analyzerId,
            strokeClr
          );
        } catch (error) {
          console.error("Error processing parameters:", params, error.message);
        }
      });
    }
    requestAnimationFrame(update);
  }

  ipcRenderer.on("audioData", (event, data) => {
    if (signalBuffer.length > 5) {
      signalBuffer.shift();
    }
    signalBuffer.push(data);
    update();
  });

  //------------------------------- sine test
  //   ipcRenderer.on("audioData", (event) => {
  //     if (signalBuffer.length > 5) {
  //       signalBuffer.shift();
  //     }
  //     signalBuffer.push(generateSineWav());
  //     update();
  //   });
}

module.exports = runSpectrumAnalysis;
