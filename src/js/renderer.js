const { ipcRenderer } = require("electron");
const ui = require("./js/renderer-modules/ui");
const drawTimeDomain = require("./js/renderer-modules/draw-time-domain");
const createSpectrum = require("./js/renderer-modules/template-graphs");
require("./js/renderer-modules/draw-freq-spectrum");
const runSpectrumAnalysis = require("./js/renderer-modules/signal-processing/fft-multi-config");

//------
const canvasWidth = 700;
const canvasHeight = 400;

const clrWhite = "white",
  clrBlue = "#1261d1",
  clrLBlue = "#08deea",
  clrPink = "#fdB090",
  clrViolet = "#af43be";

const paramsArray = [
  {
    ampScale: "db",
    windowType: "hann",
    overlap: 0,
    analyzerId: "cnvs1",
    graphId: "test1",
    overlapMode: false,
    strokeClr: clrWhite,
  },
  {
    ampScale: "db",
    windowType: "hann",
    overlap: 0.9,
    analyzerId: "cnvs2",
    graphId: "test1",
    overlapMode: true,
    strokeClr: clrPink,
  },
];
//------

function spectrumAnalyzeToCanvas(paramsArray) {
  runSpectrumAnalysis(paramsArray);
  createSpectrum(paramsArray, canvasWidth, canvasHeight);
}

spectrumAnalyzeToCanvas(paramsArray);
