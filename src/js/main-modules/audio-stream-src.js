const { spawn } = require("child_process");
const { ipcMain } = require("electron");
const {
  BIT_DEPTH,
  SAMPLE_RATE,
  CHUNK_SIZE,
} = require("../../js/utils/global-variables");

const sinkName =
  "alsa_output.usb-PreSonus_Studio_24c_SC1E20414599-00.analog-stereo.monitor";

let captureProcess = null;

function startAudioStream(mainWindow) {
  if (captureProcess) {
    captureProcess.kill();
    captureProcess = null;
  }

  captureProcess = spawn("parec", [
    `--device=${sinkName}`,
    `--format=s${BIT_DEPTH}le`,
    `--rate=${SAMPLE_RATE}`,
    "--channels=2",
  ]);

  let audioBuffer = Buffer.from([]);

  captureProcess.stdout.on("data", (data) => {
    audioBuffer = Buffer.concat([audioBuffer, data]);

    while (audioBuffer.length >= CHUNK_SIZE) {
      const chunk = audioBuffer.subarray(0, CHUNK_SIZE);
      audioBuffer = audioBuffer.subarray(CHUNK_SIZE);

      const decodedData = decodePCM(chunk, BIT_DEPTH);

      mainWindow.webContents.send("audioData", decodedData);
    }
  });

  captureProcess.on("error", (error) => {
    console.error("Capture process error:", error);
  });

  captureProcess.on("exit", (code, signal) => {
    console.log("Capture process exited with code:", code);
    console.log("Capture process exited with signal:", signal);
  });

  function decodePCM(rawData, BIT_DEPTH) {
    if (BIT_DEPTH == 16) {
      const numSamples = rawData.length / 2;
      const samples = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        const offset = i * 2;
        const sample = rawData.readInt16LE(offset) / 32768;
        samples[i] = sample;
      }
      return samples;
    } else {
      console.log("unsuported bit depth");
    }
  }
}

function stopAudioStream() {
  if (captureProcess) {
    console.log("Attempting to stop the audio stream...");
    captureProcess.kill("SIGKILL"); // Forcefully kill the process
    captureProcess = null;
    console.log("Audio stream stopped.");
  } else {
    console.log("No active audio stream to stop.");
  }
}

module.exports = {
  startAudioStream,
  stopAudioStream,
};
