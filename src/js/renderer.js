const { ipcRenderer } = require("electron");
const templateGraphs = require("./js/renderer-modules/template-graphs");
const ui = require("./js/renderer-modules/ui");
const drawTimeDomain = require("./js/renderer-modules/draw-time-domain");
require("./js/renderer-modules/draw-freq-spectrum");
const runSpectrumAnalysis = require("./js/renderer-modules/signal-processing/fft-multi-config");

//------
const paramsArray = [
  { ampScale: "db", windowType: "hann", overlap: 0, analyzerId: "test1" },
  { ampScale: "db", windowType: "hann", overlap: 0.5, analyzerId: "test2" },
];
//------

runSpectrumAnalysis(paramsArray);
