const SAMPLE_RATE = 44100; // Samples per second
const FREQUENCY = 1000; // Frequency of the sine wave (e.g., A4 note)
const AMPLITUDE = 1.0; // Amplitude of the sine wave
const BUFFER_SIZE = 4096; // Size of each generated buffer chunk

let phase = 0;
const phaseIncrement = (2 * Math.PI * FREQUENCY) / SAMPLE_RATE;

function generateSineWav() {
  let sineWaveChunk = new Float32Array(BUFFER_SIZE);

  for (let i = 0; i < BUFFER_SIZE; i++) {
    sineWaveChunk[i] = AMPLITUDE * Math.sin(phase);
    phase += phaseIncrement;
    if (phase >= 2 * Math.PI) {
      phase -= 2 * Math.PI;
    }
  }

  return sineWaveChunk;
}

module.exports = generateSineWav;
