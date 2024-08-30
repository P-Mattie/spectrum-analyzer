const SAMPLE_RATE = 44100; // Samples per second
const FREQUENCY = 10000; // Frequency of the sine wave (e.g., A4 note)
const AMPLITUDE = 1.0; // Amplitude of the sine wave
const BUFFER_SIZE = 4096; // Size of each generated buffer chunk
const MAX_16_BIT = 32767;
let phase = 0;
const phaseIncrement = (2 * Math.PI * FREQUENCY) / SAMPLE_RATE;

function generateSineWav() {
  let sineWaveChunk = new Float32Array(BUFFER_SIZE);

  for (let i = 0; i < BUFFER_SIZE; i++) {
    sineWaveChunk[i] = AMPLITUDE * MAX_16_BIT * Math.sin(phase);
    phase += phaseIncrement;
    if (phase >= 2 * Math.PI) {
      phase -= 2 * Math.PI;
    }
  }

  return sineWaveChunk;
}

module.exports = generateSineWav;

// unsigend so first 65535 then 0
// min: -148.9630584716797   max: 84.05750274658203
// min: -200 max: -200

//signed so first 32767 then -32768
//min: -146.82171630859375   max: 78.03677368164062
//min: -155.04873657226562   max: 78.03704071044922
