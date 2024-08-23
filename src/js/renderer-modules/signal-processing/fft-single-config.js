// const FFT = require("fft.js");
// const { ipcRenderer } = require("electron");
// const { applyWindowFunc, applyWindowOverlap } = require("./helper-funcs");
// const { FFT_SIZE } = require("../../utils/global-variables");
// const drawSpectrum = require("../draw-freq-spectrum");
// const generateSineWav = require("./sine-wave");

// const overlapFactor = 0.5;
// const overlapSize = Math.floor(FFT_SIZE * overlapFactor);
// const normalizationFactor = 1 / (1 + overlapFactor);
// let isFirstChunk = true;

// let signalBuffer = [];
// let prevChunk = new Float32Array(overlapSize);

// function performFFT(signal) {
//   if (signal.length !== FFT_SIZE) {
//     console.warn("Input signal length does not match FFT size");
//   }
//   const fft = new FFT(FFT_SIZE);

//   const complexArray = fft.createComplexArray();
//   const fftOutput = fft.createComplexArray();

//   for (let i = 0; i < signal.length; i++) {
//     complexArray[2 * i] = signal[i];
//     complexArray[2 * i + 1] = 0;
//   }

//   fft.transform(fftOutput, complexArray);

//   const magnitudes = new Float32Array(fftOutput.length / 2);

//   for (let i = 0; i < fftOutput.length / 2; i++) {
//     const re = fftOutput[2 * i];
//     const im = fftOutput[2 * i + 1];
//     const magnitude = Math.sqrt(re * re + im * im);
//     magnitudes[i] = magnitude / FFT_SIZE;
//   }

//   const normalizedMagnitudes = magnitudes.map(
//     (mag) => mag * normalizationFactor
//   );

//   const dbValues = new Float32Array(normalizedMagnitudes.length);
//   for (let i = 0; i < normalizedMagnitudes.length; i++) {
//     dbValues[i] = 20 * Math.log10(normalizedMagnitudes[i] + 1e-10);
//   }

//   return dbValues;
// }

// //----------------------------------

// update();

// function update() {
//   if (signalBuffer.length > 0) {
//     const signal = signalBuffer.shift();
//     let finalSignal;

//     const windowedSignal = applyWindowFunc(signal, "hamming");

//     const overlappedChunk = applyWindowOverlap(
//       prevChunk,
//       windowedSignal,
//       overlapSize
//     );

//     if (isFirstChunk) {
//       finalSignal = windowedSignal;
//     } else {
//       finalSignal = overlappedChunk;
//     }

//     const fftData = performFFT(finalSignal);
//     drawSpectrum(fftData, "fft-test");

//     const fftData2 = performFFT(signal);
//     drawSpectrum(fftData2, "no-overlap");

//     prevChunk.set(signal.slice(FFT_SIZE - overlapSize));
//     isFirstChunk = false;
//   }
//   requestAnimationFrame(update);
// }

// ipcRenderer.on("audioData", (event, data) => {
//   if (signalBuffer.length > 5) {
//     signalBuffer.shift();
//   }
//   signalBuffer.push(data);
//   update();
// });
