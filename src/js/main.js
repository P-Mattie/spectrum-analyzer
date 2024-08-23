const { app, BrowserWindow, ipcMain } = require("electron");
const {
  startAudioStream,
  stopAudioStream,
} = require("./main-modules/audio-stream-src");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile("src/index.html");
};

let mainWindow;

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("start-audio-stream", () => {
  startAudioStream(win);
});

ipcMain.on("stop-audio-stream", () => {
  stopAudioStream(win);
});
