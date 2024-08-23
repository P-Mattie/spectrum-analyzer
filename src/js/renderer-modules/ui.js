const { ipcRenderer } = require("electron");

const startStreamButton = document.getElementById("startStreamBtn");
let isStreamRunning = false;
startStreamButton.addEventListener("click", (event) => {
  if (isStreamRunning === false) {
    ipcRenderer.send("start-audio-stream");
    startStreamButton.innerHTML = "Stop Stream";
    isStreamRunning = true;
  } else if (isStreamRunning === true) {
    ipcRenderer.send("stop-audio-stream");
    startStreamButton.innerHTML = "Start Stream";
    isStreamRunning = false;
  }
});
